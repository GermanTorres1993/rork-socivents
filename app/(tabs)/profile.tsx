import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Animated, Pressable, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAuthStore } from "@/store/authStore";
import { useTicketStore } from "@/store/ticketStore";
import { Button } from "@/components/Button";
import { TicketCard } from "@/components/TicketCard";
import { colors, typography, spacing, borderRadius, shadows } from "@/constants/colors";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, isLoading: authLoading, uploadProfilePhoto, error, clearError } = useAuthStore();
  const { userTickets, fetchUserTickets, isLoading: ticketsLoading } = useTicketStore();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const profileImageScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (user) {
      fetchUserTickets(user.id);
    }
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(profileImageScale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [user]);

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out of your account?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Sign Out",
          onPress: () => logout(),
          style: "destructive",
        },
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert("Edit Profile", "Profile editing feature coming soon!");
  };

  const handleSettings = () => {
    Alert.alert("Settings", "Settings feature coming soon!");
  };

  const handleEULA = () => {
    router.push("/eula");
  };

  const handlePrivacyPolicy = () => {
    Alert.alert("Privacy Policy", "Privacy policy feature coming soon!");
  };

  const handlePhotoUpload = async () => {
    try {
      await uploadProfilePhoto();
    } catch (error) {
      console.error("Photo upload error:", error);
    }
  };

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  // Show error state if no user
  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="person-outline" size={64} color={colors.textTertiary} />
        <Text style={styles.errorTitle}>Profile Not Found</Text>
        <Text style={styles.errorSubtitle}>Please try logging in again</Text>
        <Button
          title="Go to Login"
          onPress={() => router.replace("/(auth)")}
          variant="primary"
          size="medium"
        />
      </View>
    );
  }

  const renderProfileHeader = () => (
    <Animated.View style={[styles.headerContainer, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientMiddle, colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <View style={styles.profileSection}>
            <Animated.View style={[
              styles.profileImageContainer,
              { transform: [{ scale: profileImageScale }] }
            ]}>
              <TouchableOpacity 
                style={styles.profileImageTouchable}
                onPress={handlePhotoUpload}
                disabled={authLoading}
              >
                {user.photoUrl ? (
                  <Image
                    source={{ uri: user.photoUrl }}
                    style={styles.profileImage}
                  />
                ) : (
                  <View style={styles.profileImagePlaceholder}>
                    <Ionicons 
                      name="add" 
                      size={40} 
                      color={colors.white} 
                    />
                  </View>
                )}
                <View style={styles.profileImageBorder} />
                {authLoading && (
                  <View style={styles.profileImageLoading}>
                    <ActivityIndicator size="small" color={colors.white} />
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
            
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <View style={styles.locationContainer}>
                <Ionicons name="location-outline" size={16} color={colors.white} />
                <Text style={styles.userLocation}>{user.city || "London"}</Text>
              </View>
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{userTickets.length}</Text>
                  <Text style={styles.statLabel}>Events</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>12</Text>
                  <Text style={styles.statLabel}>Following</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>48</Text>
                  <Text style={styles.statLabel}>Followers</Text>
                </View>
              </View>
            </View>
          </View>
          
          <View style={styles.headerActions}>
            <Pressable style={styles.actionButton} onPress={handleEditProfile}>
              <Ionicons name="create-outline" size={20} color={colors.white} />
            </Pressable>
            <Pressable style={styles.actionButton} onPress={handleSettings}>
              <Ionicons name="settings-outline" size={20} color={colors.white} />
            </Pressable>
            <Pressable style={[styles.actionButton, styles.logoutButton]} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color={colors.white} />
            </Pressable>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  const renderSection = (title: string, children: React.ReactNode) => (
    <Animated.View style={[
      styles.section,
      { 
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }]
      }
    ]}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </Animated.View>
  );

  const renderBioSection = () => {
    if (!user.bio) return null;
    
    return renderSection("About", (
      <View style={styles.bioCard}>
        <Text style={styles.bioText}>{user.bio}</Text>
      </View>
    ));
  };

  const renderInterestsSection = () => (
    renderSection("Interests", (
      <View style={styles.interestsContainer}>
        {user.interests && user.interests.length > 0 ? (
          <View style={styles.interestTags}>
            {user.interests.map((interest, index) => (
              <View key={index} style={styles.interestTag}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyInterests}>
            <Ionicons name="add-circle-outline" size={24} color={colors.textTertiary} />
            <Text style={styles.emptyInterestsText}>Add your interests</Text>
          </View>
        )}
      </View>
    ))
  );

  const renderTicketsSection = () => (
    renderSection("Your Tickets", (
      <View style={styles.ticketsContainer}>
        {ticketsLoading ? (
          <View style={styles.loadingTickets}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.loadingText}>Loading tickets...</Text>
          </View>
        ) : userTickets.length === 0 ? (
          <View style={styles.emptyTickets}>
            <View style={styles.emptyTicketsIcon}>
              <Ionicons name="ticket-outline" size={32} color={colors.textTertiary} />
            </View>
            <Text style={styles.emptyTicketsTitle}>No tickets yet</Text>
            <Text style={styles.emptyTicketsSubtext}>
              Book an event to see your tickets here
            </Text>
            <Button
              title="Discover Events"
              onPress={() => router.push("/(tabs)/")}
              variant="outline"
              size="medium"
              style={styles.discoverButton}
            />
          </View>
        ) : (
          userTickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))
        )}
      </View>
    ))
  );

  const renderSettingsSection = () => (
    renderSection("Settings & Legal", (
      <View style={styles.settingsContainer}>
        <TouchableOpacity style={styles.settingItem} onPress={handleSettings}>
          <View style={styles.settingIcon}>
            <Ionicons name="settings-outline" size={20} color={colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>App Settings</Text>
            <Text style={styles.settingSubtitle}>Notifications, privacy, and more</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={handleEULA}>
          <View style={styles.settingIcon}>
            <Ionicons name="document-text-outline" size={20} color={colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Terms & Conditions</Text>
            <Text style={styles.settingSubtitle}>End User License Agreement</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={handlePrivacyPolicy}>
          <View style={styles.settingIcon}>
            <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Privacy Policy</Text>
            <Text style={styles.settingSubtitle}>How we handle your data</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
        </TouchableOpacity>
      </View>
    ))
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{error}</Text>
          <TouchableOpacity onPress={clearError}>
            <Ionicons name="close" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
      )}
      
      {renderProfileHeader()}
      {renderBioSection()}
      {renderInterestsSection()}
      {renderTicketsSection()}
      {renderSettingsSection()}
      
      <View style={styles.appInfo}>
        <Text style={styles.appVersion}>Socivents v1.0.0</Text>
        <Text style={styles.appCopyright}>© 2025 Socivents. All rights reserved.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: spacing.xxxxl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    gap: spacing.lg,
  },
  loadingText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xxl,
    gap: spacing.lg,
  },
  errorTitle: {
    ...typography.h2,
    color: colors.text,
    textAlign: "center",
  },
  errorSubtitle: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  errorBanner: {
    backgroundColor: colors.error,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  errorBannerText: {
    ...typography.bodySmall,
    color: colors.white,
    flex: 1,
    marginRight: spacing.md,
  },
  headerContainer: {
    marginBottom: spacing.xxl,
  },
  headerGradient: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
    paddingHorizontal: spacing.xxl,
    borderBottomLeftRadius: borderRadius.xxxl,
    borderBottomRightRadius: borderRadius.xxxl,
  },
  headerContent: {
    gap: spacing.xl,
  },
  profileSection: {
    alignItems: "center",
    gap: spacing.lg,
  },
  profileImageContainer: {
    position: "relative",
  },
  profileImageTouchable: {
    position: "relative",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.full,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.full,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.white,
    borderStyle: "dashed",
  },
  profileImageBorder: {
    position: "absolute",
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: borderRadius.full,
    borderWidth: 3,
    borderColor: colors.white,
  },
  profileImageLoading: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: borderRadius.full,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfo: {
    alignItems: "center",
    gap: spacing.sm,
  },
  userName: {
    ...typography.displaySmall,
    color: colors.white,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  userLocation: {
    ...typography.bodyMedium,
    color: colors.white,
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.md,
    backdropFilter: "blur(10px)",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    ...typography.h3,
    color: colors.white,
    fontWeight: "800",
  },
  statLabel: {
    ...typography.caption,
    color: colors.white,
    opacity: 0.8,
    marginTop: spacing.xs,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginHorizontal: spacing.lg,
  },
  headerActions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.md,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(10px)",
  },
  logoutButton: {
    backgroundColor: "rgba(239, 68, 68, 0.3)",
  },
  section: {
    marginHorizontal: spacing.xxl,
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  bioCard: {
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    ...shadows.small,
  },
  bioText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  interestsContainer: {
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    ...shadows.small,
  },
  interestTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  interestTag: {
    backgroundColor: colors.primaryUltraLight,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  interestText: {
    ...typography.labelMedium,
    color: colors.primary,
  },
  emptyInterests: {
    alignItems: "center",
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  emptyInterestsText: {
    ...typography.bodyMedium,
    color: colors.textTertiary,
  },
  ticketsContainer: {
    gap: spacing.lg,
  },
  loadingTickets: {
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: "center",
    gap: spacing.md,
    ...shadows.small,
  },
  emptyTickets: {
    backgroundColor: colors.surface,
    padding: spacing.xxxl,
    borderRadius: borderRadius.lg,
    alignItems: "center",
    gap: spacing.lg,
    ...shadows.small,
  },
  emptyTicketsIcon: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTicketsTitle: {
    ...typography.h3,
    color: colors.text,
  },
  emptyTicketsSubtext: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    textAlign: "center",
  },
  discoverButton: {
    marginTop: spacing.md,
  },
  settingsContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    ...shadows.small,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primaryUltraLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.lg,
  },
  settingContent: {
    flex: 1,
    gap: spacing.xs,
  },
  settingTitle: {
    ...typography.bodyMedium,
    color: colors.text,
    fontWeight: "600",
  },
  settingSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  appInfo: {
    alignItems: "center",
    paddingTop: spacing.xxl,
    marginHorizontal: spacing.xxl,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    gap: spacing.xs,
  },
  appVersion: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  appCopyright: {
    ...typography.caption,
    color: colors.textTertiary,
  },
});