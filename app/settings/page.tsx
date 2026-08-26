import { PageHeader } from "@/components/PageHeader";

export default function Settings() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Tournament Settings" />
      <div className="p-6 flex-1 bg-background">
        <div className="max-w-3xl mx-auto space-y-8">
          
          <div className="bg-card border border-border/50 p-8 relative clip-angled">
            <h2 className="text-3xl font-display font-black mb-6 uppercase tracking-widest text-primary">Configuration</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest">Tournament Name</label>
                <input 
                  type="text" 
                  defaultValue="Hostel Premier League 2026"
                  className="w-full px-4 py-3 border-2 border-border/50 bg-background text-foreground font-bold focus:outline-none focus:border-primary transition-colors clip-diagonal"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest">Base Budget per House</label>
                <input 
                  type="number" 
                  defaultValue={10000}
                  className="w-full px-4 py-3 border-2 border-border/50 bg-background text-foreground font-bold font-mono focus:outline-none focus:border-primary transition-colors clip-diagonal"
                />
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button className="bg-primary hover:bg-primary/80 text-white font-bold uppercase tracking-widest py-3 px-8 transition-colors clip-angled">
                Save Changes
              </button>
            </div>
          </div>

          <div className="bg-card border border-red-500/30 p-8 relative clip-angled">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-600"></div>
            <h2 className="text-3xl font-display font-black mb-2 uppercase tracking-widest text-red-500">Danger Zone</h2>
            <p className="text-sm mb-6 text-muted-foreground font-medium uppercase tracking-wide">These actions are destructive and cannot be undone.</p>
            <div className="space-y-4">
              <button className="w-full text-left px-6 py-4 border-2 border-red-500/20 bg-red-500/5 text-red-500 font-bold uppercase tracking-wider hover:bg-red-500/10 hover:border-red-500/50 transition-all clip-diagonal">
                Reset All Auction Data
              </button>
              <button className="w-full text-left px-6 py-4 border-2 border-red-500/20 bg-red-500/5 text-red-500 font-bold uppercase tracking-wider hover:bg-red-500/10 hover:border-red-500/50 transition-all clip-diagonal">
                Delete Tournament
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
