import { PageHeader } from "@/components/PageHeader";

export default function Sports() {
  const sports = [
    { name: "Cricket", type: "Team", participants: 42, status: "Active" },
    { name: "Basketball", type: "Team", participants: 28, status: "Active" },
    { name: "Badminton", type: "Individual/Doubles", participants: 36, status: "Active" },
    { name: "Chess", type: "Individual", participants: 15, status: "Active" },
    { name: "Table Tennis", type: "Individual/Doubles", participants: 24, status: "Active" },
  ];

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Sports Registry" />
      <div className="p-6 space-y-6 flex-1 bg-background">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {sports.map((sport) => (
            <div key={sport.name} className="bg-card border border-border/50 p-6 clip-angled relative group hover:border-primary/50 transition-colors">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors"></div>
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-display font-black uppercase tracking-widest text-foreground">{sport.name}</h2>
                <span className="text-xs px-3 py-1 bg-accent/10 text-accent border border-accent/30 font-bold uppercase tracking-widest clip-diagonal">
                  {sport.status}
                </span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm bg-background p-3 border border-border/50 clip-angled">
                  <span className="font-bold text-muted-foreground uppercase tracking-widest">Type</span>
                  <span className="font-bold text-primary uppercase tracking-wider">{sport.type}</span>
                </div>
                <div className="flex justify-between text-sm bg-background p-3 border border-border/50 clip-angled">
                  <span className="font-bold text-muted-foreground uppercase tracking-widest">Registered</span>
                  <span className="font-display font-bold text-xl">{sport.participants}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
