import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ChatRoom } from "@/types";
import { colors } from "@/constants/colors";
import { formatRelativeTime } from "@/utils/dateUtils";

type ChatRoomItemProps = {
  chatRoom: ChatRoom;
};

export const ChatRoomItem: React.FC<ChatRoomItemProps> = ({ chatRoom }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/chat/${chatRoom.eventId}`);
  };

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {chatRoom.eventTitle}
        </Text>
        {chatRoom.lastMessage ? (
          <>
            <Text style={styles.lastMessageUser} numberOfLines={1}>
              {chatRoom.lastMessage.userName}:
            </Text>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {chatRoom.lastMessage.text}
            </Text>
          </>
        ) : (
          <Text style={styles.noMessages}>No messages yet</Text>
        )}
      </View>
      <View style={styles.meta}>
        {chatRoom.lastMessage && (
          <Text style={styles.time}>
            {formatRelativeTime(chatRoom.lastMessage.timestamp)}
          </Text>
        )}
        <View style={styles.participantsCount}>
          <Text style={styles.participantsText}>
            {chatRoom.participants.length}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  content: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  lastMessageUser: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textSecondary,
    marginRight: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  noMessages: {
    fontSize: 14,
    fontStyle: "italic",
    color: colors.inactive,
  },
  meta: {
    alignItems: "flex-end",
  },
  time: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  participantsCount: {
    backgroundColor: colors.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  participantsText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.white,
  },
});