import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server'; // Use Next.js Response object for handling responses

// Define the GET method as a named export
export async function GET() {
  const audioDirectory = path.join(process.cwd(), 'public', 'audio');
  try {
    const files = await fs.readdir(audioDirectory);
    const audioFiles = files.filter(file => file.endsWith('.mp3') || file.endsWith('.wav'));
    
    return NextResponse.json(audioFiles); // Use NextResponse to return JSON data
  } catch (error) {
    console.error('Error loading audio files:', error);
    return NextResponse.json({ error: 'Failed to load audio files' }, { status: 500 });
  }
}
