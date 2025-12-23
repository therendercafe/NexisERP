import { getDashboardStats, getRevenueAnalytics } from "@/lib/actions/dashboard";
import { getAuditLogs } from "@/lib/actions/audit";
import DashboardContent from "@/components/dashboard/dashboard-content";

export const dynamic = "force-dynamic";

export default async function DashboardPage({ 
  searchParams 
}: { 
  searchParams: { from?: string; to?: string } 
}) {
  const [dashResult, revResult, auditResult] = await Promise.all([
    getDashboardStats(searchParams.from, searchParams.to),
    getRevenueAnalytics(searchParams.from, searchParams.to),
    getAuditLogs({ 
      page: 1, 
      pageSize: 5, 
      startDate: searchParams.from, 
      endDate: searchParams.to 
    })
  ]);
  
  const data = dashResult.success ? dashResult.data : {
    activeSKUs: 0,
    totalRevenue: 0,
    newOrders: 0,
    grossMargin: 0,
    totalClients: 0,
    avgOrderValue: 0,
    velocity: {
      healthy: 0,
      lowStock: 0,
      outOfStock: 0
    },
    revenueByDay: []
  };

  const analytics = revResult.success ? revResult.data : { categories: [] };
  const recentMutations = auditResult.success ? auditResult.data : [];

  return (
    <DashboardContent 
      data={data} 
      analytics={analytics} 
      recentMutations={recentMutations} 
    />
  );
}
