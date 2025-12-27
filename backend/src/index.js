import http from 'http';

import app from './app.js';
import connectDB from './db/db.js';
import { env } from './config/env.js';

const server = http.createServer(app);

const startServer = async () => {
  try {
    await connectDB();
    server.listen(env.port, () => {
      console.log(`🚀 Server running on port ${env.port}`);
    });
  } catch (error) {
    console.error('Server failed to start', error);
    process.exit(1);
  }
};

startServer();

const gracefulShutdown = (signal) => {
  process.on(signal, async () => {
    console.log(`Received ${signal}. Closing server...`);
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  });
};

['SIGINT', 'SIGTERM'].forEach(gracefulShutdown);

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception', error);
});
