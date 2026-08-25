import { PageHeader } from "@/components/PageHeader";

export default function Dashboard() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Dashboard" />
      <div className="p-6 space-y-6 flex-1 bg-background">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card border border-border p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground">Total Houses</h3>
            <p className="text-3xl font-bold mt-1 text-primary">7</p>
          </div>
          <div className="bg-card border border-border p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground">Total Students</h3>
            <p className="text-3xl font-bold mt-1 text-primary">120</p>
          </div>
          <div className="bg-card border border-border p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground">Sports</h3>
            <p className="text-3xl font-bold mt-1 text-primary">6</p>
          </div>
          <div className="bg-card border border-border p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground">Auction Status</h3>
            <p className="text-xl font-bold mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Not Started
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-foreground">House Overview</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between items-center border-b border-border pb-2 last:border-0 last:pb-0">
                  <span className="font-medium">House {String.fromCharCode(64 + i)}</span>
                  <span className="text-muted-foreground">Budget: ₹10,000</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-card border border-border p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-foreground">Upcoming Matches</h2>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex flex-col border-b border-border pb-2 last:border-0 last:pb-0">
                  <span className="font-medium text-sm text-muted-foreground">Cricket</span>
                  <span className="font-semibold">House {String.fromCharCode(64 + i)} vs House {String.fromCharCode(65 + i)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-foreground">Recent Auction Activity</h2>
          <div className="text-center py-8 text-muted-foreground">
            No activity yet. Auction has not started.
          </div>
        </div>
      </div>
    </div>
  );
}
