import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

// UserID -> WebSocket mapping
const activeConnections = new Map<string, WebSocket>();

// PostID -> Connected users
const postRooms = new Map<string, Set<string>>();

export const setupWebSocket = (server: http.Server) => {
  const wss = new WebSocketServer({ 
    server,
    // Skip unnecessary HTTP handling for WS requests
    noServer: false
  });

  wss.on('connection', (ws, req) => {
    // 1. Extract cookies from request headers
    const cookies = req.headers.cookie;
    if (!cookies) {
      ws.close(1008, 'Missing authentication cookies');
      return;
    }

    // 2. Parse cookies
    const parsedCookies = cookie.parse(cookies);
    const token = parsedCookies['accessToken']; // Use your actual cookie name

    if (!token) {
      ws.close(1008, 'Authentication token missing');
      return;
    }

    // 3. Verify JWT
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
      const userId = decoded.id;
   if (!process.env.JWT_SECRET) {
  console.error('Missing JWT_SECRET in environment variables');
  ws.close(1011, 'Server misconfiguration');
  return;
}

      // 4. Store connection with user ID
      activeConnections.set(userId, ws);

      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
            if (!message.type || !message.postId) {
          console.warn('Malformed message received:', message);
           return;
          }
          // Handle room subscriptions
          if (message.type === 'subscribe' && message.postId) {
            if (!postRooms.has(message.postId)) {
              postRooms.set(message.postId, new Set());
            }
            postRooms.get(message.postId)!.add(userId);
            console.log(`User ${userId} subscribed to post ${message.postId}`);
          }
          
          if (message.type === 'unsubscribe' && message.postId) {
            postRooms.get(message.postId)?.delete(userId);
            console.log(`User ${userId} unsubscribed from post ${message.postId}`);
          }
        } catch (e) {
          console.error('Error processing message:', e);
        }
      });

      ws.on('close', () => {
        activeConnections.delete(userId);
        // Remove user from all rooms
        postRooms.forEach((users, postId) => {
          users.delete(userId);
          if (users.size === 0) postRooms.delete(postId);
        });
        console.log(`User ${userId} disconnected`);
      });

      ws.on('error', (err) => {
        console.error(`WS error for user ${userId}:`, err);
      });

    } catch (error) {
      console.error('JWT verification failed:', error);
      ws.close(1008, 'Invalid authentication token');
    }
  });
};

// Send to specific user
export const sendToUser = (userId: string, data: object) => {
  const ws = activeConnections.get(userId);
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  }
};

// Broadcast to all users in a post room
export const broadcastToPostRoom = (postId: string, data: object) => {
  const users = postRooms.get(postId);
  if (!users) return;
  
  users.forEach(userId => {
    sendToUser(userId, data);
  });
};