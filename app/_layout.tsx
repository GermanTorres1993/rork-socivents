import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "@/store/authStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, trpcClient } from "@/lib/trpc";

export const unstable_settings = {
  initialRouteName: "(auth)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Create a client
const queryClient = new QueryClient();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  const { initializeAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (error) {
      console.error("Font loading error:", error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      // Initialize authentication when fonts are loaded
      initializeAuth().catch(console.error);
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <RootLayoutNav />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

function RootLayoutNav() {
  const { isAuthenticated } = useAuthStore();

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen 
              name="event/[id]" 
              options={{ 
                headerShown: true,
                title: "Event Details",
                headerBackTitle: "Back",
              }} 
            />
            <Stack.Screen 
              name="chat/[id]" 
              options={{ 
                headerShown: true,
                title: "Event Chat",
                headerBackTitle: "Back",
              }} 
            />
            <Stack.Screen 
              name="ticket/[id]" 
              options={{ 
                headerShown: true,
                title: "Ticket",
                headerBackTitle: "Back",
              }} 
            />
            <Stack.Screen 
              name="create-event" 
              options={{ 
                headerShown: true,
                title: "Create Event",
                headerBackTitle: "Cancel",
                presentation: "modal",
              }} 
            />
            <Stack.Screen 
              name="eula" 
              options={{ 
                headerShown: true,
                title: "Terms & Conditions",
                headerBackTitle: "Back",
              }} 
            />
          </>
        ) : (
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        )}
      </Stack>
    </>
  );
}