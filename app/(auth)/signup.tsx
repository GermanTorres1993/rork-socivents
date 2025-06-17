import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { colors } from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";

export default function SignupScreen() {
  const router = useRouter();
  const { signUp, socialLogin, isLoading, error, isAuthenticated, clearError } = useAuthStore();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  // Navigate to main app when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated]);

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
  }, []);

  const validateForm = () => {
    if (!name.trim()) {
      setValidationError("Please enter your full name");
      return false;
    }
    if (!email.trim()) {
      setValidationError("Please enter your email address");
      return false;
    }
    if (!email.includes("@")) {
      setValidationError("Please enter a valid email address");
      return false;
    }
    if (!password) {
      setValidationError("Please enter a password");
      return false;
    }
    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    setValidationError("");
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await signUp(name.trim(), email.trim().toLowerCase(), password);
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  const handleSocialLogin = async (provider: "google" | "apple") => {
    try {
      await socialLogin(provider);
    } catch (error) {
      console.error(`${provider} login error:`, error);
    }
  };

  const handleTermsPress = () => {
    Alert.alert(
      "Terms & Privacy",
      "Terms of Service and Privacy Policy will be available soon. By continuing, you agree to our terms and privacy policy.",
      [{ text: "OK" }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Socivents and start discovering amazing events</Text>
        </View>
        
        <View style={styles.form}>
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChangeText={(text) => {
              setName(text);
              setValidationError("");
              clearError();
            }}
            leftIcon={<Ionicons name="person-outline" size={20} color={colors.textTertiary} />}
            autoCapitalize="words"
          />
          
          <Input
            label="Email Address"
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setValidationError("");
              clearError();
            }}
            leftIcon={<Ionicons name="mail-outline" size={20} color={colors.textTertiary} />}
          />
          
          <Input
            label="Password"
            placeholder="Create a password (min. 6 characters)"
            secureTextEntry
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setValidationError("");
              clearError();
            }}
            leftIcon={<Ionicons name="lock-closed-outline" size={20} color={colors.textTertiary} />}
          />
          
          {(validationError || error) && (
            <Text style={styles.errorText}>{validationError || error}</Text>
          )}
          
          <TouchableOpacity onPress={handleTermsPress}>
            <Text style={styles.termsText}>
              By signing up, you agree to our Terms of Service and Privacy Policy
            </Text>
          </TouchableOpacity>
          
          <Button
            title="Create Account"
            onPress={handleSignUp}
            variant="primary"
            size="large"
            fullWidth
            style={styles.button}
            loading={isLoading}
          />
          
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>
          
          <View style={styles.socialButtons}>
            <Button
              title="Google"
              onPress={() => handleSocialLogin("google")}
              variant="outline"
              size="medium"
              style={styles.socialButton}
              loading={isLoading}
            />
            <Button
              title="Apple"
              onPress={() => handleSocialLogin("apple")}
              variant="outline"
              size="medium"
              style={styles.socialButton}
              loading={isLoading}
            />
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.footerLink}>Sign in</Text>
          </TouchableOpacity>
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
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: "500",
    lineHeight: 24,
  },
  form: {
    marginBottom: 32,
  },
  errorText: {
    color: colors.error,
    marginBottom: 20,
    fontWeight: "500",
    textAlign: "center",
    fontSize: 14,
  },
  termsText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 32,
    textAlign: "center",
    lineHeight: 20,
    fontWeight: "500",
  },
  button: {
    marginBottom: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    color: colors.textTertiary,
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: "500",
  },
  socialButtons: {
    flexDirection: "row",
    gap: 12,
  },
  socialButton: {
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: "500",
  },
  footerLink: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 16,
  },
});