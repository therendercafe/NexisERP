"use server";

import prisma from "@/lib/prisma";

export async function getDashboardStats(startDate?: string, endDate?: string) {
  try {
    const dateQuery: any = {};
    if (startDate) dateQuery.gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      dateQuery.lte = end;
    }

    const [skus, orders, clients] = await Promise.all([
      prisma.sKU.findMany({
        select: { quantity: true, sellPrice: true, costPrice: true }
      }),
      prisma.order.findMany({
        where: Object.keys(dateQuery).length > 0 ? { createdAt: dateQuery } : {},
        select: { totalSales: true, totalCost: true, createdAt: true, customerName: true, status: true, id: true },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.client.count()
    ]);

    const activeSKUs = skus.length;
    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalSales), 0);
    const totalCost = orders.reduce((sum, o) => sum + Number(o.totalCost), 0);
    const grossMargin = totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue) * 100 : 0;
    
    // Last 30 days orders for trend
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    const recentOrders = orders.filter(o => o.createdAt >= monthAgo);
    
    // Revenue by weekday for the main chart
    const weekdayMap: any = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
    orders.slice(0, 50).forEach(o => {
      const day = new Date(o.createdAt).toLocaleDateString(undefined, { weekday: 'short' });
      weekdayMap[day] += Number(o.totalSales);
    });

    const revenueByDay = Object.keys(weekdayMap).map(day => ({
      name: day,
      revenue: weekdayMap[day]
    }));

    const lowStockCount = skus.filter(s => s.quantity > 0 && s.quantity <= 15).length;
    const outOfStockCount = skus.filter(s => s.quantity === 0).length;
    const healthyCount = activeSKUs - lowStockCount - outOfStockCount;

    return {
      success: true,
      data: {
        totalRevenue,
        activeSKUs,
        newOrders: recentOrders.length,
        grossMargin: Math.round(grossMargin),
        totalClients: clients,
        avgOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
        velocity: {
          healthy: healthyCount,
          lowStock: lowStockCount,
          outOfStock: outOfStockCount
        },
        revenueByDay,
        filteredOrders: orders.slice(0, 20).map(o => ({
          id: o.id,
          customerName: (o as any).customerName,
          totalSales: Number(o.totalSales),
          totalCost: Number(o.totalCost),
          createdAt: o.createdAt,
          status: (o as any).status
        }))
      }
    };
  } catch (error) {
    console.error("Dashboard fetch error:", error);
    return { success: false, error: "Matrix Sync Failure" };
  }
}

export async function getRevenueAnalytics(
  startDate?: string, 
  endDate?: string, 
  page = 1, 
  pageSize = 15,
  sortBy: string = 'createdAt',
  order: 'asc' | 'desc' = 'desc'
) {
  try {
    const dateQuery: any = {};
    if (startDate) dateQuery.gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      dateQuery.lte = end;
    }

    // Map business sort keys to DB columns
    const sortMapping: any = {
      'timestamp': 'createdAt',
      'reference': 'id',
      'entity': 'customerName',
      'revenue': 'totalSales',
      'profit': 'totalSales' // Defaulting to totalSales for profit sorting if not using raw SQL
    };

    const orderByField = sortMapping[sortBy] || sortBy;

    const [allOrders, paginatedOrders, totalOrdersCount] = await Promise.all([
      prisma.order.findMany({
        where: Object.keys(dateQuery).length > 0 ? { createdAt: dateQuery } : {},
        include: { items: { include: { sku: true } } }
      }),
      prisma.order.findMany({
        where: Object.keys(dateQuery).length > 0 ? { createdAt: dateQuery } : {},
        include: { items: { include: { sku: true } } },
        orderBy: { [orderByField]: order },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.order.count({
        where: Object.keys(dateQuery).length > 0 ? { createdAt: dateQuery } : {},
      })
    ]);

    // Grouping by "Simplified Category"
    const categoryPerformance = allOrders.flatMap(o => o.items).reduce((acc: any, item: any) => {
      const nameParts = item.sku.name.split(' ');
      const cat = nameParts[0]; 
      if (!acc[cat]) acc[cat] = { name: cat, value: 0 };
      acc[cat].value += Number(item.unitPrice) * item.quantity;
      return acc;
    }, {});

    const monthlyRevenue = allOrders.reduce((acc: any, o) => {
      const date = new Date(o.createdAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const display = date.toLocaleString('default', { month: 'short' });
      
      if (!acc[key]) acc[key] = { sortKey: key, name: display, revenue: 0, profit: 0 };
      acc[key].revenue += Number(o.totalSales);
      acc[key].profit += Number(o.totalSales) - Number(o.totalCost);
      return acc;
    }, {});

    const sortedMonthly = Object.values(monthlyRevenue).sort((a: any, b: any) => a.sortKey.localeCompare(b.sortKey));

    return {
      success: true,
      data: {
        categories: Object.values(categoryPerformance).sort((a: any, b: any) => b.value - a.value).slice(0, 5),
        monthly: sortedMonthly,
        transactions: paginatedOrders.map(o => ({
          ...o,
          totalSales: Number(o.totalSales),
          totalCost: Number(o.totalCost),
          items: o.items.map(item => ({
            ...item,
            unitPrice: Number(item.unitPrice),
            unitCost: Number(item.unitCost),
          }))
        })),
        pagination: {
          total: totalOrdersCount,
          pages: Math.ceil(totalOrdersCount / pageSize),
          currentPage: page
        },
        summary: {
          totalRevenue: allOrders.reduce((s, o) => s + Number(o.totalSales), 0),
          totalProfit: allOrders.reduce((s, o) => s + (Number(o.totalSales) - Number(o.totalCost)), 0),
          avgOrderValue: allOrders.length > 0 ? allOrders.reduce((s, o) => s + Number(o.totalSales), 0) / allOrders.length : 0
        }
      }
    };
  } catch (error) {
    console.error("Revenue analytics error:", error);
    return { success: false, error: "Failed to fetch analytics" };
  }
}
