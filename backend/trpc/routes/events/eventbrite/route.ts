import { publicProcedure } from "../../../create-context";
import { z } from 'zod';

export const fetchEventbriteEventsProcedure = publicProcedure.query(async () => {
  try {
    // Mock data for now since axios is not available in the current setup
    return [
      {
        id: 'mock1',
        name: { text: 'Mock Event 1' },
        start: { local: '2025-07-01T18:00:00' },
        venue: { address: { localized_address_display: 'London, UK' } },
        logo: { original: { url: 'https://via.placeholder.com/150' } },
      },
      {
        id: 'mock2',
        name: { text: 'Mock Event 2' },
        start: { local: '2025-07-02T18:00:00' },
        venue: { address: { localized_address_display: 'London, UK' } },
        logo: { original: { url: 'https://via.placeholder.com/150' } },
      },
    ];
  } catch (error) {
    console.error('Error fetching from Eventbrite:', error);
    throw new Error('Could not fetch events');
  }
});