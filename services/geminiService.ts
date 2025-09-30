

import { GoogleGenAI } from "@google/genai";
import { SimulationInput } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. Fin-GPT assistant will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateBankNegotiationScript = async (inputs: SimulationInput): Promise<string> => {
  if (!API_KEY) {
    return "API Key not configured. Please set up your Gemini API key to use this feature.";
  }

  const { principal, interestRate, tenureYears } = inputs;

  const prompt = `
    You are an expert financial advisor in India named "Fin-GPT" from NestSaver.
    A user has a home loan with the following details:
    - Loan Amount: ₹${principal.toLocaleString('en-IN')}
    - Interest Rate: ${interestRate}%
    - Original Tenure: ${tenureYears} years

    The user wants to negotiate a lower interest rate with their bank.
    Generate a short, polite, and firm script that the user can use for a phone call or email to their bank's customer service or relationship manager.
    The script should:
    1.  Start by politely introducing themselves and stating the purpose of the call.
    2.  Mention they are a long-time customer (if applicable, which we can assume).
    3.  State their current loan details.
    4.  Mention that they are aware of current market rates and have received competitive offers for a balance transfer (e.g., from competitors at around ${Math.max(6.5, interestRate - 0.5).toFixed(2)}%).
    5.  Clearly ask the bank to review and reduce their current interest rate to retain them as a customer.
    6.  End with a polite closing, requesting a prompt response.

    Keep the tone professional and confident. Structure the output as a simple script. Do not add any introductory or concluding text outside of the script itself.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "There was an error generating the script. Please try again later.";
  }
};