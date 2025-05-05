import { API_CONFIG } from "../config/api";
import { toast } from "@/hooks/use-toast";

interface OpenAIRequestOptions {
  prompt: string;
  systemMessage?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * Make a request to the OpenAI API
 */
export const fetchOpenAI = async ({
  prompt,
  systemMessage = "You are a helpful medical AI assistant providing accurate and useful information.",
  model = API_CONFIG.MODEL,
  temperature = API_CONFIG.TEMPERATURE,
  maxTokens = API_CONFIG.MAX_TOKENS
}: OpenAIRequestOptions) => {
  try {
    console.log("API Key:", API_CONFIG.OPENAI_API_KEY ? "Present" : "Missing");
    console.log("Making request to OpenAI API...");

    const response = await fetch(API_CONFIG.OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_CONFIG.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: systemMessage
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature,
        max_tokens: maxTokens
      })
    });

    console.log("Response status:", response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("API error details:", errorData || response.statusText);
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("API response received successfully");
    return data;
  } catch (error) {
    console.error("Detailed error in fetchOpenAI:", error);
    toast({
      variant: "destructive",
      title: "API Error",
      description: error instanceof Error ? error.message : "Failed to connect to AI service"
    });
    throw error;
  }
}

/**
 * Helper function to parse JSON from AI responses
 */
export const parseAIResponse = (content: string) => {
  try {
    // Try to extract JSON from the response which might be markdown formatted
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                     content.match(/```\n([\s\S]*?)\n```/) ||
                     content.match(/{[\s\S]*}/);
    
    const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;
    return JSON.parse(jsonStr.trim());
  } catch (jsonError) {
    console.error("Error parsing JSON from AI response:", jsonError);
    throw new Error("Could not parse response from AI service");
  }
}

/**
 * Process any string fields that might be JSON
 */
export const deepParseJsonStrings = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj === 'string') {
    try {
      // Try to parse it as JSON
      return JSON.parse(obj);
    } catch (e) {
      // If it's not valid JSON, return the original string
      return obj;
    }
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepParseJsonStrings(item));
  }
  
  if (typeof obj === 'object') {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = deepParseJsonStrings(value);
    }
    return result;
  }
  
  // For numbers, booleans, etc., return as is
  return obj;
};
