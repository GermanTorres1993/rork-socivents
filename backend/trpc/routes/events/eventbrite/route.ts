import { z } from "zod";
import { publicProcedure } from "../../../create-context";

export const fetchEventbriteEventsProcedure = publicProcedure
  .input(z.object({ location: z.string().default("London, UK"), limit: z.number().default(20) }))
  .query(async ({ input }) => {
    const EVENTBRITE_API_KEY = process.env.EVENTBRITE_API_KEY || process.env.EXPO_PUBLIC_EVENTBRITE_API_KEY || 'TX3YBNW4W6MUB5XDHBO3';
    const EVENTBRITE_API_URL = 'https://www.eventbriteapi.com/v3/events/search';

    if (!EVENTBRITE_API_KEY) {
      console.warn('Eventbrite API key is not configured on the server. Returning empty events list.');
      return [];
    }

    const url = `${EVENTBRITE_API_URL}?location.address=${encodeURIComponent(
      input.location
    )}&sort_by=date&expand=venue,logo&token=${EVENTBRITE_API_KEY}&page_size=${input.limit}`;

    console.log('Fetching events from Eventbrite API via backend...', { location: input.location, limit: input.limit });
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${EVENTBRITE_API_KEY}`
        }
      });
      if (!response.ok) {
        console.error(`Eventbrite API error: ${response.status} ${response.statusText}`);
        return [];
      }

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        console.error('Eventbrite API returned non-JSON response:', contentType);
        const text = await response.text();
        console.error('Response content:', text.slice(0, 200) + (text.length > 200 ? '...' : ''));
        return [];
      }

      const data = await response.json();
      console.log('Successfully fetched Eventbrite events from backend:', data.events?.length || 0);
      return data.events || [];
    } catch (error) {
      console.error('Error fetching Eventbrite events from backend:', error instanceof Error ? error.message : String(error));
      return [];
    }
  });