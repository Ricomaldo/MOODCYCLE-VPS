import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { ContentManagementTabs } from "@/components/ContentManagementTabs";
import { useTheme } from "@/contexts/ThemeContext";

const ContentManagement = () => {
  const [searchParams] = useSearchParams();
  const [currentTab, setCurrentTab] = useState("Variantes Personas");
  const { isDarkMode } = useTheme();

  const getTabName = (tabValue: string) => {
    const tabMap: { [key: string]: string } = {
      'phases': 'Phases Infos',
      'base-insights': 'Conseils génériques',
      'persona-variants': 'Variantes Personas',
      'closings': 'Conclusions',
      'test-formula': 'Simulation'
    };
    return tabMap[tabValue] || 'Variantes Personas';
  };

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl) {
      setCurrentTab(getTabName(tabFromUrl));
    }
  }, [searchParams]);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <SidebarProvider>
        <div className="flex w-full min-h-screen">
          <AppSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <AppHeader 
              currentPage="Gestion de contenu" 
              currentTab={currentTab}
            />
            <ContentManagementTabs onTabChange={(tab) => setCurrentTab(getTabName(tab))} />
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default ContentManagement;
