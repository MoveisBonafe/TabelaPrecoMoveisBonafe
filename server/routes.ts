import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { githubStorage } from "./github-storage";
import { insertProductSchema, insertCategorySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await githubStorage.getProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });



  // Category routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await githubStorage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Backup routes
  app.post("/api/backup/create", async (req, res) => {
    try {
      // Com GitHub, o backup é automático através dos commits
      const products = await githubStorage.getProducts();
      const categories = await githubStorage.getCategories();
      
      const backupData = {
        timestamp: new Date().toISOString(),
        products: products.length,
        categories: categories.length,
        status: 'success'
      };
      
      res.json({ 
        message: "Backup manual registrado com sucesso!",
        data: backupData 
      });
    } catch (error) {
      console.error("Error creating backup:", error);
      res.status(500).json({ message: "Falha ao criar backup" });
    }
  });

  app.get("/api/backup/export", async (req, res) => {
    try {
      const products = await githubStorage.getProducts();
      const categories = await githubStorage.getCategories();
      
      const exportData = {
        metadata: {
          exportDate: new Date().toISOString(),
          version: "1.0",
          totalProducts: products.length,
          totalCategories: categories.length
        },
        products,
        categories
      };
      
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=backup-catalogo-${new Date().toISOString().split('T')[0]}.json`);
      res.json(exportData);
    } catch (error) {
      console.error("Error exporting data:", error);
      res.status(500).json({ message: "Falha ao exportar dados" });
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

  // Modificar as rotas para enviar atualizações via WebSocket
  app.post("/api/products", async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await githubStorage.createProduct(productData);
      
      // Enviar atualização para todos os clientes
      broadcastUpdate('product_created', product);
      
      res.json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const productData = insertProductSchema.partial().parse(req.body);
      const product = await githubStorage.updateProduct(id, productData);
      
      // Enviar atualização para todos os clientes
      broadcastUpdate('product_updated', product);
      
      res.json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const success = await githubStorage.deleteProduct(id);
      if (success) {
        // Enviar atualização para todos os clientes
        broadcastUpdate('product_deleted', { id });
        
        res.json({ message: "Produto excluído com sucesso" });
      } else {
        res.status(404).json({ message: "Produto não encontrado" });
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  app.post("/api/products/bulk-import", async (req, res) => {
    try {
      const { products: productsData } = req.body;
      const results = [];
      
      for (const productData of productsData) {
        const validatedProduct = insertProductSchema.parse(productData);
        const result = await githubStorage.createProduct(validatedProduct);
        results.push(result);
      }
      
      // Enviar atualização para todos os clientes
      broadcastUpdate('products_bulk_imported', { count: results.length, products: results });
      
      res.json({ 
        message: `${results.length} produtos processados com sucesso!`,
        products: results 
      });
    } catch (error) {
      console.error("Error in bulk import:", error);
      res.status(500).json({ message: "Erro na importação em lote" });
    }
  });

  // Rota para estatísticas de monitoramento
  app.get("/api/monitoring/stats", async (req, res) => {
    try {
      const products = await githubStorage.getProducts();
      const categories = await githubStorage.getCategories();
      
      const stats = {
        totalProducts: products.length,
        totalCategories: categories.length,
        activeProducts: products.filter((p: any) => p.active).length,
        inactiveProducts: products.filter((p: any) => !p.active).length,
        connectedClients: clients.size,
        serverUptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        lastUpdate: new Date().toISOString()
      };
      
      res.json(stats);
    } catch (error) {
      console.error("Error fetching monitoring stats:", error);
      res.status(500).json({ message: "Failed to fetch monitoring stats" });
    }
  });

  return httpServer;
}
