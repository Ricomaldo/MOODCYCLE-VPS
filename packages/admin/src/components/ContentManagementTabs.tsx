import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BaseInsightsTab } from "@/components/BaseInsightsTab";
import { PersonaVariantsTab } from "@/components/PersonaVariantsTab";
import { TestFormulaTab } from "@/components/TestFormulaTab";
import { useTheme } from "@/contexts/ThemeContext";

interface ContentManagementTabsProps {
  onTabChange?: (tab: string) => void;
}

export function ContentManagementTabs({ onTabChange }: ContentManagementTabsProps) {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("persona-variants");
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  // TEST AVEC HTML PUR - SANS SHADCN UI
  return (
    <main className={`flex-1 p-4 lg:p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} overflow-auto`}>
      <div className="max-w-7xl mx-auto">
        
        <div className="space-y-6">
          {/* TABS NAVIGATION - HTML PUR */}
          <div className="overflow-x-auto">
            <div className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} border p-1 w-full min-w-max inline-flex h-10 items-center justify-center rounded-md`}>

              <button 
                onClick={() => handleTabChange("base-insights")}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm py-1.5 px-3 lg:px-4 text-xs lg:text-sm font-medium transition-all ${
                  activeTab === "base-insights" 
                    ? 'bg-gradient-to-r from-pink-500/20 to-lime-400/20 text-white border border-pink-500/30' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Conseils génériques
              </button>
              
              <button 
                onClick={() => handleTabChange("persona-variants")}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm py-1.5 px-3 lg:px-4 text-xs lg:text-sm font-medium transition-all ${
                  activeTab === "persona-variants" 
                    ? 'bg-gradient-to-r from-pink-500/20 to-lime-400/20 text-white border border-pink-500/30' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Variantes Personas
              </button>
              
              <button 
                onClick={() => handleTabChange("closings")}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm py-1.5 px-3 lg:px-4 text-xs lg:text-sm font-medium transition-all ${
                  activeTab === "closings" 
                    ? 'bg-gradient-to-r from-pink-500/20 to-lime-400/20 text-white border border-pink-500/30' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Conclusions TEST PURE
              </button>
              
              <button 
                onClick={() => handleTabChange("phases")}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm py-1.5 px-3 lg:px-4 text-xs lg:text-sm font-medium transition-all ${
                  activeTab === "phases" 
                    ? 'bg-gradient-to-r from-pink-500/20 to-lime-400/20 text-white border border-pink-500/30' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Phases TEST PURE
              </button>

            </div>
          </div>
          
          {/* CONTENT - HTML PUR */}
          {activeTab === "phases" && (
            <div className="space-y-6">
              <div className="bg-green-500 p-8 text-white text-center text-2xl">🎉 PHASES TAB WORKS WITH PURE HTML!</div>
            </div>
          )}
          
          {activeTab === "base-insights" && (
            <div className="space-y-6">
              <BaseInsightsTab />
            </div>
          )}
          
          {activeTab === "persona-variants" && (
            <div className="space-y-6">
              <PersonaVariantsTab />
            </div>
          )}
          
          {activeTab === "closings" && (
            <div className="space-y-6">
              <div className="bg-blue-500 p-8 text-white text-center text-2xl">🎉 CLOSINGS TAB WORKS WITH PURE HTML!</div>
            </div>
          )}
          
          {activeTab === "test-formula" && (
            <div className="space-y-6">
              <TestFormulaTab />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
// Force deploy Tue Jun 18 19:25:02 CEST 2025
