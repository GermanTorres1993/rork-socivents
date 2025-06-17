import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/types";
import { supabase } from "@/lib/supabase";
import { AuthError } from "@supabase/supabase-js";
import * as ImagePicker from 'expo-image-picker';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | undefined;
  login: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  socialLogin: (provider: "google" | "apple") => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  uploadProfilePhoto: () => Promise<void>;
  clearError: () => void;
  initializeAuth: () => Promise<void>;
  bypassLogin: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: undefined,

      initializeAuth: async () => {
        set({ isLoading: true, error: undefined });
        
        try {
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            console.error("Session error:", sessionError);
            set({ isAuthenticated: false, isLoading: false });
            return;
          }
          
          if (session?.user) {
            // Fetch user profile from our users table with better error handling
            const { data: profile, error: profileError } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profileError) {
              console.error("Profile fetch error during initialization:", profileError);
              
              // If no profile exists, create one
              if (profileError.code === 'PGRST116') {
                console.log("No profile found for user during initialization, creating one");
                const { error: insertError } = await supabase
                  .from('users')
                  .insert({
                    id: session.user.id,
                    email: session.user.email || '',
                    name: session.user.user_metadata?.name || 'User',
                  });

                if (insertError) {
                  console.error("Failed to create user profile:", insertError);
                  set({ isAuthenticated: false, isLoading: false });
                  return;
                }

                // Fetch the newly created profile
                const { data: newProfile, error: newProfileError } = await supabase
                  .from('users')
                  .select('*')
                  .eq('id', session.user.id)
                  .single();

                if (newProfileError || !newProfile) {
                  console.error("Failed to fetch newly created profile:", newProfileError);
                  set({ isAuthenticated: false, isLoading: false });
                  return;
                }

                const user: User = {
                  id: newProfile.id,
                  name: newProfile.name,
                  email: newProfile.email,
                  photoUrl: newProfile.photo_url || undefined,
                  bio: newProfile.bio || undefined,
                  city: newProfile.city || undefined,
                  interests: newProfile.interests || [],
                  createdAt: newProfile.created_at,
                };
                set({ user, isAuthenticated: true, isLoading: false });
              } else {
                set({ isAuthenticated: false, isLoading: false });
              }
              return;
            }

            if (profile) {
              const user: User = {
                id: profile.id,
                name: profile.name,
                email: profile.email,
                photoUrl: profile.photo_url || undefined,
                bio: profile.bio || undefined,
                city: profile.city || undefined,
                interests: profile.interests || [],
                createdAt: profile.created_at,
              };
              set({ user, isAuthenticated: true, isLoading: false });
            } else {
              set({ isAuthenticated: false, isLoading: false });
            }
          } else {
            set({ isAuthenticated: false, isLoading: false });
          }
        } catch (error) {
          console.error("Auth initialization error:", error);
          set({ error: "Failed to initialize authentication", isLoading: false });
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: undefined });
        
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim().toLowerCase(),
            password,
          });

          if (error) throw error;

          if (data.user) {
            // Fetch user profile with better error handling
            const { data: profile, error: profileError } = await supabase
              .from('users')
              .select('*')
              .eq('id', data.user.id)
              .single();

            if (profileError) {
              console.error("Profile fetch error during login:", profileError);
              
              // If no profile exists, create one
              if (profileError.code === 'PGRST116') {
                const { error: insertError } = await supabase
                  .from('users')
                  .insert({
                    id: data.user.id,
                    email: data.user.email || '',
                    name: data.user.user_metadata?.name || 'User',
                  });

                if (insertError) {
                  console.error("Failed to create user profile during login:", insertError);
                  throw insertError;
                }

                // Fetch the newly created profile
                const { data: newProfile, error: newProfileError } = await supabase
                  .from('users')
                  .select('*')
                  .eq('id', data.user.id)
                  .single();

                if (newProfileError || !newProfile) {
                  console.error("Failed to fetch newly created profile during login:", newProfileError);
                  set({ isAuthenticated: false, isLoading: false });
                  return;
                }

                const user: User = {
                  id: newProfile.id,
                  name: newProfile.name,
                  email: newProfile.email,
                  photoUrl: newProfile.photo_url || undefined,
                  bio: newProfile.bio || undefined,
                  city: newProfile.city || undefined,
                  interests: newProfile.interests || [],
                  createdAt: newProfile.created_at,
                };

                set({ user, isAuthenticated: true, isLoading: false });
              } else {
                throw profileError;
              }
            } else if (profile) {
              const user: User = {
                id: profile.id,
                name: profile.name,
                email: profile.email,
                photoUrl: profile.photo_url || undefined,
                bio: profile.bio || undefined,
                city: profile.city || undefined,
                interests: profile.interests || [],
                createdAt: profile.created_at,
              };

              set({ user, isAuthenticated: true, isLoading: false });
            }
          }
        } catch (error) {
          const authError = error as AuthError;
          set({ 
            error: authError.message || "Login failed. Please try again.", 
            isLoading: false 
          });
        }
      },

      signUp: async (name, email, password) => {
        set({ isLoading: true, error: undefined });
        
        try {
          const { data, error } = await supabase.auth.signUp({
            email: email.trim().toLowerCase(),
            password,
            options: {
              data: {
                name: name.trim(),
              },
            },
          });

          if (error) throw error;

          if (data.user) {
            // The user profile will be created automatically by the trigger
            // Wait a moment for the trigger to complete
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Fetch the created profile
            const { data: profile, error: profileError } = await supabase
              .from('users')
              .select('*')
              .eq('id', data.user.id)
              .single();

            if (profile && !profileError) {
              const user: User = {
                id: profile.id,
                name: profile.name,
                email: profile.email,
                photoUrl: profile.photo_url || undefined,
                bio: profile.bio || undefined,
                city: profile.city || undefined,
                interests: profile.interests || [],
                createdAt: profile.created_at,
              };

              set({ user, isAuthenticated: true, isLoading: false });
            } else {
              // If profile fetch fails, still consider signup successful
              console.error("Profile fetch error during signup:", profileError?.message);
              set({ isLoading: false });
            }
          }
        } catch (error) {
          const authError = error as AuthError;
          set({ 
            error: authError.message || "Registration failed. Please try again.", 
            isLoading: false 
          });
        }
      },

      socialLogin: async (provider) => {
        set({ isLoading: true, error: undefined });
        
        // Temporarily bypass Supabase auth for both Google and Apple login
        // This is a temporary solution for development purposes
        setTimeout(() => {
          const mockUser: User = {
            id: `mock-${provider}-user-id`,
            name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
            email: `user@${provider}.com`,
            photoUrl: undefined,
            createdAt: new Date().toISOString(),
          };
          set({ user: mockUser, isAuthenticated: true, isLoading: false });
        }, 1000);
        return;
        
        try {
          const { data, error } = await supabase.auth.signInWithOAuth({
            provider: provider === "google" ? "google" : "apple",
            options: {
              redirectTo: "socivents://auth/callback",
            },
          });

          if (error) throw error;

          // OAuth flow will handle the rest
          set({ isLoading: false });
        } catch (error) {
          const authError = error as AuthError;
          set({ 
            error: authError.message || `${provider} login failed. Please try again.`, 
            isLoading: false 
          });
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          
          set({ user: null, isAuthenticated: false, error: undefined, isLoading: false });
        } catch (error) {
          console.error("Logout error:", error);
          // Force logout even if there's an error
          set({ user: null, isAuthenticated: false, error: undefined, isLoading: false });
        }
      },

      updateProfile: async (updates) => {
        const currentUser = get().user;
        if (!currentUser) return;

        set({ isLoading: true, error: undefined });
        try {
          const { error } = await supabase
            .from('users')
            .update({
              name: updates.name,
              photo_url: updates.photoUrl,
              bio: updates.bio,
              city: updates.city,
              interests: updates.interests,
            })
            .eq('id', currentUser.id);

          if (error) throw error;

          set(state => ({
            user: state.user ? { ...state.user, ...updates } : null,
            isLoading: false
          }));
        } catch (error) {
          console.error("Profile update error:", error);
          set({ error: "Profile update failed. Please try again.", isLoading: false });
        }
      },

      uploadProfilePhoto: async () => {
        const currentUser = get().user;
        if (!currentUser) return;

        try {
          // Request permission to access media library
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            set({ error: 'Permission to access media library is required!' });
            return;
          }

          // Launch image picker
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
            base64: true,
          });

          if (!result.canceled && result.assets[0]) {
            set({ isLoading: true, error: undefined });
            
            const asset = result.assets[0];
            const fileExt = asset.uri.split('.').pop();
            const fileName = `${currentUser.id}/profile.${fileExt}`;
            
            // Note: Removed dependency on 'base64-arraybuffer' due to installation limitations
            // TODO: Implement proper image upload for React Native with Expo
            // For now, we'll set an error message indicating functionality is not fully implemented
            set({ 
              error: "Image upload functionality is not fully implemented in this version.", 
              isLoading: false 
            });
            
            // Placeholder for actual upload logic
            /*
            if (!asset.base64) {
              throw new Error('Failed to get image data');
            }

            // Upload to Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('profile-photos')
              .upload(fileName, decode(asset.base64), {
                contentType: `image/${fileExt}`,
                upsert: true,
              });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: urlData } = supabase.storage
              .from('profile-photos')
              .getPublicUrl(fileName);

            const photoUrl = urlData.publicUrl;

            // Update user profile with new photo URL
            await get().updateProfile({ photoUrl });

            set({ isLoading: false });
            */
          }
        } catch (error) {
          console.error("Photo upload error:", error);
          set({ 
            error: "Failed to upload photo. Please try again.", 
            isLoading: false 
          });
        }
      },

      clearError: () => {
        set({ error: undefined });
      },

      bypassLogin: () => {
        const mockUser: User = {
          id: "mock-google-user-id",
          name: "Google User",
          email: "user@google.com",
          photoUrl: undefined,
          createdAt: new Date().toISOString(),
        };
        set({ user: mockUser, isAuthenticated: true, isLoading: false });
      },
    }),
    {
      name: "socivents-auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

// Listen for auth changes
supabase.auth.onAuthStateChange(async (event, session) => {
  const { initializeAuth } = useAuthStore.getState();
  
  if (event === 'SIGNED_IN' && session) {
    await initializeAuth();
  } else if (event === 'SIGNED_OUT') {
    useAuthStore.setState({ 
      user: null, 
      isAuthenticated: false, 
      error: undefined 
    });
  }
});