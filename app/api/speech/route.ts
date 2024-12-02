// import { NextResponse } from "next/server"; // Importing Next.js response handling
// import fs from "fs"; // File system module to handle file operations
// import path from "path"; // Module to work with file paths
// import OpenAI from "openai"; // Correct ESM import

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// // Define the path for saving the speech audio file
// const speechFile = path.resolve("./public/speech.mp3");

// export async function POST(req: Request) {
//   try {
//     const body = await req.json() as { input: string }; // Parse the JSON body and type input
//     const input = " Special Many leading apparel exporters have experienced a slowdown in recent months, but India has benefitted from Bangladesh's socio-political unrest,";

//     // Input validation
//     if (!input) {
//       return NextResponse.json({ error: "Input text is required" }, { status: 400 });
//     }

//     // Generate speech using OpenAI's TTS model
//     const response = await openai.audio.speech.create({
//       model: "tts-1", // Choose your model
//       voice: "alloy", // Choose a voice from the available options
//       input: input, // Input text to convert to speech
//     });

//     // Convert the response to a buffer and convert it to Uint8Array
//     const arrayBuffer = await response.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);  // Convert the ArrayBuffer to Buffer
//     const uint8Array = new Uint8Array(buffer); // Convert the Buffer to Uint8Array

//     // Write the Uint8Array to a file
//     await fs.promises.writeFile(speechFile, uint8Array);

//     // Respond with the URL to access the audio file
//     return NextResponse.json({ audioUrl: "/speech.mp3" });
//   } catch (error) {
//     console.error('[TTS_ERROR]', error); // Log any errors
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// }


import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { checkSubscription } from "@/lib/subscription";
import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";
import fs from "fs"; // File system module to handle file operations
import path from "path"; // Module to work with file paths
import OpenAI from "openai"; // Correct ESM import

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


// const instructionMessage = {
//   role: "system",
//   content: "You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations."
// };

export async function POST(
  req: Request
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages  } = body;
    let result = messages.content.slice(0, 25);
    const fileName = result;
    const speechFile = path.resolve(`./public/audio/${fileName}.mp3`);
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

      // Generate speech using OpenAI's TTS model
    const response = await openai.audio.speech.create({
      model: "tts-1", // Choose your model
      voice: "alloy", // Choose a voice from the available options
      input: messages.content, // Input text to convert to speech
    });

    //     // Convert the response to a buffer and convert it to Uint8Array
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);  // Convert the ArrayBuffer to Buffer
    const uint8Array = new Uint8Array(buffer); // Convert the Buffer to Uint8Array

    // Write the Uint8Array to a file
    await fs.promises.writeFile(speechFile, uint8Array);

    if (!isPro) {
      await incrementApiLimit(10 ,15);
    }
    return NextResponse.json({ audioUrl: speechFile });
    
  } catch (error) {
    console.log('[CODE_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
