#!/usr/bin/env node

/**
 * Module dependencies.
 */

import debugPkg from 'debug';
import { createServer } from 'http';
import app from '@/app';
import { Addr, Err } from './www.types';

const debug = debugPkg('sample-ts-express:server');

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string) {
  const port: number = parseInt(val, 10);

  if (Number.isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Create HTTP server.
 */

const server = createServer(app);

/**
 * Get port from environment and store in Express.
 */

const PORT = normalizePort(process.env.PORT || '3000');
app.set('port', PORT);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: Err) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof PORT === 'string'
    ? `Pipe ${PORT}`
    : `Port ${PORT}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr: Addr = server.address();
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr?.port}`;
  debug(`Listening on ${bind}`);
}

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(PORT);
server.on('error', onError);
server.on('listening', onListening);
