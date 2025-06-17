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

export default function LoginScreen() {
  const router = useRouter();
  const { login, socialLogin, isLoading, error, isAuthenticated, clearError, bypassLogin } = useAuthStore();
  
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
    if (!email.trim()) {
      setValidationError("Please enter your email address");
      return false;
    }
    if (!email.includes("@")) {
      setValidationError("Please enter a valid email address");
      return false;
    }
    if (!password) {
      setValidationError("Please enter your password");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    setValidationError("");
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await login(email.trim().toLowerCase(), password);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleSocialLogin = async (provider: "google" | "apple") => {
    try {
      await socialLogin(provider);
    } catch (error) {
      console.error(`${provider} login error:`, error);
    }
  };

  const handleBypassLogin = () => {
    bypassLogin();
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Reset Password",
      "Password reset functionality will be available soon. For now, please use the bypass login option.",
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
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue discovering amazing events</Text>
        </View>
        
        <View style={styles.form}>
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
            placeholder="Enter your password"
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
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={20} color={colors.error} />
              <Text style={styles.errorText}>{validationError || error}</Text>
            </View>
          )}
          
          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={handleForgotPassword}
          >
            <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
          </TouchableOpacity>
          
          <Button
            title="Sign In"
            onPress={handleLogin}
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
          
          <View style={styles.bypassButtonContainer}>
            <Button
              title="Bypass Login (Demo)"
              onPress={handleBypassLogin}
              variant="ghost"
              size="medium"
              style={styles.bypassButton}
              textStyle={styles.bypassButtonText}
            />
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/signup")}>
            <Text style={styles.footerLink}>Sign up</Text>
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
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.errorLight,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
    gap: 8,
  },
  errorText: {
    color: colors.error,
    fontWeight: "500",
    fontSize: 14,
    flex: 1,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 32,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 14,
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
  bypassButtonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  bypassButton: {
    borderWidth: 1,
    borderColor: colors.primary,
  },
  bypassButtonText: {
    color: colors.primary,
    fontWeight: "500",
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