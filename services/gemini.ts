
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiExtraction } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

/**
 * Extracts prompt content from various sources with high-fidelity synthesis.
 * Uses Gemini 3 Pro for deep thinking when analyzing complex documents or emails.
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
    contents: `${sourceInstructions[type]}. \n\nInput Content/URL: ${input}.
    
    Research related engineering techniques using Google Search.
    Return in this EXACT JSON format:
    {
      "title": "A precise, professional name for this asset",
      "content": "The actual prompt text with variables highlighted if applicable",
      "tags": ["model-name", "industry", "complexity", "technique"],
      "analysis": "A deep analysis of the prompt's logical structure and why it works."
    }`,
    config: {
      tools: [{ googleSearch: {} }],
      thinkingConfig: { thinkingBudget: 4000 } // High budget for deep analysis
    }
  });

  const text = response.text || '';
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
        { text: "Examine this prompt screenshot. Extract the text carefully. Provide title, tags, and a structural analysis." }
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
      parts: [ ...imageParts, { text: "Synthesize the prompt being demonstrated in these video frames." } ]
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
    contents: `Suggest 4 SEO-optimized tags for this prompt: ${content}`,
    config: { responseMimeType: "application/json", thinkingConfig: { thinkingBudget: 500 } }
  });
  try { return JSON.parse(response.text || '{"tags":[]}').tags; } catch { return []; }
};

export const generatePromptImage = async (promptContent: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [ { text: `Cinematic 3D abstract art representation of this idea: ${promptContent.substring(0, 100)}. Deep violets, glass textures, obsidian background. NO TEXT.` } ] },
    config: { imageConfig: { aspectRatio: "16:9" } }
  });
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
  }
  return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800';
};
