import { publicProcedure, createTRPCRouter } from "../../create-context";
import { z } from 'zod';
import axios from 'axios';

export const fetchEventbriteEventsProcedure = publicProcedure.query(async () => {
  try {
    const response = await axios.get(
      'https://www.eventbriteapi.com/v3/events/search/?location.address=London',
      {
        headers: {
          Authorization: `Bearer ${process.env.EVENTBRITE_TOKEN || 'TX3YBNW4W6MUB5XDHBO3'}`,
        },
      },
    );
    return response.data.events;
  } catch (error) {
    console.error('Error fetching from Eventbrite:', error);
    throw new Error('Could not fetch events');
  }
});