import dotenv from "dotenv";
dotenv.config();

import http, { Server } from "http";
import app from "./app";
import { prisma } from "./config/db";
import bcrypt from "bcrypt";
import { Role } from "@prisma/client";

let server: Server | null = null;

async function connectToDB() {
  try {
    await prisma.$connect();
    console.log("*** DB connection successfull!!");
  } catch (error) {
    console.log("*** DB connection failed!");
    process.exit(1);
  }
}

async function startServer() {
  try {
    await connectToDB();

    // Seed default user if no users exist
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      console.log("No users found. Creating default SUPER_ADMIN user...");
      const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
      const hashedPassword = await bcrypt.hash("sharif123", saltRounds);
      await prisma.user.create({
        data: {
          name: "Sharif Ahmed",
          email: "a.sharif@dazbd.com",
          password: hashedPassword,
          role: Role.SUPER_ADMIN,
        },
      });
      console.log("Default user created.");
    }

    server = http.createServer(app);
    server.listen(process.env.PORT, () => {
      console.log(`🚀 Server is running on port ${process.env.PORT}`);
    });

    handleProcessEvents();
  } catch (error) {
    console.error("❌ Error during server startup:", error);
    process.exit(1);
  }
}

/**
 * Gracefully shutdown the server and close database connections.
 * @param {string} signal - The termination signal received.
 */
async function gracefulShutdown(signal: string) {
  console.warn(`🔄 Received ${signal}, shutting down gracefully...`);

  if (server) {
    server.close(async () => {
      console.log("✅ HTTP server closed.");

      try {
        console.log("Server shutdown complete.");
      } catch (error) {
        console.error("❌ Error during shutdown:", error);
      }

      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

/**
 * Handle system signals and unexpected errors.
 */
function handleProcessEvents() {
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));

  process.on("uncaughtException", (error) => {
    console.error("💥 Uncaught Exception:", error);
    gracefulShutdown("uncaughtException");
  });

  process.on("unhandledRejection", (reason) => {
    console.error("💥 Unhandled Rejection:", reason);
    gracefulShutdown("unhandledRejection");
  });
}

// Start the application
startServer();
