import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/colors";
import { formatFullDate } from "@/utils/dateUtils";
import { Button } from "@/components/Button";
import { useTicketStore } from "@/store/ticketStore";
import { useEventStore } from "@/store/eventStore";
import { useAuthStore } from "@/store/authStore";
import { Ticket, Event } from "@/types";

export default function TicketScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuthStore();
  const { userTickets } = useTicketStore();
  const { getEventById } = useEventStore();
  
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTicketAndEvent = async () => {
      if (!id || !user) return;
      
      setIsLoading(true);
      
      // Find the ticket
      const foundTicket = userTickets.find(t => t.id === id);
      if (foundTicket) {
        setTicket(foundTicket);
        
        // Get the event details
        const eventData = await getEventById(foundTicket.eventId);
        setEvent(eventData);
      }
      
      setIsLoading(false);
    };
    
    loadTicketAndEvent();
  }, [id, user, userTickets]);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading ticket...</Text>
      </View>
    );
  }

  if (!ticket) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Ticket not found</Text>
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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.ticketCard}>
        <View style={styles.ticketHeader}>
          <Text style={styles.ticketTitle}>Event Ticket</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{ticket.status}</Text>
          </View>
        </View>
        
        <Image
          source={{ uri: event.imageUrl }}
          style={styles.eventImage}
          contentFit="cover"
        />
        
        <View style={styles.ticketDetails}>
          <Text style={styles.eventTitle}>{event.title}</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={18} color={colors.primary} style={styles.infoIcon} />
            <Text style={styles.infoText}>
              {formatFullDate(event.date, event.time)}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={18} color={colors.primary} style={styles.infoIcon} />
            <Text style={styles.infoText}>{event.location.address}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={18} color={colors.primary} style={styles.infoIcon} />
            <Text style={styles.infoText}>Hosted by {event.hostName}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.ticketInfo}>
            <View style={styles.ticketInfoRow}>
              <Text style={styles.ticketInfoLabel}>Ticket ID</Text>
              <Text style={styles.ticketInfoValue}>{ticket.id}</Text>
            </View>
            
            <View style={styles.ticketInfoRow}>
              <Text style={styles.ticketInfoLabel}>Purchase Date</Text>
              <Text style={styles.ticketInfoValue}>
                {new Date(ticket.purchaseDate).toLocaleDateString()}
              </Text>
            </View>
            
            <View style={styles.ticketInfoRow}>
              <Text style={styles.ticketInfoLabel}>Price</Text>
              <Text style={styles.ticketInfoValue}>
                {ticket.price > 0 ? `£${ticket.price.toFixed(2)}` : "FREE"}
              </Text>
            </View>
          </View>
          
          <View style={styles.qrContainer}>
            <Text style={styles.qrText}>Show this ticket at the event</Text>
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" }}
              style={styles.qrCode}
            />
          </View>
        </View>
      </View>
      
      <View style={styles.actionsContainer}>
        <Button
          title="Add to Calendar"
          onPress={() => {}}
          variant="outline"
          size="medium"
          style={styles.actionButton}
        />
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
    padding: 24,
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
  },
  ticketCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  ticketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  ticketTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  statusBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  eventImage: {
    width: "100%",
    height: 180,
  },
  ticketDetails: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  ticketInfo: {
    marginBottom: 24,
  },
  ticketInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  ticketInfoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  ticketInfoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  qrContainer: {
    alignItems: "center",
    marginTop: 8,
  },
  qrText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  qrCode: {
    width: 200,
    height: 200,
    backgroundColor: colors.card,
  },
  actionsContainer: {
    marginTop: 24,
  },
  actionButton: {
    width: "100%",
  },
});