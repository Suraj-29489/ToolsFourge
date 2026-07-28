import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { extractVideoMetadata, streamVideoDownload, checkYtDlpAvailable } from './utils/ytDlpHelper.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Task 6: Log every incoming request
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] Incoming Request: ${req.method} ${req.originalUrl}`);
  next();
});

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
    console.error('[Backend /api/health Exception]:', err);
    return res.status(503).json({
      success: false,
      error: {
        message: 'yt-dlp is not installed on the server.',
        code: 'YT_DLP_MISSING',
      },
    });
  }
});

/**
 * POST /api/video/analyze
 * Extracts metadata for YouTube, Shorts, Live, and supported platforms
 */
app.post('/api/video/analyze', async (req, res) => {
  console.log('[API /api/video/analyze Triggered] Payload body:', req.body);
  try {
    const { url } = req.body;

    if (!url || typeof url !== 'string' || !url.trim()) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Please provide a valid video URL.',
          code: 'MISSING_URL',
        },
      });
    }

    const metadata = await extractVideoMetadata(url.trim());
    return res.json({
      success: true,
      data: metadata,
    });
  } catch (error) {
    console.error('[Backend /api/video/analyze Exception]:', error);

    const message = error.message || 'Failed to analyze video URL.';
    const isYtDlpMissing = message.includes('not installed');
    const statusCode = isYtDlpMissing ? 503 : 400;
    const errorCode = isYtDlpMissing ? 'YT_DLP_MISSING' : 'ANALYSIS_FAILED';

    return res.status(statusCode).json({
      success: false,
      error: {
        message,
        code: errorCode,
      },
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
        error: {
          message: 'Missing video URL parameter.',
          code: 'MISSING_URL_PARAM',
        },
      });
    }

    streamVideoDownload(url, formatId, res, title || 'video');
  } catch (error) {
    console.error('[Backend /api/video/download GET Exception]:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: {
          message: 'Error initiating video download stream.',
          code: 'DOWNLOAD_FAILED',
        },
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
        error: {
          message: 'Missing video URL parameter.',
          code: 'MISSING_URL_PARAM',
        },
      });
    }

    streamVideoDownload(url, formatId, res, title || 'video');
  } catch (error) {
    console.error('[Backend /api/video/download POST Exception]:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: {
          message: 'Error initiating video download stream.',
          code: 'DOWNLOAD_FAILED',
        },
      });
    }
  }
});

// JSON 404 Handler - Guarantees JSON output for any missing route
app.use((req, res) => {
  console.warn(`[Backend 404 Not Found]: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    error: {
      message: `Endpoint '${req.originalUrl}' was not found on this server.`,
      code: 'NOT_FOUND',
    },
  });
});

// Global Express Error Handler - Guarantees JSON output on unexpected errors
app.use((err, req, res, next) => {
  console.error('[Express Global Error Handler Exception]:', err);
  res.status(err.status || 500).json({
    success: false,
    error: {
      message: err.message || 'Internal Server Error.',
      code: 'INTERNAL_ERROR',
    },
  });
});

// Start Express Server bound to 0.0.0.0
app.listen(PORT, HOST, () => {
  console.log(`🚀 Express server running on http://127.0.0.1:${PORT}`);
});
