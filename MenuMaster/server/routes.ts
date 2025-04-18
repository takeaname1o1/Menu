import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { menuItems } from "./data/menu";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes with /api prefix
  
  // Get menu items
  app.get("/api/menu", (req, res) => {
    res.json(menuItems);
  });

  // Get menu items by category
  app.get("/api/menu/category/:category", (req, res) => {
    const { category } = req.params;
    const filteredItems = menuItems.filter(item => 
      category === 'all' ? true : item.category.toLowerCase() === category.toLowerCase()
    );
    res.json(filteredItems);
  });

  // Get a specific menu item
  app.get("/api/menu/:id", (req, res) => {
    const { id } = req.params;
    const item = menuItems.find(item => item.id === id);
    
    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    
    res.json(item);
  });

  const httpServer = createServer(app);
  return httpServer;
}
