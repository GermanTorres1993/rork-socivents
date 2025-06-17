import { create } from "zustand";
import { ChatMessage, ChatRoom } from "@/types";
import { supabase } from "@/lib/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";

interface ChatState {
  chatRooms: ChatRoom[];
  currentChatMessages: ChatMessage[];
  currentEventId: string | null;
  isLoading: boolean;
  error: string | null;
  realtimeChannel: RealtimeChannel | null;
  fetchChatRooms: (userId: string) => Promise<void>;
  fetchChatMessages: (eventId: string) => Promise<void>;
  sendMessage: (eventId: string, userId: string, userName: string, userPhotoUrl: string | undefined, text: string) => Promise<void>;
  joinChat: (eventId: string, userId: string) => Promise<void>;
  leaveChat: (eventId: string, userId: string) => Promise<void>;
  subscribeToMessages: (eventId: string) => void;
  unsubscribeFromMessages: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  chatRooms: [],
  currentChatMessages: [],
  currentEventId: null,
  isLoading: false,
  error: null,
  realtimeChannel: null,

  fetchChatRooms: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      // Get events where user has tickets or is the host
      const { data: userEvents, error: eventsError } = await supabase
        .from('events')
        .select(`
          id,
          title,
          host_id,
          chat_rooms(id)
        `);

      if (eventsError) {
        console.error("Chat rooms fetch error:", eventsError);
        throw eventsError;
      }

      // Filter events where user is host or has tickets
      const { data: userTickets, error: ticketsError } = await supabase
        .from('tickets')
        .select('event_id')
        .eq('user_id', userId);

      if (ticketsError) {
        console.error("Tickets fetch error:", ticketsError);
        throw ticketsError;
      }

      const ticketEventIds = (userTickets || []).map(ticket => ticket.event_id);
      const filteredEvents = (userEvents || []).filter(event => 
        event.host_id === userId || ticketEventIds.includes(event.id)
      );

      // Get last messages for each chat room
      const chatRooms: ChatRoom[] = [];
      
      for (const event of filteredEvents) {
        // Get the chat room ID (chat_rooms is an array, so we take the first one)
        const chatRoomsArray = Array.isArray(event.chat_rooms) ? event.chat_rooms : [event.chat_rooms];
        const chatRoomData = chatRoomsArray[0];
        const chatRoomId = chatRoomData?.id;
        
        if (!chatRoomId) continue;

        const { data: lastMessage } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('chat_room_id', chatRoomId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        // Get participants count
        const { data: participants } = await supabase
          .from('tickets')
          .select('user_id')
          .eq('event_id', event.id);

        const participantIds = participants?.map(p => p.user_id) || [];
        
        chatRooms.push({
          eventId: event.id,
          eventTitle: event.title,
          participants: participantIds,
          lastMessage: lastMessage ? {
            id: lastMessage.id,
            eventId: event.id,
            userId: lastMessage.user_id,
            userName: lastMessage.user_name,
            userPhotoUrl: lastMessage.user_photo_url,
            text: lastMessage.message,
            timestamp: lastMessage.created_at,
          } : undefined,
        });
      }

      set({ chatRooms, isLoading: false });
    } catch (error) {
      console.error("Fetch chat rooms error:", error);
      set({ 
        error: "Failed to load chat rooms. Please try again.", 
        isLoading: false 
      });
    }
  },

  fetchChatMessages: async (eventId) => {
    set({ isLoading: true, error: null, currentEventId: eventId });
    try {
      // Get chat room for this event
      const { data: chatRoom, error: roomError } = await supabase
        .from('chat_rooms')
        .select('id')
        .eq('event_id', eventId)
        .single();

      if (roomError) {
        console.error("Chat room fetch error:", roomError);
        throw roomError;
      }

      // Get messages for this chat room
      const { data: messages, error: messagesError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('chat_room_id', chatRoom.id)
        .order('created_at', { ascending: true });

      if (messagesError) {
        console.error("Chat messages fetch error:", messagesError);
        throw messagesError;
      }

      const chatMessages: ChatMessage[] = (messages || []).map(msg => ({
        id: msg.id,
        eventId,
        userId: msg.user_id,
        userName: msg.user_name,
        userPhotoUrl: msg.user_photo_url,
        text: msg.message,
        timestamp: msg.created_at,
      }));

      set({ currentChatMessages: chatMessages, isLoading: false });
      
      // Subscribe to real-time updates
      get().subscribeToMessages(eventId);
    } catch (error) {
      console.error("Fetch chat messages error:", error);
      set({ 
        error: "Failed to load messages. Please try again.", 
        isLoading: false 
      });
    }
  },

  sendMessage: async (eventId, userId, userName, userPhotoUrl, text) => {
    try {
      // Get chat room for this event
      const { data: chatRoom, error: roomError } = await supabase
        .from('chat_rooms')
        .select('id')
        .eq('event_id', eventId)
        .single();

      if (roomError) {
        console.error("Chat room fetch error for sending message:", roomError);
        throw roomError;
      }

      // Insert new message
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          chat_room_id: chatRoom.id,
          user_id: userId,
          user_name: userName,
          user_photo_url: userPhotoUrl,
          message: text,
        });

      if (error) {
        console.error("Send message error:", error);
        throw error;
      }

      // Message will be added via real-time subscription
    } catch (error) {
      console.error("Send message error:", error);
      set({ error: "Failed to send message. Please try again." });
    }
  },

  joinChat: async (eventId, userId) => {
    set({ isLoading: true, error: null });
    try {
      // Check if user has a ticket for this event
      const { data: ticket, error: ticketError } = await supabase
        .from('tickets')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', userId)
        .maybeSingle();

      if (ticketError && ticketError.code !== 'PGRST116') {
        console.error("Ticket check error:", ticketError);
        throw ticketError;
      }

      // Check if user is the host
      const { data: event, error: eventError } = await supabase
        .from('events')
        .select('host_id')
        .eq('id', eventId)
        .single();

      if (eventError) {
        console.error("Event check error:", eventError);
        throw eventError;
      }

      if (!ticket && event.host_id !== userId) {
        throw new Error("You need a ticket to join this chat");
      }

      set({ isLoading: false });
    } catch (error) {
      console.error("Join chat error:", error);
      set({ error: "Failed to join chat. Please try again.", isLoading: false });
      throw error;
    }
  },

  leaveChat: async (eventId, userId) => {
    set({ isLoading: true, error: null });
    try {
      // For now, just unsubscribe from real-time updates
      get().unsubscribeFromMessages();
      set({ isLoading: false });
    } catch (error) {
      console.error("Leave chat error:", error);
      set({ error: "Failed to leave chat. Please try again.", isLoading: false });
    }
  },

  subscribeToMessages: (eventId) => {
    const currentChannel = get().realtimeChannel;
    if (currentChannel) {
      currentChannel.unsubscribe();
    }

    const channel = supabase
      .channel(`chat-${eventId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
        },
        (payload) => {
          const newMessage: ChatMessage = {
            id: payload.new.id,
            eventId,
            userId: payload.new.user_id,
            userName: payload.new.user_name,
            userPhotoUrl: payload.new.user_photo_url,
            text: payload.new.message,
            timestamp: payload.new.created_at,
          };

          set(state => ({
            currentChatMessages: [...state.currentChatMessages, newMessage]
          }));
        }
      )
      .subscribe();

    set({ realtimeChannel: channel });
  },

  unsubscribeFromMessages: () => {
    const currentChannel = get().realtimeChannel;
    if (currentChannel) {
      currentChannel.unsubscribe();
      set({ realtimeChannel: null });
    }
  },
}));