"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { createClient } from "@/utils/supabase/client";

export default function Settings() {
  const [budget, setBudget] = useState<string>("0");
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchBudget = async () => {
      const supabase = createClient();
      // Fetch budget of any house to populate the input
      const { data, error } = await supabase.from('houses').select('budget').limit(1).single();
      if (!error && data) {
        setBudget(data.budget.toString());
      }
      setIsFetching(false);
    };
    fetchBudget();
  }, []);

  const handleSaveSettings = async () => {
    if (!budget || isNaN(Number(budget))) {
      alert("Please enter a valid budget amount.");
      return;
    }
    
    setLoading(true);
    const supabase = createClient();
    
    // Update budget for all houses
    // Supabase requires a filter for updates, so we use not('id', 'is', null) to match all
    const { error } = await supabase
      .from('houses')
      .update({ budget: Number(budget) })
      .not('id', 'is', null);

    if (error) {
      alert("Error updating budgets: " + error.message);
    } else {
      alert("Successfully updated the budget for all houses!");
    }
    
    setLoading(false);
  };

  const handleResetData = async () => {
    if (confirm("Are you sure you want to reset all auction data? This will mark all groups as 'Available' and reset all house budgets!")) {
      const supabase = createClient();
      
      // Reset auction groups
      const { error: groupError } = await supabase
        .from('auction_groups')
        .update({ 
          sold_status: null, 
          sold_to_house: null, 
          sold_amount: null, 
          sold_at: null 
        })
        .not('id', 'is', null);

      if (groupError) {
         alert("Error resetting auction groups: " + groupError.message);
         return;
      }

      // Reset budgets
      const { error: houseError } = await supabase
        .from('houses')
        .update({ budget: Number(budget) }) // reset to whatever is in the input
        .not('id', 'is', null);

      if (houseError) {
         alert("Error resetting house budgets: " + houseError.message);
         return;
      }

      alert("All auction data has been successfully reset!");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Tournament Settings" />
      <div className="p-6 flex-1 bg-background">
        <div className="max-w-3xl mx-auto space-y-8">
          
          <div className="bg-card border border-border/50 p-8 relative clip-angled">
            <h2 className="text-3xl font-display font-black mb-6 uppercase tracking-widest text-primary">Configuration</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest">Tournament Name</label>
                <input 
                  type="text" 
                  defaultValue="Hostel Premier League 2026"
                  className="w-full px-4 py-3 border-2 border-border/50 bg-background text-foreground font-bold focus:outline-none focus:border-primary transition-colors clip-diagonal"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest">Base Budget per House</label>
                <input 
                  type="number" 
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  disabled={isFetching}
                  className="w-full px-4 py-3 border-2 border-border/50 bg-background text-foreground font-bold font-mono focus:outline-none focus:border-primary transition-colors clip-diagonal disabled:opacity-50"
                />
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button 
                onClick={handleSaveSettings}
                disabled={loading || isFetching}
                className="bg-primary hover:bg-primary/80 text-white font-bold uppercase tracking-widest py-3 px-8 transition-colors clip-angled disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          <div className="bg-card border border-red-500/30 p-8 relative clip-angled">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-600"></div>
            <h2 className="text-3xl font-display font-black mb-2 uppercase tracking-widest text-red-500">Danger Zone</h2>
            <p className="text-sm mb-6 text-muted-foreground font-medium uppercase tracking-wide">These actions are destructive and cannot be undone.</p>
            <div className="space-y-4">
              <button 
                onClick={handleResetData}
                className="w-full text-left px-6 py-4 border-2 border-red-500/20 bg-red-500/5 text-red-500 font-bold uppercase tracking-wider hover:bg-red-500/10 hover:border-red-500/50 transition-all clip-diagonal"
              >
                Reset All Auction Data
              </button>
              <button className="w-full text-left px-6 py-4 border-2 border-red-500/20 bg-red-500/5 text-red-500 font-bold uppercase tracking-wider hover:bg-red-500/10 hover:border-red-500/50 transition-all clip-diagonal opacity-50 cursor-not-allowed">
                Delete Tournament (Disabled)
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
