import { Handler } from "@netlify/functions";
import { storage } from "../../server/storage";
import { insertProfileSchema, insertLinkSchema } from "../../shared/schema";
import { z } from "zod";

export const handler: Handler = async (event, context) => {
  const { path, httpMethod, body } = event;

  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  };

  // Handle preflight requests
  if (httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  try {
    // Parse the API path
    const apiPath = path.replace(/^\/api/, "");
    const parsedBody = body ? JSON.parse(body) : {};

    // Profile endpoints
    if (apiPath === "/profile") {
      if (httpMethod === "GET") {
        const profile = await storage.getProfile();
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(profile || null),
        };
      }
      
      if (httpMethod === "PUT") {
        const profileData = insertProfileSchema.parse(parsedBody);
        const profile = await storage.updateProfile(profileData);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(profile),
        };
      }
    }

    // Links endpoints
    if (apiPath === "/links") {
      if (httpMethod === "GET") {
        const links = await storage.getLinks();
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(links),
        };
      }
      
      if (httpMethod === "POST") {
        const linkData = insertLinkSchema.parse(parsedBody);
        const link = await storage.createLink(linkData);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(link),
        };
      }
    }

    // Individual link endpoints
    const linkMatch = apiPath.match(/^\/links\/(\d+)$/);
    if (linkMatch) {
      const linkId = parseInt(linkMatch[1]);
      
      if (httpMethod === "PUT") {
        const linkData = insertLinkSchema.partial().parse(parsedBody);
        const link = await storage.updateLink(linkId, linkData);
        
        if (!link) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ message: "Link not found" }),
          };
        }
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(link),
        };
      }
      
      if (httpMethod === "DELETE") {
        const success = await storage.deleteLink(linkId);
        
        if (!success) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ message: "Link not found" }),
          };
        }
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: "Link deleted successfully" }),
        };
      }
    }

    // Not found
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ message: "Not found" }),
    };

  } catch (error) {
    console.error("API Error:", error);
    
    if (error instanceof z.ZodError) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          message: "Invalid request data", 
          errors: error.errors 
        }),
      };
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};