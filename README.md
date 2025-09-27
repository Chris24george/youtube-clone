# YouTube Clone - Video Processing Service

A cloud-native video processing microservice built following NeetCode's tutorial to learn modern full-stack deployment and cloud architecture patterns.

## Architecture

Scalable video processing pipeline using Node.js/Express, Google Cloud Storage, FFmpeg, Docker, and TypeScript.

## Features

- Converts uploaded videos to 360p resolution
- Integrates with Google Cloud Storage for raw and processed video storage
- Accepts base64-encoded Pub/Sub messages for event-driven processing
- Multi-stage Docker build for production deployment

## Setup

### Prerequisites
- Node.js 18+
- Google Cloud Storage buckets configured
- FFmpeg installed locally

### Development
```bash
cd video-processing-service
npm install
npm start
```

### Production
```bash
npm run build
npm run serve
```

### Docker
```bash
docker build -t video-processing-service .
docker run -p 3000:3000 video-processing-service
```

## API

**POST `/process-video`**

Processes a video by downloading from cloud storage, converting to 360p, and uploading the result.

Request body:
```json
{
  "message": {
    "data": "base64-encoded-json-payload"
  }
}
```

Payload format:
```json
{
  "name": "video-filename.mp4"
}
```

## Configuration

Requires Google Cloud Storage buckets:
- `cg-yt-raw-videos` - Raw video uploads
- `cg-yt-processed-videos` - Processed video output

## Learning Objectives

Demonstrates microservice architecture, cloud storage integration, video processing with FFmpeg, Docker containerization, event-driven architecture, and TypeScript in production.

Built following [NeetCode's YouTube Clone Tutorial](https://neetcode.io).
