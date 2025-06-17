import React from "react";
import { StyleSheet, Text, View, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/components/Button";
import { colors } from "@/constants/colors";

export default function CreateScreen() {
  const router = useRouter();

  const handleCreateEvent = () => {
    router.push("/create-event");
  };

  const features = [
    {
      icon: <Ionicons name="add-circle" size={24} color={colors.primary} />,
      title: "Create Your Event",
      description: "Fill in the details about your event, including title, description, date, time, location, and ticket price."
    },
    {
      icon: <Ionicons name="people" size={24} color={colors.primary} />,
      title: "Reach Your Audience",
      description: "Once published, your event will be visible to all Socivents users. Share the link to promote it further."
    },
    {
      icon: <Ionicons name="chatbubbles" size={24} color={colors.primary} />,
      title: "Engage Attendees",
      description: "Chat with attendees, answer questions, and build excitement before the event."
    },
    {
      icon: <Ionicons name="card" size={24} color={colors.primary} />,
      title: "Get Paid",
      description: "For paid events, receive payments directly to your account (minus a small service fee)."
    }
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <LinearGradient
        colors={[colors.primary, colors.gradientEnd]}
        style={styles.heroSection}
      >
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>Create Amazing Events</Text>
          <Text style={styles.heroSubtitle}>
            Share your passion with the community and connect with like-minded people
          </Text>
          <Button
            title="Create Your First Event"
            onPress={handleCreateEvent}
            variant="secondary"
            size="large"
            fullWidth
            style={styles.heroButton}
          />
        </View>
      </LinearGradient>

      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>How It Works</Text>
        
        {features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <View style={styles.featureIcon}>
              {feature.icon}
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Join Our Community</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>1,000+</Text>
            <Text style={styles.statLabel}>Events Created</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>10,000+</Text>
            <Text style={styles.statLabel}>Happy Attendees</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>500+</Text>
            <Text style={styles.statLabel}>Event Hosts</Text>
          </View>
        </View>
      </View>

      <View style={styles.ctaSection}>
        <View style={styles.ctaCard}>
          <Ionicons name="star" size={32} color={colors.warning} style={styles.ctaIcon} />
          <Text style={styles.ctaTitle}>Ready to Get Started?</Text>
          <Text style={styles.ctaDescription}>
            Create your first event and start building your community today
          </Text>
          <Button
            title="Create Event Now"
            onPress={handleCreateEvent}
            variant="primary"
            size="large"
            fullWidth
            style={styles.ctaButton}
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
  heroSection: {
    margin: 20,
    borderRadius: 24,
    overflow: "hidden",
  },
  heroContent: {
    padding: 32,
    alignItems: "center",
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.white,
    textAlign: "center",
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    color: colors.white,
    textAlign: "center",
    marginBottom: 32,
    opacity: 0.9,
    fontWeight: "500",
    lineHeight: 24,
  },
  heroButton: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  featuresSection: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 24,
    textAlign: "center",
  },
  featureItem: {
    flexDirection: "row",
    marginBottom: 24,
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    fontWeight: "500",
  },
  statsSection: {
    padding: 24,
    backgroundColor: colors.card,
    margin: 20,
    borderRadius: 20,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "600",
    textAlign: "center",
  },
  ctaSection: {
    padding: 24,
  },
  ctaCard: {
    backgroundColor: colors.surface,
    padding: 32,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  ctaIcon: {
    marginBottom: 16,
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 12,
    textAlign: "center",
  },
  ctaDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
    fontWeight: "500",
    lineHeight: 24,
  },
  ctaButton: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});