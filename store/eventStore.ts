import { create } from "zustand";
import { EventCategory, Event } from "@/types";
import { supabase } from "@/lib/supabase";
import { fetchEventbriteEvents, clearEventbriteCache, normalizeEventbriteEvents, mapCategory } from "@/lib/eventbrite";
import { trpcClient } from "@/lib/trpc";

interface EventSourceStatus {
  loading: boolean;
  error: string | null;
}

interface EventState {
  events: Event[];
  filteredEvents: Event[];
  selectedCategory: EventCategory | "all";
  sources: {
    supabase: EventSourceStatus;
    eventbrite: EventSourceStatus;
  };
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  fetchEvents: (forceRefresh?: boolean) => Promise<void>;
  filterByCategory: (category: EventCategory | "all") => void;
  createEvent: (event: Omit<Event, "id" | "createdAt">) => Promise<string>;
  getEventById: (id: string) => Promise<Event | null>;
  refreshExternalEvents: () => Promise<void>;
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache TTL for Supabase data

// Function to map Supabase event data to Event type
const mapSupabaseEvent = (data: any): Event => ({
  id: data.id,
  title: data.title,
  description: data.description,
  imageUrl: data.image_url,
  date: data.date,
  time: data.time,
  location: data.location,
  price: Number(data.price),
  category: data.category as EventCategory,
  hostId: data.host_id,
  hostName: data.host_name,
  createdAt: data.created_at,
});

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  filteredEvents: [],
  selectedCategory: "all",
  sources: {
    supabase: { loading: false, error: null },
    eventbrite: { loading: false, error: null },
  },
  isLoading: false,
  error: null,
  lastFetched: null,

  fetchEvents: async (forceRefresh = false) => {
    const currentTime = Date.now();
    const lastFetched = get().lastFetched;
    if (!forceRefresh && lastFetched !== null && currentTime - lastFetched < CACHE_TTL) {
      console.log("Using cached events data, skipping fetch.");
      return;
    }

    set({ isLoading: true, error: null, sources: {
      supabase: { loading: true, error: null },
      eventbrite: { loading: true, error: null },
    }});

    try {
      // Fetch events from Supabase and Eventbrite in parallel
      const [supabaseResult, eventbriteResult] = await Promise.allSettled([
        (async () => {
          const { data, error } = await supabase
            .from('events')
            .select('*')
            .gte('date', new Date().toISOString().split('T')[0]) // Only future events
            .order('date', { ascending: true })
            .order('time', { ascending: true });

          if (error) {
            console.error("Supabase events fetch error:", error.message);
            throw error;
          }

          const supabaseEvents: Event[] = (data || []).map(mapSupabaseEvent);
          console.log("Fetched Supabase events:", supabaseEvents.length);
          return supabaseEvents;
        })(),
        (async () => {
          let eventbriteEvents: Event[] = [];
          try {
            console.log("Attempting to fetch Eventbrite events via tRPC backend...");
            const eventbriteRawEvents = await trpcClient.events.fetchEventbrite.query({ location: "London, UK", limit: 20 });
            console.log("Successfully fetched Eventbrite events via tRPC:", eventbriteRawEvents.length);
            eventbriteEvents = normalizeEventbriteEvents(eventbriteRawEvents);
          } catch (trpcError) {
            console.error("tRPC fetch error for Eventbrite, falling back to client-side:", trpcError instanceof Error ? trpcError.message : String(trpcError));
            try {
              eventbriteEvents = await fetchEventbriteEvents();
              console.log("Successfully fetched Eventbrite events client-side:", eventbriteEvents.length);
            } catch (eventbriteError) {
              console.error("Eventbrite fetch error (client-side):", eventbriteError instanceof Error ? eventbriteError.message : String(eventbriteError));
              // Continue with just Supabase events if Eventbrite fails
            }
          }
          return eventbriteEvents;
        })()
      ]);

      // Process results from both sources
      const supabaseEvents = supabaseResult.status === 'fulfilled' ? supabaseResult.value : [];
      const eventbriteEvents = eventbriteResult.status === 'fulfilled' ? eventbriteResult.value : [];

      // Update source-specific status
      const supabaseStatus: EventSourceStatus = {
        loading: false,
        error: supabaseResult.status === 'rejected' ? (supabaseResult.reason instanceof Error ? supabaseResult.reason.message : String(supabaseResult.reason)) : null,
      };
      const eventbriteStatus: EventSourceStatus = {
        loading: false,
        error: eventbriteResult.status === 'rejected' ? (eventbriteResult.reason instanceof Error ? eventbriteResult.reason.message : String(eventbriteResult.reason)) : null,
      };

      // Log failures if any
      if (supabaseResult.status === 'rejected') {
        console.error("Supabase fetch failed:", supabaseResult.reason instanceof Error ? supabaseResult.reason.message : String(supabaseResult.reason));
      }
      if (eventbriteResult.status === 'rejected') {
        console.error("Eventbrite fetch failed:", eventbriteResult.reason instanceof Error ? eventbriteResult.reason.message : String(eventbriteResult.reason));
      }

      // Combine events from both sources
      const combinedEvents = [...supabaseEvents, ...eventbriteEvents];
      console.log("Total events combined:", combinedEvents.length, "Supabase:", supabaseEvents.length, "Eventbrite:", eventbriteEvents.length);
      console.log("Debugging events data:", combinedEvents); // Debugging log to check events data

      set({ 
        events: combinedEvents, 
        filteredEvents: combinedEvents, 
        isLoading: false, 
        lastFetched: currentTime,
        sources: {
          supabase: supabaseStatus,
          eventbrite: eventbriteStatus,
        }
      });
    } catch (error) {
      console.error("Fetch events error (general):", error instanceof Error ? error.message : String(error));
      set({ 
        error: "Failed to load events. Please check your internet connection and ensure API keys are set.", 
        isLoading: false,
        sources: {
          supabase: { loading: false, error: "General fetch error" },
          eventbrite: { loading: false, error: "General fetch error" },
        }
      });
    }
  },

  filterByCategory: (category) => {
    set({ selectedCategory: category });
    const filteredEvents = category === "all" 
      ? get().events 
      : get().events.filter(event => event.category === category);
    console.log("Filtering by category:", category, "Filtered events count:", filteredEvents.length);
    set({ filteredEvents });
  },

  createEvent: async (eventData) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('events')
        .insert({
          title: eventData.title,
          description: eventData.description,
          image_url: eventData.imageUrl,
          date: eventData.date,
          time: eventData.time,
          location: eventData.location,
          price: eventData.price,
          category: eventData.category,
          host_id: eventData.hostId,
          host_name: eventData.hostName,
        })
        .select()
        .single();

      if (error) throw error;

      // Instead of fetching all events, add the new event to the state
      const newEvent: Event = mapSupabaseEvent(data);
      const updatedEvents = [...get().events, newEvent];
      set({ events: updatedEvents, filteredEvents: updatedEvents, isLoading: false });

      return data.id;
    } catch (error) {
      console.error("Create event error:", error instanceof Error ? error.message : String(error));
      const errorMessage = "Failed to create event. Please try again.";
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  getEventById: async (id: string) => {
    try {
      // Check if it's an Eventbrite event (id starts with 'eb_')
      if (id.startsWith('eb_')) {
        const allEvents = get().events;
        return allEvents.find(event => event.id === id) || null;
      }

      // Otherwise, fetch from Supabase
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error("Get event by ID error:", error.message);
        return null;
      }

      return mapSupabaseEvent(data);
    } catch (error) {
      console.error("Get event by ID error (general):", error instanceof Error ? error.message : String(error));
      return null;
    }
  },

  refreshExternalEvents: async () => {
    set({ isLoading: true, error: null, sources: { ...get().sources, eventbrite: { loading: true, error: null } } });
    try {
      // Clear cache and fetch fresh Eventbrite events
      await clearEventbriteCache();
      await get().fetchEvents(true);
    } catch (error) {
      console.error("Refresh external events error:", error instanceof Error ? error.message : String(error));
      set({ error: "Failed to refresh external events.", isLoading: false, sources: { ...get().sources, eventbrite: { loading: false, error: "Failed to refresh" } } });
    }
  },
}));

// Subscribe to real-time events updates
supabase
  .channel('events')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'events' }, 
    (payload) => {
      console.log("Supabase real-time update received:", payload.eventType, payload.new);
      // Instead of fetching all events, update state based on the change
      const state = useEventStore.getState();
      if (payload.eventType === 'INSERT' && payload.new) {
        const newEvent = payload.new as any;
        const formattedEvent: Event = mapSupabaseEvent(newEvent);
        const exists = state.events.some(e => e.id === formattedEvent.id);
        if (!exists) {
          const updatedEvents = [...state.events, formattedEvent];
          useEventStore.setState({ events: updatedEvents, filteredEvents: updatedEvents });
        }
      } else if (payload.eventType === 'UPDATE' && payload.new) {
        const updatedEvent = payload.new as any;
        const formattedEvent: Event = mapSupabaseEvent(updatedEvent);
        const updatedEvents = state.events.map(event => event.id === formattedEvent.id ? formattedEvent : event);
        useEventStore.setState({ events: updatedEvents, filteredEvents: updatedEvents });
      } else if (payload.eventType === 'DELETE' && payload.old) {
        const deletedId = payload.old.id;
        const updatedEvents = state.events.filter(event => event.id !== deletedId);
        useEventStore.setState({ events: updatedEvents, filteredEvents: updatedEvents });
      }
    }
  )
  .subscribe();