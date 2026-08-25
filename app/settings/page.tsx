import { PageHeader } from "@/components/PageHeader";

export default function Settings() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Settings" />
      <div className="p-6 flex-1 bg-background">
        <div className="max-w-2xl mx-auto space-y-6">
          
          <div className="bg-card border border-border rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Tournament Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Tournament Name</label>
                <input 
                  type="text" 
                  defaultValue="Hostel Premier League 2026"
                  className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Base Budget per House</label>
                <input 
                  type="number" 
                  defaultValue={10000}
                  className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="bg-primary hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors">
                Save Changes
              </button>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg shadow-sm p-6 text-red-600">
            <h2 className="text-xl font-bold mb-4">Danger Zone</h2>
            <p className="text-sm mb-4 text-muted-foreground">These actions are destructive and cannot be undone.</p>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 border border-red-200 bg-red-50 dark:bg-red-950/20 rounded-md font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
                Reset All Auction Data
              </button>
              <button className="w-full text-left px-4 py-3 border border-red-200 bg-red-50 dark:bg-red-950/20 rounded-md font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
                Delete Tournament
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
