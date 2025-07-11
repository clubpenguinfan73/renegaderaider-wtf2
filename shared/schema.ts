import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  bio: text("bio").notNull(),
  profilePicture: text("profile_picture"),
  backgroundImage: text("background_image"),
  backgroundMusic: text("background_music"),
  musicEnabled: boolean("music_enabled").default(false),
});

export const links = pgTable("links", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  description: text("description"),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  order: integer("order").notNull().default(0),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProfileSchema = createInsertSchema(profiles).pick({
  username: true,
  bio: true,
  profilePicture: true,
  backgroundImage: true,
  backgroundMusic: true,
  musicEnabled: true,
});

export const insertLinkSchema = createInsertSchema(links).pick({
  title: true,
  url: true,
  description: true,
  icon: true,
  color: true,
  order: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profiles.$inferSelect;
export type InsertLink = z.infer<typeof insertLinkSchema>;
export type Link = typeof links.$inferSelect;
