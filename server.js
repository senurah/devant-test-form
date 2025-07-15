// Load environment variables for local development
require("dotenv").config({ path: ".env.local" });

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN || "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Rate limiting storage
const rateLimitStore = new Map();

function rateLimit(ip, windowMs = 60000, maxRequests = 5) {
  const now = Date.now();
  const windowStart = now - windowMs;

  const requests = rateLimitStore.get(ip) || [];
  const recentRequests = requests.filter((time) => time > windowStart);

  if (recentRequests.length >= maxRequests) {
    return {
      allowed: false,
      resetTime: Math.ceil((recentRequests[0] + windowMs - now) / 1000),
    };
  }

  recentRequests.push(now);
  rateLimitStore.set(ip, recentRequests);

  return {
    allowed: true,
    remaining: maxRequests - recentRequests.length,
  };
}

// Debug endpoint to check configuration
app.get("/debug/config", (req, res) => {
  const config = {
    hasDevantUrl: !!process.env.DEVANT_API_URL,
    hasDevantToken: !!process.env.DEVANT_API_TOKEN,
    allowedOrigin: process.env.ALLOWED_ORIGIN,
    port: process.env.PORT,
    devantUrlMasked: process.env.DEVANT_API_URL
      ? process.env.DEVANT_API_URL.substring(0, 50) + "..."
      : "NOT SET",
  };
  res.json(config);
});

// API endpoint for form submission
app.post("/api/submit-form", async (req, res) => {
  try {
    // Get client IP
    const clientIP =
      req.headers["x-forwarded-for"] ||
      req.headers["x-real-ip"] ||
      req.connection.remoteAddress ||
      "unknown";

    // Rate limiting
    const rateLimitResult = rateLimit(clientIP, 60000, 5);
    if (!rateLimitResult.allowed) {
      return res.status(429).json({
        success: false,
        message: `Too many requests. Please try again in ${rateLimitResult.resetTime} seconds.`,
        retryAfter: rateLimitResult.resetTime,
      });
    }

    const { fullName, email } = req.body;

    // Input validation
    if (!email || typeof email !== "string") {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    if (
      !fullName ||
      typeof fullName !== "string" ||
      fullName.trim().length < 2
    ) {
      return res.status(400).json({
        success: false,
        message: "Full name is required (minimum 2 characters).",
      });
    }

    // Sanitize inputs
    const sanitizedData = {
      fullName: fullName.trim().substring(0, 100),
      email: email.trim().toLowerCase().substring(0, 100),
    };

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedData.email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    // Validate name format
    const nameRegex = /^[a-zA-Z\s\-'\.]+$/;
    if (!nameRegex.test(sanitizedData.fullName)) {
      return res.status(400).json({
        success: false,
        message: "Full name contains invalid characters.",
      });
    }

    // Get environment variables
    const devantApiUrl = process.env.DEVANT_API_URL;
    const devantApiToken = process.env.DEVANT_API_TOKEN;

    if (!devantApiUrl || !devantApiToken) {
      console.error("Missing Devant API configuration");
      return res.status(500).json({
        success: false,
        message: "Server configuration error. Please contact administrator.",
      });
    }

    // Log request (anonymized)
    console.log("Form submission received:", {
      email: sanitizedData.email.replace(/(.{2}).*@/, "$1***@"),
      timestamp: new Date().toISOString(),
      ip: clientIP,
    });

    // Prepare payload for Devant/Choreo API
    const apiPayload = {
      formData: sanitizedData,
      submissionTime: new Date().toISOString(),
      source: "web-form",
    };

    // Make request to your Choreo integration
    const response = await fetch(devantApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${devantApiToken}`,
        "User-Agent": "FormProxy/1.0",
      },
      body: JSON.stringify(apiPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API error:", {
        status: response.status,
        error: errorText.substring(0, 200),
      });

      return res.status(500).json({
        success: false,
        message: "Failed to process your request. Please try again later.",
      });
    }

    const result = await response.json();

    console.log("Successfully triggered integration:", {
      email: sanitizedData.email.replace(/(.{2}).*@/, "$1***@"),
      timestamp: new Date().toISOString(),
    });

    return res.status(200).json({
      success: true,
      message:
        "Form submitted successfully! Your automation has been triggered.",
      submissionId: result.id || `sub_${Date.now()}`,
    });
  } catch (error) {
    console.error("Form submission error:", {
      message: error.message,
      timestamp: new Date().toISOString(),
    });

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
});

// Serve the HTML form at root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Form available at: http://localhost:${PORT}`);
});
