import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/colors";

export default function EULAScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: "End User License Agreement",
          headerBackTitle: "Back",
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTitleStyle: {
            fontWeight: "700",
            fontSize: 18,
            color: colors.text,
          },
        }} 
      />
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>End User License Agreement (EULA)</Text>
          <Text style={styles.subtitle}>Effective Date: January 15, 2025</Text>
          <Text style={styles.subtitle}>Last Updated: January 15, 2025</Text>
        </View>

        <Text style={styles.paragraph}>
          This End User License Agreement ("Agreement") is a legal agreement between you ("User", "You") and Socivents, ("Company", "We", "Us", or "Our"), regarding your use of the Socivents mobile application ("Application").
        </Text>

        <Text style={styles.paragraph}>
          By downloading, installing, accessing, or using the Application, you agree to be bound by the terms of this Agreement. If you do not agree to these terms, do not install or use the Application.
        </Text>

        <Text style={styles.sectionTitle}>1. License Grant</Text>
        <Text style={styles.paragraph}>
          We grant you a limited, non-exclusive, non-transferable, revocable license to use the Application for personal, non-commercial purposes strictly in accordance with this Agreement.
        </Text>

        <Text style={styles.sectionTitle}>2. Restrictions</Text>
        <Text style={styles.paragraph}>You agree not to:</Text>
        <View style={styles.bulletContainer}>
          <Text style={styles.bulletPoint}>• Modify, reverse-engineer, or decompile the Application.</Text>
          <Text style={styles.bulletPoint}>• Use the Application for any unlawful or prohibited purpose.</Text>
          <Text style={styles.bulletPoint}>• Sell, rent, or sublicense the Application to any third party.</Text>
          <Text style={styles.bulletPoint}>• Interfere with the Application's security or performance.</Text>
          <Text style={styles.bulletPoint}>• Impersonate others or provide false information.</Text>
        </View>

        <Text style={styles.sectionTitle}>3. Ownership</Text>
        <Text style={styles.paragraph}>
          The Application, including all content, code, and intellectual property, is owned by Socivents or its licensors and is protected by international copyright, trademark, and other laws.
        </Text>

        <Text style={styles.sectionTitle}>4. User Content and Events</Text>
        <Text style={styles.paragraph}>
          You are responsible for any content or events you create or share through the Application. You grant Socivents a non-exclusive, worldwide, royalty-free license to display, distribute, and promote your content within the platform.
        </Text>

        <Text style={styles.sectionTitle}>5. Payments and Tickets</Text>
        <Text style={styles.paragraph}>
          Some features may involve payments, such as ticket purchases. Payment processing may be managed by third-party providers (e.g., Stripe). By using these features, you agree to their terms of service and privacy policies.
        </Text>
        <Text style={styles.paragraph}>
          We do not process refunds unless explicitly required by law or under our refund policy.
        </Text>

        <Text style={styles.sectionTitle}>6. Third-Party Integrations</Text>
        <Text style={styles.paragraph}>
          The Application may integrate third-party APIs (e.g., Eventbrite, Supabase). We are not responsible for content, accuracy, or availability of external services.
        </Text>

        <Text style={styles.sectionTitle}>7. Privacy</Text>
        <Text style={styles.paragraph}>
          Our Privacy Policy governs the collection, use, and sharing of your personal data. By using the Application, you consent to such processing.
        </Text>

        <Text style={styles.sectionTitle}>8. Updates</Text>
        <Text style={styles.paragraph}>
          We may provide periodic updates to improve performance or add features. These updates may be applied automatically or require manual installation.
        </Text>

        <Text style={styles.sectionTitle}>9. Termination</Text>
        <Text style={styles.paragraph}>
          We may suspend or terminate your access if you violate this Agreement or if required by law. You may also uninstall the Application at any time.
        </Text>

        <Text style={styles.sectionTitle}>10. Disclaimer of Warranty</Text>
        <Text style={styles.paragraph}>
          The Application is provided "AS IS" and "AS AVAILABLE", without warranties of any kind, express or implied. We do not guarantee that the Application will be error-free, secure, or always available.
        </Text>

        <Text style={styles.sectionTitle}>11. Limitation of Liability</Text>
        <Text style={styles.paragraph}>
          To the maximum extent permitted by law, Socivents is not liable for any direct, indirect, incidental, or consequential damages resulting from your use or inability to use the Application.
        </Text>

        <Text style={styles.sectionTitle}>12. Governing Law</Text>
        <Text style={styles.paragraph}>
          This Agreement shall be governed by the laws of the Netherlands, without regard to conflict of law principles.
        </Text>

        <Text style={styles.sectionTitle}>13. Changes to This Agreement</Text>
        <Text style={styles.paragraph}>
          We reserve the right to modify this EULA at any time. Continued use of the Application after changes constitutes acceptance of the new terms.
        </Text>

        <Text style={styles.sectionTitle}>14. Contact Information</Text>
        <Text style={styles.paragraph}>
          If you have any questions or concerns, please contact us at:
        </Text>
        <Text style={styles.contactInfo}>📧 legal@socivents.com</Text>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Thank you for using Socivents. We appreciate your compliance with these terms.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    fontWeight: "500",
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginTop: 24,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 16,
    fontWeight: "500",
  },
  bulletContainer: {
    marginLeft: 16,
    marginBottom: 16,
  },
  bulletPoint: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 8,
    fontWeight: "500",
  },
  contactInfo: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  footer: {
    marginTop: 32,
    padding: 20,
    backgroundColor: colors.card,
    borderRadius: 16,
    alignItems: "center",
  },
  footerText: {
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 24,
  },
});