"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Search, Users, ChevronDown, ChevronUp, Save } from "lucide-react"; 
import { createClient } from "@/utils/supabase/client";

export default function Auction() {
  const [bidAmount, setBidAmount] = useState<string>("");
  const [selectedHouse, setSelectedHouse] = useState<string | null>(null);
  const [searchGroupId, setSearchGroupId] = useState("");
  const [searchRegNo, setSearchRegNo] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [auctionGroup, setAuctionGroup] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  const [loading, setLoading] = useState(false);

  // Roster States
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [roster, setRoster] = useState<any[]>([]);
  const [rosterFilter, setRosterFilter] = useState<'Available' | 'Sold' | 'Unsold'>('Available');
  const [sportFilter, setSportFilter] = useState<string>('All');
  const [showRoster, setShowRoster] = useState(true);

  const houses = [
    { id: "tons-tigers", name: "Tons Tigers", baseColor: "bg-orange-600", ringColor: "ring-orange-500", text: "text-orange-500", fadedClass: "bg-orange-500/10 border-orange-500/30 text-orange-500 hover:bg-orange-500/20 hover:border-orange-500/50" },
    { id: "shimsha-panther", name: "Shimsha Panther", baseColor: "bg-sky-600", ringColor: "ring-sky-500", text: "text-sky-400", fadedClass: "bg-sky-400/10 border-sky-400/30 text-sky-400 hover:bg-sky-400/20 hover:border-sky-400/50" },
    { id: "orsang-leopards", name: "Orsang Leopards", baseColor: "bg-blue-800", ringColor: "ring-blue-700", text: "text-blue-500", fadedClass: "bg-blue-900/30 border-blue-800/60 text-blue-500 hover:bg-blue-900/50 hover:border-blue-700/60" },
    { id: "ken-cheetas", name: "Ken Cheetas", baseColor: "bg-red-600", ringColor: "ring-red-500", text: "text-red-500", fadedClass: "bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20 hover:border-red-500/50" },
    { id: "kabini-lynx", name: "Kabini Lynx", baseColor: "bg-purple-600", ringColor: "ring-purple-500", text: "text-purple-500", fadedClass: "bg-purple-500/10 border-purple-500/30 text-purple-500 hover:bg-purple-500/20 hover:border-purple-500/50" },
    { id: "harangi-jaguars", name: "Harangi Jaguars", baseColor: "bg-green-600", ringColor: "ring-green-500", text: "text-green-500", fadedClass: "bg-green-500/10 border-green-500/30 text-green-500 hover:bg-green-500/20 hover:border-green-500/50" },
    { id: "arkavati-lions", name: "Arkavati Lions", baseColor: "bg-yellow-500", ringColor: "ring-yellow-400", text: "text-yellow-500", fadedClass: "bg-yellow-500/10 border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/20 hover:border-yellow-500/50" },
  ];

  const fetchRoster = async () => {
    const supabase = createClient();
    const { data } = await supabase.from('auction_groups').select('*').order('group_id');
    if (data) {
      const grouped = data.reduce((acc: any, row: any) => {
        if (!acc[row.group_id]) {
          acc[row.group_id] = { ...row, rows: [row], all_sports: [row.sport].filter(Boolean) };
        } else {
          acc[row.group_id].rows.push(row);
          if (row.sport && !acc[row.group_id].all_sports.includes(row.sport)) {
             acc[row.group_id].all_sports.push(row.sport);
          }
        }
        return acc;
      }, {});
      setRoster(Object.values(grouped));
    }
  };

  useEffect(() => {
    fetchRoster();
  }, []);

  const uniqueSports = Array.from(new Set(roster.flatMap(g => g.all_sports))).sort();
  
  const filteredRoster = roster.filter(g => {
    const statusMatch = (g.sold_status || 'Available') === rosterFilter;
    const sportMatch = sportFilter === 'All' || (g.all_sports && g.all_sports.includes(sportFilter));
    return statusMatch && sportMatch;
  });

  const getPlayersFromGroup = (group: any) => {
    const players: any[] = [];
    const rows = group.rows || [group];
    rows.forEach((row: any) => {
      for (let i = 1; i <= 7; i++) {
        if (row[`player_${i}`]) {
          players.push({
            name: row[`player_${i}`],
            regNo: row[`reg_no_${i}`],
            sport: row.sport
          });
        }
      }
    });
    return players;
  };

  const handleLoad = async () => {
    if (!searchGroupId) return;
    setLoading(true);
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('auction_groups')
      .select('*')
      .ilike('group_id', searchGroupId.trim());
      
    if (error || !data || data.length === 0) {
      alert("Group not found in database!");
      setAuctionGroup(null);
      setBidAmount("");
      setSelectedHouse(null);
    } else {
      const syntheticGroup = { ...data[0], rows: data, all_sports: data.map(r => r.sport).filter(Boolean) };
      setAuctionGroup(syntheticGroup);
      if (data[0].sold_status === 'Sold') {
        setBidAmount(data[0].sold_amount?.toString() || "");
        setSelectedHouse(data[0].sold_to_house || null);
      } else {
        setBidAmount("");
        setSelectedHouse(null);
      }
      setShowRoster(false);
    }
    setLoading(false);
  };

  const handleLoadRegNo = async () => {
    if (!searchRegNo) return;
    setLoading(true);
    const supabase = createClient();
    const query = searchRegNo.trim();
    
    const { data: matchData, error: matchError } = await supabase
      .from('auction_groups')
      .select('group_id')
      .or(`reg_no_1.ilike.%${query}%,reg_no_2.ilike.%${query}%,reg_no_3.ilike.%${query}%,reg_no_4.ilike.%${query}%,reg_no_5.ilike.%${query}%,reg_no_6.ilike.%${query}%,reg_no_7.ilike.%${query}%`)
      .limit(1)
      .single();
      
    if (matchError || !matchData) {
      alert("Player not found in any group!");
      setAuctionGroup(null);
      setBidAmount("");
      setSelectedHouse(null);
    } else {
      const { data } = await supabase.from('auction_groups').select('*').eq('group_id', matchData.group_id);
      if (data && data.length > 0) {
        const syntheticGroup = { ...data[0], rows: data, all_sports: data.map(r => r.sport).filter(Boolean) };
        setAuctionGroup(syntheticGroup);
        if (data[0].sold_status === 'Sold') {
          setBidAmount(data[0].sold_amount?.toString() || "");
          setSelectedHouse(data[0].sold_to_house || null);
        } else {
          setBidAmount("");
          setSelectedHouse(null);
        }
        setShowRoster(false);
      }
    }
    setLoading(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const loadFromRoster = (group: any) => {
    setAuctionGroup(group);
    if (group.sold_status === 'Sold') {
      setBidAmount(group.sold_amount?.toString() || "");
      setSelectedHouse(group.sold_to_house || null);
    } else {
      setBidAmount("");
      setSelectedHouse(null);
    }
    setSearchGroupId(group.group_id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };



  const getOverlappingRowIds = (targetGroupId: string, allGroups: any[]) => {
    const affectedGroupIds = new Set<string>([targetGroupId]);
    let addedNew = true;
    
    while (addedNew) {
      addedNew = false;
      const currentRegNos = new Set<string>();
      allGroups.forEach(row => {
        if (affectedGroupIds.has(row.group_id)) {
          const rowRegNos = getPlayersFromGroup(row).map((p: any) => p.regNo).filter(Boolean);
          rowRegNos.forEach((r: string) => currentRegNos.add(r));
        }
      });
      
      allGroups.forEach(row => {
        if (!affectedGroupIds.has(row.group_id)) {
          const rowRegNos = getPlayersFromGroup(row).map((p: any) => p.regNo).filter(Boolean);
          if (rowRegNos.some((r: string) => currentRegNos.has(r))) {
            affectedGroupIds.add(row.group_id);
            addedNew = true;
          }
        }
      });
    }

    return allGroups
      .filter(row => affectedGroupIds.has(row.group_id))
      .map(row => row.id);
  };

  const handleSold = async () => {
    if (!auctionGroup) {
      alert("Please load a group first.");
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
      alert("Error fetching house budget. Is the houses table populated?");
      return;
    }
    
    if (houseData.budget < Number(bidAmount)) {
      alert(`Insufficient funds! ${houseName} only has ₹${houseData.budget.toLocaleString()} left.`);
      return;
    }
    
    // 2. Find ALL overlapping groups (fully transitive across group_ids)
    const { data: allGroups, error: allGroupsError } = await supabase.from('auction_groups').select('*');
    if (allGroupsError) {
      alert("Error fetching groups for overlap check.");
      return;
    }
    
    const overlappingGroupIds = getOverlappingRowIds(auctionGroup.group_id, allGroups || []);
    // if we are updating more rows than just this group's rows, then there is an overlap
    const isMultiple = overlappingGroupIds.length > (auctionGroup.rows ? auctionGroup.rows.length : 1);

    // 3. Deduct budget (ONCE for the entire transaction)
    const newBudget = houseData.budget - Number(bidAmount);
    const { error: houseUpdateError } = await supabase
      .from('houses')
      .update({ budget: newBudget })
      .eq('id', selectedHouse);
      
    if (houseUpdateError) {
      alert("Error updating house budget: " + houseUpdateError.message);
      return;
    }

    // 4. Update all overlapping groups
    const { error } = await supabase
      .from('auction_groups')
      .update({ 
        sold_status: 'Sold', 
        sold_to_house: selectedHouse, 
        sold_amount: Number(bidAmount),
        sold_at: new Date().toISOString()
      })
      .in('id', overlappingGroupIds);

    if (error) {
      alert("Error updating database: " + error.message);
      return;
    }

    alert(`Success! Group ${auctionGroup.group_id} ${isMultiple ? '(and all overlapping groups) ' : ''}sold to ${houseName} for ₹${bidAmount}.`);
    
    // Refresh fully
    fetchRoster();
    setAuctionGroup(null);
    setBidAmount("");
    setSelectedHouse(null);
    setSearchGroupId("");
  };

  const handleUpdateSold = async () => {
    if (!auctionGroup || auctionGroup.sold_status !== 'Sold') return;
    
    if (!bidAmount || isNaN(Number(bidAmount)) || Number(bidAmount) <= 0) {
      alert("Please enter a valid winning bid amount.");
      return;
    }
    if (!selectedHouse) {
      alert("Please select the winning house.");
      return;
    }

    const newPrice = Number(bidAmount);
    const oldPrice = auctionGroup.sold_amount || 0;
    const oldHouseId = auctionGroup.sold_to_house;
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

    // Update ALL overlapping groups exactly like handleSold
    const { data: allGroups } = await supabase.from('auction_groups').select('*');
    const overlappingGroupIds = getOverlappingRowIds(auctionGroup.group_id, allGroups || []);
    const isMultiple = overlappingGroupIds.length > (auctionGroup.rows ? auctionGroup.rows.length : 1);

    const { error } = await supabase
      .from('auction_groups')
      .update({ sold_to_house: newHouseId, sold_amount: newPrice })
      .in('id', overlappingGroupIds);
      
    if (error) {
      alert("Error updating database: " + error.message);
      return;
    }
    
    alert(`Success! Group ${auctionGroup.group_id} ${isMultiple ? '(and all overlapping groups) ' : ''}sold details updated to ${houseName} for ₹${newPrice}.`);
    
    fetchRoster();
    setAuctionGroup(null);
    setBidAmount("");
    setSelectedHouse(null);
    setSearchGroupId("");
  };

  const handleUnsold = async () => {
    if (!auctionGroup) return;
    
    const isCurrentlySold = auctionGroup.sold_status === 'Sold';
    const confirmMsg = isCurrentlySold 
      ? "Are you sure you want to UNDO this sale? The budget will be refunded and the group will be marked as UNSOLD." 
      : "Mark group as UNSOLD?";
      
    if (confirm(confirmMsg)) {
      const supabase = createClient();
      
      // 1. Refund the house if it was previously sold
      if (isCurrentlySold && auctionGroup.sold_to_house && auctionGroup.sold_amount) {
         const { data: houseData, error: houseError } = await supabase
           .from('houses')
           .select('budget')
           .eq('id', auctionGroup.sold_to_house)
           .single();
           
         if (!houseError && houseData) {
            await supabase
              .from('houses')
              .update({ budget: houseData.budget + auctionGroup.sold_amount })
              .eq('id', auctionGroup.sold_to_house);
         }
      }
      
      // 2. Find ALL overlapping groups to update them all
      const { data: allGroups } = await supabase.from('auction_groups').select('*');
      const overlappingGroupIds = getOverlappingRowIds(auctionGroup.group_id, allGroups || []);

      // 3. Mark all as unsold and clear sold data
      const { error } = await supabase
        .from('auction_groups')
        .update({ 
          sold_status: 'Unsold', 
          sold_to_house: null, 
          sold_amount: null, 
          sold_at: null 
        })
        .in('id', overlappingGroupIds);

      if (error) {
        alert("Error updating database: " + error.message);
        return;
      }
      
      alert(isCurrentlySold ? `Sale undone! Budget refunded and group marked as Unsold.` : `Group marked as Unsold.`);
      
      fetchRoster();
      setAuctionGroup(null);
      setBidAmount("");
      setSelectedHouse(null);
      setSearchGroupId("");
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-background relative overflow-x-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>

      <PageHeader title="Auction Command Center" />
      
      <div className="p-4 md:p-8 flex-1 flex flex-col md:flex-row gap-8 max-w-[90rem] mx-auto w-full relative z-10">
        
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Top Controls */}
          <div className="flex flex-col gap-4">
            <div className="bg-card/80 backdrop-blur-sm p-4 border border-border/50 flex flex-col gap-4 clip-angled shadow-lg">
               
               {/* Group ID Search */}
               <div className="flex items-center gap-4">
                 <div className="relative flex-1">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
                   <input 
                     type="text" 
                     value={searchGroupId}
                     onChange={(e) => setSearchGroupId(e.target.value)}
                     onKeyDown={(e) => e.key === 'Enter' && handleLoad()}
                     placeholder="ENTER GROUP ID (E.G. G01)" 
                     className="w-full pl-12 pr-4 py-3 bg-background border border-border/50 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-primary transition-colors text-foreground"
                   />
                 </div>
                 <button 
                   onClick={handleLoad}
                   disabled={loading}
                   className="bg-primary/10 text-primary border border-primary/50 px-6 py-3 font-bold uppercase tracking-widest text-sm hover:bg-primary hover:text-white transition-all clip-angled disabled:opacity-50 min-w-[160px]"
                 >
                   {loading ? 'LOADING...' : 'LOAD GROUP'}
                 </button>
               </div>

               {/* Registration Number Search */}
               <div className="flex items-center gap-4">
                 <div className="relative flex-1">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-accent w-5 h-5" />
                   <input 
                     type="text" 
                     value={searchRegNo}
                     onChange={(e) => setSearchRegNo(e.target.value)}
                     onKeyDown={(e) => e.key === 'Enter' && handleLoadRegNo()}
                     placeholder="ENTER REGISTRATION NUMBER..." 
                     className="w-full pl-12 pr-4 py-3 bg-background border border-border/50 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-accent transition-colors text-foreground"
                   />
                 </div>
                 <button 
                   onClick={handleLoadRegNo}
                   disabled={loading}
                   className="bg-accent/10 text-accent border border-accent/50 px-6 py-3 font-bold uppercase tracking-widest text-sm hover:bg-accent hover:text-white transition-all clip-angled disabled:opacity-50 min-w-[160px]"
                 >
                   {loading ? 'LOADING...' : 'FIND PLAYER'}
                 </button>
               </div>
               
            </div>

            {/* Roster Panel */}
            <div className="bg-card border border-border/50 clip-angled flex flex-col">
              <button 
                onClick={() => setShowRoster(!showRoster)}
                className="flex items-center justify-between p-4 bg-muted/50 hover:bg-muted transition-colors outline-none"
              >
                <div className="flex items-center gap-3">
                  <Users className="text-primary w-5 h-5" />
                  <span className="font-bold uppercase tracking-widest text-sm">Browse Groups</span>
                </div>
                {showRoster ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
              </button>

              {showRoster && (
                <div className="p-4 border-t border-border/50 flex flex-col gap-4">
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
                        {status} ({roster.filter(g => (g.sold_status || 'Available') === status).length})
                      </button>
                    ))}
                  </div>

                  <div className="max-h-64 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                    {filteredRoster.length > 0 ? (
                      filteredRoster.map((group) => (
                        <button
                          key={group.id}
                          onClick={() => loadFromRoster(group)}
                          className="w-full text-left bg-background border border-border/50 p-3 flex justify-between items-center hover:border-primary/50 group transition-colors clip-angled"
                        >
                          <div className="flex flex-col">
                            <span className="font-bold text-foreground group-hover:text-primary transition-colors uppercase tracking-widest">
                              {group.group_id}
                            </span>
                            <span className="text-xs text-muted-foreground">{group.category} • {group.total_sports} Sports</span>
                          </div>
                          {(group.sold_status || 'Available') === 'Sold' ? (
                            <span className="text-xs font-bold uppercase text-red-500 bg-red-500/10 px-2 py-1">₹{group.sold_amount}</span>
                          ) : (
                            <span className="text-xs font-bold uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">Select</span>
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="text-center p-4 text-sm font-bold uppercase tracking-widest text-muted-foreground border border-dashed border-border/50 clip-angled">
                        No {rosterFilter} groups found.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Group Profile */}
          <div className="bg-card border border-border/50 flex flex-col overflow-hidden relative group clip-angled h-full min-h-[500px]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary"></div>
            
            {auctionGroup ? (
              <div className="flex flex-col h-full">
                <div className="p-8 border-b border-border/50 relative overflow-hidden flex flex-col justify-center items-center">
                  <div className="absolute inset-0 bg-primary/5"></div>
                  
                  {auctionGroup.sold_status === 'Sold' && (
                    <div className="absolute top-4 right-4 rotate-12 z-20">
                      <span className="border-4 border-red-500 text-red-500 font-black text-2xl uppercase tracking-widest px-4 py-1 inline-block bg-background/90 clip-angled shadow-lg">SOLD</span>
                    </div>
                  )}
                  {auctionGroup.sold_status === 'Unsold' && (
                    <div className="absolute top-4 right-4 rotate-12 z-20">
                      <span className="border-4 border-muted-foreground text-muted-foreground font-black text-2xl uppercase tracking-widest px-4 py-1 inline-block bg-background/90 clip-angled shadow-lg">UNSOLD</span>
                    </div>
                  )}

                  <p className="text-sm font-bold uppercase tracking-widest mb-2 text-primary relative z-10 text-center">
                    {auctionGroup.sold_status === 'Sold' ? `Sold to: ${houses.find(h => h.id === auctionGroup.sold_to_house)?.name} for ₹${auctionGroup.sold_amount}` : 'Currently on the block'}
                  </p>
                  <h2 className="text-5xl md:text-7xl font-display font-black tracking-wider text-white relative z-10 uppercase text-center">{auctionGroup.group_id}</h2>
                  
                  <div className="flex gap-4 mt-4 relative z-10 flex-wrap justify-center">
                     <span className="px-3 py-1 bg-background border border-border/50 text-xs font-bold uppercase tracking-widest">{auctionGroup.category}</span>
                     {auctionGroup.all_sports ? auctionGroup.all_sports.map((sport: string) => (
                       <span key={sport} className="px-3 py-1 bg-background border border-border/50 text-xs font-bold uppercase tracking-widest">{sport}</span>
                     )) : (
                       <span className="px-3 py-1 bg-background border border-border/50 text-xs font-bold uppercase tracking-widest">{auctionGroup.sport}</span>
                     )}
                  </div>

                  {/* Base Amount Display */}
                  <div className="mt-8 relative z-10 bg-background/80 backdrop-blur px-8 py-4 border border-border/50 flex flex-col items-center clip-angled shadow-lg">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Base Amount</span>
                    <span className="font-display font-black text-3xl text-primary tracking-wider">
                      ₹{auctionGroup.base_price?.toLocaleString() || 0}
                    </span>
                  </div>
                </div>
                
                <div className="p-8 flex-1 flex flex-col bg-card/50">
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-center text-muted-foreground">Players in Group ({auctionGroup.total_sports} Sports, {auctionGroup.total_teams} Teams)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getPlayersFromGroup(auctionGroup).map((player, idx) => (
                      <div key={idx} className="bg-background p-4 border border-border/50 flex flex-col clip-angled hover:border-primary/50 transition-colors">
                        <span className="font-bold uppercase tracking-wider text-foreground">{player.name}</span>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs font-mono text-muted-foreground">{player.regNo}</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest bg-muted px-2 py-1 text-muted-foreground">{player.sport}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-muted-foreground/50">
                <Search className="w-16 h-16 mb-4 opacity-50" />
                <p className="font-bold uppercase tracking-widest text-lg">No Group Loaded</p>
                <p className="text-sm mt-2 max-w-sm text-center">Enter a group ID above or browse to load a profile.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right side Bid Panel */}
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
                disabled={!auctionGroup}
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
                    disabled={!auctionGroup}
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
              {auctionGroup?.sold_status === 'Sold' ? (
                <button 
                  onClick={handleUpdateSold}
                  disabled={!auctionGroup}
                  className="bg-orange-500 hover:bg-orange-600 text-background text-3xl font-display font-black uppercase tracking-widest py-6 transition-all clip-diagonal flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  UPDATE SOLD DETAILS
                </button>
              ) : (
                <button 
                  onClick={handleSold}
                  disabled={!auctionGroup || auctionGroup.sold_status === 'Sold'}
                  className="bg-accent hover:bg-accent/90 text-background text-3xl font-display font-black uppercase tracking-widest py-6 transition-all clip-diagonal glow-accent flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  CONFIRM SOLD
                </button>
              )}
              <button 
                onClick={handleUnsold}
                disabled={!auctionGroup}
                className="bg-background border-2 border-red-500/50 hover:bg-red-500/10 text-red-500 font-bold uppercase tracking-widest py-4 transition-all clip-diagonal disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {auctionGroup?.sold_status === 'Sold' ? 'UNDO SALE' : 'MARK UNSOLD'}
              </button>
            </div>
            
          </div>
        </div>
        
      </div>
    </div>
  );
}
