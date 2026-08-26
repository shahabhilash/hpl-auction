"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Search } from "lucide-react"; // Might be useful for player search

export default function Auction() {
  const [bidAmount, setBidAmount] = useState<string>("");
  const [selectedHouse, setSelectedHouse] = useState<string | null>(null);

  const houses = [
    { id: "A", name: "House A", baseColor: "bg-red-500", ringColor: "ring-red-500" },
    { id: "B", name: "House B", baseColor: "bg-blue-500", ringColor: "ring-blue-500" },
    { id: "C", name: "House C", baseColor: "bg-green-500", ringColor: "ring-green-500" },
    { id: "D", name: "House D", baseColor: "bg-yellow-500", ringColor: "ring-yellow-500" },
    { id: "E", name: "House E", baseColor: "bg-purple-500", ringColor: "ring-purple-500" },
    { id: "F", name: "House F", baseColor: "bg-orange-500", ringColor: "ring-orange-500" },
    { id: "G", name: "House G", baseColor: "bg-teal-500", ringColor: "ring-teal-500" },
  ];

  const handleSold = () => {
    if (!bidAmount || isNaN(Number(bidAmount)) || Number(bidAmount) <= 0) {
      alert("Please enter a valid winning bid amount.");
      return;
    }
    if (!selectedHouse) {
      alert("Please select the winning house.");
      return;
    }

    // In the future, this will connect to Supabase
    // e.g. supabase.from('auction_purchases').insert({...})
    const houseName = houses.find(h => h.id === selectedHouse)?.name;
    console.log(`[SUPABASE MOCK] Player sold to ${houseName} for ₹${bidAmount}`);
    alert(`Success! Player sold to ${houseName} for ₹${bidAmount}. Wallet deducted.`);
    
    // Reset for next player
    setBidAmount("");
    setSelectedHouse(null);
  };

  const handleUnsold = () => {
    if (confirm("Mark player as UNSOLD?")) {
      console.log(`[SUPABASE MOCK] Player marked as unsold`);
      setBidAmount("");
      setSelectedHouse(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900">
      <PageHeader title="Offline Auction Control Panel" />
      <div className="p-4 md:p-8 flex-1 flex flex-col md:flex-row gap-6 max-w-7xl mx-auto w-full">
        
        {/* Left Column - Student Info */}
        <div className="flex-1 bg-card border border-border rounded-xl shadow-lg flex flex-col overflow-hidden">
          {/* Mock Player Selection/Search area (for the offline auctioneer) */}
          <div className="bg-muted p-4 border-b border-border flex items-center gap-3">
             <div className="relative flex-1">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
               <input 
                 type="text" 
                 placeholder="Search next player to auction..." 
                 className="w-full pl-9 pr-4 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
               />
             </div>
             <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
               Load Player
             </button>
          </div>

          <div className="bg-primary p-6 text-primary-foreground text-center">
            <p className="text-sm uppercase tracking-wider mb-1 opacity-80">Current Player on Block</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Rahul Sharma</h2>
            <div className="mt-4 inline-block bg-white/20 px-4 py-2 rounded-full font-semibold text-lg backdrop-blur-sm">
              Overall Rating: 4.3
            </div>
            <p className="mt-4 text-primary-foreground/80 font-medium">Base Price: ₹100</p>
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

        {/* Right Column - Offline Entry Area */}
        <div className="w-full md:w-[28rem] flex flex-col gap-6">
          <div className="bg-card border border-border rounded-xl shadow-lg p-6 flex flex-col gap-6">
            <div className="text-center">
              <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Final Bid Details</h2>
              <p className="text-muted-foreground text-sm mt-1">Enter the manual final winning amount</p>
            </div>

            {/* Amount Input */}
            <div>
              <label className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wider">
                Winning Amount (₹)
              </label>
              <input 
                type="number" 
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder="e.g. 1500"
                className="w-full text-4xl font-black text-center py-4 rounded-xl border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all bg-muted/50"
              />
            </div>

            {/* House Selection */}
            <div>
              <label className="block text-sm font-bold text-foreground mb-3 uppercase tracking-wider">
                Select Winning House
              </label>
              <div className="grid grid-cols-2 gap-3">
                {houses.map((house) => (
                  <button 
                    key={house.id}
                    onClick={() => setSelectedHouse(house.id)}
                    className={`
                      ${house.baseColor} text-white font-bold py-3 rounded-lg shadow-sm transition-all transform active:scale-95 focus:outline-none border-2
                      ${selectedHouse === house.id ? `ring-4 ${house.ringColor} ring-offset-2 ring-offset-background border-white scale-[1.02] shadow-md` : 'border-transparent opacity-80 hover:opacity-100'}
                    `}
                  >
                    {house.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mt-4">
              <button 
                onClick={handleSold}
                className="bg-green-600 hover:bg-green-700 text-white text-xl font-black py-4 rounded-xl shadow-lg transition-all transform active:scale-95"
              >
                CONFIRM SOLD
              </button>
              <button 
                onClick={handleUnsold}
                className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-foreground font-bold py-3 rounded-xl transition-all transform active:scale-95"
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
