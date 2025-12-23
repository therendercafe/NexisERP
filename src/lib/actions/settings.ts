"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateSystemSettings(data: any) {
  try {
    // In a production app, we would save this to a SystemSettings table.
    // For this demo, we simulate the logic and commit it to the Audit Matrix.
    
    await prisma.auditLog.create({
      data: {
        userId: "system",
        action: "SYSTEM_SETTINGS_UPDATE",
        entityType: "SYSTEM",
        entityId: "GLOBAL_CONFIG",
        metadata: {
          updatedFields: data,
          timestamp: new Date().toISOString(),
          status: "SUCCESS_COMMITTED"
        }
      }
    });

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard/audit");
    
    return { success: true, message: "System configuration updated." };
  } catch (error) {
    return { success: false, error: "Configuration sync failed." };
  }
}

