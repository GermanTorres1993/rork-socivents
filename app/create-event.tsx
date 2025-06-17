import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { colors } from "@/constants/colors";
import { useEventStore } from "@/store/eventStore";
import { useAuthStore } from "@/store/authStore";
import { EventCategory } from "@/types";

export default function CreateEventScreen() {
  const router = useRouter();
  const { createEvent, isLoading } = useEventStore();
  const { user } = useAuthStore();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("London");
  const [category, setCategory] = useState<EventCategory>("other");
  const [isFree, setIsFree] = useState(false);
  const [price, setPrice] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title) newErrors.title = "Title is required";
    if (!description) newErrors.description = "Description is required";
    if (!date) newErrors.date = "Date is required";
    if (!time) newErrors.time = "Time is required";
    if (!address) newErrors.address = "Address is required";
    if (!isFree && (!price || isNaN(Number(price)) || Number(price) <= 0)) {
      newErrors.price = "Please enter a valid price";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateEvent = async () => {
    if (!validateForm() || !user) return;
    
    try {
      // Use a default image if none selected (in real app, you'd upload to storage)
      const imageUrl = imageUri || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
      
      const eventData = {
        title,
        description,
        imageUrl,
        date,
        time,
        location: {
          address,
          city,
        },
        price: isFree ? 0 : Number(price),
        category,
        hostId: user.id,
        hostName: user.name,
      };
      
      const eventId = await createEvent(eventData);
      
      Alert.alert(
        "Success!",
        "Your event has been created successfully.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to create event. Please try again.");
    }
  };

  const categories: Array<{ value: EventCategory; label: string; emoji: string }> = [
    { value: "music", label: "Music", emoji: "🎵" },
    { value: "tech", label: "Tech", emoji: "💻" },
    { value: "food", label: "Food", emoji: "🍕" },
    { value: "art", label: "Art", emoji: "🎨" },
    { value: "sports", label: "Sports", emoji: "⚽" },
    { value: "education", label: "Education", emoji: "📚" },
    { value: "networking", label: "Networking", emoji: "🤝" },
    { value: "free", label: "Free", emoji: "🆓" },
    { value: "other", label: "Other", emoji: "✨" },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Create New Event</Text>
      <Text style={styles.subtitle}>Share your event with the community</Text>
      
      <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} contentFit="cover" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="camera" size={48} color={colors.textTertiary} />
            <Text style={styles.imagePlaceholderText}>Add Event Photo</Text>
            <Text style={styles.imagePlaceholderSubtext}>Tap to select from gallery</Text>
          </View>
        )}
      </TouchableOpacity>
      {errors.image && <Text style={styles.errorText}>{errors.image}</Text>}
      
      <View style={styles.form}>
        <Input
          label="Event Title"
          placeholder="What's your event called?"
          value={title}
          onChangeText={setTitle}
          error={errors.title}
          leftIcon={<Ionicons name="pricetag-outline" size={20} color={colors.textTertiary} />}
        />
        
        <Input
          label="Description"
          placeholder="Tell people about your event..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          error={errors.description}
        />
        
        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Input
              label="Date"
              placeholder="YYYY-MM-DD"
              value={date}
              onChangeText={setDate}
              error={errors.date}
              leftIcon={<Ionicons name="calendar-outline" size={20} color={colors.textTertiary} />}
            />
          </View>
          
          <View style={styles.halfInput}>
            <Input
              label="Time"
              placeholder="HH:MM"
              value={time}
              onChangeText={setTime}
              error={errors.time}
              leftIcon={<Ionicons name="time-outline" size={20} color={colors.textTertiary} />}
            />
          </View>
        </View>
        
        <Input
          label="Address"
          placeholder="Where is your event?"
          value={address}
          onChangeText={setAddress}
          error={errors.address}
          leftIcon={<Ionicons name="location-outline" size={20} color={colors.textTertiary} />}
        />
        
        <Input
          label="City"
          placeholder="City"
          value={city}
          onChangeText={setCity}
          leftIcon={<Ionicons name="location-outline" size={20} color={colors.textTertiary} />}
        />
        
        <Text style={styles.sectionTitle}>Category</Text>
        <View style={styles.categoryContainer}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.value}
              style={[
                styles.categoryButton,
                category === cat.value && styles.selectedCategory,
              ]}
              onPress={() => setCategory(cat.value)}
            >
              <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
              <Text
                style={[
                  styles.categoryText,
                  category === cat.value && styles.selectedCategoryText,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.pricingSection}>
          <Text style={styles.sectionTitle}>Pricing</Text>
          <View style={styles.switchContainer}>
            <View style={styles.switchContent}>
              <Text style={styles.switchLabel}>Free Event</Text>
              <Text style={styles.switchSubtext}>No charge for attendees</Text>
            </View>
            <Switch
              value={isFree}
              onValueChange={setIsFree}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
          
          {!isFree && (
            <Input
              label="Ticket Price (£)"
              placeholder="0.00"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              error={errors.price}
              leftIcon={<Ionicons name="card-outline" size={20} color={colors.textTertiary} />}
            />
          )}
        </View>
        
        <Button
          title="Create Event"
          onPress={handleCreateEvent}
          variant="primary"
          size="large"
          fullWidth
          style={styles.createButton}
          loading={isLoading}
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
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 32,
    fontWeight: "500",
  },
  imageContainer: {
    width: "100%",
    height: 200,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 24,
    backgroundColor: colors.card,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 20,
    borderStyle: "dashed",
  },
  imagePlaceholderText: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  imagePlaceholderSubtext: {
    marginTop: 4,
    fontSize: 14,
    color: colors.textTertiary,
  },
  form: {
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    gap: 16,
  },
  halfInput: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginTop: 16,
    marginBottom: 16,
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.border,
    gap: 8,
  },
  selectedCategory: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryEmoji: {
    fontSize: 16,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  selectedCategoryText: {
    color: colors.white,
  },
  pricingSection: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 16,
    marginBottom: 32,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  switchContent: {
    flex: 1,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  switchSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  createButton: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: -16,
    marginBottom: 16,
    fontWeight: "500",
  },
});