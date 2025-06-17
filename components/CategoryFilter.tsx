import React, { useRef } from "react";
import { StyleSheet, Text, View, ScrollView, Pressable, Animated } from "react-native";
import { EventCategory } from "@/types";
import { colors, typography, spacing, borderRadius, shadows } from "@/constants/colors";

type CategoryFilterProps = {
  selectedCategory: EventCategory | "all";
  onSelectCategory: (category: EventCategory | "all") => void;
};

const categories: Array<{ id: EventCategory | "all"; label: string; emoji: string; color: string }> = [
  { id: "all", label: "All Events", emoji: "🎉", color: colors.primary },
  { id: "music", label: "Music", emoji: "🎵", color: colors.categoryMusic },
  { id: "tech", label: "Tech", emoji: "💻", color: colors.categoryTech },
  { id: "food", label: "Food", emoji: "🍕", color: colors.categoryFood },
  { id: "art", label: "Art", emoji: "🎨", color: colors.categoryArt },
  { id: "sports", label: "Sports", emoji: "⚽", color: colors.categorySports },
  { id: "education", label: "Education", emoji: "📚", color: colors.categoryEducation },
  { id: "networking", label: "Networking", emoji: "🤝", color: colors.categoryNetworking },
  { id: "free", label: "Free", emoji: "🆓", color: colors.categoryFree },
  { id: "other", label: "Other", emoji: "✨", color: colors.categoryOther },
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const animatedValues = useRef(
    categories.reduce((acc, category) => {
      acc[category.id] = new Animated.Value(selectedCategory === category.id ? 1 : 0);
      return acc;
    }, {} as Record<string, Animated.Value>)
  ).current;

  const handleCategoryPress = (categoryId: EventCategory | "all") => {
    // Animate out the previously selected category
    if (selectedCategory !== categoryId) {
      Animated.timing(animatedValues[selectedCategory], {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }

    // Animate in the newly selected category
    Animated.timing(animatedValues[categoryId], {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();

    onSelectCategory(categoryId);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={120}
        snapToAlignment="start"
      >
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;
          const animatedValue = animatedValues[category.id];

          const backgroundColor = animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [colors.surface, category.color],
          });

          const textColor = animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [colors.textSecondary, colors.white],
          });

          const scale = animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.05],
          });

          const shadowOpacity = animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0.1, 0.25],
          });

          return (
            <Pressable
              key={category.id}
              onPress={() => handleCategoryPress(category.id)}
              style={styles.categoryButtonContainer}
            >
              <Animated.View
                style={[
                  styles.categoryButton,
                  {
                    backgroundColor,
                    transform: [{ scale }],
                    shadowOpacity,
                  },
                ]}
              >
                <View style={styles.categoryContent}>
                  <Text style={styles.emoji}>{category.emoji}</Text>
                  <Animated.Text
                    style={[
                      styles.categoryText,
                      { color: textColor }
                    ]}
                  >
                    {category.label}
                  </Animated.Text>
                </View>
                
                {isSelected && (
                  <Animated.View
                    style={[
                      styles.selectedIndicator,
                      {
                        opacity: animatedValue,
                      }
                    ]}
                  />
                )}
              </Animated.View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.lg,
    marginBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  scrollContent: {
    paddingHorizontal: spacing.xxl,
    gap: spacing.md,
  },
  categoryButtonContainer: {
    position: "relative",
  },
  categoryButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    minWidth: 100,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.small,
  },
  categoryContent: {
    alignItems: "center",
    gap: spacing.xs,
  },
  emoji: {
    fontSize: 20,
  },
  categoryText: {
    ...typography.labelMedium,
    textAlign: "center",
  },
  selectedIndicator: {
    position: "absolute",
    bottom: -spacing.sm,
    left: "50%",
    marginLeft: -12,
    width: 24,
    height: 3,
    backgroundColor: colors.white,
    borderRadius: borderRadius.xs,
  },
});