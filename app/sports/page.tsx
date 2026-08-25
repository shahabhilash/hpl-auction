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
      <PageHeader title="Sports" />
      <div className="p-6 space-y-6 flex-1 bg-background">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sports.map((sport) => (
            <div key={sport.name} className="bg-card border border-border rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">{sport.name}</h2>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full font-medium">
                  {sport.status}
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium">{sport.type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Registered Players</span>
                  <span className="font-medium">{sport.participants}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
