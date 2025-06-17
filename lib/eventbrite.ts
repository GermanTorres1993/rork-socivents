import AsyncStorage from '@react-native-async-storage/async-storage';
import { Event } from '@/types';

// Eventbrite API base URL for searching events
const EVENTBRITE_API_URL = 'https://www.eventbriteapi.com/v3/events/search';

// Cache TTL (Time to Live) set to 1 hour (in milliseconds)
const CACHE_TTL = 60 * 60 * 1000;

// Default location to London
const DEFAULT_LOCATION = 'London, UK';

// Environment variable for API key (to be set in .env)
const EVENTBRITE_API_KEY = process.env.EXPO_PUBLIC_EVENTBRITE_API_KEY || '';

// Type for Eventbrite API response (simplified for necessary fields)
interface EventbriteEvent {
  id: string;
  name: { text: string };
  description: { text: string };
  start: { local: string };
  venue: {
    address: {
      localized_address_display: string;
      latitude?: string;
      longitude?: string;
    };
  } | null;
  logo: { original: { url: string } } | null;
  url: string;
  is_free: boolean;
  category_id: string | null;
}

// Fetch events from Eventbrite API with caching
export const fetchEventbriteEvents = async (
  location: string = DEFAULT_LOCATION,
  limit: number = 20
): Promise<Event[]> => {
  try {
    // Check cache first
    const cacheKey = `eventbrite_events_${location}_${limit}`;
    const cachedData = await AsyncStorage.getItem(cacheKey);
    const cacheTimestamp = await AsyncStorage.getItem(`${cacheKey}_timestamp`);
    const currentTime = Date.now();

    if (cachedData && cacheTimestamp) {
      const age = currentTime - parseInt(cacheTimestamp, 10);
      if (age < CACHE_TTL) {
        console.log('Using cached Eventbrite events');
        return JSON.parse(cachedData);
      }
    }

    // If no valid cache, fetch from API
    if (!EVENTBRITE_API_KEY) {
      console.warn('Eventbrite API key is not set in environment variables. Returning empty events list.');
      return [];
    }

    const url = `${EVENTBRITE_API_URL}?location.address=${encodeURIComponent(
      location
    )}&sort_by=date&expand=venue,logo&token=${EVENTBRITE_API_KEY}&page_size=${limit}`;

    console.log('Fetching events from Eventbrite API...', { url: url.slice(0, 100) + '...' });
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Eventbrite API error: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Eventbrite API returned non-JSON response:', contentType, 'Content:', text.slice(0, 200) + (text.length > 200 ? '...' : ''));
      throw new Error('Non-JSON response from Eventbrite API');
    }

    const data = await response.json();
    const rawEvents: EventbriteEvent[] = data.events || [];

    // Normalize Eventbrite data to our Event type
    const normalizedEvents: Event[] = rawEvents
      .filter(event => event.start && event.start.local)
      .map(event => {
        const startDate = new Date(event.start.local);
        const dateStr = startDate.toISOString().split('T')[0];
        const timeStr = startDate.toTimeString().split(' ')[0].slice(0, 5);

        return {
          id: `eb_${event.id}`,
          title: event.name.text || 'Untitled Event',
          description: event.description.text || 'No description available.',
          imageUrl: event.logo?.original?.url || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
          date: dateStr,
          time: timeStr,
          location: {
            address: event.venue?.address?.localized_address_display || 'Location TBD',
            city: location.split(',')[0].trim(),
            coordinates: event.venue?.address?.latitude && event.venue?.address?.longitude
              ? {
                  latitude: parseFloat(event.venue.address.latitude),
                  longitude: parseFloat(event.venue.address.longitude),
                }
              : undefined,
          },
          price: event.is_free ? 0 : -1, // -1 indicates price not specified; UI can show 'Check Website'
          category: mapCategory(event.category_id),
          hostId: 'eventbrite',
          hostName: 'Eventbrite',
          createdAt: new Date().toISOString(),
          source: 'Eventbrite',
          externalUrl: event.url,
        };
      });

    // Cache the results
    await AsyncStorage.setItem(cacheKey, JSON.stringify(normalizedEvents));
    await AsyncStorage.setItem(`${cacheKey}_timestamp`, currentTime.toString());

    console.log(`Successfully fetched and cached ${normalizedEvents.length} events from Eventbrite`);
    return normalizedEvents;
  } catch (error) {
    console.error('Error fetching Eventbrite events:', error instanceof Error ? error.message : String(error));
    return [];
  }
};

// Clear cache for Eventbrite events
export const clearEventbriteCache = async (location: string = DEFAULT_LOCATION, limit: number = 20): Promise<void> => {
  const cacheKey = `eventbrite_events_${location}_${limit}`;
  await AsyncStorage.removeItem(cacheKey);
  await AsyncStorage.removeItem(`${cacheKey}_timestamp`);
};

// Normalize Eventbrite events (used when fetching via tRPC)
export function normalizeEventbriteEvents(rawEvents: any[]): Event[] {
  return rawEvents
    .filter(event => event.start && event.start.local)
    .map(event => {
      const startDate = new Date(event.start.local);
      const dateStr = startDate.toISOString().split('T')[0];
      const timeStr = startDate.toTimeString().split(' ')[0].slice(0, 5);

      return {
        id: `eb_${event.id}`,
        title: event.name.text || 'Untitled Event',
        description: event.description.text || 'No description available.',
        imageUrl: event.logo?.original?.url || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        date: dateStr,
        time: timeStr,
        location: {
          address: event.venue?.address?.localized_address_display || 'Location TBD',
          city: 'London',
          coordinates: event.venue?.address?.latitude && event.venue?.address?.longitude
            ? {
                latitude: parseFloat(event.venue.address.latitude),
                longitude: parseFloat(event.venue.address.longitude),
              }
            : undefined,
        },
        price: event.is_free ? 0 : -1,
        category: mapCategory(event.category_id),
        hostId: 'eventbrite',
        hostName: 'Eventbrite',
        createdAt: new Date().toISOString(),
        source: 'Eventbrite',
        externalUrl: event.url,
      };
    });
}

// Map Eventbrite category IDs to our internal categories (simplified)
export function mapCategory(categoryId: string | null): Event['category'] {
  if (!categoryId) return 'other';

  const categoryMap: Record<string, Event['category']> = {
    '103': 'music',
    '110': 'food',
    '113': 'sports',
    '105': 'art',
    '102': 'tech',
    '108': 'education',
    '107': 'networking',
  };

  return categoryMap[categoryId] || 'other';
}