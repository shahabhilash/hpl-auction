import { PageHeader } from "@/components/PageHeader";

export default function Leaderboard() {
  const leaderboard = [
    { rank: 1, house: "House C", matches: 5, wins: 4, losses: 1, points: 12 },
    { rank: 2, house: "House A", matches: 5, wins: 3, losses: 2, points: 9 },
    { rank: 3, house: "House E", matches: 5, wins: 3, losses: 2, points: 9 },
    { rank: 4, house: "House G", matches: 5, wins: 2, losses: 3, points: 6 },
    { rank: 5, house: "House B", matches: 5, wins: 2, losses: 3, points: 6 },
    { rank: 6, house: "House D", matches: 5, wins: 2, losses: 3, points: 6 },
    { rank: 7, house: "House F", matches: 5, wins: 1, losses: 4, points: 3 },
  ];

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Leaderboard" />
      <div className="p-6 flex-1 bg-background">
        <div className="max-w-5xl mx-auto bg-card border border-border/50 relative">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/80 border-b border-border/50 text-muted-foreground uppercase text-xs font-bold tracking-widest">
                  <th className="px-6 py-4 w-16 text-center">Pos</th>
                  <th className="px-6 py-4">House</th>
                  <th className="px-6 py-4 text-center">Played</th>
                  <th className="px-6 py-4 text-center">Won</th>
                  <th className="px-6 py-4 text-center">Lost</th>
                  <th className="px-6 py-4 text-right">Pts</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((row) => (
                  <tr key={row.house} className="border-b border-border/30 last:border-0 hover:bg-muted/40 transition-colors group relative">
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 font-display font-bold text-xl clip-angled ${
                        row.rank === 1 ? 'bg-primary text-white glow-primary scale-110' : 
                        row.rank === 2 ? 'bg-slate-300 text-slate-900' : 
                        row.rank === 3 ? 'bg-orange-700 text-white' : 'bg-muted text-muted-foreground'
                      }`}>
                        {row.rank}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-display font-black text-2xl uppercase tracking-wider group-hover:text-primary transition-colors">{row.house}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-display font-bold text-xl text-muted-foreground">{row.matches}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-display font-bold text-xl text-accent">{row.wins}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-display font-bold text-xl text-red-500">{row.losses}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-display font-black text-3xl text-primary">{row.points}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
