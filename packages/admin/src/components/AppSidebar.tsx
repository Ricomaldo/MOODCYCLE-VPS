import { LayoutDashboard, FileText, BarChart3, Users, Server, Settings, Activity } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Tableau de bord",
    icon: LayoutDashboard,
    url: "/",
  },
  {
    title: "Gestion de contenu",
    icon: FileText,
    url: "/content",
  },
  {
    title: "Analytiques",
    icon: BarChart3,
    url: "/analytics",
  },
  {
    title: "Analytics Avancés",
    icon: Activity,
    url: "/advanced-analytics",
  },
  {
    title: "Données Utilisateurs",
    icon: Users,
    url: "/users",
  },
  {
    title: "Infrastructure",
    icon: Server,
    url: "/infrastructure",
  },
  {
    title: "Paramètres",
    icon: Settings,
    url: "/settings",
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { isDarkMode } = useTheme();

  return (
    <Sidebar className={`${isDarkMode ? 'border-gray-800 bg-gray-900/80' : 'border-gray-200 bg-white/80'} border-r backdrop-blur-sm`}>
      <SidebarContent>
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-lime-400 bg-clip-text text-transparent">
            MoodCycle
          </h1>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Tableau de bord Admin</p>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-xs uppercase tracking-wider px-6`}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      className={`mx-3 rounded-lg ${
                        isActive 
                          ? 'bg-gradient-to-r from-pink-500/20 to-lime-400/20 text-white border border-pink-500/30' 
                          : `${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800/50' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`
                      }`}
                    >
                      <Link to={item.url} className="flex items-center gap-3 px-3 py-2">
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
