import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const featureRequestsRoutes = express.Router();

// Get all feature requests (with optional filtering)
featureRequestsRoutes.get("/", async (req, res) => {
  try {
    const { status, priority, category, shopDomain } = req.query;
    
    const where: any = {};
    
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (category) where.category = category;
    if (shopDomain) where.shopDomain = shopDomain;
    
    const featureRequests = await prisma.featureRequest.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });
    
    res.json({
      success: true,
      data: featureRequests,
    });
  } catch (error) {
    console.error("Error fetching feature requests:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch feature requests",
    });
  }
});

// Get a specific feature request by ID
featureRequestsRoutes.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const featureRequest = await prisma.featureRequest.findUnique({
      where: { id },
    });
    
    if (!featureRequest) {
       res.status(404).json({
        success: false,
        error: "Feature request not found",
      });
    }
    
    res.json({
      success: true,
      data: featureRequest,
    });
  } catch (error) {
    console.error("Error fetching feature request:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch feature request",
    });
  }
});

// Create a new feature request
featureRequestsRoutes.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      priority = "medium",
      category = "general",
      userEmail,
      userName,
      shopDomain,
    } = req.body;
    
    // Validate required fields
    if (!title || !description || !userEmail || !shopDomain) {
       res.status(400).json({
        success: false,
        error: "Title, description, userEmail, and shopDomain are required",
      });
    }
    
    const featureRequest = await prisma.featureRequest.create({
      data: {
        title,
        description,
        priority,
        category,
        userEmail,
        userName,
        shopDomain,
      },
    });
    
    res.status(201).json({
      success: true,
      data: featureRequest,
    });
  } catch (error) {
    console.error("Error creating feature request:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create feature request",
    });
  }
});

// Update a feature request (admin only - status, priority, category)
featureRequestsRoutes.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, category } = req.body;
    
    // Only allow updating status, priority, and category (admin fields)
    const updateData: any = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (category) updateData.category = category;
    
    if (Object.keys(updateData).length === 0) {
       res.status(400).json({
        success: false,
        error: "No valid fields to update",
      });
    }
    
    const featureRequest = await prisma.featureRequest.update({
      where: { id },
      data: updateData,
    });
    
    res.json({
      success: true,
      data: featureRequest,
    });
  } catch (error) {
    console.error("Error updating feature request:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update feature request",
    });
  }
});

// Upvote a feature request
featureRequestsRoutes.post("/:id/upvote", async (req, res) => {
  try {
    const { id } = req.params;
    
    const featureRequest = await prisma.featureRequest.update({
      where: { id },
      data: {
        upvotes: {
          increment: 1,
        },
      },
    });
    
    res.json({
      success: true,
      data: featureRequest,
    });
  } catch (error) {
    console.error("Error upvoting feature request:", error);
    res.status(500).json({
      success: false,
      error: "Failed to upvote feature request",
    });
  }
});

// Add a comment to a feature request
featureRequestsRoutes.post("/:id/comment", async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, userEmail, userName } = req.body;
    
    if (!comment || !userEmail) {
       res.status(400).json({
        success: false,
        error: "Comment and userEmail are required",
      });
    }
    
    const featureRequest = await prisma.featureRequest.findUnique({
      where: { id },
    });
    
    if (!featureRequest) {
       res.status(404).json({
        success: false,
        error: "Feature request not found",
      });
    }
    
    const newComment = {
      id: Date.now().toString(),
      comment,
      userEmail,
      userName: userName || userEmail,
      createdAt: new Date().toISOString(),
    };
    
    const updatedFeatureRequest = await prisma.featureRequest.update({
      where: { id },
      data: {
        comments: {
          push: newComment,
        },
      },
    });
    
    res.json({
      success: true,
      data: updatedFeatureRequest,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({
      success: false,
      error: "Failed to add comment",
    });
  }
});

// Delete a feature request (admin only)
featureRequestsRoutes.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.featureRequest.delete({
      where: { id },
    });
    
    res.json({
      success: true,
      message: "Feature request deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting feature request:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete feature request",
    });
  }
});

export default featureRequestsRoutes; 