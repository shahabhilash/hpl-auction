"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Search, Users, ChevronDown, ChevronUp } from "lucide-react"; 
import { createClient } from "@/utils/supabase/client";

export default function Auction() {
  const [bidAmount, setBidAmount] = useState<string>("");
  const [selectedHouse, setSelectedHouse] = useState<string | null>(null);
  const [searchRoll, setSearchRoll] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Roster States
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [roster, setRoster] = useState<any[]>([]);
  const [rosterFilter, setRosterFilter] = useState<'Available' | 'Sold' | 'Unsold'>('Available');
  const [sportFilter, setSportFilter] = useState<string>('All');
  const [showRoster, setShowRoster] = useState(true);

  const houses = [
    { id: "tons", name: "Tons Tigers", baseColor: "bg-orange-600", ringColor: "ring-orange-500", text: "text-orange-500", fadedClass: "bg-orange-500/10 border-orange-500/30 text-orange-500 hover:bg-orange-500/20 hover:border-orange-500/50" },
    { id: "shimsha", name: "Shimsha Panther", baseColor: "bg-sky-600", ringColor: "ring-sky-500", text: "text-sky-400", fadedClass: "bg-sky-400/10 border-sky-400/30 text-sky-400 hover:bg-sky-400/20 hover:border-sky-400/50" },
    { id: "orsang", name: "Orsang Leopards", baseColor: "bg-blue-800", ringColor: "ring-blue-700", text: "text-blue-500", fadedClass: "bg-blue-900/30 border-blue-800/60 text-blue-500 hover:bg-blue-900/50 hover:border-blue-700/60" },
    { id: "ken", name: "Ken Cheetas", baseColor: "bg-red-600", ringColor: "ring-red-500", text: "text-red-500", fadedClass: "bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20 hover:border-red-500/50" },
    { id: "kabini", name: "Kabini Lynx", baseColor: "bg-purple-600", ringColor: "ring-purple-500", text: "text-purple-500", fadedClass: "bg-purple-500/10 border-purple-500/30 text-purple-500 hover:bg-purple-500/20 hover:border-purple-500/50" },
    { id: "harangi", name: "Harangi Jaguars", baseColor: "bg-green-600", ringColor: "ring-green-500", text: "text-green-500", fadedClass: "bg-green-500/10 border-green-500/30 text-green-500 hover:bg-green-500/20 hover:border-green-500/50" },
    { id: "arkavati", name: "Arkavati Lions", baseColor: "bg-yellow-500", ringColor: "ring-yellow-400", text: "text-yellow-500", fadedClass: "bg-yellow-500/10 border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/20 hover:border-yellow-500/50" },
  ];

  useEffect(() => {
    const fetchRoster = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('students').select('*').order('name');
      if (data) setRoster(data);
    };
    fetchRoster();
  }, []);

  const uniqueSports = Array.from(new Set(roster.flatMap(s => s.sports || []))).sort();
  
  const filteredRoster = roster.filter(s => {
    const statusMatch = s.status === rosterFilter;
    const sportMatch = sportFilter === 'All' || (s.sports && s.sports.includes(sportFilter));
    return statusMatch && sportMatch;
  });

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
      setBidAmount("");
      setSelectedHouse(null);
    } else {
      setStudent(data);
      if (data.status === 'Sold') {
        setBidAmount(data.sold_price?.toString() || "");
        setSelectedHouse(data.house_id || null);
      } else {
        setBidAmount("");
        setSelectedHouse(null);
      }
      // Auto-collapse roster when searching manually to save space
      setShowRoster(false);
    }
    setLoading(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const loadFromRoster = (player: any) => {
    setStudent(player);
    if (player.status === 'Sold') {
      setBidAmount(player.sold_price?.toString() || "");
      setSelectedHouse(player.house_id || null);
    } else {
      setBidAmount("");
      setSelectedHouse(null);
    }
    setSearchRoll(player.roll_no);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    
    // 1. Fetch house budget
    const { data: houseData, error: houseFetchError } = await supabase
      .from('houses')
      .select('budget')
      .eq('id', selectedHouse)
      .single();
      
    if (houseFetchError || !houseData) {
      alert("Error fetching house budget. Is the houses table created?");
      return;
    }
    
    if (houseData.budget < Number(bidAmount)) {
      alert(`Insufficient funds! ${houseName} only has ₹${houseData.budget.toLocaleString()} left.`);
      return;
    }
    
    // 2. Deduct budget
    const newBudget = houseData.budget - Number(bidAmount);
    const { error: houseUpdateError } = await supabase
      .from('houses')
      .update({ budget: newBudget })
      .eq('id', selectedHouse);
      
    if (houseUpdateError) {
      alert("Error updating house budget: " + houseUpdateError.message);
      return;
    }

    // 3. Update student status
    let query = supabase.from('students').update({ status: 'Sold', house_id: selectedHouse, sold_price: Number(bidAmount) });
    if (student.team_name) {
      query = query.eq('team_name', student.team_name);
    } else {
      query = query.eq('id', student.id);
    }
    
    const { error } = await query;

    if (error) {
      alert("Error updating database: " + error.message);
      return;
    }

    alert(`Success! ${student.name} sold to ${houseName} for ₹${bidAmount}.`);
    
    // Update local roster instantly
    setRoster(roster.map(s => {
      if (student.team_name && s.team_name === student.team_name) {
         return { ...s, status: 'Sold', house_id: selectedHouse, sold_price: Number(bidAmount) };
      } else if (!student.team_name && s.id === student.id) {
         return { ...s, status: 'Sold', house_id: selectedHouse, sold_price: Number(bidAmount) };
      }
      return s;
    }));

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
      let query = supabase.from('students').update({ status: 'Unsold' });
      if (student.team_name) {
        query = query.eq('team_name', student.team_name);
      } else {
        query = query.eq('id', student.id);
      }
      
      const { error } = await query;

      if (error) {
        alert("Error updating database: " + error.message);
        return;
      }
      
      alert(`${student.name} marked as Unsold.`);
      
      // Update local roster instantly
      setRoster(roster.map(s => {
        if (student.team_name && s.team_name === student.team_name) {
           return { ...s, status: 'Unsold' };
        } else if (!student.team_name && s.id === student.id) {
           return { ...s, status: 'Unsold' };
        }
        return s;
      }));

      setBidAmount("");
      setSelectedHouse(null);
      setStudent(null);
      setSearchRoll("");
    }
  };

  const handleUpdateSold = async () => {
    if (!student || student.status !== 'Sold') return;
    
    if (!bidAmount || isNaN(Number(bidAmount)) || Number(bidAmount) <= 0) {
      alert("Please enter a valid winning bid amount.");
      return;
    }
    if (!selectedHouse) {
      alert("Please select the winning house.");
      return;
    }

    const newPrice = Number(bidAmount);
    const oldPrice = student.sold_price || 0;
    const oldHouseId = student.house_id;
    const newHouseId = selectedHouse;

    if (oldHouseId === newHouseId && oldPrice === newPrice) {
      alert("No changes made.");
      return;
    }

    const houseName = houses.find(h => h.id === selectedHouse)?.name;
    const supabase = createClient();
    
    // Check new house budget if it's a different house, or if it's the same house and price increased
    if (oldHouseId !== newHouseId) {
      const { data: newHouseData, error: newHouseError } = await supabase.from('houses').select('budget').eq('id', newHouseId).single();
      if (newHouseError || !newHouseData) {
         alert("Error fetching new house budget.");
         return;
      }
      if (newHouseData.budget < newPrice) {
         alert(`Insufficient funds! ${houseName} only has ₹${newHouseData.budget.toLocaleString()} left.`);
         return;
      }
      
      // refund old house
      if (oldHouseId) {
         const { data: oldHouseData } = await supabase.from('houses').select('budget').eq('id', oldHouseId).single();
         if (oldHouseData) {
           await supabase.from('houses').update({ budget: oldHouseData.budget + oldPrice }).eq('id', oldHouseId);
         }
      }
      
      // charge new house
      await supabase.from('houses').update({ budget: newHouseData.budget - newPrice }).eq('id', newHouseId);
      
    } else {
      // same house
      const budgetDiff = newPrice - oldPrice;
      const { data: houseData, error: houseError } = await supabase.from('houses').select('budget').eq('id', newHouseId).single();
      if (houseError || !houseData) {
         alert("Error fetching house budget.");
         return;
      }
      if (houseData.budget < budgetDiff) {
         alert(`Insufficient funds! ${houseName} only has ₹${houseData.budget.toLocaleString()} left.`);
         return;
      }
      await supabase.from('houses').update({ budget: houseData.budget - budgetDiff }).eq('id', newHouseId);
    }

    // Update student status
    let query = supabase.from('students').update({ house_id: newHouseId, sold_price: newPrice });
    if (student.team_name) {
      query = query.eq('team_name', student.team_name);
    } else {
      query = query.eq('id', student.id);
    }
    
    const { error } = await query;
    if (error) {
      alert("Error updating database: " + error.message);
      return;
    }
    
    alert(`Success! ${student.name}'s sold details updated to ${houseName} for ₹${newPrice}.`);
    
    // Update local roster instantly
    setRoster(roster.map(s => {
      if (student.team_name && s.team_name === student.team_name) {
         return { ...s, house_id: newHouseId, sold_price: newPrice };
      } else if (!student.team_name && s.id === student.id) {
         return { ...s, house_id: newHouseId, sold_price: newPrice };
      }
      return s;
    }));

    setBidAmount("");
    setSelectedHouse(null);
    setStudent(null);
    setSearchRoll("");
  };

  return (
    <div className="flex flex-col min-h-full bg-background relative overflow-x-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>

      <PageHeader title="Auction Command Center" />
      
      <div className="p-4 md:p-8 flex-1 flex flex-col md:flex-row gap-8 max-w-[90rem] mx-auto w-full relative z-10">
        
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Top Controls: Search OR Browse */}
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="bg-card/80 backdrop-blur-sm p-4 border border-border/50 flex items-center gap-4 clip-angled shadow-lg">
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

            {/* Roster Panel */}
            <div className="bg-card border border-border/50 clip-angled flex flex-col">
              <button 
                onClick={() => setShowRoster(!showRoster)}
                className="flex items-center justify-between p-4 bg-muted/50 hover:bg-muted transition-colors outline-none"
              >
                <div className="flex items-center gap-3">
                  <Users className="text-primary w-5 h-5" />
                  <span className="font-bold uppercase tracking-widest text-sm">Browse Roster</span>
                </div>
                {showRoster ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
              </button>

              {showRoster && (
                <div className="p-4 border-t border-border/50 flex flex-col gap-4">
                  {/* Sport Filter */}
                  <div className="flex gap-2 p-2 bg-background border border-border/50 clip-angled items-center">
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">Sport:</span>
                    <select 
                      value={sportFilter} 
                      onChange={(e) => setSportFilter(e.target.value)}
                      className="flex-1 bg-transparent border-none text-sm font-bold text-foreground focus:ring-0 outline-none uppercase tracking-widest cursor-pointer"
                    >
                      <option className="bg-background text-foreground font-sans" value="All">All Sports</option>
                      {uniqueSports.map((sport: any) => (
                        <option className="bg-background text-foreground font-sans" key={sport} value={sport}>{sport}</option>
                      ))}
                    </select>
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex gap-2 p-1 bg-background border border-border/50 clip-angled">
                    {(['Available', 'Sold', 'Unsold'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => setRosterFilter(status)}
                        className={`
                          flex-1 py-2 text-xs font-bold uppercase tracking-widest transition-colors clip-angled
                          ${rosterFilter === status ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}
                        `}
                      >
                        {status} ({roster.filter(s => s.status === status).length})
                      </button>
                    ))}
                  </div>

                  {/* Scrollable List */}
                  <div className="max-h-64 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                    {filteredRoster.length > 0 ? (
                      filteredRoster.map((player) => (
                        <button
                          key={player.id}
                          onClick={() => loadFromRoster(player)}
                          className="w-full text-left bg-background border border-border/50 p-3 flex justify-between items-center hover:border-primary/50 group transition-colors clip-angled"
                        >
                          <div className="flex flex-col">
                            <span className="font-bold text-foreground group-hover:text-primary transition-colors">{player.name}</span>
                            <span className="text-xs font-mono text-muted-foreground">{player.roll_no}</span>
                          </div>
                          {player.status === 'Sold' ? (
                            <span className="text-xs font-bold uppercase text-red-500 bg-red-500/10 px-2 py-1">₹{player.sold_price}</span>
                          ) : (
                            <span className="text-xs font-bold uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">Select</span>
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="text-center p-4 text-sm font-bold uppercase tracking-widest text-muted-foreground border border-dashed border-border/50 clip-angled">
                        No {rosterFilter} players found.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-card border border-border/50 flex flex-col overflow-hidden relative group clip-angled h-full min-h-[400px]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary"></div>
            
            {student ? (
              <>
                <div className="p-8 text-center border-b border-border/50 relative overflow-hidden flex-1 flex flex-col justify-center">
                  <div className="absolute inset-0 bg-primary/5"></div>
                  
                  {student.status === 'Sold' && (
                    <div className="absolute top-4 right-4 rotate-12 z-20">
                      <span className="border-4 border-red-500 text-red-500 font-black text-2xl uppercase tracking-widest px-4 py-1 inline-block bg-background/90 clip-angled shadow-lg">SOLD</span>
                    </div>
                  )}
                  {student.status === 'Unsold' && (
                    <div className="absolute top-4 right-4 rotate-12 z-20">
                      <span className="border-4 border-muted-foreground text-muted-foreground font-black text-2xl uppercase tracking-widest px-4 py-1 inline-block bg-background/90 clip-angled shadow-lg">UNSOLD</span>
                    </div>
                  )}

                  {student.team_name && (
                    <div className="absolute top-4 left-4 z-20">
                      <span className="border-2 border-accent text-accent font-bold text-xs uppercase tracking-widest px-3 py-1 inline-block bg-background/90 clip-angled shadow-lg">
                        TEAM AUCTION: {student.team_name}
                      </span>
                    </div>
                  )}

                  <p className="text-sm font-bold uppercase tracking-widest mb-2 text-primary relative z-10">
                    {student.status === 'Sold' ? `Sold to: ${houses.find(h => h.id === student.house_id)?.name} for ₹${student.sold_price}` : 'Currently on the block'}
                  </p>
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
                <p className="text-sm mt-2 max-w-sm text-center">Enter a registration number above or browse the roster to load their profile.</p>
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-[32rem] flex flex-col gap-6">
          <div className="bg-card border border-border/50 p-8 flex flex-col gap-8 clip-angled relative shadow-lg">
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
                onWheel={(e) => (e.target as HTMLElement).blur()}
                disabled={!student || (student.status !== 'Available' && student.status !== 'Sold')}
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
                    disabled={!student || (student.status !== 'Available' && student.status !== 'Sold')}
                    className={`
                      font-display font-bold text-xl uppercase tracking-wider py-4 transition-all rounded-xl border-2 outline-none
                      ${selectedHouse === house.id 
                        ? `${house.baseColor} border-${house.ringColor} text-white glow-primary scale-105 z-10 shadow-lg` 
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
              {student?.status === 'Sold' ? (
                <button 
                  onClick={handleUpdateSold}
                  disabled={!student}
                  className="bg-orange-500 hover:bg-orange-600 text-background text-3xl font-display font-black uppercase tracking-widest py-6 transition-all clip-diagonal flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  UPDATE SOLD DETAILS
                </button>
              ) : (
                <button 
                  onClick={handleSold}
                  disabled={!student || student.status !== 'Available'}
                  className="bg-accent hover:bg-accent/90 text-background text-3xl font-display font-black uppercase tracking-widest py-6 transition-all clip-diagonal glow-accent flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  CONFIRM SOLD
                </button>
              )}
              <button 
                onClick={handleUnsold}
                disabled={!student || student.status !== 'Available'}
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
