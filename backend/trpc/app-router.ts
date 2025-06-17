import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import { fetchEventbriteEventsProcedure } from "./routes/events/eventbrite/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  events: createTRPCRouter({
    fetchEventbrite: fetchEventbriteEventsProcedure,
  }),
});

export type AppRouter = typeof appRouter;