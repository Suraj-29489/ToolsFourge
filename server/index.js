import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { extractVideoMetadata, streamVideoDownload } from './utils/ytDlpHelper.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * POST /api/video/analyze
 * Extracts metadata for a given video URL using yt-dlp
 */
app.post('/api/video/analyze', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || typeof url !== 'string' || !url.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid video URL.',
      });
    }

    const metadata = await extractVideoMetadata(url.trim());
    return res.json({
      success: true,
      data: metadata,
    });
  } catch (error) {
    console.error('API /api/video/analyze error:', error.message);
    return res.status(400).json({
      success: false,
      error: error.message || 'Failed to extract video information.',
    });
  }
});

/**
 * GET /api/video/download
 * Downloads/streams the video or audio file directly to browser
 */
app.get('/api/video/download', (req, res) => {
  try {
    const { url, formatId, title } = req.query;

    if (!url) {
      return res.status(400).send('Missing video URL.');
    }

    streamVideoDownload(url, formatId, res, title || 'video');
  } catch (error) {
    console.error('API /api/video/download error:', error.message);
    if (!res.headersSent) {
      res.status(500).send('Error initiating download.');
    }
  }
});

/**
 * POST /api/video/download
 * Alternative POST endpoint for download streaming
 */
app.post('/api/video/download', (req, res) => {
  try {
    const { url, formatId, title } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, error: 'Missing video URL.' });
    }

    streamVideoDownload(url, formatId, res, title || 'video');
  } catch (error) {
    console.error('API /api/video/download POST error:', error.message);
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: 'Error initiating download.' });
    }
  }
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
