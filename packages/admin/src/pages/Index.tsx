import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { Dashboard } from "@/components/Dashboard";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleNavigateToTab = (tab: string) => {
    navigate(`/content?tab=${tab}`);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <SidebarProvider>
        <div className="flex w-full min-h-screen">
          <AppSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <AppHeader currentPage="Tableau de bord" />
            <main className={`flex-1 p-4 lg:p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} overflow-auto`}>
              <div className="max-w-7xl mx-auto">
                {/* <div className="mb-6">
                  <h1 className={`text-3xl lg:text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Bonjour {user?.displayName} !
                  </h1>
                  <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Voici un aperçu de vos données aujourd'hui
                  </p>
                </div> */}
                <Dashboard onNavigateToTab={handleNavigateToTab} />
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Index;
