import bcrypt from "bcrypt";
import { prisma } from "./config/db";
import { Role } from "@prisma/client";

const seedDatabase = async () => {
  try {
    // Check if any users exist
    const userCount = await prisma.user.count();

    if (userCount === 0) {
      console.log("No users found. Creating default SUPER_ADMIN user...");

      // Hash the password
      const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
      const hashedPassword = await bcrypt.hash("sharif123", saltRounds);

      // Create the default user
      const user = await prisma.user.create({
        data: {
          name: "Sharif Ahmed",
          email: "a.sharif@dazbd.com",
          password: hashedPassword,
          role: Role.SUPER_ADMIN,
        },
      });

      console.log("Default user created:", user);
    } else {
      console.log("Users already exist. Skipping seed.");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
};

// Run the seed function
seedDatabase();
