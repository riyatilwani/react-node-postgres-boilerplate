import dotenv from 'dotenv';
import path from 'path';

// Load environment-specific .env file
const envFile = process.env.ENV_FILE || '.env.development';
const envPath = path.resolve(__dirname, `../${envFile}`);
dotenv.config({ path: envPath });
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@gmail.com";
  const username = "admin";
  const plainPassword = "password";

  // Check if the admin user already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    console.log("Admin user already exists. Skipping seeding.");
    return;
  }

  // Hash the password
  const passwordHash = await bcrypt.hash(plainPassword, 10);

  // Create the admin user
  const adminUser = await prisma.user.create({
    data: {
      email,
      username,
      passwordHash,
      isAdmin: true,
      isVerified: true, // Set to true or false based on your verification flow
    },
  });

  console.log("Admin user created:", adminUser);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
