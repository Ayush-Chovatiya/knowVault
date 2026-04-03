import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Inventory as InventoryIcon,
  ArrowBack,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import api from "../services/api";

export function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await api.post("/auth/forgot-password", { email });
      setSuccess(response.data.message);
      setStep(2);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      if (typeof message === "object" && message !== null) {
        setError(Object.values(message).flat().join(", "));
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post("/auth/verify-otp", { email, otp });
      setStep(3);
    } catch (err) {
      const message =
        err.response?.data?.message || "Invalid OTP. Please try again.";
      if (typeof message === "object" && message !== null) {
        setError(Object.values(message).flat().join(", "));
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/reset-password", {
        email,
        otp,
        password,
      });
      setSuccess(response.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      if (typeof message === "object" && message !== null) {
        setError(Object.values(message).flat().join(", "));
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (step === 1) return "Forgot password?";
    if (step === 2) return "Enter OTP";
    return "Reset password";
  };

  const getSubtitle = () => {
    if (step === 1) return "Enter your email and we'll send you an OTP";
    if (step === 2) return `We sent a 6-digit code to ${email}`;
    return "Enter your new password below";
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        px: 2,
        py: 4,
      }}
    >
      <Card sx={{ maxWidth: 440, width: "100%" }}>
        <CardContent sx={{ p: 4 }}>
          {/* Logo */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2,
                bgcolor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
              }}
            >
              <InventoryIcon sx={{ color: "white", fontSize: 32 }} />
            </Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              {getTitle()}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {getSubtitle()}
            </Typography>
          </Box>

          {/* Success Alert */}
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Step 1: Email Form */}
          {step === 1 && (
            <Box component="form" onSubmit={handleSendOTP}>
              <TextField
                label="Email address"
                type="email"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                autoFocus
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send OTP"}
              </Button>
            </Box>
          )}

          {/* Step 2: OTP Form */}
          {step === 2 && (
            <Box component="form" onSubmit={handleVerifyOTP}>
              <TextField
                label="Enter 6-digit OTP"
                type="text"
                fullWidth
                required
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                autoFocus
                inputProps={{
                  maxLength: 6,
                  style: { letterSpacing: "0.5em", textAlign: "center" },
                }}
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading || otp.length !== 6}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>

              <Button
                variant="text"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => {
                  setStep(1);
                  setOtp("");
                  setError("");
                  setSuccess("");
                }}
              >
                Change email
              </Button>
            </Box>
          )}

          {/* Step 3: New Password Form */}
          {step === 3 && (
            <Box component="form" onSubmit={handleResetPassword}>
              <TextField
                label="New password"
                type={showPassword ? "text" : "password"}
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                autoFocus
                sx={{ mb: 2.5 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Confirm new password"
                type={showConfirmPassword ? "text" : "password"}
                fullWidth
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                sx={{ mb: 3 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset password"}
              </Button>
            </Box>
          )}

          {/* Footer */}
          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Link
              component={RouterLink}
              to="/login"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
              }}
              fontWeight={500}
            >
              <ArrowBack fontSize="small" />
              Back to login
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
