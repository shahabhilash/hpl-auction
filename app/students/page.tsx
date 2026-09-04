export const dynamic = 'force-dynamic';

import { PageHeader } from "@/components/PageHeader";
import { createClient } from "@/utils/supabase/server";

export default async function Students() {
  const supabase = createClient();
  
  // Fetch all auction groups
  const { data: groups } = await supabase
    .from('auction_groups')
    .select('*')
    .order('group_id');
    
  // Helper to extract players from all groups
  const extractPlayers = (group: any) => {
    const players = [];
    for (let i = 1; i <= 7; i++) {
      if (group[`player_${i}`]) {
        players.push({
          id: `${group.id}-${i}`, 
          name: group[`player_${i}`],
          roll_no: group[`reg_no_${i}`],
          sports: [group.sport].filter(Boolean),
          status: group.sold_status || 'Available',
          house_id: group.sold_to_house,
          group_id: group.group_id
        });
      }
    }
    return players;
  };

  // Extract, sort alphabetically by name
  const studentsList = groups?.flatMap(extractPlayers).sort((a, b) => a.name.localeCompare(b.name)) || [];

  const getHouseColor = (houseId: string | null) => {
    switch (houseId) {
      case 'tons-tigers': return 'bg-orange-500/10 hover:bg-orange-500/20';
      case 'shimsha-panther': return 'bg-sky-400/10 hover:bg-sky-400/20';
      case 'orsang-leopards': return 'bg-blue-900/30 hover:bg-blue-900/50';
      case 'ken-cheetas': return 'bg-red-500/10 hover:bg-red-500/20';
      case 'kabini-lynx': return 'bg-purple-500/10 hover:bg-purple-500/20';
      case 'harangi-jaguars': return 'bg-green-500/10 hover:bg-green-500/20';
      case 'arkavati-lions': return 'bg-yellow-500/10 hover:bg-yellow-500/20';
      default: return 'hover:bg-muted/40';
    }
  };

  // Format house name from ID (e.g. 'tons-tigers' -> 'TONS TIGERS')
  const formatHouseName = (houseId: string | null) => {
    if (!houseId) return 'UNASSIGNED';
    return houseId.replace(/-/g, ' ').toUpperCase();
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Students Database" />
      <div className="p-6 space-y-6 flex-1 bg-background">
        {/* Filters (UI only - requires Client Component conversion for full interactivity) */}
        <div className="flex flex-col md:flex-row justify-between gap-4 opacity-50 pointer-events-none">
          <input 
            type="text" 
            placeholder="SEARCH STUDENTS... (COMING SOON)" 
            className="px-4 py-3 border-2 border-border/50 rounded-none bg-card text-foreground font-bold tracking-wider uppercase text-sm focus:outline-none focus:border-primary transition-colors w-full md:w-80"
          />
          <div className="flex gap-2">
            <select className="px-4 py-3 border-2 border-border/50 rounded-none bg-card text-foreground font-bold tracking-wider uppercase text-sm focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer">
              <option>ALL SPORTS</option>
            </select>
            <select className="px-4 py-3 border-2 border-border/50 rounded-none bg-card text-foreground font-bold tracking-wider uppercase text-sm focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer">
              <option>ALL HOUSES</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-card border border-border/50 relative overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/80 border-b border-border/50">
                  <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-widest text-xs">Name</th>
                  <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-widest text-xs">Reg No</th>
                  <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-widest text-xs">Group</th>
                  <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-widest text-xs">Sports</th>
                  <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-widest text-xs">House</th>
                  <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-widest text-xs">Status</th>
                </tr>
              </thead>
              <tbody>
                {studentsList.map((student) => (
                  <tr key={student.id} className={`border-b border-border/30 last:border-0 transition-colors group ${getHouseColor(student.house_id)}`}>
                    <td className="px-6 py-4 font-bold text-foreground text-lg">{student.name}</td>
                    <td className="px-6 py-4 font-mono text-muted-foreground">{student.roll_no}</td>
                    <td className="px-6 py-4 font-bold text-primary">{student.group_id}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {student.sports?.map((s: string) => (
                          <span key={s} className="bg-muted text-xs px-2 py-1 border border-border/50 font-bold uppercase tracking-wider text-muted-foreground">{s}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider">
                      {formatHouseName(student.house_id)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-3 py-1.5 font-bold uppercase tracking-widest border clip-angled ${student.status === 'Available' ? 'bg-accent/10 text-accent border-accent/50' : 'bg-red-500/10 text-red-500 border-red-500/50'}`}>
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {studentsList.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground font-bold uppercase tracking-widest">
                      No students found in database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
