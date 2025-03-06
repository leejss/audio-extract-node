import express, { type Request, type Response } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

// Ensure assets directory exists
const assetsDir = path.resolve(process.cwd(), 'assets');
try {
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
    console.log('Created assets directory');
  }
} catch (error) {
  console.error('Error creating assets directory:', error);
}

// Define types for request body
interface VideoRequestBody {
  filePath: string;
  outputPath: string;
}

// Create Express app
const app = express();
app.use(express.json());

// Root endpoint
app.get('/', (_req: Request, res: Response) => {
  res.send('Video Processing Server is running. Use POST /video endpoint to extract audio.');
});

// Video processing endpoint
app.post('/video', async (req: Request<unknown, unknown, VideoRequestBody>, res: Response) => {
  try {
    // Extract the filepath and output path from the request
    const { filePath, outputPath } = req.body;
    
    // Validate the input
    if (!filePath || !outputPath) {
      return res.status(400).json({ 
        error: "Missing required parameters: filePath and outputPath" 
      });
    }
    
    // Resolve paths relative to assets directory
    const assetsDir = path.resolve(process.cwd(), 'assets');
    const fullInputPath = path.resolve(assetsDir, filePath);
    const fullOutputPath = path.resolve(assetsDir, outputPath);
    
    // Check if the input file exists
    if (!fs.existsSync(fullInputPath)) {
      return res.status(404).json({ 
        error: "Input video file not found" 
      });
    }
    
    // Create the output directory if it doesn't exist
    const outputDir = path.dirname(fullOutputPath);
    await mkdir(outputDir, { recursive: true });
    
    console.log(`Extracting audio from: ${fullInputPath} to ${fullOutputPath}`);
    
    // Extract audio using fluent-ffmpeg
    ffmpeg(fullInputPath)
      .noVideo()
      .audioCodec('pcm_s16le')
      .audioFrequency(44100)
      .audioChannels(2)
      .output(fullOutputPath)
      .on('end', () => {
        console.log('Audio extraction completed');
        res.status(200).json({ 
          success: true, 
          message: "Audio extracted successfully", 
          outputPath // Return the relative path as provided in the request
        });
      })
      .on('error', (err) => {
        console.error('Error during audio extraction:', err.message);
        res.status(500).json({ 
          error: "Failed to extract audio", 
          details: err.message 
        });
      })
      .run();
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ 
      error: "Server error", 
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});