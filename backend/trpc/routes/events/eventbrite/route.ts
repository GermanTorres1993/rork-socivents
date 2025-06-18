import { publicProcedure } from "@backend/trpc/trpc";
import { z } from "zod";

export const eventbriteRoute = publicProcedure
  .input(z.object({ location: z.string() }))
  .query(async ({ input }) => {
    const token = process.env.EVENTBRITE_TOKEN;
    if (!token) throw new Error("Eventbrite token is missing from env.");

    const res = await fetch(
      `https://www.eventbriteapi.com/v3/events/search?location.address=${input.location}&expand=venue`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Eventbrite API responded with ${res.status}: ${text}`);
    }

    const data = await res.json();
    return data.events;
  });