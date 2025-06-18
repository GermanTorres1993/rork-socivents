import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, View, Pressable, Animated, Linking, Platform } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Event } from "@/types";
import { colors, typography, spacing, borderRadius, shadows } from "@/constants/colors";
import { formatDate } from "@/utils/dateUtils";

type EventCardProps = {
  event: Event;
};

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    console.log("EventCard mounted for event:", event.title); // Debugging log
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (event.source === 'Eventbrite' && event.externalUrl) {
      Linking.openURL(event.externalUrl).catch(err => {
        console.error("Failed to open URL:", err);
      });
    } else {
      router.push(`/event/${event.id}`);
    }
  };

  const getCategoryColor = () => {
    const categoryColors = {
      music: colors.categoryMusic,
      tech: colors.categoryTech,
      food: colors.categoryFood,
      art: colors.categoryArt,
      sports: colors.categorySports,
      education: colors.categoryEducation,
      networking: colors.categoryNetworking,
      free: colors.categoryFree,
      other: colors.categoryOther,
    };
    return categoryColors[event.category] || colors.categoryOther;
  };

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          opacity: opacityAnim,
          transform: [
            { scale: scaleAnim },
            { translateY: slideAnim }
          ]
        }
      ]}
    >
      <Pressable 
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.pressable}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: event.imageUrl }}
            style={styles.image}
            contentFit="cover"
            transition={300}
          />
          
          {/* Gradient overlay for better text readability */}
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.3)"]}
            style={styles.imageGradient}
          />
          
          {/* Badges overlay */}
          <View style={styles.badgesContainer}>
            <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor() }]}>
              <Text style={styles.categoryText}>{event.category}</Text>
            </View>
            
            {event.price === 0 && (
              <View style={styles.freeBadge}>
                <Text style={styles.freeText}>FREE</Text>
              </View>
            )}
            
            {event.source === 'Eventbrite' && (
              <View style={styles.sourceBadge}>
                <Ionicons name="link-outline" size={12} color={colors.white} />
                <Text style={styles.sourceText}>Eventbrite</Text>
              </View>
            )}
          </View>

          {/* Bookmark button */}
          <View style={styles.bookmarkContainer}>
            <Pressable style={styles.bookmarkButton}>
              <Ionicons name="bookmark-outline" size={18} color={colors.white} />
            </Pressable>
          </View>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {event.title}
          </Text>
          
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <View style={styles.iconWrapper}>
                <Ionicons name="calendar-outline" size={16} color={colors.primary} />
              </View>
              <Text style={styles.infoText}>
                {formatDate(event.date)} • {event.time}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <View style={styles.iconWrapper}>
                <Ionicons name="location-outline" size={16} color={colors.primary} />
              </View>
              <Text style={styles.infoText} numberOfLines={1}>
                {event.location.address}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <View style={styles.iconWrapper}>
                <Ionicons name="person-outline" size={16} color={colors.primary} />
              </View>
              <Text style={styles.infoText} numberOfLines={1}>
                {event.hostName}
              </Text>
            </View>
          </View>
          
          <View style={styles.footer}>
            <View style={styles.priceContainer}>
              {event.price > 0 ? (
                <>
                  <Text style={styles.priceLabel}>From</Text>
                  <Text style={styles.price}>£{event.price.toFixed(2)}</Text>
                </>
              ) : event.price === -1 ? (
                <Text style={styles.checkWebsiteText}>Check Website</Text>
              ) : (
                <View style={styles.freeContainer}>
                  <Ionicons name="gift-outline" size={16} color={colors.success} />
                  <Text style={styles.freePrice}>Free Event</Text>
                </View>
              )}
            </View>
            
            <View style={styles.actionButtons}>
              <Pressable style={styles.shareButton}>
                <Ionicons name="share-outline" size={16} color={colors.textTertiary} />
              </Pressable>
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.xl,
    overflow: "hidden",
    ...shadows.medium,
  },
  pressable: {
    flex: 1,
  },
  imageContainer: {
    position: "relative",
    height: 220,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  badgesContainer: {
   I position: "absolute",
    top: spacing.lg,
    left: spacing.lg,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  categoryBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    ...shadows.small,
  },
  categoryText: {
    ...typography.labelMedium,
    color: colors.white,
    textTransform: "capitalize",
  },
  freeBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    ...shadows.small,
  },
  freeText: {
    ...typography.labelMedium,
    color: colors.white,
    fontWeight: "700",
  },
  sourceBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    ...shadows.small,
  },
  sourceText: {
    ...typography.labelSmall,
    color: colors.white,
  },
  bookmarkContainer: {
    position: "absolute",
    top: spacing.lg,
    right: spacing.lg,
  },
  bookmarkButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(10px)",
  },
  content: {
    padding: spacing.xl,
  },
  title: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  infoContainer: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  iconWrapper: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primaryUltraLight,
    alignItems: "center",
    justifyContent: "center",
  },
  infoText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: spacing.xs,
    flex: 1,
  },
  priceLabel: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  price: {
    ...typography.h3,
    color: colors.primary,
  },
  checkWebsiteText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  freeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  freePrice: {
    ...typography.bodySmall,
    color: colors.success,
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  shareButton: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
});