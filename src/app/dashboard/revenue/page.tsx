import { getRevenueAnalytics } from "@/lib/actions/dashboard";
import RevenueContent from "@/components/dashboard/revenue-content";

export const dynamic = "force-dynamic";

export default async function RevenuePage({ 
  searchParams 
}: { 
  searchParams: { 
    from?: string; 
    to?: string; 
    page?: string;
    sortBy?: string;
    order?: string;
  } 
}) {
  const page = parseInt(searchParams.page || "1");
  const sortBy = searchParams.sortBy || "createdAt";
  const order = (searchParams.order as "asc" | "desc") || "desc";

  const result = await getRevenueAnalytics(
    searchParams.from, 
    searchParams.to, 
    page, 
    15,
    sortBy,
    order
  );
  
  if (!result.success || !result.data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-black uppercase text-primary mb-4">Matrix Sync Failure</h2>
          <p className="text-muted-foreground font-bold italic">Unable to fetch revenue intelligence. Please verify database connectivity.</p>
        </div>
      </div>
    );
  }

  return (
    <RevenueContent 
      data={result.data} 
      searchParams={searchParams}
    />
  );
}
