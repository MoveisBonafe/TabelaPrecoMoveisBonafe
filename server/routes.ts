import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertProductSchema, insertCategorySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Product routes - now handled by frontend GitHub client
  app.get("/api/products", async (req, res) => {
    try {
      res.json([]);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });



  // Category routes - now handled by frontend GitHub client
  app.get("/api/categories", async (req, res) => {
    try {
      res.json([]);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Backup routes - now handled by frontend GitHub client
  app.post("/api/backup/create", async (req, res) => {
    try {
      const backupData = {
        timestamp: new Date().toISOString(),
        status: 'success',
        message: 'Backup automático via GitHub commits'
      };
      
      res.json({ 
        message: "Backup automático via GitHub!",
        data: backupData 
      });
    } catch (error) {
      console.error("Error creating backup:", error);
      res.status(500).json({ message: "Falha ao criar backup" });
    }
  });

  const httpServer = createServer(app);
  
  // WebSocket para sincronização entre navegadores
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  const clients = new Set<WebSocket>();

  wss.on('connection', (ws: WebSocket) => {
    clients.add(ws);
    console.log('Cliente conectado ao WebSocket. Total:', clients.size);

    ws.on('close', () => {
      clients.delete(ws);
      console.log('Cliente desconectado do WebSocket. Total:', clients.size);
    });

    ws.on('error', (error) => {
      console.error('Erro no WebSocket:', error);
      clients.delete(ws);
    });
  });

  // Função para enviar atualizações para todos os clientes conectados
  const broadcastUpdate = (type: string, data: any) => {
    const message = JSON.stringify({ type, data, timestamp: new Date().toISOString() });
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  };

  // All operations now handled by frontend GitHub client
  app.post("/api/products", async (req, res) => {
    res.json({ message: "Use GitHub client directly" });
  });

  app.put("/api/products/:id", async (req, res) => {
    res.json({ message: "Use GitHub client directly" });
  });

  app.delete("/api/products/:id", async (req, res) => {
    res.json({ message: "Use GitHub client directly" });
  });

  app.post("/api/products/bulk-import", async (req, res) => {
    res.json({ message: "Use GitHub client directly" });
  });

  // Rota para estatísticas de monitoramento
  app.get("/api/monitoring/stats", async (req, res) => {
    try {
      const stats = {
        totalProducts: 0,
        totalCategories: 0,
        activeProducts: 0,
        inactiveProducts: 0,
        connectedClients: clients.size,
        serverUptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        lastUpdate: new Date().toISOString(),
        dataSource: 'GitHub'
      };
      
      res.json(stats);
    } catch (error) {
      console.error("Error fetching monitoring stats:", error);
      res.status(500).json({ message: "Failed to fetch monitoring stats" });
    }
  });

  return httpServer;
}
