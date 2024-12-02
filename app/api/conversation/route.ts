import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { checkSubscription } from "@/lib/subscription";
import { incrementApiLimit, checkApiLimit, testLimit } from "@/lib/api-limit";
import {wordCount} from "@/lib/wordCount"
import OpenAI from "openai"; // Correct ESM import

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(
  req: Request
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages  } = body;

    // let promt = messages.content
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!openai.apiKey) {
      return new NextResponse("OpenAI API Key not configured.", { status: 500 });
    }

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired. Please upgrade to pro.", { status: 403 });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages
    });
   
    if (!isPro) {
      
      let chatMassage =messages[messages.length - 1].content;
      let promtMain = response.choices[0].message
      let promt = JSON.stringify(promtMain.content)
     
      // const cleanText = (text: string): string => {
      //   return text
      //     .replace(/\\n/g, " ")        // Remove newline symbols
      //     .replace(/\d+\.\s\*\*/g, "") // Remove numbers followed by periods and ** formatting
      //     .trim();                      // Trim any leading or trailing spaces
      // };
      
   
      // let promt =cleanText(promtSlice)
      
      
      const messageCount = wordCount(promt)
      const promtCount = wordCount(chatMassage)
      await incrementApiLimit(messageCount, promtCount);
 
   
      await testLimit(chatMassage, promt)
    }

    return NextResponse.json(response.choices[0].message);
  } catch (error) {
    console.log('[CONVERSATION_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};