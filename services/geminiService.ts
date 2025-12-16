import { GoogleGenAI, Type, Schema } from "@google/genai";
import { VerificationResult } from "../types";

const processFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      let encoded = reader.result?.toString().replace(/^data:(.*,)?/, "");
      if (encoded && (encoded.length % 4) > 0) {
        encoded += "=".repeat(4 - (encoded.length % 4));
      }
      resolve(encoded || "");
    };
    reader.onerror = (error) => reject(error);
  });
};

export const verifyIdentity = async (
  name: string,
  idFile: File,
  selfieFile: File
): Promise<VerificationResult> => {
  // Initialization: Directly use process.env.API_KEY as per guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const idBase64 = await processFileToBase64(idFile);
  const selfieBase64 = await processFileToBase64(selfieFile);

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      isIdValid: {
        type: Type.BOOLEAN,
        description: "Whether the first image appears to be a valid government-issued ID card.",
      },
      isNameMatch: {
        type: Type.BOOLEAN,
        description: "Whether the name on the ID card matches the user provided name.",
      },
      extractedName: {
        type: Type.STRING,
        description: "The full name extracted from the ID card.",
      },
      isFaceMatch: {
        type: Type.BOOLEAN,
        description: "Whether the face in the ID card photo matches the face in the selfie photo.",
      },
      confidenceScore: {
        type: Type.NUMBER,
        description: "A confidence score from 0 to 100 regarding the match.",
      },
      reasoning: {
        type: Type.STRING,
        description: "A brief explanation of the findings, pointing out specific visual evidence.",
      },
      verdict: {
        type: Type.STRING,
        enum: ["APPROVED", "REJECTED", "MANUAL_REVIEW"],
        description: "The final recommendation.",
      },
    },
    required: ["isIdValid", "isNameMatch", "isFaceMatch", "confidenceScore", "reasoning", "verdict", "extractedName"],
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          { text: `You are an expert identity verification AI. Your task is to verify a user's identity.
            
            Input Data:
            1. The user claims their name is: "${name}"
            2. Image 1 is the user's uploaded ID document.
            3. Image 2 is a live verification selfie.

            Task:
            1. Analyze Image 1: Is it a valid-looking ID? Can you read the name? Does it match the claimed name "${name}" (allow for minor spelling/formatting differences)?
            2. Analyze Image 2: Is it a real human face?
            3. Compare Image 1 (ID Photo) vs Image 2 (Selfie): Do these look like the same person? Look at facial structure, nose shape, eyes, etc.
            
            Provide a strict JSON output.` 
          },
          {
            inlineData: {
              mimeType: idFile.type,
              data: idBase64,
            },
          },
          {
            inlineData: {
              mimeType: selfieFile.type,
              data: selfieBase64,
            },
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    return JSON.parse(text) as VerificationResult;

  } catch (error) {
    console.error("Gemini Verification Error:", error);
    // Fallback error result
    return {
      isIdValid: false,
      isNameMatch: false,
      isFaceMatch: false,
      confidenceScore: 0,
      extractedName: "Unknown",
      reasoning: "System error during verification process. Please try again.",
      verdict: "MANUAL_REVIEW",
    };
  }
};