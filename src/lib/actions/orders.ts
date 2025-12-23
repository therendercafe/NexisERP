"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getOrders(params: {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  startDate?: string;
  endDate?: string;
  status?: string;
}) {
  const { 
    page = 1, 
    pageSize = 50, 
    sortBy = 'createdAt', 
    order = 'desc',
    startDate,
    endDate,
    status
  } = params;

  try {
    const skip = (page - 1) * pageSize;
    const where: any = {};
    
    if (status && status !== "ALL") {
      where.status = status;
    }
    
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          items: {
            include: {
              sku: true
            }
          },
          user: true,
        },
        orderBy: {
          [sortBy]: order
        }
      }),
      prisma.order.count({ where })
    ]);

    return { 
      success: true, 
      data: orders,
      pagination: {
        total,
        pageCount: Math.ceil(total / pageSize),
        currentPage: page,
        pageSize
      }
    };
  } catch (error) {
    return { success: false, error: "Failed to fetch orders" };
  }
}

export async function updateOrderStatus(id: string, newStatus: string, userId: string = "system") {
  try {
    const oldOrder = await prisma.order.findUnique({
      where: { id },
      select: { status: true }
    });

    const updated = await prisma.order.update({
      where: { id },
      data: { status: newStatus },
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        userId,
        action: "ORDER_STATUS_UPDATE",
        entityType: "ORDER",
        entityId: id,
        metadata: {
          before: oldOrder?.status,
          after: newStatus
        }
      }
    });

    revalidatePath("/dashboard/orders");
    revalidatePath("/dashboard/audit");
    return { success: true, data: updated };
  } catch (error) {
    return { success: false, error: "Failed to update status" };
  }
}

export async function getFinancialPerformance() {
  try {
    const orders = await prisma.order.findMany();

    const metrics = orders.reduce((acc, order) => {
      acc.totalRevenue += Number(order.totalSales);
      acc.totalCost += Number(order.totalCost);
      return acc;
    }, { totalRevenue: 0, totalCost: 0 });

    const totalProfit = metrics.totalRevenue - metrics.totalCost;
    const netMargin = metrics.totalRevenue > 0 ? (totalProfit / metrics.totalRevenue) * 100 : 0;

    return {
      success: true,
      data: {
        ...metrics,
        totalProfit,
        netMargin: netMargin.toFixed(2) + "%",
        orderCount: orders.length
      }
    };
  } catch (error) {
    return { success: false, error: "Failed to calculate financials" };
  }
}
