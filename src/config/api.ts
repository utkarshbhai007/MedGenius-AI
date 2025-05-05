// Base URLs for different APIs
export const API_CONFIG = {
  OPENAI_API_URL: "",
  OPENAI_API_KEY:  || "",
  MODEL: "gpt-3.5-turbo",
  MAX_TOKENS: 2048,
  TEMPERATURE: 0.3
};

// Log the API key status (remove this in production)
console.log("OpenAI API Key Status:", {
  isPresent: !!API_CONFIG.OPENAI_API_KEY,
  startsWithSk: API_CONFIG.OPENAI_API_KEY.startsWith("sk-"),
  length: API_CONFIG.OPENAI_API_KEY.length
});

