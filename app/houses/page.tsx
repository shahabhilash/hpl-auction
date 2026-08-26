import { PageHeader } from "@/components/PageHeader";

export default function Houses() {
  const houses = [
    { name: "House A", color: "bg-red-500", budget: 10000, players: 12, rating: 4.1 },
    { name: "House B", color: "bg-blue-500", budget: 8500, players: 14, rating: 3.9 },
    { name: "House C", color: "bg-green-500", budget: 12000, players: 10, rating: 4.3 },
    { name: "House D", color: "bg-yellow-500", budget: 9000, players: 13, rating: 4.0 },
    { name: "House E", color: "bg-purple-500", budget: 11500, players: 11, rating: 4.2 },
    { name: "House F", color: "bg-orange-500", budget: 10500, players: 12, rating: 3.8 },
    { name: "House G", color: "bg-teal-500", budget: 10000, players: 12, rating: 4.1 },
  ];

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Houses" />
      <div className="p-6 space-y-8 flex-1 bg-background">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {houses.map((house) => (
            <div key={house.name} className="bg-card border border-border/50 relative overflow-hidden flex flex-col group transition-all hover:border-border">
              {/* Top Color Accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${house.color} group-hover:h-2 transition-all`}></div>
              
              <div className="p-6 flex-1 mt-2">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-3xl font-display font-black uppercase tracking-wider">{house.name}</h2>
                  <div className={`w-8 h-8 rounded-sm ${house.color} opacity-20 group-hover:opacity-100 transition-opacity clip-diagonal`}></div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-background p-3 border-l-2 border-primary">
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Remaining Budget</span>
                    <span className="font-display font-bold text-2xl text-primary tracking-wider">₹{house.budget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center bg-background p-3 border-l-2 border-transparent group-hover:border-accent transition-colors">
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Players</span>
                    <span className="font-bold text-lg">{house.players}</span>
                  </div>
                  <div className="flex justify-between items-center bg-background p-3 border-l-2 border-transparent group-hover:border-accent transition-colors">
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Avg Rating</span>
                    <span className="font-bold text-lg">{house.rating}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-primary/5 px-6 py-4 border-t border-border/50 hover:bg-primary/10 transition-colors cursor-pointer text-center group-hover:border-primary/50">
                <button className="text-primary font-bold uppercase tracking-widest text-sm w-full transition-transform group-hover:scale-105">
                  View Full Roster
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
