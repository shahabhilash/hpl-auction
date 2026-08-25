import { PageHeader } from "@/components/PageHeader";

export default function Matches() {
  const matches = [
    { id: 1, sport: "Cricket", teams: "House A vs House B", status: "Upcoming", date: "Oct 15, 2026" },
    { id: 2, sport: "Basketball", teams: "House C vs House D", status: "Upcoming", date: "Oct 16, 2026" },
    { id: 3, sport: "Chess", teams: "Rahul vs Amit", status: "Upcoming", date: "Oct 16, 2026" },
    { id: 4, sport: "Badminton", teams: "House E vs House F", status: "Completed", date: "Oct 10, 2026", result: "House E won" },
  ];

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Matches" />
      <div className="p-6 flex-1 bg-background">
        <div className="max-w-4xl mx-auto space-y-4">
          {matches.map((match) => (
            <div key={match.id} className="bg-card border border-border rounded-lg shadow-sm p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">{match.sport}</span>
                <h3 className="text-xl font-bold mt-1">{match.teams}</h3>
                <p className="text-muted-foreground text-sm mt-1">{match.date}</p>
              </div>
              <div className="flex flex-col md:items-end gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  match.status === 'Upcoming' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                }`}>
                  {match.status}
                </span>
                {match.result && (
                  <span className="text-sm font-medium">{match.result}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
