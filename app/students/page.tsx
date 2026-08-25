import { PageHeader } from "@/components/PageHeader";

export default function Students() {
  const students = [
    { id: 1, name: "Rahul Sharma", roll: "2023CS01", rating: 4.3, sports: ["Cricket", "Badminton"], house: "House A", status: "Sold" },
    { id: 2, name: "Amit Patel", roll: "2023EE14", rating: 3.9, sports: ["Basketball", "Table Tennis"], house: "Unassigned", status: "Available" },
    { id: 3, name: "Priya Singh", roll: "2024ME05", rating: 4.5, sports: ["Chess", "Badminton"], house: "House C", status: "Sold" },
  ];

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Students" />
      <div className="p-6 space-y-6 flex-1 bg-background">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <input 
            type="text" 
            placeholder="Search students..." 
            className="px-4 py-2 border border-border rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary w-full md:w-64"
          />
          <div className="flex gap-2">
            <select className="px-4 py-2 border border-border rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
              <option>All Sports</option>
              <option>Cricket</option>
              <option>Basketball</option>
            </select>
            <select className="px-4 py-2 border border-border rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
              <option>All Houses</option>
              <option>House A</option>
              <option>Unassigned</option>
            </select>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted border-b border-border">
                  <th className="px-4 py-3 font-semibold text-muted-foreground">Name</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground">Roll Number</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground">Rating</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground">Sports</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground">House</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium">{student.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{student.roll}</td>
                    <td className="px-4 py-3">{student.rating}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {student.sports.map(s => (
                          <span key={s} className="bg-muted text-xs px-2 py-1 rounded border border-border">{s}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">{student.house}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${student.status === 'Available' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'}`}>
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
