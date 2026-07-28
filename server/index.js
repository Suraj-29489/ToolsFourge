import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { extractVideoMetadata, streamVideoDownload, checkYtDlpAvailable } from './utils/ytDlpHelper.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Force JSON content-type header on all /api routes
app.use('/api', (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

/**
 * GET /api/health
 * Health check & yt-dlp status verification
 */
app.get('/api/health', async (req, res) => {
  try {
    const version = await checkYtDlpAvailable();
    return res.json({
      success: true,
      data: {
        status: 'ok',
        ytDlpVersion: version,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err) {
    return res.status(503).json({
      success: false,
      error: 'yt-dlp is not installed on the server.',
    });
  }
});

/**
 * POST /api/video/analyze
 * Extracts metadata for YouTube, Shorts, Live, and supported platforms
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
    console.error('[API /api/video/analyze error]:', error.message);
    const status = error.message.includes('not installed') ? 503 : 400;
    return res.status(status).json({
      success: false,
      error: error.message || 'Failed to extract video details.',
    });
  }
});

/**
 * GET /api/video/download
 * Initiates direct browser attachment download stream
 */
app.get('/api/video/download', (req, res) => {
  try {
    const { url, formatId, title } = req.query;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'Missing video URL parameter.',
      });
    }

    streamVideoDownload(url, formatId, res, title || 'video');
  } catch (error) {
    console.error('[API /api/video/download error]:', error.message);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: 'Error initiating video download stream.',
      });
    }
  }
});

/**
 * POST /api/video/download
 * Alternative POST endpoint for downloads
 */
app.post('/api/video/download', (req, res) => {
  try {
    const { url, formatId, title } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'Missing video URL parameter.',
      });
    }

    streamVideoDownload(url, formatId, res, title || 'video');
  } catch (error) {
    console.error('[API /api/video/download POST error]:', error.message);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: 'Error initiating video download stream.',
      });
    }
  }
});

// JSON 404 Handler - Guarantees JSON output instead of HTML 404 pages
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint '${req.originalUrl}' was not found on this server.`,
  });
});

// Global Express Error Handler - Guarantees JSON output on unexpected errors
app.use((err, req, res, next) => {
  console.error('[Express Global Error Handler]:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error.',
  });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 Express server running on http://localhost:${PORT}`);
});
