import { PageHeader } from "@/components/PageHeader";

export default function Dashboard() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Dashboard" />
      <div className="p-6 space-y-8 flex-1 bg-background">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card border-l-4 border-l-primary p-6 clip-diagonal relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1 relative z-10">Total Houses</h3>
            <p className="text-5xl font-display font-black text-foreground relative z-10">7</p>
          </div>
          
          <div className="bg-card border-l-4 border-l-accent p-6 clip-diagonal relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1 relative z-10">Total Students</h3>
            <p className="text-5xl font-display font-black text-foreground relative z-10">120</p>
          </div>
          
          <div className="bg-card border-l-4 border-l-orange-500 p-6 clip-diagonal relative group overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1 relative z-10">Sports</h3>
            <p className="text-5xl font-display font-black text-foreground relative z-10">6</p>
          </div>
          
          <div className="bg-card border-l-4 border-l-purple-500 p-6 clip-diagonal relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 relative z-10">Auction Status</h3>
            <div className="relative z-10">
              <span className="text-lg font-bold uppercase tracking-widest px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/50 clip-angled inline-block">
                Not Started
              </span>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="bg-card p-0 clip-angled relative border border-border/50">
            <div className="bg-muted/80 p-4 border-b border-border">
              <h2 className="text-xl font-display font-bold uppercase tracking-wider text-foreground">House Overview</h2>
            </div>
            <div className="p-4 space-y-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-background hover:bg-muted/50 transition-colors border-l-2 border-transparent hover:border-primary">
                  <span className="font-bold text-foreground uppercase tracking-wide">House {String.fromCharCode(64 + i)}</span>
                  <span className="font-display font-bold text-xl text-primary tracking-wider">₹10,000</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card p-0 clip-angled relative border border-border/50">
            <div className="bg-muted/80 p-4 border-b border-border">
              <h2 className="text-xl font-display font-bold uppercase tracking-wider text-foreground">Upcoming Matches</h2>
            </div>
            <div className="p-4 space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="flex flex-col p-4 bg-background border border-border/50 relative overflow-hidden group">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent/80 group-hover:w-2 transition-all"></div>
                  <span className="font-bold text-xs uppercase tracking-widest text-accent mb-1 pl-3">Cricket</span>
                  <span className="font-display font-bold text-2xl pl-3">HOUSE {String.fromCharCode(64 + i)} <span className="text-muted-foreground px-2">VS</span> HOUSE {String.fromCharCode(65 + i)}</span>
                </div>
              ))}
            </div>
          </div>
          
        </div>

        {/* Activity Log */}
        <div className="bg-card p-0 border border-border/50">
          <div className="bg-muted/80 p-4 border-b border-border border-l-4 border-l-primary">
            <h2 className="text-xl font-display font-bold uppercase tracking-wider text-foreground">Recent Auction Activity</h2>
          </div>
          <div className="text-center py-12 text-muted-foreground font-medium tracking-widest uppercase text-sm flex flex-col items-center justify-center">
            <div className="w-16 h-1 bg-muted-foreground/20 mb-4 rounded-full"></div>
            No activity yet. Auction has not started.
          </div>
        </div>
        
      </div>
    </div>
  );
}
