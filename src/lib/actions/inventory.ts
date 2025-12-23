"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createProduct(data: any) {
  try {
    const product = await prisma.sKU.create({
      data: {
        name: data.name,
        description: data.description,
        code: data.code,
        quantity: parseInt(data.quantity),
        costPrice: parseFloat(data.costPrice),
        sellPrice: parseFloat(data.sellPrice),
      },
    });

    // Audit Log for Creation
    await prisma.auditLog.create({
      data: {
        userId: "system",
        action: "PRODUCT_CREATE",
        entityType: "SKU",
        entityId: product.id,
        metadata: { product },
      }
    });

    revalidatePath("/dashboard/inventory");
    revalidatePath("/dashboard");
    return { success: true, data: product };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: "SKU Code already exists" };
    }
    return { success: false, error: "Failed to create product" };
  }
}

export async function getInventory(
  page: number = 1, 
  pageSize: number = 50,
  search?: string,
  sortBy: string = 'createdAt',
  order: 'asc' | 'desc' = 'desc'
) {
  try {
    const skip = (page - 1) * pageSize;
    
    const where = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ],
    } : {};

    // Map business sort keys to DB columns
    const sortMapping: any = {
      'product': 'name',
      'sku': 'code',
      'quantity': 'quantity',
      'retail': 'sellPrice',
      'cost': 'costPrice',
      'margin': 'sellPrice',
      'created': 'createdAt'
    };

    const orderByField = sortMapping[sortBy] || sortBy;

    const [skus, total] = await Promise.all([
      // @ts-ignore
      prisma.sKU.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { [orderByField]: order },
      }),
      // @ts-ignore
      prisma.sKU.count({ where })
    ]);

    return { 
      success: true, 
      data: skus,
      pagination: {
        total,
        pageCount: Math.ceil(total / pageSize),
        currentPage: page,
        pageSize
      }
    };
  } catch (error) {
    return { success: false, error: "Failed to fetch inventory" };
  }
}

export async function updateProduct(id: string, data: any) {
  try {
    const oldProduct = await prisma.sKU.findUnique({ where: { id } });
    
    const updated = await prisma.sKU.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        quantity: parseInt(data.quantity),
        costPrice: parseFloat(data.costPrice),
        sellPrice: parseFloat(data.sellPrice),
        code: data.code,
      },
    });
    
    await prisma.auditLog.create({
      data: {
        userId: "system",
        action: "PRODUCT_UPDATE",
        entityType: "SKU",
        entityId: id,
        metadata: {
          before: oldProduct,
          after: updated
        },
      }
    });

    revalidatePath("/dashboard/inventory");
    revalidatePath("/dashboard");
    return { success: true, data: updated };
  } catch (error) {
    return { success: false, error: "Failed to update product" };
  }
}

export async function updateStock(id: string, newQuantity: number) {
  try {
    const updated = await prisma.sKU.update({
      where: { id },
      data: { quantity: newQuantity },
    });
    
    await prisma.auditLog.create({
      data: {
        userId: "system",
        action: "STOCK_UPDATE",
        entityType: "SKU",
        entityId: id,
        metadata: { newQuantity },
      }
    });

    revalidatePath("/dashboard/inventory");
    return { success: true, data: updated };
  } catch (error) {
    return { success: false, error: "Failed to update stock" };
  }
}
