
import { Bell, User, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useAuth } from "@/contexts/AuthContext";
import { ProfileSettings } from "@/components/ProfileSettings";
import { useState } from "react";

interface AppHeaderProps {
  currentPage?: string;
  currentTab?: string;
}

export function AppHeader({ currentPage = "Tableau de bord", currentTab }: AppHeaderProps) {
  const { logout, user } = useAuth();
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const getAdminAvatar = (username: string) => {
    switch (username) {
      case 'jeza':
        return '/images/avatars/profilJezabel.png';
      case 'admin':
        return '/images/avatars/profilEric.png';
      default:
        return '/images/avatars/profilEric.png';
    }
  };

  const getBreadcrumbs = () => {
    const breadcrumbs = [
      { label: "Tableau de bord", href: "/" }
    ];

    if (currentPage !== "Tableau de bord") {
      breadcrumbs.push({ 
        label: currentPage, 
        href: currentPage === "Gestion de contenu" ? "/content" : 
              currentPage === "Analytiques" ? "/analytics" : 
              currentPage === "Données Utilisateurs" ? "/users" :
              currentPage === "Infrastructure" ? "/infrastructure" : "/settings"
      });
    }

    if (currentTab) {
      breadcrumbs.push({ label: currentTab, href: "#" });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 lg:px-6 py-4">
        <div className="flex items-center gap-2 lg:gap-4 min-w-0 flex-1">
          <SidebarTrigger className="text-gray-300 hover:text-white flex-shrink-0" />
          <Breadcrumb className="min-w-0">
            <BreadcrumbList className="flex-wrap">
              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center">
                  <BreadcrumbItem className="min-w-0">
                    {index === breadcrumbs.length - 1 ? (
                      <BreadcrumbPage className="text-white font-medium truncate">
                        {crumb.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={crumb.href} className="text-gray-400 hover:text-white truncate">
                        {crumb.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbs.length - 1 && (
                    <BreadcrumbSeparator className="text-gray-600 mx-1 lg:mx-2 flex-shrink-0" />
                  )}
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        
        <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-300 hover:text-white hover:bg-gray-800/50 relative w-9 h-9 lg:w-10 lg:h-10"
          >
            <Bell className="w-4 h-4 lg:w-5 lg:h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            </span>
          </Button>
          
          <div className="flex items-center gap-2 lg:gap-3 pl-2 lg:pl-3 border-l border-gray-700">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 lg:gap-3 cursor-pointer hover:bg-gray-800/50 rounded-lg p-1 lg:p-2 transition-colors">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs lg:text-sm font-medium text-white">
                      {user?.displayName} / {user?.role}
                    </p>
                    <p className="text-xs text-gray-400">{user?.username}@moodcycle.com</p>
                  </div>
                  <Avatar className="w-8 h-8 lg:w-10 lg:h-10 ring-2 ring-gray-700">
                    <AvatarImage src={getAdminAvatar(user?.username || '')} />
                    <AvatarFallback className="bg-gray-800 text-white">
                      <User className="w-3 h-3 lg:w-5 lg:h-5" />
                    </AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-56 bg-gray-800 border-gray-700 text-white"
              >
                <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
                  <DialogTrigger asChild>
                    <DropdownMenuItem className="focus:bg-gray-700" onSelect={(e) => e.preventDefault()}>
                      <User className="mr-2 h-4 w-4" />
                      Paramètres du profil
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-800 border-gray-700">
                    <ProfileSettings />
                  </DialogContent>
                </Dialog>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="focus:bg-gray-700 text-red-400 focus:text-red-300"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
