import { DollarSign, Ticket, Image as ImageIcon, MapPin, BarChart3, Clock } from "lucide-react";

export default function VendorDashboard() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Your Vendor Dashboard</h2>
        <div className="flex items-center space-x-2">
          {/* Calendar placeholder */}
          <div className="text-sm text-muted-foreground border p-2 rounded-md">
            All Time
          </div>
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow rounded-md px-4 py-2 text-sm font-medium">
            Create Event
          </button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Revenue (Your cut)</h3>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Tickets Sold</h3>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">+180 from last month</p>
          </div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Upcoming Events</h3>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">3 happening this week</p>
          </div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Active Venues</h3>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Locations globally</p>
          </div>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 pt-4">
        <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow">
          <div className="flex flex-col space-y-1.5 p-6 border-b">
            <h3 className="font-semibold leading-none tracking-tight">Recent Sales Performance</h3>
          </div>
          <div className="p-6 pt-0 h-[350px] flex items-center justify-center text-muted-foreground">
            {/* Chart placeholder */}
            [Bar Chart: Ticket Sales Over Time]
          </div>
        </div>
        
        <div className="col-span-3 rounded-xl border bg-card text-card-foreground shadow">
          <div className="flex flex-col space-y-1.5 p-6 border-b">
            <h3 className="font-semibold leading-none tracking-tight">Recent Bookings / Orders</h3>
            <p className="text-sm text-muted-foreground">252 Sales this month.</p>
          </div>
          <div className="p-6 pt-6">
            <div className="space-y-8">
              {/* List placeholder */}
              <div className="flex items-center">
                <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                  U
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Olivia Martin</p>
                  <p className="text-sm text-muted-foreground">olivia.martin@email.com</p>
                </div>
                <div className="ml-auto font-medium">+$45.00</div>
              </div>
              <div className="flex items-center">
                <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                  J
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Jackson Lee</p>
                  <p className="text-sm text-muted-foreground">jackson.lee@email.com</p>
                </div>
                <div className="ml-auto font-medium">+$215.00</div>
              </div>
              <div className="flex items-center">
                <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                  I
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Isabella Nguyen</p>
                  <p className="text-sm text-muted-foreground">isabella.nguyen@email.com</p>
                </div>
                <div className="ml-auto font-medium">+$120.00</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
