"use server";

import prisma from "@/lib/prisma";

export async function getAuditLogs(params: {
  page?: number;
  pageSize?: number;
  action?: string;
  startDate?: string;
  endDate?: string;
}) {
  const { 
    page = 1, 
    pageSize = 50, 
    action, 
    startDate, 
    endDate 
  } = params;

  try {
    const skip = (page - 1) * pageSize;
    
    // Build where clause
    const where: any = {};
    
    if (action && action !== "ALL") {
      where.action = action;
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

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              role: true,
              email: true,
            }
          }
        }
      }),
      prisma.auditLog.count({ where })
    ]);

    return { 
      success: true, 
      data: logs,
      pagination: {
        total,
        pageCount: Math.ceil(total / pageSize),
        currentPage: page,
        pageSize
      }
    };
  } catch (error) {
    console.error("Audit log fetch error:", error);
    return { success: false, error: "Failed to fetch audit logs" };
  }
}

export async function getAuditActions() {
  try {
    const actions = await prisma.auditLog.findMany({
      select: { action: true },
      distinct: ['action'],
    });
    return { success: true, data: actions.map(a => a.action) };
  } catch (error) {
    return { success: false, error: "Failed to fetch actions" };
  }
}
