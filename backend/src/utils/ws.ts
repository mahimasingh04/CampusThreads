import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';

// UserID -> WebSocket mapping
const activeConnections = new Map<string, WebSocket>();

// PostID -> Connected users
const postRooms = new Map<string, Set<string>>();

export const setupWebSocket = (server: http.Server) => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws, req) => {
    // Extract user ID from query params (should be authenticated)
    const userId = new URL(req.url!, `http://${req.headers.host}`).searchParams.get('userId');
    
    if (!userId) {
      ws.close(1008, 'Unauthorized');
      return;
    }

    // Store connection
    activeConnections.set(userId, ws);

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        // Handle room subscriptions
        if (message.type === 'subscribe' && message.postId) {
          if (!postRooms.has(message.postId)) {
            postRooms.set(message.postId, new Set());
          }
          postRooms.get(message.postId)!.add(userId);
        }
        
        if (message.type === 'unsubscribe' && message.postId) {
          postRooms.get(message.postId)?.delete(userId);
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
    });
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