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
      <div className="p-6 space-y-6 flex-1 bg-background">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {houses.map((house) => (
            <div key={house.name} className="bg-card border border-border rounded-lg shadow-sm overflow-hidden flex flex-col">
              <div className={`h-3 w-full ${house.color}`} />
              <div className="p-5 flex-1">
                <h2 className="text-xl font-bold mb-4">{house.name}</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Remaining Budget</span>
                    <span className="font-bold text-lg text-primary">₹{house.budget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Players</span>
                    <span className="font-semibold">{house.players}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Avg Rating</span>
                    <span className="font-semibold">{house.rating}</span>
                  </div>
                </div>
              </div>
              <div className="bg-muted px-5 py-3 border-t border-border">
                <button className="text-primary font-medium hover:underline w-full text-center text-sm">
                  View Roster
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
