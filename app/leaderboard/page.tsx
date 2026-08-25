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
        <div className="max-w-4xl mx-auto bg-card border border-border rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted border-b border-border text-muted-foreground uppercase text-xs font-semibold tracking-wider">
                  <th className="px-6 py-4">Rank</th>
                  <th className="px-6 py-4">House</th>
                  <th className="px-6 py-4 text-center">Matches</th>
                  <th className="px-6 py-4 text-center">Wins</th>
                  <th className="px-6 py-4 text-center">Losses</th>
                  <th className="px-6 py-4 text-right">Points</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((row) => (
                  <tr key={row.house} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="px-6 py-4 font-bold">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                        row.rank === 1 ? 'bg-yellow-100 text-yellow-700' : 
                        row.rank === 2 ? 'bg-gray-200 text-gray-700' : 
                        row.rank === 3 ? 'bg-orange-100 text-orange-700' : 'text-muted-foreground'
                      }`}>
                        {row.rank}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-lg">{row.house}</td>
                    <td className="px-6 py-4 text-center text-muted-foreground">{row.matches}</td>
                    <td className="px-6 py-4 text-center text-green-600 font-medium">{row.wins}</td>
                    <td className="px-6 py-4 text-center text-red-600 font-medium">{row.losses}</td>
                    <td className="px-6 py-4 text-right font-black text-xl text-primary">{row.points}</td>
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
