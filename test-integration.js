// Test script to verify Choreo integration works
require("dotenv").config({ path: ".env.local" });

async function testIntegration() {
  const apiUrl = process.env.DEVANT_API_URL;
  const apiToken = process.env.DEVANT_API_TOKEN;

  console.log("🧪 Testing Choreo Integration...\n");
  console.log("API URL:", apiUrl);
  console.log(
    "Token (first 20 chars):",
    apiToken ? apiToken.substring(0, 20) + "..." : "NOT SET"
  );
  console.log("\n" + "=".repeat(50));

  if (!apiUrl || !apiToken) {
    console.error("❌ Missing required environment variables!");
    console.log("Please check your .env.local file");
    return;
  }

  // Test payload (same format as your form)
  const testPayload = {
    formData: {
      fullName: "Test User",
      email: "test@example.com",
    },
    submissionTime: new Date().toISOString(),
    source: "integration-test",
  };

  try {
    console.log("📤 Sending test request...");
    console.log("Payload:", JSON.stringify(testPayload, null, 2));

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`,
        "User-Agent": "IntegrationTest/1.0",
      },
      body: JSON.stringify(testPayload),
    });

    console.log("\n📥 Response received:");
    console.log("Status:", response.status, response.statusText);
    console.log("Headers:", Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log("Body:", responseText);

    if (response.ok) {
      console.log("\n✅ SUCCESS! Integration is working properly.");
      try {
        const jsonResponse = JSON.parse(responseText);
        console.log("Parsed Response:", jsonResponse);
      } catch (e) {
        console.log("Response is not JSON format (this might be expected)");
      }
    } else {
      console.log("\n❌ FAILED! Integration returned an error.");
      console.log("This might indicate a token or URL issue.");
    }
  } catch (error) {
    console.error("\n💥 REQUEST FAILED:");
    console.error("Error:", error.message);

    if (error.name === "TypeError" && error.message.includes("fetch")) {
      console.log(
        "\n💡 Tip: Make sure you have internet connection and the URL is correct."
      );
    }
  }
}

// Run the test
testIntegration().catch(console.error);
