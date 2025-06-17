import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useChatStore } from "@/store/chatStore";
import { useAuthStore } from "@/store/authStore";
import { useEventStore } from "@/store/eventStore";
import { ChatMessage as ChatMessageComponent } from "@/components/ChatMessage";
import { colors } from "@/constants/colors";
import { Event } from "@/types";

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuthStore();
  const {
    currentChatMessages,
    fetchChatMessages,
    sendMessage,
    isLoading,
    error,
  } = useChatStore();
  const { getEventById } = useEventStore();
  
  const [messageText, setMessageText] = useState("");
  const [event, setEvent] = useState<Event | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (id) {
      fetchChatMessages(id);
      // Load event details
      loadEvent();
    }
  }, [id]);

  const loadEvent = async () => {
    if (id) {
      const eventData = await getEventById(id);
      setEvent(eventData);
    }
  };

  useEffect(() => {
    // Scroll to bottom when messages change
    if (currentChatMessages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [currentChatMessages]);

  const handleSendMessage = () => {
    if (!user || !messageText.trim() || !id) return;
    
    sendMessage(
      id,
      user.id,
      user.name,
      user.photoUrl,
      messageText.trim()
    );
    setMessageText("");
  };

  if (!user) return null;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {event && (
        <View style={styles.eventInfo}>
          <Text style={styles.eventTitle}>{event.title}</Text>
        </View>
      )}
      
      {isLoading && currentChatMessages.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Loading messages...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : currentChatMessages.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No messages yet</Text>
          <Text style={styles.emptySubtext}>
            Be the first to start the conversation!
          </Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={currentChatMessages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatMessageComponent
              message={item}
              isCurrentUser={item.userId === user.id}
            />
          )}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
        />
      )}
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={messageText}
          onChangeText={setMessageText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            !messageText.trim() && styles.sendButtonDisabled,
          ]}
          onPress={handleSendMessage}
          disabled={!messageText.trim()}
        >
          <Ionicons
            name="send"
            size={20}
            color={!messageText.trim() ? colors.inactive : colors.white}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  eventInfo: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
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
  messagesList: {
    flexGrow: 1,
    paddingVertical: 16,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  input: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingRight: 48,
    fontSize: 16,
    maxHeight: 120,
  },
  sendButton: {
    position: "absolute",
    right: 24,
    bottom: 24,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    backgroundColor: colors.border,
  },
});