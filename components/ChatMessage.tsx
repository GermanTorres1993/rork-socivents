import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { ChatMessage as ChatMessageType } from "@/types";
import { colors } from "@/constants/colors";
import { formatTime } from "@/utils/dateUtils";

type ChatMessageProps = {
  message: ChatMessageType;
  isCurrentUser: boolean;
};

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isCurrentUser,
}) => {
  return (
    <View
      style={[
        styles.container,
        isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer,
      ]}
    >
      {!isCurrentUser && (
        <Image
          source={{ uri: message.userPhotoUrl || "https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" }}
          style={styles.avatar}
        />
      )}
      <View
        style={[
          styles.messageContent,
          isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
        ]}
      >
        {!isCurrentUser && (
          <Text style={styles.userName}>{message.userName}</Text>
        )}
        <Text style={[styles.messageText, isCurrentUser && styles.currentUserText]}>
          {message.text}
        </Text>
        <Text
          style={[
            styles.timestamp,
            isCurrentUser ? styles.currentUserTimestamp : styles.otherUserTimestamp,
          ]}
        >
          {formatTime(message.timestamp)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  currentUserContainer: {
    justifyContent: "flex-end",
  },
  otherUserContainer: {
    justifyContent: "flex-start",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  messageContent: {
    maxWidth: "75%",
    borderRadius: 16,
    padding: 12,
  },
  currentUserMessage: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  otherUserMessage: {
    backgroundColor: colors.card,
    borderBottomLeftRadius: 4,
  },
  userName: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    color: colors.text,
  },
  currentUserText: {
    color: colors.white,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  currentUserTimestamp: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  otherUserTimestamp: {
    color: colors.textSecondary,
  },
});