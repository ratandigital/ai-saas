// pages/api/audios.ts
import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const audioDirectory = path.join(process.cwd(), 'public', 'audio');
  try {
    const files = await fs.readdir(audioDirectory);
    const audioFiles = files.filter(file => file.endsWith('.mp3') || file.endsWith('.wav')); // Adjust based on your file formats
    res.status(200).json(audioFiles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load audio files' });
  }
}
