import { publicProcedure, router } from '../trpc';
import { z } from 'zod';
import axios from 'axios';

export const eventbriteRouter = router({
  getEvents: publicProcedure.query(async () => {
    try {
      const response = await axios.get(
        'https://www.eventbriteapi.com/v3/events/search/?location.address=London',
        {
          headers: {
            Authorization: `Bearer ${process.env.EVENTBRITE_TOKEN}`,
          },
        },
      );
      return response.data.events;
    } catch (error) {
      console.error('Error fetching from Eventbrite:', error);
      throw new Error('Could not fetch events');
    }
  }),
});