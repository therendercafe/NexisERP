"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getClients(page: number = 1, pageSize: number = 50, search?: string) {
  try {
    const skip = (page - 1) * pageSize;
    const where = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ],
    } : {};

    const [clients, total] = await Promise.all([
      // @ts-ignore
      prisma.client.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          _count: {
            select: { orders: true }
          },
          orders: {
            select: { totalSales: true }
          }
        },
        orderBy: { name: 'asc' },
      }),
      // @ts-ignore
      prisma.client.count({ where })
    ]);

    const clientsWithStats = clients.map((c: any) => {
      const ltv = c.orders.reduce((sum: number, o: any) => sum + Number(o.totalSales), 0);
      return { ...c, ltv };
    });

    return { 
      success: true, 
      data: clientsWithStats,
      pagination: { total, pageCount: Math.ceil(total / pageSize), currentPage: page }
    };
  } catch (error) {
    return { success: false, error: "Failed to fetch clients" };
  }
}

export async function createClient(data: any) {
  try {
    const client = await prisma.client.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: "system",
        action: "CLIENT_CREATE",
        entityType: "CLIENT",
        entityId: client.id,
        metadata: { client },
      }
    });

    revalidatePath("/dashboard/clients");
    return { success: true, data: client };
  } catch (error: any) {
    if (error.code === 'P2002') return { success: false, error: "Email already registered" };
    return { success: false, error: "Failed to create client" };
  }
}

export async function updateClient(id: string, data: any) {
  try {
    const oldClient = await prisma.client.findUnique({ where: { id } });
    const updated = await prisma.client.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: "system",
        action: "CLIENT_UPDATE",
        entityType: "CLIENT",
        entityId: id,
        metadata: { before: oldClient, after: updated },
      }
    });

    revalidatePath("/dashboard/clients");
    return { success: true, data: updated };
  } catch (error) {
    return { success: false, error: "Failed to update client" };
  }
}

export async function searchSKUs(query: string) {
  try {
    const skus = await prisma.sKU.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { code: { contains: query, mode: 'insensitive' } },
        ],
        quantity: { gt: 0 }
      },
      take: 10
    });
    return { success: true, data: skus };
  } catch (error) {
    return { success: false, error: "Failed to search SKUs" };
  }
}

export async function searchClients(query: string) {
  try {
    const clients = await prisma.client.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { phone: { contains: query, mode: 'insensitive' } },
        ]
      },
      take: 5
    });
    return { success: true, data: clients };
  } catch (error) {
    return { success: false, error: "Failed to search clients" };
  }
}

export async function createEnterpriseOrder(data: {
  clientId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: { skuId: string; quantity: number }[];
  userId: string;
}) {
  try {
    return await prisma.$transaction(async (tx) => {
      let totalSales = 0;
      let totalCost = 0;
      const orderItems = [];

      for (const item of data.items) {
        const sku = await tx.sKU.findUnique({ where: { id: item.skuId } });
        if (!sku || sku.quantity < item.quantity) throw new Error(`Insufficient stock for ${sku?.name || 'item'}`);

        const price = Number(sku.sellPrice);
        const cost = Number(sku.costPrice);
        
        totalSales += price * item.quantity;
        totalCost += cost * item.quantity;

        orderItems.push({
          skuId: sku.id,
          quantity: item.quantity,
          unitPrice: price,
          unitCost: cost,
        });

        await tx.sKU.update({
          where: { id: sku.id },
          data: { quantity: { decrement: item.quantity } }
        });
      }

      const order = await tx.order.create({
        data: {
          userId: data.userId,
          clientId: data.clientId,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          totalSales,
          totalCost,
          items: { create: orderItems }
        }
      });

      await tx.auditLog.create({
        data: {
          userId: data.userId,
          action: "ENTERPRISE_ORDER_CREATE",
          entityType: "ORDER",
          entityId: order.id,
          metadata: { totalSales, itemCount: data.items.length }
        }
      });

      revalidatePath("/dashboard");
      revalidatePath("/dashboard/orders");
      revalidatePath("/dashboard/inventory");
      revalidatePath("/dashboard/clients");

      return { success: true, data: order };
    });
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
