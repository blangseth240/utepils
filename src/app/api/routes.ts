// `app/api/plants/route.ts` (for Next.js App Router)
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

// Ensure API key is set before making requests
if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing OpenAI API key");
}

// Upload plant media to Vercel Blob
export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({
                success: false,
                error: "No file provided",
            });
        }

        // Generate a unique filename
        const filename = `${Date.now()}-${file.name}`;
        const pathname = `plants/${filename}`;

        // Upload to Vercel Blob
        const blob = await put(pathname, file, {
            access: "public", // Change if needed for security
            contentType: file.type,
        });

        return NextResponse.json({ success: true, url: blob.url });
    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to upload file",
        });
    }
}

// Identify plant and get health assessment
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const imageUrl = searchParams.get("imageUrl");

        if (!imageUrl) {
            return NextResponse.json({
                success: false,
                error: "Missing image URL",
            });
        }

        const prompt = `
        You are a plant identification and health assessment expert. 
        Analyze the plant in this image: ${imageUrl}
        
        Provide the following information in JSON format:
        {
          "name": "Common Name",
          "scientificName": "Scientific Name",
          "description": "Description text",
          "careInstructions": {
            "water": "Water instructions",
            "light": "Light requirements",
            "soil": "Soil preferences",
            "temperature": "Temperature range"
          },
          "healthAssessment": {
            "status": "healthy|moderate|unhealthy",
            "issues": ["Issue 1", "Issue 2"],
            "recommendations": ["Recommendation 1", "Recommendation 2"]
          }
        }
        `;

        const { text } = await generateText({
            model: openai("gpt-4o"),
            prompt: prompt,
            temperature: 0.7,
            maxTokens: 1000,
        });

        // Safely parse JSON response
        let plantData;
        try {
            plantData = JSON.parse(text);
        } catch (parseError) {
            console.error("Error parsing AI response:", parseError);
            return NextResponse.json({
                success: false,
                error: "Invalid response format from AI model",
            });
        }

        return NextResponse.json({ success: true, data: plantData });
    } catch (error) {
        console.error("Error identifying plant:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to identify plant. Please try again later.",
        });
    }
}
