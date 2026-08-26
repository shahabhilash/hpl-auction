"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Search } from "lucide-react"; 

export default function Auction() {
  const [bidAmount, setBidAmount] = useState<string>("");
  const [selectedHouse, setSelectedHouse] = useState<string | null>(null);

  const houses = [
    { id: "A", name: "House A", baseColor: "bg-red-600", ringColor: "ring-red-500", text: "text-red-500" },
    { id: "B", name: "House B", baseColor: "bg-blue-600", ringColor: "ring-blue-500", text: "text-blue-500" },
    { id: "C", name: "House C", baseColor: "bg-green-600", ringColor: "ring-green-500", text: "text-green-500" },
    { id: "D", name: "House D", baseColor: "bg-yellow-500", ringColor: "ring-yellow-400", text: "text-yellow-500" },
    { id: "E", name: "House E", baseColor: "bg-purple-600", ringColor: "ring-purple-500", text: "text-purple-500" },
    { id: "F", name: "House F", baseColor: "bg-orange-600", ringColor: "ring-orange-500", text: "text-orange-500" },
    { id: "G", name: "House G", baseColor: "bg-teal-600", ringColor: "ring-teal-500", text: "text-teal-500" },
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

    const houseName = houses.find(h => h.id === selectedHouse)?.name;
    console.log(`[SUPABASE MOCK] Player sold to ${houseName} for ₹${bidAmount}`);
    alert(`Success! Player sold to ${houseName} for ₹${bidAmount}. Wallet deducted.`);
    
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
    <div className="flex flex-col min-h-full bg-background relative overflow-x-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>

      <PageHeader title="Auction Command Center" />
      
      <div className="p-4 md:p-8 flex-1 flex flex-col md:flex-row gap-8 max-w-[90rem] mx-auto w-full relative z-10">
        
        {/* Left Column - Student Info */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Mock Player Selection/Search */}
          <div className="bg-card/80 backdrop-blur-sm p-4 border border-border/50 flex items-center gap-4 clip-angled">
             <div className="relative flex-1">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
               <input 
                 type="text" 
                 placeholder="SEARCH PLAYER ROSTER..." 
                 className="w-full pl-12 pr-4 py-3 bg-background border border-border/50 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-primary transition-colors text-foreground"
               />
             </div>
             <button className="bg-primary/10 text-primary border border-primary/50 px-6 py-3 font-bold uppercase tracking-widest text-sm hover:bg-primary hover:text-white transition-all clip-angled">
               Load
             </button>
          </div>

          <div className="bg-card border border-border/50 flex flex-col overflow-hidden relative group clip-angled h-full">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary"></div>
            
            <div className="p-8 text-center border-b border-border/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-primary/5"></div>
              <p className="text-sm font-bold uppercase tracking-widest mb-2 text-primary relative z-10">Currently on the block</p>
              <h2 className="text-5xl md:text-7xl font-display font-black tracking-wider text-white relative z-10 uppercase">Rahul Sharma</h2>
              
              <div className="mt-6 flex justify-center gap-4 relative z-10">
                <div className="bg-background border border-border/50 px-6 py-2 flex flex-col items-center clip-angled">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Base Price</span>
                  <span className="font-display font-bold text-2xl text-white">₹100</span>
                </div>
                <div className="bg-background border border-border/50 px-6 py-2 flex flex-col items-center clip-angled">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Rating</span>
                  <span className="font-display font-bold text-2xl text-accent">4.3</span>
                </div>
              </div>
            </div>
            
            <div className="p-8 flex-1 flex flex-col justify-center bg-card/50">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-center text-muted-foreground">Registered Sports</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-background p-5 border border-border/50 flex justify-between items-center group-hover:border-primary/30 transition-colors clip-angled">
                  <span className="font-bold uppercase tracking-wider text-foreground">Cricket</span>
                  <span className="font-display text-3xl font-black text-primary">4.5</span>
                </div>
                <div className="bg-background p-5 border border-border/50 flex justify-between items-center group-hover:border-primary/30 transition-colors clip-angled">
                  <span className="font-bold uppercase tracking-wider text-foreground">Badminton</span>
                  <span className="font-display text-3xl font-black text-primary">3.8</span>
                </div>
                <div className="bg-background p-5 border border-border/50 flex justify-between items-center md:col-span-2 group-hover:border-primary/30 transition-colors clip-angled">
                  <span className="font-bold uppercase tracking-wider text-foreground">Basketball</span>
                  <span className="font-display text-3xl font-black text-primary">4.1</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Offline Entry Area */}
        <div className="w-full md:w-[32rem] flex flex-col gap-6">
          <div className="bg-card border border-border/50 p-8 flex flex-col gap-8 clip-angled relative">
            
            <div className="text-center">
              <h2 className="text-3xl font-display font-black text-foreground uppercase tracking-widest flex items-center justify-center gap-3">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                Final Bid Entry
              </h2>
            </div>

            {/* Amount Input */}
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-3 uppercase tracking-widest text-center">
                Winning Amount (₹)
              </label>
              <input 
                type="number" 
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder="0"
                className="w-full text-7xl font-display font-black text-center py-6 bg-background border-2 border-border/50 focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all text-white placeholder:text-muted-foreground/30 clip-diagonal outline-none"
              />
            </div>

            {/* House Selection */}
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-4 uppercase tracking-widest text-center">
                Select Winning House
              </label>
              <div className="grid grid-cols-2 gap-3">
                {houses.map((house) => (
                  <button 
                    key={house.id}
                    onClick={() => setSelectedHouse(house.id)}
                    className={`
                      font-display font-bold text-xl uppercase tracking-wider py-4 transition-all clip-angled border-2 outline-none
                      ${selectedHouse === house.id 
                        ? `${house.baseColor} border-${house.ringColor} text-white glow-primary scale-105 z-10` 
                        : `bg-background border-border/50 text-muted-foreground hover:border-primary/50 hover:text-foreground`}
                    `}
                  >
                    {house.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 mt-2">
              <button 
                onClick={handleSold}
                className="bg-accent hover:bg-accent/90 text-background text-3xl font-display font-black uppercase tracking-widest py-6 transition-all clip-diagonal glow-accent flex items-center justify-center gap-3"
              >
                CONFIRM SOLD
              </button>
              <button 
                onClick={handleUnsold}
                className="bg-background border-2 border-red-500/50 hover:bg-red-500/10 text-red-500 font-bold uppercase tracking-widest py-4 transition-all clip-diagonal"
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
