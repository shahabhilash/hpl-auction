import { PageHeader } from "@/components/PageHeader";

export default function Students() {
  const students = [
    { id: 1, name: "Rahul Sharma", roll: "2023CS01", rating: 4.3, sports: ["Cricket", "Badminton"], house: "Tons Tigers", status: "Sold" },
    { id: 2, name: "Amit Patel", roll: "2023EE14", rating: 3.9, sports: ["Basketball", "Table Tennis"], house: "Unassigned", status: "Available" },
    { id: 3, name: "Priya Singh", roll: "2024ME05", rating: 4.5, sports: ["Chess", "Badminton"], house: "Orsang Leopards", status: "Sold" },
  ];

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Students Database" />
      <div className="p-6 space-y-6 flex-1 bg-background">
        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <input 
            type="text" 
            placeholder="SEARCH STUDENTS..." 
            className="px-4 py-3 border-2 border-border/50 rounded-none bg-card text-foreground font-bold tracking-wider uppercase text-sm focus:outline-none focus:border-primary transition-colors w-full md:w-80"
          />
          <div className="flex gap-2">
            <select className="px-4 py-3 border-2 border-border/50 rounded-none bg-card text-foreground font-bold tracking-wider uppercase text-sm focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer">
              <option>ALL SPORTS</option>
              <option>CRICKET</option>
              <option>BASKETBALL</option>
            </select>
            <select className="px-4 py-3 border-2 border-border/50 rounded-none bg-card text-foreground font-bold tracking-wider uppercase text-sm focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer">
              <option>ALL HOUSES</option>
              <option>TONS TIGERS</option>
              <option>UNASSIGNED</option>
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
                  <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-widest text-xs">Roll No</th>
                  <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-widest text-xs text-center">Rating</th>
                  <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-widest text-xs">Sports</th>
                  <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-widest text-xs">House</th>
                  <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-widest text-xs">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b border-border/30 last:border-0 hover:bg-muted/40 transition-colors group">
                    <td className="px-6 py-4 font-bold text-foreground text-lg">{student.name}</td>
                    <td className="px-6 py-4 font-mono text-muted-foreground">{student.roll}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-display font-bold text-xl text-primary">{student.rating}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {student.sports.map(s => (
                          <span key={s} className="bg-muted text-xs px-2 py-1 border border-border/50 font-bold uppercase tracking-wider text-muted-foreground">{s}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider">{student.house}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-3 py-1.5 font-bold uppercase tracking-widest border clip-angled ${student.status === 'Available' ? 'bg-accent/10 text-accent border-accent/50' : 'bg-muted text-muted-foreground border-border'}`}>
                        {student.status}
                      </span>
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
