
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";

export function ProfileSettings() {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    role: user?.role || '',
    email: user?.username ? `${user.username}@moodcycle.com` : ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName,
        role: user.role,
        email: `${user.username}@moodcycle.com`
      });
    }
  }, [user]);

  const handleSave = () => {
    // Save to localStorage
    const updatedUser = {
      ...user,
      displayName: formData.displayName,
      role: formData.role
    };
    
    localStorage.setItem('moodcycle_user', JSON.stringify(updatedUser));
    
    toast({
      title: "Profil mis à jour",
      description: "Vos modifications ont été sauvegardées avec succès.",
    });

    // Force a page reload to update the UI with new user data
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <Card className={`w-full max-w-md ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <CardHeader>
        <CardTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>
          Paramètres du profil
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="displayName" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
            Pseudo/Nom
          </Label>
          <Input
            id="displayName"
            value={formData.displayName}
            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
            className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="role" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
            Rôle
          </Label>
          <Input
            id="role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
            Email
          </Label>
          <Input
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
          />
        </div>
        
        <Button onClick={handleSave} className="w-full">
          Sauvegarder
        </Button>
      </CardContent>
    </Card>
  );
}
