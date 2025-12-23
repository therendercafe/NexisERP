"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getUsers() {
  return await prisma.user.findMany({
    orderBy: { name: "asc" },
  });
}

export async function createUser(data: any) {
  try {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        role: data.role,
        password: data.password,
        permissions: data.permissions,
      },
    });

    // Log the creation
    await prisma.auditLog.create({
      data: {
        userId: "system", // In a real app, this would be the session user
        action: "USER_CREATE",
        entityType: "USER",
        entityId: user.id,
        metadata: {
          name: user.name,
          email: user.email,
          role: user.role,
          permissions: user.permissions
        },
      },
    });

    revalidatePath("/dashboard/users");
    return { success: true, user };
  } catch (error) {
    console.error("Failed to create user:", error);
    return { success: false, error: "Failed to create user" };
  }
}

export async function updateUser(id: string, data: any) {
  try {
    const before = await prisma.user.findUnique({ where: { id } });
    
    const user = await prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        role: data.role,
        password: data.password,
        permissions: data.permissions,
      },
    });

    // Log the update
    await prisma.auditLog.create({
      data: {
        userId: "system",
        action: "USER_UPDATE",
        entityType: "USER",
        entityId: user.id,
        metadata: {
          before,
          after: user
        },
      },
    });

    revalidatePath("/dashboard/users");
    return { success: true, user };
  } catch (error) {
    console.error("Failed to update user:", error);
    return { success: false, error: "Failed to update user" };
  }
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({ where: { id } });
    revalidatePath("/dashboard/users");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete user" };
  }
}

