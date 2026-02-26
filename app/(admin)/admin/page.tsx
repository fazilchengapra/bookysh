import { Activity, CreditCard, DollarSign, Users } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">System Global Dashboard</h2>
        <div className="flex items-center space-x-2">
          {/* Calendar placeholder */}
          <div className="text-sm text-muted-foreground border p-2 rounded-md">
            All Time
          </div>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Revenue</h3>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">$1,234,456.89</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Platform Vendors</h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">+180 new merchants</p>
          </div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Active Bookings</h3>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
          </div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Active Events</h3>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">+201 since last hour</p>
          </div>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 pt-4">
        <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="font-semibold leading-none tracking-tight">System Revenue Overview</h3>
          </div>
          <div className="p-6 pt-0 h-[350px] flex items-center justify-center text-muted-foreground">
            {/* Chart placeholder */}
            [Chart Area: Recharts Integration]
          </div>
        </div>
        <div className="col-span-3 rounded-xl border bg-card text-card-foreground shadow">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="font-semibold leading-none tracking-tight">Recent Onboarded Vendors</h3>
            <p className="text-sm text-muted-foreground">You have 15 new pending vendors for approval.</p>
          </div>
          <div className="p-6 pt-0">
            <div className="space-y-8">
              {/* List placeholder */}
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">AMC Theatres</p>
                  <p className="text-sm text-muted-foreground">contact@amc.com</p>
                </div>
                <div className="ml-auto font-medium text-emerald-500">Approved</div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Global Sports Arena</p>
                  <p className="text-sm text-muted-foreground">info@globalsports.com</p>
                </div>
                <div className="ml-auto font-medium text-amber-500">Pending Review</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
