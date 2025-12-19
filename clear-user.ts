import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function clearUser() {
  try {
    // Delete the user with the corrupted password
    const result = await prisma.user.delete({
      where: {
        email: "kaustubhduse2004@gmail.com",
      },
    });
    console.log("User deleted:", result.email);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

clearUser();
