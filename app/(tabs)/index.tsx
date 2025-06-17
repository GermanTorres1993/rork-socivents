import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, FlatList, RefreshControl, Animated, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useEventStore } from "@/store/eventStore";
import { EventCard } from "@/components/EventCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { colors, typography, spacing, borderRadius, shadows } from "@/constants/colors";
import { EventCategory } from "@/types";
import { Button } from "@/components/Button";

export default function DiscoverScreen() {
  const { 
    filteredEvents, 
    events,
    selectedCategory, 
    fetchEvents, 
    filterByCategory,
    refreshExternalEvents,
    isLoading,
    error
  } = useEventStore();

  const [externalEventsError, setExternalEventsError] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const headerScaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    console.log("Fetching events on component mount");
    fetchEvents();
    
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
      Animated.spring(headerScaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    console.log("Filtered events updated:", filteredEvents.length);
  }, [filteredEvents]);

  const handleCategorySelect = (category: EventCategory | "all") => {
    filterByCategory(category);
  };

  const handleRefresh = () => {
    console.log("Refreshing events");
    fetchEvents();
    setExternalEventsError(false);
  };

  const handleRefreshExternal = async () => {
    try {
      await refreshExternalEvents();
      setExternalEventsError(false);
    } catch (err) {
      setExternalEventsError(true);
      console.error("Failed to refresh external events:", err);
    }
  };

  const renderHeader = () => (
    <Animated.View style={[
      styles.headerContainer,
      {
        opacity: fadeAnim,
        transform: [
          { translateY: slideAnim },
          { scale: headerScaleAnim }
        ]
      }
    ]}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientMiddle, colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>Good morning! 👋</Text>
            <Text style={styles.title}>Discover Events</Text>
            <Text style={styles.subtitle}>Find amazing experiences happening in London</Text>
          </View>
          
          <View style={styles.headerStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{filteredEvents.length}</Text>
              <Text style={styles.statLabel}>Events</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Categories</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="calendar-outline" size={64} color={colors.textQuaternary} />
      </View>
      <Text style={styles.emptyTitle}>No events found</Text>
      <Text style={styles.emptySubtitle}>
        {events.length > 0 
          ? "No events match the selected category. Try selecting a different category." 
          : "There are no upcoming events. Check back later for new events."}
      </Text>
      <Button
        title="Refresh Events"
        onPress={handleRefresh}
        variant="outline"
        size="medium"
        style={styles.emptyButton}
      />
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <View style={styles.loadingIconContainer}>
        <Ionicons name="search-outline" size={48} color={colors.primary} />
      </View>
      <Text style={styles.loadingTitle}>Finding amazing events...</Text>
      <Text style={styles.loadingSubtitle}>This won't take long</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />
      
      {isLoading && filteredEvents.length === 0 ? (
        renderLoadingState()
      ) : error ? (
        <View style={styles.errorContainer}>
          <View style={styles.errorIconContainer}>
            <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
          </View>
          <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
          <Text style={styles.errorText}>{error}</Text>
          <Button
            title="Try Again"
            onPress={handleRefresh}
            variant="primary"
            size="medium"
            style={styles.errorButton}
          />
        </View>
      ) : filteredEvents.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            console.log("Rendering event:", item.title); // Debugging log for each event
            return <EventCard event={item} />;
          }}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
              progressBackgroundColor={colors.surface}
            />
          }
        />
      )}
      
      <View style={styles.floatingActions}>
        <Pressable style={styles.refreshFab} onPress={handleRefreshExternal}>
          <Ionicons name="refresh-outline" size={20} color={colors.white} />
        </Pressable>
      </View>

      {externalEventsError && (
        <View style={styles.externalErrorContainer}>
          <Text style={styles.externalErrorText}>
            Could not load external events. API key might be missing.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    marginBottom: spacing.lg,
  },
  headerGradient: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
    borderBottomLeftRadius: borderRadius.xxxl,
    borderBottomRightRadius: borderRadius.xxxl,
  },
  headerContent: {
    gap: spacing.xl,
  },
  headerText: {
    gap: spacing.sm,
  },
  greeting: {
    ...typography.bodyMedium,
    color: colors.white,
    opacity: 0.9,
  },
  title: {
    ...typography.displayMedium,
    color: colors.white,
  },
  subtitle: {
    ...typography.bodyLarge,
    color: colors.white,
    opacity: 0.9,
  },
  headerStats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    backdropFilter: "blur(10px)",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    ...typography.h2,
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
    height: 32,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginHorizontal: spacing.lg,
  },
  listContent: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xxxxxxl,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xxxl,
    paddingVertical: spacing.xxxxl,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.full,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xxl,
    ...shadows.small,
  },
  emptyTitle: {
    ...typography.h2,
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  emptySubtitle: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.xxxl,
  },
  emptyButton: {
    minWidth: 160,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xxxl,
  },
  loadingIconContainer: {
    width: 96,
    height: 96,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryUltraLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
  },
  loadingTitle: {
    ...typography.h3,
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  loadingSubtitle: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xxxl,
  },
  errorIconContainer: {
    width: 96,
    height: 96,
    borderRadius: borderRadius.full,
    backgroundColor: colors.errorLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
  },
  errorTitle: {
    ...typography.h3,
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  errorText: {
    ...typography.bodyMedium,
    color: colors.error,
    textAlign: "center",
    marginBottom: spacing.xxxl,
  },
  errorButton: {
    minWidth: 120,
  },
  floatingActions: {
    position: "absolute",
    bottom: spacing.xxxl,
    right: spacing.xxl,
  },
  refreshFab: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.large,
  },
  externalErrorContainer: {
    position: "absolute",
    bottom: spacing.xxxxl,
    left: spacing.xxl,
    right: spacing.xxl,
    backgroundColor: colors.errorLight,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: "center",
  },
  externalErrorText: {
    ...typography.caption,
    color: colors.error,
    textAlign: "center",
  },
});