import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Ticket, Event } from "@/types";
import { colors } from "@/constants/colors";
import { formatDate } from "@/utils/dateUtils";
import { useEventStore } from "@/store/eventStore";

type TicketCardProps = {
  ticket: Ticket;
};

export const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  const router = useRouter();
  const { getEventById } = useEventStore();
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    const loadEvent = async () => {
      const eventData = await getEventById(ticket.eventId);
      setEvent(eventData);
    };
    
    loadEvent();
  }, [ticket.eventId]);

  if (!event) return null;

  const handlePress = () => {
    router.push(`/ticket/${ticket.id}`);
  };

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <Image
        source={{ uri: event.imageUrl }}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>
        <Text style={styles.date}>
          {formatDate(event.date)} • {event.time}
        </Text>
        <View style={styles.footer}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{ticket.status}</Text>
          </View>
          <Text style={styles.price}>£{ticket.price.toFixed(2)}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    flexDirection: "row",
    height: 120,
  },
  image: {
    width: 100,
    height: "100%",
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
});