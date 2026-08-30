"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Search } from "lucide-react"; 
import { createClient } from "@/utils/supabase/client";

export default function Auction() {
  const [bidAmount, setBidAmount] = useState<string>("");
  const [selectedHouse, setSelectedHouse] = useState<string | null>(null);
  const [searchRoll, setSearchRoll] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const houses = [
    { id: "tons", name: "Tons Tigers", baseColor: "bg-orange-600", ringColor: "ring-orange-500", text: "text-orange-500", fadedClass: "bg-orange-500/10 border-orange-500/30 text-orange-500 hover:bg-orange-500/20 hover:border-orange-500/50" },
    { id: "shimsha", name: "Shimsha Panther", baseColor: "bg-sky-600", ringColor: "ring-sky-500", text: "text-sky-400", fadedClass: "bg-sky-400/10 border-sky-400/30 text-sky-400 hover:bg-sky-400/20 hover:border-sky-400/50" },
    { id: "orsang", name: "Orsang Leopards", baseColor: "bg-blue-800", ringColor: "ring-blue-700", text: "text-blue-500", fadedClass: "bg-blue-900/30 border-blue-800/60 text-blue-500 hover:bg-blue-900/50 hover:border-blue-700/60" },
    { id: "ken", name: "Ken Cheetas", baseColor: "bg-red-600", ringColor: "ring-red-500", text: "text-red-500", fadedClass: "bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20 hover:border-red-500/50" },
    { id: "kabini", name: "Kabini Lynx", baseColor: "bg-purple-600", ringColor: "ring-purple-500", text: "text-purple-500", fadedClass: "bg-purple-500/10 border-purple-500/30 text-purple-500 hover:bg-purple-500/20 hover:border-purple-500/50" },
    { id: "harangi", name: "Harangi Jaguars", baseColor: "bg-green-600", ringColor: "ring-green-500", text: "text-green-500", fadedClass: "bg-green-500/10 border-green-500/30 text-green-500 hover:bg-green-500/20 hover:border-green-500/50" },
    { id: "arkavati", name: "Arkavati Lions", baseColor: "bg-yellow-500", ringColor: "ring-yellow-400", text: "text-yellow-500", fadedClass: "bg-yellow-500/10 border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/20 hover:border-yellow-500/50" },
  ];

  const handleLoad = async () => {
    if (!searchRoll) return;
    setLoading(true);
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .ilike('roll_no', searchRoll.trim())
      .single();
      
    if (error || !data) {
      alert("Player not found in database!");
      setStudent(null);
    } else if (data.status !== 'Available') {
      alert(`Player is no longer available! Status: ${data.status}`);
      setStudent(null);
    } else {
      setStudent(data);
    }
    setLoading(false);
  };

  const handleSold = async () => {
    if (!student) {
      alert("Please load a player first.");
      return;
    }
    if (!bidAmount || isNaN(Number(bidAmount)) || Number(bidAmount) <= 0) {
      alert("Please enter a valid winning bid amount.");
      return;
    }
    if (!selectedHouse) {
      alert("Please select the winning house.");
      return;
    }

    const houseName = houses.find(h => h.id === selectedHouse)?.name;
    const supabase = createClient();
    
    const { error } = await supabase
      .from('students')
      .update({ status: 'Sold', house_id: selectedHouse, sold_price: Number(bidAmount) })
      .eq('id', student.id);

    if (error) {
      alert("Error updating database: " + error.message);
      return;
    }

    alert(`Success! ${student.name} sold to ${houseName} for ₹${bidAmount}.`);
    
    setBidAmount("");
    setSelectedHouse(null);
    setStudent(null);
    setSearchRoll("");
  };

  const handleUnsold = async () => {
    if (!student) {
      alert("Please load a player first.");
      return;
    }
    if (confirm("Mark player as UNSOLD?")) {
      const supabase = createClient();
      const { error } = await supabase
        .from('students')
        .update({ status: 'Unsold' })
        .eq('id', student.id);

      if (error) {
        alert("Error updating database: " + error.message);
        return;
      }
      
      alert(`${student.name} marked as Unsold.`);
      setBidAmount("");
      setSelectedHouse(null);
      setStudent(null);
      setSearchRoll("");
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-background relative overflow-x-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>

      <PageHeader title="Auction Command Center" />
      
      <div className="p-4 md:p-8 flex-1 flex flex-col md:flex-row gap-8 max-w-[90rem] mx-auto w-full relative z-10">
        
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-card/80 backdrop-blur-sm p-4 border border-border/50 flex items-center gap-4 clip-angled">
             <div className="relative flex-1">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
               <input 
                 type="text" 
                 value={searchRoll}
                 onChange={(e) => setSearchRoll(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleLoad()}
                 placeholder="ENTER REGISTRATION NUMBER..." 
                 className="w-full pl-12 pr-4 py-3 bg-background border border-border/50 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-primary transition-colors text-foreground"
               />
             </div>
             <button 
               onClick={handleLoad}
               disabled={loading}
               className="bg-primary/10 text-primary border border-primary/50 px-6 py-3 font-bold uppercase tracking-widest text-sm hover:bg-primary hover:text-white transition-all clip-angled disabled:opacity-50"
             >
               {loading ? 'LOADING...' : 'LOAD PLAYER'}
             </button>
          </div>

          <div className="bg-card border border-border/50 flex flex-col overflow-hidden relative group clip-angled h-full min-h-[400px]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary"></div>
            
            {student ? (
              <>
                <div className="p-8 text-center border-b border-border/50 relative overflow-hidden flex-1 flex flex-col justify-center">
                  <div className="absolute inset-0 bg-primary/5"></div>
                  <p className="text-sm font-bold uppercase tracking-widest mb-2 text-primary relative z-10">Currently on the block</p>
                  <h2 className="text-5xl md:text-7xl font-display font-black tracking-wider text-white relative z-10 uppercase">{student.name}</h2>
                  <p className="text-xl font-mono text-muted-foreground mt-4 relative z-10">{student.roll_no}</p>
                </div>
                
                {student.sports && student.sports.length > 0 && (
                  <div className="p-8 flex-1 flex flex-col justify-center bg-card/50">
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-center text-muted-foreground">Registered Sports</h3>
                    <div className="flex flex-wrap justify-center gap-4">
                      {student.sports.map((sport: string) => (
                        <div key={sport} className="bg-background px-8 py-4 border border-border/50 flex justify-center items-center clip-angled hover:border-primary/50 transition-colors">
                          <span className="font-bold uppercase tracking-wider text-foreground">{sport}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-muted-foreground/50">
                <Search className="w-16 h-16 mb-4 opacity-50" />
                <p className="font-bold uppercase tracking-widest text-lg">No Player Loaded</p>
                <p className="text-sm mt-2">Enter a registration number above to load their profile.</p>
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-[32rem] flex flex-col gap-6">
          <div className="bg-card border border-border/50 p-8 flex flex-col gap-8 clip-angled relative">
            <div className="text-center">
              <h2 className="text-3xl font-display font-black text-foreground uppercase tracking-widest flex items-center justify-center gap-3">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                Final Bid Entry
              </h2>
            </div>

            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-3 uppercase tracking-widest text-center">
                Winning Amount (₹)
              </label>
              <input 
                type="number" 
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                disabled={!student}
                placeholder="0"
                className="w-full text-7xl font-display font-black text-center py-6 bg-background border-2 border-border/50 focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all text-white placeholder:text-muted-foreground/30 clip-diagonal outline-none disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-4 uppercase tracking-widest text-center">
                Select Winning House
              </label>
              <div className="grid grid-cols-2 gap-3">
                {houses.map((house) => (
                  <button 
                    key={house.id}
                    onClick={() => setSelectedHouse(house.id)}
                    disabled={!student}
                    className={`
                      font-display font-bold text-xl uppercase tracking-wider py-4 transition-all rounded-xl border-2 outline-none
                      ${selectedHouse === house.id 
                        ? `${house.baseColor} border-${house.ringColor} text-white glow-primary scale-105 z-10` 
                        : house.fadedClass}
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                  >
                    {house.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-2">
              <button 
                onClick={handleSold}
                disabled={!student}
                className="bg-accent hover:bg-accent/90 text-background text-3xl font-display font-black uppercase tracking-widest py-6 transition-all clip-diagonal glow-accent flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                CONFIRM SOLD
              </button>
              <button 
                onClick={handleUnsold}
                disabled={!student}
                className="bg-background border-2 border-red-500/50 hover:bg-red-500/10 text-red-500 font-bold uppercase tracking-widest py-4 transition-all clip-diagonal disabled:opacity-50 disabled:cursor-not-allowed"
              >
                MARK UNSOLD
              </button>
            </div>
            
          </div>
        </div>
        
      </div>
    </div>
  );
}
