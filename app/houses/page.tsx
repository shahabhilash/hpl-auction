export const dynamic = 'force-dynamic';

import { PageHeader } from "@/components/PageHeader";
import { createClient } from "@/utils/supabase/server";

export default async function Houses() {
  const supabase = createClient();
  
  // 1. Fetch real budgets from the houses table
  const { data: dbHouses } = await supabase.from('houses').select('*');
  
  // 2. Fetch all sold students to calculate how many players each house has
  const { data: students } = await supabase.from('students').select('house_id').eq('status', 'Sold');
  
  const playerCounts = students?.reduce((acc: any, curr) => {
    if (curr.house_id) {
      acc[curr.house_id] = (acc[curr.house_id] || 0) + 1;
    }
    return acc;
  }, {});

  const staticHouses = [
    { id: "tons", name: "Tons Tigers", color: "bg-orange-500" },
    { id: "shimsha", name: "Shimsha Panther", color: "bg-sky-500" },
    { id: "orsang", name: "Orsang Leopards", color: "bg-blue-800" },
    { id: "ken", name: "Ken Cheetas", color: "bg-red-500" },
    { id: "kabini", name: "Kabini Lynx", color: "bg-purple-500" },
    { id: "harangi", name: "Harangi Jaguars", color: "bg-green-500" },
    { id: "arkavati", name: "Arkavati Lions", color: "bg-yellow-500" },
  ];

  const houses = staticHouses.map(sh => {
    const dbHouse = dbHouses?.find(h => h.id === sh.id);
    return {
      ...sh,
      budget: dbHouse ? dbHouse.budget : 0,
      players: playerCounts && playerCounts[sh.id] ? playerCounts[sh.id] : 0
    }
  });

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Houses Dashboard" />
      <div className="p-6 space-y-8 flex-1 bg-background">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {houses.map((house) => (
            <div key={house.id} className="bg-card border border-border/50 relative overflow-hidden flex flex-col group transition-all hover:border-border">
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
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Players Owned</span>
                    <span className="font-bold text-lg">{house.players}</span>
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
