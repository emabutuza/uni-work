import { Server } from 'socket.io';
import http from 'http';
import type { IFlower } from '../models/Flower.ts';

let io: Server;

export const initWebSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: '*', // In production, restrict this to trusted domains
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected', socket.id);

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected', socket.id);
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

// Emit events for updates
export const emitFlowerCreated = (flower: IFlower) => {
  if (io) {
    io.emit('flower:created', flower);
  }
};

export const emitFlowerUpdated = (flower: IFlower) => {
  if (io) {
    io.emit('flower:updated', flower);
  }
};

export const emitFlowerDeleted = (flowerId: string) => {
  if (io) {
    io.emit('flower:deleted', flowerId);
  }
};

// For real-time chart data and asynchronous updates
export const emitChartData = (data: any) => {
  if (io) {
    io.emit('chart:update', data);
  }
}; 