import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { hash } from "bcryptjs"
import dotenv from "dotenv"
//import { v4 as uuidv4 } from "uuid"
dotenv.config()

async function seedAdmin() {
  try {
    // Configuration - you can change these values as needed
    const adminEmail = process.env.ADMIN_EMAIL 
    const adminPassword = process.env.ADMIN_PASSWORD 
    const adminName = "Admin User"
    if(!adminEmail || !adminPassword) {
        throw new Error("Admin email and password must be set in environment variables.")
    }

    // Check if admin already exists
    const existingAdmin = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, adminEmail),
    })

    if (existingAdmin) {
      console.log(`Admin user with email ${adminEmail} already exists.`)
      process.exit(0)
    }

    // Hash the password
    const hashedPassword = await hash(adminPassword, 10)

    // Create the admin user
    await db.insert(users).values({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    console.log(`Admin user created successfully with email: ${adminEmail}`)
    console.log(`Password: ${adminPassword}`)
    console.log("Please change this password after your first login!")

    process.exit(0)
  } catch (error) {
    console.error("Error seeding admin user:", error)
    process.exit(1)
  }
}

seedAdmin()
