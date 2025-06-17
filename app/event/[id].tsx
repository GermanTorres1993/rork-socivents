import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/components/Button";
import { colors } from "@/constants/colors";
import { formatFullDate } from "@/utils/dateUtils";
import { useAuthStore } from "@/store/authStore";
import { useTicketStore } from "@/store/ticketStore";
import { useChatStore } from "@/store/chatStore";
import { useEventStore } from "@/store/eventStore";
import { Event } from "@/types";

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const { purchaseTicket, checkTicketStatus, isLoading: ticketLoading } = useTicketStore();
  const { joinChat, isLoading: chatLoading } = useChatStore();
  const { getEventById } = useEventStore();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [hasTicket, setHasTicket] = useState(false);
  const [isJoiningChat, setIsJoiningChat] = useState(false);
  const [isLoadingEvent, setIsLoadingEvent] = useState(true);

  useEffect(() => {
    const loadEvent = async () => {
      if (id) {
        setIsLoadingEvent(true);
        const eventData = await getEventById(id);
        setEvent(eventData);
        setIsLoadingEvent(false);
      }
    };
    
    loadEvent();
  }, [id]);

  useEffect(() => {
    if (user && event) {
      checkTicketStatus(event.id, user.id).then(setHasTicket);
    }
  }, [user, event]);

  if (isLoadingEvent) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading event...</Text>
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Event not found</Text>
      </View>
    );
  }

  const handlePurchaseTicket = async () => {
    if (!user) return;
    
    try {
      await purchaseTicket(event.id, user.id, event.price);
      setHasTicket(true);
      Alert.alert(
        "Success!",
        `You've successfully purchased a ticket for ${event.title}`,
        [{ text: "OK" }]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to purchase ticket. Please try again.");
    }
  };

  const handleJoinChat = async () => {
    if (!user) return;
    
    setIsJoiningChat(true);
    try {
      await joinChat(event.id, user.id);
      router.push(`/chat/${event.id}`);
    } catch (error) {
      Alert.alert("Error", "Failed to join chat. Please try again.");
    } finally {
      setIsJoiningChat(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: event.imageUrl }}
          style={styles.image}
          contentFit="cover"
        />
        <LinearGradient
          colors={["transparent", colors.overlay]}
          style={styles.imageOverlay}
        />
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{event.category}</Text>
        </View>
      </View>
      
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{event.title}</Text>
        
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="calendar-outline" size={20} color={colors.primary} />
            </View>
            <Text style={styles.infoText}>
              {formatFullDate(event.date, event.time)}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="location-outline" size={20} color={colors.primary} />
            </View>
            <Text style={styles.infoText}>{event.location.address}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="person-outline" size={20} color={colors.primary} />
            </View>
            <Text style={styles.infoText}>Hosted by {event.hostName}</Text>
          </View>
        </View>
        
        <View style={styles.priceSection}>
          {event.price > 0 ? (
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Ticket Price</Text>
              <Text style={styles.price}>£{event.price.toFixed(2)}</Text>
            </View>
          ) : (
            <View style={styles.freePriceContainer}>
              <Text style={styles.freePrice}>FREE EVENT</Text>
            </View>
          )}
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>About this event</Text>
          <Text style={styles.description}>{event.description}</Text>
        </View>
        
        <View style={styles.actionsContainer}>
          {!hasTicket ? (
            <Button
              title={event.price > 0 ? `Get Ticket - £${event.price.toFixed(2)}` : "Get Free Ticket"}
              onPress={handlePurchaseTicket}
              variant="primary"
              size="large"
              fullWidth
              style={styles.primaryButton}
              loading={ticketLoading}
              icon={<Ionicons name="card-outline" size={20} color={colors.white} />}
            />
          ) : (
            <Button
              title="Join Event Chat"
              onPress={handleJoinChat}
              variant="primary"
              size="large"
              fullWidth
              style={styles.primaryButton}
              loading={isJoiningChat}
              icon={<Ionicons name="chatbubbles-outline" size={20} color={colors.white} />}
            />
          )}
          
          <Button
            title="Share Event"
            onPress={() => Alert.alert("Share", "Sharing feature coming soon!")}
            variant="outline"
            size="large"
            fullWidth
            style={styles.secondaryButton}
            icon={<Ionicons name="share-outline" size={20} color={colors.primary} />}
          />
        </View>
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
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    fontWeight: "500",
  },
  imageContainer: {
    position: "relative",
    height: 300,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  categoryBadge: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  categoryText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  detailsContainer: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 24,
    lineHeight: 36,
  },
  infoSection: {
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  infoText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
    fontWeight: "500",
  },
  priceSection: {
    marginBottom: 24,
  },
  priceContainer: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "600",
    marginBottom: 4,
  },
  price: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.primary,
  },
  freePriceContainer: {
    backgroundColor: colors.successLight,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  freePrice: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.success,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 24,
  },
  descriptionSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    fontWeight: "500",
  },
  actionsContainer: {
    gap: 16,
  },
  primaryButton: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  secondaryButton: {
    backgroundColor: colors.card,
  },
});