import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { checkSubscription } from "@/lib/subscription";
import { incrementApiLimit, checkApiLimit, ImageCreate } from "@/lib/api-limit";
import { wordCount } from "@/lib/wordCount";
import OpenAI from "openai";
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch'; // Use this or global `fetch` in Node.js 18+

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt, amount = 1, resolution = "1024x1024" } = body;
    const parsedAmount = parseInt(amount as unknown as string, 10);
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!openai.apiKey) {
      return new NextResponse("OpenAI API Key not configured.", { status: 500 });
    }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired. Please upgrade to pro.", { status: 403 });
    }

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: parsedAmount,
      size: resolution,
    });

    const imageUrl = response.data[0]?.url;

    if (!imageUrl) {
      return new NextResponse("Failed to generate image.", { status: 500 });
    }

    // Fetch the image data
    const imageResponse = await fetch(imageUrl);
    const buffer = await imageResponse.arrayBuffer();

    // Define the file path and name
    const fileName = `${prompt}-${Date.now()}.png`;
    const filePath = path.join(process.cwd(), 'public', 'images', fileName);

    // Convert ArrayBuffer to Uint8Array and save to the public/images folder
    const uint8Array = new Uint8Array(buffer);
    fs.writeFileSync(filePath, uint8Array);
    const fileUrl = `/images/${fileName}`
    console.log(`Image saved to ${filePath}`);

    if (!isPro) {
      const messageCount = wordCount(prompt);
      await ImageCreate(prompt, fileName);
      await incrementApiLimit(messageCount, 100);
    }
    const downLoadLink = response.data
    return NextResponse.json(response.data);
    // return NextResponse.json({
    //   imageUrl: `/images/${fileName}`,
    //   LinkDownload: downLoadLink,
    // });
  } catch (error) {
    console.error('[IMAGE_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

