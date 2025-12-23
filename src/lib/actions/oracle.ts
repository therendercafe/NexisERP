"use server";

import OpenAI from "openai";
import prisma from "@/lib/prisma";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getEnterpriseContext() {
  try {
    const [skus, orders, clients, auditLogs, orderItems, clientOrders] = await Promise.all([
      prisma.sKU.findMany({
        select: { name: true, quantity: true, sellPrice: true, costPrice: true, code: true }
      }),
      prisma.order.findMany({
        take: 100,
        orderBy: { createdAt: 'desc' },
        select: { totalSales: true, totalCost: true, status: true, customerName: true, createdAt: true, customerEmail: true }
      }),
      prisma.client.count(),
      prisma.auditLog.findMany({
        take: 15,
        orderBy: { createdAt: 'desc' },
        select: { action: true, entityType: true, metadata: true, createdAt: true }
      }),
      prisma.orderItem.findMany({
        take: 200,
        include: { sku: true }
      }),
      prisma.order.groupBy({
        by: ['customerEmail'],
        _max: { createdAt: true },
        _count: { id: true }
      })
    ]);

    // Calculate real business metrics
    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalSales), 0);
    const totalCosts = orders.reduce((sum, o) => sum + Number(o.totalCost), 0);
    const netProfit = totalRevenue - totalCosts;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
    
    const lowStockItems = skus.filter(s => s.quantity > 0 && s.quantity <= 15).map(s => `${s.name} (Qty: ${s.quantity})`);
    const outOfStock = skus.filter(s => s.quantity === 0).map(s => `${s.name}`);

    // Churn Heuristic: Customers who haven't ordered in 60+ days
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    const inactiveClients = clientOrders.filter(c => c._max.createdAt && new Date(c._max.createdAt) < sixtyDaysAgo);
    const churnRiskList = inactiveClients.slice(0, 5).map(c => `${c.customerEmail} (Last Order: ${c._max.createdAt?.toLocaleDateString()})`);

    // Group sales by SKU for forecasting
    const productPerformance: Record<string, { revenue: number, units: number }> = {};
    orderItems.forEach(item => {
      const name = item.sku.name;
      if (!productPerformance[name]) productPerformance[name] = { revenue: 0, units: 0 };
      productPerformance[name].revenue += (Number(item.unitPrice) * item.quantity);
      productPerformance[name].units += item.quantity;
    });

    const topPerformers = Object.entries(productPerformance)
      .sort(([, a], [, b]) => b.revenue - a.revenue)
      .slice(0, 5)
      .map(([name, stats]) => `${name}: $${stats.revenue.toFixed(2)}`);

    return `
      [CONFIDENTIAL ENTERPRISE DATA REPORT]
      --------------------------------------
      FISCAL PERFORMANCE:
      - Cumulative Revenue (Sample): $${totalRevenue.toLocaleString()}
      - Net Profit: $${netProfit.toLocaleString()}
      - Operating Margin: ${profitMargin.toFixed(1)}%
      
      INVENTORY & STOCK:
      - Total SKUs: ${skus.length}
      - Out of Stock: ${outOfStock.length} items (${outOfStock.slice(0, 5).join(", ")}...)
      - Low Stock Critical: ${lowStockItems.slice(0, 5).join(", ")}
      
      CHURN & RETENTION:
      - Total Entities: ${clients}
      - Inactive Entities (>60 days): ${inactiveClients.length}
      - High Risk Churn Samples: ${churnRiskList.join(", ") || "None detected"}
      
      PRODUCT PERFORMANCE:
      - Top Revenue Drivers: ${topPerformers.join(", ")}
      
      RECENT ACTIVITY:
      ${auditLogs.map(l => `- ${l.action} on ${l.entityType}`).join("\n")}
      --------------------------------------
    `;
  } catch (error) {
    console.error("Context Generation Error:", error);
    return "FATAL: Enterprise data stream corrupted.";
  }
}

export async function runOracleAudit(query: string) {
  if (!process.env.OPENAI_API_KEY) {
    return {
      content: "AI Oracle Error: OPENAI_API_KEY is not configured.",
      type: "error"
    };
  }

  const dataReport = await getEnterpriseContext();

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are NEXIS AI Oracle, an elite autonomous Auditor integrated into a live ERP. 
          
          MANDATORY OPERATIONAL DIRECTIVE:
          You must analyze the SPECIFIC data in the [CONFIDENTIAL ENTERPRISE DATA REPORT] provided below.
          Base your entire response on these numbers. If the user asks for churn, look at the CHURN & RETENTION section. 
          If they ask for forecasting, look at FISCAL and INVENTORY.

          ${dataReport}

          CRITICAL FORMATTING:
          1. Use DOUBLE NEWLINES (\n\n) between paragraphs.
          2. Use **Bold Headers** for sections.
          3. If the user asks for a FORECAST or STOCK report, provide a Markdown table.
          4. If the user asks for CHURN, provide a prioritized risk list with specific emails/names from the report.
          5. Finish with a "So What?" strategic impact section.
          
          TONE: 
          Professional, sharp, and highly technical. Do not give general advice. Be specific to the data provided.`
        },
        {
          role: "user",
          content: query
        },
      ],
      temperature: 0.2,
      max_tokens: 1200,
    });

    const content = response.choices[0].message.content || "Audit failed to materialize.";
    
    // Simple heuristic to detect category for UI badges
    let type = "general";
    if (content.toLowerCase().includes("revenue")) type = "revenue";
    else if (content.toLowerCase().includes("churn")) type = "churn";
    else if (content.toLowerCase().includes("inventory")) type = "inventory";

    return { content, type };
  } catch (error) {
    console.error("Oracle Audit Error:", error);
    return {
      content: "Neural link interrupted. The Oracle is currently offline or experiencing high latency.",
      type: "error"
    };
  }
}

