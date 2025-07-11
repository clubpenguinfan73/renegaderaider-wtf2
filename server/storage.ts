import { users, profiles, links, type User, type InsertUser, type Profile, type InsertProfile, type Link, type InsertLink } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getProfile(): Promise<Profile | undefined>;
  updateProfile(profile: InsertProfile): Promise<Profile>;
  
  getLinks(): Promise<Link[]>;
  createLink(link: InsertLink): Promise<Link>;
  updateLink(id: number, link: Partial<InsertLink>): Promise<Link | undefined>;
  deleteLink(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private profile: Profile | null;
  private links: Map<number, Link>;
  private currentUserId: number;
  private currentLinkId: number;

  constructor() {
    this.users = new Map();
    this.profile = {
      id: 1,
      username: "renegade raider",
      bio: "Professional gamer • Content creator • Streaming daily",
      profilePicture: "",
      backgroundImage: ""
    };
    this.links = new Map();
    this.currentUserId = 1;
    this.currentLinkId = 1;
    
    // Initialize with default links
    const defaultLinks: Link[] = [
      { id: 1, title: "Twitch", url: "#", description: "Watch me live stream", icon: "fab fa-twitch", color: "bg-gaming-purple", order: 1 },
      { id: 2, title: "YouTube", url: "#", description: "Gaming highlights & tutorials", icon: "fab fa-youtube", color: "bg-red-600", order: 2 },
      { id: 3, title: "Twitter", url: "#", description: "Latest updates & thoughts", icon: "fab fa-twitter", color: "bg-gaming-cyan", order: 3 },
      { id: 4, title: "Discord", url: "#", description: "Join the community", icon: "fab fa-discord", color: "bg-indigo-600", order: 4 },
      { id: 5, title: "Spotify", url: "#", description: "My gaming playlists", icon: "fab fa-spotify", color: "bg-green-600", order: 5 }
    ];
    
    defaultLinks.forEach(link => this.links.set(link.id, link));
    this.currentLinkId = 6;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getProfile(): Promise<Profile | undefined> {
    return this.profile || undefined;
  }

  async updateProfile(profileData: InsertProfile): Promise<Profile> {
    this.profile = {
      id: this.profile?.id || 1,
      username: profileData.username,
      bio: profileData.bio,
      profilePicture: profileData.profilePicture || null,
      backgroundImage: profileData.backgroundImage || null,
    };
    return this.profile!;
  }

  async getLinks(): Promise<Link[]> {
    return Array.from(this.links.values()).sort((a, b) => a.order - b.order);
  }

  async createLink(linkData: InsertLink): Promise<Link> {
    const id = this.currentLinkId++;
    const link: Link = { 
      id,
      title: linkData.title,
      url: linkData.url,
      description: linkData.description || null,
      icon: linkData.icon,
      color: linkData.color,
      order: linkData.order || 0
    };
    this.links.set(id, link);
    return link;
  }

  async updateLink(id: number, linkData: Partial<InsertLink>): Promise<Link | undefined> {
    const existingLink = this.links.get(id);
    if (!existingLink) return undefined;
    
    const updatedLink = { ...existingLink, ...linkData };
    this.links.set(id, updatedLink);
    return updatedLink;
  }

  async deleteLink(id: number): Promise<boolean> {
    return this.links.delete(id);
  }
}

export const storage = new MemStorage();
