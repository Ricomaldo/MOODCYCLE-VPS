import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BaseInsightsTab } from "@/components/BaseInsightsTab";
import { PersonaVariantsTab } from "@/components/PersonaVariantsTab";
// import { PhasesTab } from "@/components/PhasesTab";
// import { ClosingsTab } from "@/components/ClosingsTab";
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

  return (
    <main className={`flex-1 p-4 lg:p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} overflow-auto`}>
      <div className="max-w-7xl mx-auto">
        {/* <div className="mb-6">
          <h2 className={`text-2xl lg:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Gestion de Contenu</h2>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Gérez les conseils, personas et contenu thérapeutique</p>
        </div> */}
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <div className="overflow-x-auto">
            <TabsList className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} border p-1 w-full min-w-max`}>

              <TabsTrigger 
                value="base-insights" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500/20 data-[state=active]:to-lime-400/20 data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-pink-500/30 text-xs lg:text-sm px-3 lg:px-4"
              >
                Conseils génériques
              </TabsTrigger>
              <TabsTrigger 
                value="persona-variants"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500/20 data-[state=active]:to-lime-400/20 data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-pink-500/30 text-xs lg:text-sm px-3 lg:px-4"
              >
                Variantes Personas
              </TabsTrigger>
              <TabsTrigger 
                value="closings"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500/20 data-[state=active]:to-lime-400/20 data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-pink-500/30 text-xs lg:text-sm px-3 lg:px-4"
              >
                Conclusions TEST
              </TabsTrigger>
              <TabsTrigger 
                value="phases"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500/20 data-[state=active]:to-lime-400/20 data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-pink-500/30 text-xs lg:text-sm px-3 lg:px-4"
              >
                Phases TEST
              </TabsTrigger>
              {/* <TabsTrigger 
                value="test-formula"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500/20 data-[state=active]:to-lime-400/20 data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-pink-500/30 text-xs lg:text-sm px-3 lg:px-4"
              >
                Simulation
              </TabsTrigger> */}
            </TabsList>
          </div>
          
          <TabsContent value="phases" className="space-y-6">
            <div className="bg-green-500 p-4 text-white">PHASES TAB WORKS!</div>
          </TabsContent>
          
          <TabsContent value="base-insights" className="space-y-6">
            <BaseInsightsTab />
          </TabsContent>
          
          <TabsContent value="persona-variants" className="space-y-6">
            <PersonaVariantsTab />
          </TabsContent>
          
          <TabsContent value="closings" className="space-y-6">
            <div className="bg-blue-500 p-4 text-white">CLOSINGS TAB WORKS!</div>
          </TabsContent>
          
          <TabsContent value="test-formula" className="space-y-6">
            <TestFormulaTab />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
// Force deploy Tue Jun 18 19:20:02 CEST 2025
