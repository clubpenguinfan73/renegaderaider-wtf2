import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProfileSchema, insertLinkSchema } from "@shared/schema";
import { z } from "zod";
import { discordAPI } from "./discord";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get profile data
  app.get("/api/profile", async (req, res) => {
    try {
      const profile = await storage.getProfile();
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  // Update profile data
  app.put("/api/profile", async (req, res) => {
    try {
      const profileData = insertProfileSchema.parse(req.body);
      const profile = await storage.updateProfile(profileData);
      res.json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid profile data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update profile" });
      }
    }
  });

  // Get all links
  app.get("/api/links", async (req, res) => {
    try {
      const links = await storage.getLinks();
      res.json(links);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch links" });
    }
  });

  // Create new link
  app.post("/api/links", async (req, res) => {
    try {
      const linkData = insertLinkSchema.parse(req.body);
      const link = await storage.createLink(linkData);
      res.json(link);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid link data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create link" });
      }
    }
  });

  // Update existing link
  app.put("/api/links/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const linkData = insertLinkSchema.partial().parse(req.body);
      const link = await storage.updateLink(id, linkData);
      
      if (!link) {
        res.status(404).json({ message: "Link not found" });
        return;
      }
      
      res.json(link);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid link data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update link" });
      }
    }
  });

  // Delete link
  app.delete("/api/links/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteLink(id);
      
      if (!success) {
        res.status(404).json({ message: "Link not found" });
        return;
      }
      
      res.json({ message: "Link deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete link" });
    }
  });

  // Discord API endpoints
  app.get("/api/discord/profile", async (req, res) => {
    try {
      const user = await discordAPI.getUserProfile();
      const avatarUrl = discordAPI.getAvatarUrl(user);
      const bannerUrl = discordAPI.getBannerUrl(user);
      const badges = discordAPI.getBadges(user.public_flags);
      
      res.json({
        id: user.id,
        username: user.username,
        discriminator: user.discriminator,
        avatar: avatarUrl,
        banner: bannerUrl,
        accentColor: user.accent_color,
        badges: badges,
        premiumType: user.premium_type,
        publicFlags: user.public_flags
      });
    } catch (error) {
      console.error('Discord API error:', error);
      res.status(500).json({ message: "Failed to fetch Discord profile" });
    }
  });

  // Discord activity endpoint
  app.get("/api/discord/activity", async (req, res) => {
    try {
      const activity = await discordAPI.getCurrentActivity();
      res.json(activity);
    } catch (error) {
      console.error('Discord activity error:', error);
      res.status(500).json({ message: "Failed to fetch Discord activity" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
