import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, View, ImageBackground, Animated, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/components/Button";
import { colors, typography, spacing, borderRadius, shadows } from "@/constants/colors";

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const floatingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Main entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Floating animation for decorative elements
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const floatingTranslateY = floatingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  return (
    <ImageBackground
      source={{ uri: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" }}
      style={styles.background}
    >
      <LinearGradient
        colors={[
          "rgba(99, 102, 241, 0.8)",
          "rgba(139, 92, 246, 0.7)",
          "rgba(244, 114, 182, 0.6)"
        ]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.container}>
          <StatusBar style="light" />
          
          {/* Floating decorative elements */}
          <Animated.View style={[
            styles.floatingElement,
            styles.floatingElement1,
            { transform: [{ translateY: floatingTranslateY }] }
          ]}>
            <Ionicons name="musical-notes" size={24} color="rgba(255, 255, 255, 0.3)" />
          </Animated.View>
          
          <Animated.View style={[
            styles.floatingElement,
            styles.floatingElement2,
            { transform: [{ translateY: floatingTranslateY }] }
          ]}>
            <Ionicons name="heart" size={20} color="rgba(255, 255, 255, 0.2)" />
          </Animated.View>
          
          <Animated.View style={[
            styles.floatingElement,
            styles.floatingElement3,
            { transform: [{ translateY: floatingTranslateY }] }
          ]}>
            <Ionicons name="star" size={18} color="rgba(255, 255, 255, 0.25)" />
          </Animated.View>

          <View style={styles.content}>
            <Animated.View style={[
              styles.logoContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: logoScale }
                ]
              }
            ]}>
              <View style={styles.logoWrapper}>
                <LinearGradient
                  colors={[colors.white, "rgba(255, 255, 255, 0.9)"]}
                  style={styles.logoBackground}
                >
                  <Text style={styles.logo}>S</Text>
                </LinearGradient>
              </View>
              <Text style={styles.brandName}>Socivents</Text>
              <View style={styles.taglineContainer}>
                <View style={styles.taglineDot} />
                <Text style={styles.tagline}>Connect</Text>
                <View style={styles.taglineDot} />
                <Text style={styles.tagline}>Discover</Text>
                <View style={styles.taglineDot} />
                <Text style={styles.tagline}>Experience</Text>
                <View style={styles.taglineDot} />
              </View>
            </Animated.View>
            
            <Animated.View style={[
              styles.textContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}>
              <Text style={styles.title}>Discover Events & Connect</Text>
              <Text style={styles.subtitle}>
                Find local events, meet new people, and create unforgettable memories in London
              </Text>
              
              <View style={styles.featuresContainer}>
                <View style={styles.featureItem}>
                  <View style={styles.featureIcon}>
                    <Ionicons name="calendar" size={16} color={colors.primary} />
                  </View>
                  <Text style={styles.featureText}>1000+ Events</Text>
                </View>
                <View style={styles.featureItem}>
                  <View style={styles.featureIcon}>
                    <Ionicons name="people" size={16} color={colors.primary} />
                  </View>
                  <Text style={styles.featureText}>Active Community</Text>
                </View>
                <View style={styles.featureItem}>
                  <View style={styles.featureIcon}>
                    <Ionicons name="chatbubbles" size={16} color={colors.primary} />
                  </View>
                  <Text style={styles.featureText}>Real-time Chat</Text>
                </View>
              </View>
            </Animated.View>
          </View>
          
          <Animated.View style={[
            styles.buttonContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}>
            <Button
              title="Get Started"
              onPress={() => router.push("/signup")}
              variant="gradient"
              size="large"
              fullWidth
              style={styles.primaryButton}
            />
            
            <Button
              title="I already have an account"
              onPress={() => router.push("/login")}
              variant="ghost"
              size="large"
              fullWidth
              style={styles.secondaryButton}
              textStyle={styles.secondaryButtonText}
            />
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    position: "relative",
  },
  floatingElement: {
    position: "absolute",
    zIndex: 1,
  },
  floatingElement1: {
    top: height * 0.15,
    right: width * 0.1,
  },
  floatingElement2: {
    top: height * 0.25,
    left: width * 0.15,
  },
  floatingElement3: {
    top: height * 0.35,
    right: width * 0.2,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xxxl,
    zIndex: 2,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: spacing.xxxxl,
  },
  logoWrapper: {
    marginBottom: spacing.lg,
  },
  logoBackground: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.large,
  },
  logo: {
    fontSize: 36,
    fontWeight: "800",
    color: colors.primary,
  },
  brandName: {
    ...typography.displayLarge,
    color: colors.white,
    marginBottom: spacing.md,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  taglineContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  taglineDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.white,
    opacity: 0.6,
  },
  tagline: {
    ...typography.bodyMedium,
    color: colors.white,
    opacity: 0.9,
    fontWeight: "500",
  },
  textContainer: {
    alignItems: "center",
    gap: spacing.xl,
  },
  title: {
    ...typography.displayMedium,
    color: colors.white,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    ...typography.bodyLarge,
    color: colors.white,
    textAlign: "center",
    opacity: 0.9,
    lineHeight: 28,
  },
  featuresContainer: {
    flexDirection: "row",
    gap: spacing.lg,
    marginTop: spacing.lg,
  },
  featureItem: {
    alignItems: "center",
    gap: spacing.xs,
    flex: 1,
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(10px)",
  },
  featureText: {
    ...typography.caption,
    color: colors.white,
    opacity: 0.9,
    textAlign: "center",
    fontWeight: "600",
  },
  buttonContainer: {
    paddingHorizontal: spacing.xxxl,
    paddingBottom: spacing.xxxxl,
    gap: spacing.lg,
    zIndex: 2,
  },
  primaryButton: {
    ...shadows.xlarge,
  },
  secondaryButton: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    backdropFilter: "blur(10px)",
  },
  secondaryButtonText: {
    color: colors.white,
    fontWeight: "600",
  },
});