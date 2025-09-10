import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const LogoutButton = () => {
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the system.",
    });
    window.location.href = '/login';
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleLogout}
      className="flex items-center space-x-2"
    >
      <LogOut className="h-4 w-4" />
      <span>Logout</span>
    </Button>
  );
};

export default LogoutButton;
