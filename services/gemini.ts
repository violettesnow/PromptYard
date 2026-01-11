
// Use correct imports as per guidelines
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiExtraction } from "../types";

// Always use process.env.API_KEY directly as per guidelines
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Extracts prompt content from various sources with high-fidelity synthesis.
 * Uses Gemini 3 Pro for deep thinking when analyzing complex documents or emails.
 * Now incorporates a Senior Product Designer persona for high-end organization.
 */
export const extractPromptFromSource = async (
  input: string, 
  type: 'x' | 'gmail' | 'drive' | 'manual'
): Promise<GeminiExtraction> => {
  const ai = getAI();
  
  const sourceInstructions = {
    x: "Scout this X/Twitter source. Extract the specific AI prompt. Identify the creator and the target model (GPT-4, Claude, etc). Use Google Search to find related discussions.",
    gmail: "Act as an email analysis agent. Extract a shared AI prompt from this communication. Look past the conversational noise to find the structured instruction.",
    drive: "Analyze this document/file content. Extract the core AI prompt logic. If it's a technical doc, synthesize the 'System Instruction' or 'User Prompt' pattern.",
    manual: "Structure this manual entry into a high-quality AI prompt asset."
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview', // Using Pro for deep synthesis across platforms
    contents: `Input Content/URL: ${input}`,
    config: {
      // Use systemInstruction for better control
      systemInstruction: `Act as a Senior Product Designer. Prioritize a high-end, minimalist 'Obsidian' aesthetic in your analysis and categorization. ${sourceInstructions[type]}. Research related engineering techniques using Google Search. Return your findings in a structured JSON block containing "title", "content", "tags" (string array), and "analysis".`,
      tools: [{ googleSearch: {} }],
      thinkingConfig: { thinkingBudget: 4000 } // High budget for deep analysis
    }
  });

  const text = response.text || '';
  // Extract URLs from groundingChunks as per guidelines
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const groundingUrls = groundingChunks
    .map((chunk: any) => chunk.web?.uri || chunk.maps?.uri)
    .filter((uri: string | undefined): uri is string => !!uri);

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0]);
      return {
        ...data,
        grounding_urls: Array.from(new Set([...groundingUrls, input.startsWith('http') ? input : ''])),
        source_type: type
      };
    }
    throw new Error("JSON parse failure in extraction");
  } catch (e) {
    return { 
      title: "Rescued Intelligence", 
      content: text, 
      tags: ["Imported", "Raw"], 
      analysis: "Intelligence extracted via agentic scan.",
      source_type: type 
    };
  }
};

export const extractPromptFromImage = async (base64Data: string): Promise<GeminiExtraction> => {
  const ai = getAI();
  const base64Content = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Content, mimeType: 'image/jpeg' } },
        { text: "Examine this prompt screenshot. Act as a Senior Product Designer to extract and organize the text into a clean, professional structure. Provide title, tags, and a structural analysis." }
      ]
    },
    config: {
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 2000 },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
          analysis: { type: Type.STRING },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["title", "content", "tags", "analysis"]
      }
    }
  });

  try {
    // response.text is a property, not a function
    return { ...JSON.parse(response.text || '{}'), source_type: 'drive' };
  } catch {
    return { title: "Visual Rescue", content: "Failed to parse OCR", tags: ["Error"], source_type: 'drive' };
  }
};

export const extractPromptFromVideo = async (frames: string[]): Promise<GeminiExtraction> => {
  const ai = getAI();
  const imageParts = frames.map(base64 => ({
    inlineData: { data: base64.includes(',') ? base64.split(',')[1] : base64, mimeType: 'image/jpeg' }
  }));

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [ ...imageParts, { text: "Act as a Senior Product Designer. Synthesize the prompt being demonstrated in these video frames into a high-fidelity asset description." } ]
    },
    config: {
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 2500 },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
          analysis: { type: Type.STRING },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["title", "content", "tags", "analysis"]
      }
    }
  });
  return { ...JSON.parse(response.text || '{}'), source_type: 'drive' };
};

export const refineTags = async (content: string): Promise<string[]> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Suggest 4 SEO-optimized tags for this prompt. Use high-end technical terminology: ${content}`,
    config: { 
      responseMimeType: "application/json", 
      thinkingConfig: { thinkingBudget: 500 },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          tags: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["tags"]
      }
    }
  });
  try { return JSON.parse(response.text || '{"tags":[]}').tags; } catch { return []; }
};

export const generatePromptImage = async (promptContent: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [ { text: `Senior Product Designer aesthetic: A cinematic 3D abstract art representation of this idea: ${promptContent.substring(0, 100)}. Palette: obsidian black, 24k metallic gold, and subtle neon magenta/cyan depth. Glass textures, high-end minimalist finish. NO TEXT.` } ] },
    config: { imageConfig: { aspectRatio: "16:9" } }
  });
  // Iterate through parts to find the image part as per guidelines
  if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800';
};
