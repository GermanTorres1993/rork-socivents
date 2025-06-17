import { create } from "zustand";
import { Ticket } from "@/types";
import { supabase } from "@/lib/supabase";

interface TicketState {
  userTickets: Ticket[];
  isLoading: boolean;
  error: string | null;
  fetchUserTickets: (userId: string) => Promise<void>;
  purchaseTicket: (eventId: string, userId: string, price: number) => Promise<void>;
  checkTicketStatus: (eventId: string, userId: string) => Promise<boolean>;
}

export const useTicketStore = create<TicketState>((set, get) => ({
  userTickets: [],
  isLoading: false,
  error: null,

  fetchUserTickets: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Fetch tickets error:", error);
        throw error;
      }

      const tickets: Ticket[] = (data || []).map(ticket => ({
        id: ticket.id,
        eventId: ticket.event_id,
        userId: ticket.user_id,
        purchaseDate: ticket.purchase_date,
        price: Number(ticket.price),
        status: ticket.status as "active" | "used" | "cancelled",
      }));

      set({ userTickets: tickets, isLoading: false });
    } catch (error) {
      console.error("Fetch tickets error:", error);
      set({ 
        error: "Failed to load tickets. Please try again.", 
        isLoading: false 
      });
    }
  },

  purchaseTicket: async (eventId, userId, price) => {
    set({ isLoading: true, error: null });
    try {
      // Check if user already has a ticket
      const { data: existingTicket, error: checkError } = await supabase
        .from('tickets')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', userId)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error("Ticket check error:", checkError);
        throw checkError;
      }

      if (existingTicket) {
        throw new Error("You already have a ticket for this event");
      }

      // For now, we'll create the ticket directly
      // In a real app, this would involve Stripe payment processing
      const { data, error } = await supabase
        .from('tickets')
        .insert({
          event_id: eventId,
          user_id: userId,
          price,
          status: 'active',
        })
        .select()
        .single();

      if (error) {
        console.error("Purchase ticket error:", error);
        throw error;
      }

      const newTicket: Ticket = {
        id: data.id,
        eventId: data.event_id,
        userId: data.user_id,
        purchaseDate: data.purchase_date,
        price: Number(data.price),
        status: data.status as "active" | "used" | "cancelled",
      };

      set(state => ({
        userTickets: [newTicket, ...state.userTickets],
        isLoading: false
      }));
    } catch (error) {
      console.error("Purchase ticket error:", error);
      set({ 
        error: error instanceof Error ? error.message : "Failed to purchase ticket. Please try again.", 
        isLoading: false 
      });
      throw error;
    }
  },

  checkTicketStatus: async (eventId, userId) => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error("Check ticket status error:", error);
        throw error;
      }
      
      return !!data;
    } catch (error) {
      console.error("Check ticket status error:", error);
      return false;
    }
  },
}));

// Subscribe to real-time ticket updates
supabase
  .channel('tickets')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'tickets' }, 
    () => {
      // Refresh tickets when there are changes
      // We'll need the current user ID for this
      const userId = useTicketStore.getState().userTickets[0]?.userId;
      if (userId) {
        useTicketStore.getState().fetchUserTickets(userId);
      }
    }
  )
  .subscribe();