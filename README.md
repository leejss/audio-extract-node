# Audio Extract Node

A simple Node.js service that extracts audio from video files using FFmpeg.

## Features

- RESTful API for extracting audio from video files
- Converts video to high-quality WAV audio (PCM 16-bit, 44.1kHz, stereo)
- Built with Express.js and fluent-ffmpeg

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- FFmpeg (installed automatically via dependencies)

## Usage

### Starting the Server

```bash
# Development mode
npm run dev

# Or build and run in production
npm run build
npm start
```

The server runs on port 3000 by default (configurable via PORT environment variable).

### API Endpoints

#### `GET /`

Returns a simple status message confirming the server is running.

**Example:**

```bash
curl http://localhost:3000/
```

#### `POST /video`

Extracts audio from a video file.

**Request Body:**

```json
{
  "filePath": "/path/to/input/video.mp4",
  "outputPath": "/path/to/output/audio.wav"
}
```

- `filePath`: Absolute path to the input video file (required)
- `outputPath`: Absolute path where the extracted audio will be saved (required)

**Response:**

Success:

```json
{
  "success": true,
  "message": "Audio extracted successfully",
  "outputPath": "/path/to/output/audio.wav"
}
```

Error:

```json
{
  "error": "Error message",
  "details": "Detailed error information"
}
```

**Example:**

```bash
curl -X POST http://localhost:3000/video \
  -H "Content-Type: application/json" \
  -d '{
    "filePath": "/Users/username/videos/input.mp4",
    "outputPath": "/Users/username/audio/output.wav"
  }'
```

## Example Use Cases

1. **Extract audio from a local video file:**

   ```bash
   curl -X POST http://localhost:3000/video \
     -H "Content-Type: application/json" \
     -d '{
       "filePath": "/path/to/video.mp4",
       "outputPath": "/path/to/audio.wav"
     }'
   ```

2. **Extract audio with a specific name and location:**

   ```bash
   curl -X POST http://localhost:3000/video \
     -H "Content-Type: application/json" \
     -d '{
       "filePath": "/Users/username/Downloads/lecture.mp4",
       "outputPath": "/Users/username/Music/lecture_audio.wav"
     }'
   ```

## Development

This project is written in TypeScript and uses the following technologies:

- Express.js for the HTTP server
- fluent-ffmpeg for media processing
- TypeScript for type safety

To contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.
