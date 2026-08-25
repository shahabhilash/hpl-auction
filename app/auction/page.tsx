import { PageHeader } from "@/components/PageHeader";

export default function Auction() {
  const houses = [
    { id: "A", name: "House A", color: "bg-red-500", hoverColor: "hover:bg-red-600" },
    { id: "B", name: "House B", color: "bg-blue-500", hoverColor: "hover:bg-blue-600" },
    { id: "C", name: "House C", color: "bg-green-500", hoverColor: "hover:bg-green-600" },
    { id: "D", name: "House D", color: "bg-yellow-500", hoverColor: "hover:bg-yellow-600" },
    { id: "E", name: "House E", color: "bg-purple-500", hoverColor: "hover:bg-purple-600" },
    { id: "F", name: "House F", color: "bg-orange-500", hoverColor: "hover:bg-orange-600" },
    { id: "G", name: "House G", color: "bg-teal-500", hoverColor: "hover:bg-teal-600" },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900">
      <PageHeader title="Live Auction" />
      <div className="p-4 md:p-8 flex-1 flex flex-col md:flex-row gap-6 max-w-7xl mx-auto w-full">
        
        {/* Left Column - Student Info */}
        <div className="flex-1 bg-card border border-border rounded-xl shadow-lg flex flex-col overflow-hidden">
          <div className="bg-primary p-6 text-primary-foreground text-center">
            <p className="text-sm uppercase tracking-wider mb-1 opacity-80">Current Student</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Rahul Sharma</h2>
            <div className="mt-4 inline-block bg-white/20 px-4 py-2 rounded-full font-semibold text-lg backdrop-blur-sm">
              Overall Rating: 4.3
            </div>
          </div>
          
          <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
            <h3 className="text-xl font-bold mb-6 text-center text-foreground">Registered Sports</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted p-4 rounded-lg flex justify-between items-center border border-border">
                <span className="font-semibold text-lg">Cricket</span>
                <span className="text-2xl font-bold text-primary">4.5</span>
              </div>
              <div className="bg-muted p-4 rounded-lg flex justify-between items-center border border-border">
                <span className="font-semibold text-lg">Badminton</span>
                <span className="text-2xl font-bold text-primary">3.8</span>
              </div>
              <div className="bg-muted p-4 rounded-lg flex justify-between items-center border border-border md:col-span-2">
                <span className="font-semibold text-lg">Basketball</span>
                <span className="text-2xl font-bold text-primary">4.1</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Bidding Area */}
        <div className="w-full md:w-96 flex flex-col gap-6">
          <div className="bg-card border border-border rounded-xl shadow-lg p-6 text-center flex flex-col items-center justify-center">
            <p className="text-muted-foreground uppercase tracking-wider text-sm font-semibold mb-2">Starting Bid</p>
            <p className="text-3xl font-bold text-foreground">₹100</p>
            
            <div className="w-full h-px bg-border my-6"></div>
            
            <p className="text-muted-foreground uppercase tracking-wider text-sm font-semibold mb-2 flex items-center justify-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              Current Bid
            </p>
            <p className="text-6xl font-black text-primary my-4">₹500</p>
            <p className="text-lg font-medium text-muted-foreground bg-muted px-4 py-2 rounded-full w-full">House A</p>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-lg p-4 flex-1">
            <h3 className="text-sm uppercase tracking-wider font-semibold text-center mb-4 text-muted-foreground">Place Bid</h3>
            <div className="grid grid-cols-2 gap-3">
              {houses.map((house) => (
                <button 
                  key={house.id}
                  className={`${house.color} ${house.hoverColor} text-white font-bold py-4 rounded-lg shadow-sm transition-all transform active:scale-95 focus:outline-none`}
                >
                  {house.name}
                </button>
              ))}
              <button className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 rounded-lg shadow-sm transition-all transform active:scale-95 focus:outline-none col-span-2">
                SOLD
              </button>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
