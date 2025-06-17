import React, { useEffect } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { useChatStore } from "@/store/chatStore";
import { useAuthStore } from "@/store/authStore";
import { ChatRoomItem } from "@/components/ChatRoomItem";
import { colors } from "@/constants/colors";

export default function ChatsScreen() {
  const { user } = useAuthStore();
  const { chatRooms, fetchChatRooms, isLoading, error } = useChatStore();

  useEffect(() => {
    if (user) {
      fetchChatRooms(user.id);
    }
  }, [user]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Event Chats</Text>
      </View>
      
      {isLoading && chatRooms.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Loading chats...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : chatRooms.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No chats yet</Text>
          <Text style={styles.emptySubtext}>
            Join events to chat with other attendees
          </Text>
        </View>
      ) : (
        <FlatList
          data={chatRooms}
          keyExtractor={(item) => item.eventId}
          renderItem={({ item }) => <ChatRoomItem chatRoom={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
  },
  listContent: {
    flexGrow: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: "center",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
  },
});