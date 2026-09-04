export const dynamic = 'force-dynamic';

import { PageHeader } from "@/components/PageHeader";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { X } from "lucide-react";

export default async function Houses({ searchParams }: { searchParams: { roster?: string, sport?: string } }) {
  const supabase = createClient();
  
  // 1. Fetch real budgets from the houses table
  const { data: dbHouses } = await supabase.from('houses').select('*');
  
  // 2. Fetch all sold auction groups to calculate counts and display roster
  const { data: soldGroups } = await supabase.from('auction_groups')
    .select('*')
    .eq('sold_status', 'Sold')
    .order('sold_amount', { ascending: false });

  // Fetch all groups just to extract unique sports for the modal
  const { data: allGroupsForSports } = await supabase.from('auction_groups').select('sport');
  const allSports = Array.from(new Set(allGroupsForSports?.map(g => g.sport).filter(Boolean))).sort();
  
  // Helper to extract players from a group
  const extractPlayers = (group: any) => {
    const players = [];
    for (let i = 1; i <= 7; i++) {
      if (group[`player_${i}`]) {
        players.push({
          id: `${group.id}-${i}`, // composite id
          name: group[`player_${i}`],
          roll_no: group[`reg_no_${i}`],
          sport: group.sport,
          category: group.category,
          sold_price: group.sold_amount,
          group_id: group.group_id,
          house_id: group.sold_to_house
        });
      }
    }
    return players;
  };

  // 3. Extract all sold players
  const allSoldPlayers = soldGroups?.flatMap(extractPlayers) || [];

  // Calculate player counts per house
  const playerCounts = allSoldPlayers.reduce((acc: any, curr) => {
    if (curr.house_id) {
      acc[curr.house_id] = (acc[curr.house_id] || 0) + 1;
    }
    return acc;
  }, {});

  const staticHouses = [
    { id: "tons-tigers", name: "Tons Tigers", color: "bg-orange-500" },
    { id: "shimsha-panther", name: "Shimsha Panther", color: "bg-sky-500" },
    { id: "orsang-leopards", name: "Orsang Leopards", color: "bg-blue-800" },
    { id: "ken-cheetas", name: "Ken Cheetas", color: "bg-red-500" },
    { id: "kabini-lynx", name: "Kabini Lynx", color: "bg-purple-500" },
    { id: "harangi-jaguars", name: "Harangi Jaguars", color: "bg-green-500" },
    { id: "arkavati-lions", name: "Arkavati Lions", color: "bg-yellow-500" },
  ];

  const houses = staticHouses.map(sh => {
    const dbHouse = dbHouses?.find(h => h.id === sh.id);
    return {
      ...sh,
      budget: dbHouse ? dbHouse.budget : 0,
      players: playerCounts && playerCounts[sh.id] ? playerCounts[sh.id] : 0
    }
  });

  const rosterHouseId = searchParams.roster;
  const selectedHouse = rosterHouseId ? houses.find(h => h.id === rosterHouseId) : null;
  const selectedHouseRoster = selectedHouse ? allSoldPlayers.filter(p => p.house_id === rosterHouseId) : [];

  const playersBySport: Record<string, number> = {};
  allSports.forEach(sport => {
    playersBySport[sport as string] = 0;
  });

  selectedHouseRoster.forEach((player: any) => {
    if (player.sport) {
      playersBySport[player.sport] += 1;
    }
  });

  return (
    <div className="flex flex-col h-full relative">
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
              
              <div className="bg-primary/5 px-6 py-4 border-t border-border/50 hover:bg-primary/10 transition-colors cursor-pointer text-center group-hover:border-primary/50 block">
                <Link href={`/houses?roster=${house.id}`} className="block text-primary font-bold uppercase tracking-widest text-sm w-full transition-transform group-hover:scale-105">
                  View Full Roster
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Roster Modal */}
      {selectedHouse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Link href="/houses" className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="bg-card w-full max-w-3xl border border-border/50 clip-angled relative max-h-[90vh] flex flex-col shadow-2xl z-10">
            <Link href="/houses" className="absolute top-4 right-4 z-50 text-muted-foreground hover:text-foreground transition-colors p-2 bg-background/50 rounded-full hover:bg-muted">
              <X className="w-6 h-6" />
            </Link>
            
            <div className={`p-8 border-b border-border/50 relative overflow-hidden flex justify-between items-center`}>
              <div className={`absolute inset-0 ${selectedHouse.color} opacity-10`}></div>
              <div>
                <h2 className="text-4xl font-display font-black uppercase tracking-widest relative z-10">{selectedHouse.name}</h2>
                <p className="text-sm font-bold tracking-widest uppercase text-muted-foreground mt-2 relative z-10">
                  {selectedHouseRoster.length} Players Registered {searchParams.sport ? `• ${searchParams.sport}` : ''}
                </p>
              </div>
              {searchParams.sport && (
                 <Link href={`/houses?roster=${selectedHouse.id}`} className="bg-background border border-border/50 px-4 py-2 font-bold uppercase tracking-widest text-xs hover:bg-muted transition-colors clip-angled relative z-10">
                   Back to Sports
                 </Link>
              )}
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-background/50">
              {!searchParams.sport ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(playersBySport).map(([sport, count]) => (
                    <Link 
                      key={sport}
                      href={`/houses?roster=${selectedHouse.id}&sport=${encodeURIComponent(sport)}`}
                      className="bg-background border border-border/50 p-6 flex flex-col items-center justify-center gap-2 hover:border-primary/50 group transition-all clip-angled hover:bg-primary/5"
                    >
                      <span className="text-xl font-display font-black uppercase tracking-widest group-hover:text-primary transition-colors text-center">{sport}</span>
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{count as number} {count === 1 ? 'Player' : 'Players'}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedHouseRoster.filter(p => p.sport === searchParams.sport).map((player: any) => (
                    <div key={player.id} className="flex flex-col md:flex-row justify-between md:items-center bg-background border border-border/50 p-4 clip-angled gap-4 hover:border-primary/50 transition-colors">
                      <div className="flex flex-col">
                        <span className="font-bold text-lg text-foreground uppercase tracking-wide">{player.name}</span>
                        <span className="text-xs font-mono text-muted-foreground">{player.roll_no}</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                           <span className="text-[10px] font-bold uppercase border border-border/50 px-2 py-1 tracking-widest text-muted-foreground">
                             Group {player.group_id}
                           </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-center">
                         <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Group Purchased For</span>
                         <span className="font-display font-black text-2xl text-red-500 bg-red-500/10 px-4 py-2 clip-diagonal">₹{player.sold_price}</span>
                      </div>
                    </div>
                  ))}
                  {selectedHouseRoster.filter(p => p.sport === searchParams.sport).length === 0 && (
                     <div className="text-center py-12 text-muted-foreground font-bold uppercase tracking-widest border-2 border-dashed border-border/50 clip-angled">
                        No players purchased for this sport yet.
                     </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );  
}
