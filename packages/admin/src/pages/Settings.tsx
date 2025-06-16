import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun, LogOut } from "lucide-react";

const Settings = () => {
  const { logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <SidebarProvider>
        <div className="flex w-full min-h-screen">
          <AppSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <AppHeader currentPage="Paramètres" />
            <main className={`flex-1 p-4 lg:p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} overflow-auto`}>
              <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                  <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Paramètres</h2>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Configurez vos préférences d'administration MoodCycle</p>
                </div>
                
                <div className="space-y-6">
                  <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm`}>
                    <CardHeader>
                      <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                        {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                        Apparence
                      </CardTitle>
                      <CardDescription className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Personnalisez le thème de l'interface
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Mode sombre</Label>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Utiliser le thème sombre pour l'interface</p>
                        </div>
                        <Switch 
                          checked={isDarkMode}
                          onCheckedChange={toggleTheme}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm`}>
                    <CardHeader>
                      <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                        <LogOut className="w-5 h-5" />
                        Compte
                      </CardTitle>
                      <CardDescription className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Gérez votre session de compte
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        variant="outline" 
                        onClick={handleLogout}
                        className="border-red-600 text-red-400 hover:bg-red-900/20"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Se déconnecter
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Settings;