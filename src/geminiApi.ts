import { GoogleGenerativeAI } from "@google/generative-ai"

// Your API key should be stored in an environment variable
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

const genAI = new GoogleGenerativeAI(API_KEY)

export async function generateTextWithGemini(prompt: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })
    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error("Error generating text with Gemini:", error)
    return "I'm sorry, but I encountered an error while processing your request. Please refresh and try again later."
  }
}

