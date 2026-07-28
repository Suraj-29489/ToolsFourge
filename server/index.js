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

// Tasks 1 & 2: Log every incoming request in detail
app.use((req, res, next) => {
  console.log(`\n==================================================`);
  console.log(`[REQUEST] ${new Date().toISOString()}`);
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.originalUrl}`);
  console.log(`Headers: ${JSON.stringify(req.headers)}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`Body: ${JSON.stringify(req.body)}`);
  }
  console.log(`==================================================\n`);
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
  console.log('---> [ROUTE MATCHED] GET /api/health');
  try {
    const version = await checkYtDlpAvailable();
    const responsePayload = {
      success: true,
      data: {
        status: 'ok',
        ytDlpVersion: version,
        timestamp: new Date().toISOString(),
      },
    };
    console.log('<--- [RESPONSE 200] GET /api/health:', JSON.stringify(responsePayload));
    return res.json(responsePayload);
  } catch (err) {
    console.error('<--- [RESPONSE 503] GET /api/health Exception:', err);
    const errorPayload = {
      success: false,
      error: {
        message: err.message || 'yt-dlp is not installed on the server.',
        code: 'YT_DLP_MISSING',
      },
    };
    return res.status(503).json(errorPayload);
  }
});

/**
 * POST /api/video/analyze
 * Extracts metadata for YouTube, Shorts, Live, and supported platforms
 */
app.post('/api/video/analyze', async (req, res) => {
  console.log('--------------------------------------------------');
  console.log('---> [ROUTE MATCHED] POST /api/video/analyze');
  console.log('---> Request Received for URL:', req.body?.url);
  console.log('---> Full Request Body:', JSON.stringify(req.body));
  console.log('--------------------------------------------------');

  try {
    const { url } = req.body;

    if (!url || typeof url !== 'string' || !url.trim()) {
      const missingPayload = {
        success: false,
        error: {
          message: 'Please provide a valid video URL.',
          code: 'MISSING_URL',
        },
      };
      console.log('<--- [RESPONSE 400] Missing URL:', JSON.stringify(missingPayload));
      return res.status(400).json(missingPayload);
    }

    const metadata = await extractVideoMetadata(url.trim());

    const successPayload = {
      success: true,
      data: metadata,
    };

    console.log('--------------------------------------------------');
    console.log('<--- [FINAL RESPONSE 200 SUCCESS]:', JSON.stringify({
      success: true,
      data: {
        id: metadata.id,
        title: metadata.title,
        platform: metadata.platform,
        durationFormatted: metadata.durationFormatted,
        formatsCount: metadata.formats?.length,
      }
    }));
    console.log('--------------------------------------------------');

    return res.json(successPayload);
  } catch (error) {
    console.error('--------------------------------------------------');
    console.error('<--- [FINAL RESPONSE ERROR EXCEPTION]:', error);

    const message = error.message || 'Failed to analyze video URL.';
    const isYtDlpMissing = message.includes('not installed');
    const statusCode = isYtDlpMissing ? 503 : 400;
    const errorCode = isYtDlpMissing ? 'YT_DLP_MISSING' : 'ANALYSIS_FAILED';

    const errorPayload = {
      success: false,
      error: {
        message,
        code: errorCode,
      },
    };

    console.error(`<--- [FINAL RESPONSE ${statusCode} ERROR]:`, JSON.stringify(errorPayload));
    console.error('--------------------------------------------------');

    return res.status(statusCode).json(errorPayload);
  }
});

/**
 * GET /api/video/download
 * Initiates direct browser attachment download stream
 */
app.get('/api/video/download', (req, res) => {
  console.log('---> [ROUTE MATCHED] GET /api/video/download', req.query);
  try {
    const { url, formatId, title } = req.query;

    if (!url) {
      const missingPayload = {
        success: false,
        error: {
          message: 'Missing video URL parameter.',
          code: 'MISSING_URL_PARAM',
        },
      };
      console.log('<--- [RESPONSE 400] Missing Download URL:', missingPayload);
      return res.status(400).json(missingPayload);
    }

    streamVideoDownload(url, formatId, res, title || 'video');
  } catch (error) {
    console.error('<--- [RESPONSE 500] Download GET Exception:', error);
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
  console.log('---> [ROUTE MATCHED] POST /api/video/download', req.body);
  try {
    const { url, formatId, title } = req.body;

    if (!url) {
      const missingPayload = {
        success: false,
        error: {
          message: 'Missing video URL parameter.',
          code: 'MISSING_URL_PARAM',
        },
      };
      return res.status(400).json(missingPayload);
    }

    streamVideoDownload(url, formatId, res, title || 'video');
  } catch (error) {
    console.error('<--- [RESPONSE 500] Download POST Exception:', error);
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
  console.warn(`\n<--- [BACKEND 404 NOT FOUND]: ${req.method} ${req.originalUrl}\n`);
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
  console.error('\n<--- [EXPRESS GLOBAL ERROR HANDLER EXCEPTION]:', err, '\n');
  res.status(err.status || 500).json({
    success: false,
    error: {
      message: err.message || 'Internal Server Error.',
      code: 'INTERNAL_ERROR',
    },
  });
});

// Start Express Server bound to 0.0.0.0
const server = app.listen(PORT, HOST, () => {
  console.log(`\n🚀 Express server running on http://127.0.0.1:${PORT} (bound to ${HOST})\n`);
});

server.on('error', (err) => {
  console.error('[CRITICAL SERVER ERROR]: Could not start Express server:', err);
});
