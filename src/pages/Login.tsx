import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Cake, UserPlus, LogIn } from 'lucide-react';

interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'staff';
  createdAt: string;
}

const Login = () => {
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const [registerData, setRegisterData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Initialize default admin user if not exists
  const initializeDefaultUser = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const adminExists = users.find((user: User) => user.username === 'admin');
    
    if (!adminExists) {
      const defaultAdmin: User = {
        id: '1',
        username: 'admin',
        password: 'admin', // In production, this should be hashed
        role: 'admin',
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('users', JSON.stringify([defaultAdmin]));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      initializeDefaultUser();
      const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.username === loginData.username && u.password === loginData.password);

      if (user) {
        // Set user session
        localStorage.setItem('currentUser', JSON.stringify({
          id: user.id,
          username: user.username,
          role: user.role
        }));
        
        toast({
          title: "Login successful!",
          description: `Welcome back, ${user.username}!`,
        });

        // Redirect to CRM dashboard
        window.location.href = '/crm';
      } else {
        toast({
          title: "Login failed",
          description: "Invalid username or password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (registerData.password !== registerData.confirmPassword) {
        toast({
          title: "Registration failed",
          description: "Passwords do not match.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (registerData.password.length < 4) {
        toast({
          title: "Registration failed",
          description: "Password must be at least 4 characters long.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      initializeDefaultUser();
      const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
      
      const userExists = users.find(u => u.username === registerData.username);
      if (userExists) {
        toast({
          title: "Registration failed",
          description: "Username already exists.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const newUser: User = {
        id: (users.length + 1).toString(),
        username: registerData.username,
        password: registerData.password, // In production, this should be hashed
        role: 'staff',
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      toast({
        title: "Registration successful!",
        description: "Your account has been created. You can now log in.",
      });

      // Reset form
      setRegisterData({
        username: '',
        password: '',
        confirmPassword: ''
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during registration.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'login' | 'register') => {
    const value = e.target.value;
    if (type === 'login') {
      setLoginData(prev => ({
        ...prev,
        [e.target.name]: value
      }));
    } else {
      setRegisterData(prev => ({
        ...prev,
        [e.target.name]: value
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="relative">
              <Cake className="h-12 w-12 text-primary" />
            </div>
            <div>
              <span className="font-serif text-3xl font-bold text-primary">Treat Yo Self</span>
              <p className="text-sm text-muted-foreground">Staff Portal</p>
            </div>
          </div>
          <p className="text-muted-foreground">Access your bakery management system</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" className="flex items-center space-x-2">
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </TabsTrigger>
            <TabsTrigger value="register" className="flex items-center space-x-2">
              <UserPlus className="h-4 w-4" />
              <span>Register</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card className="border-accent/20">
              <CardHeader>
                <CardTitle className="text-primary">Sign In</CardTitle>
                <CardDescription>
                  Enter your credentials to access the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-username">Username</Label>
                    <Input
                      id="login-username"
                      name="username"
                      value={loginData.username}
                      onChange={(e) => handleInputChange(e, 'login')}
                      required
                      placeholder="Enter your username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      name="password"
                      type="password"
                      value={loginData.password}
                      onChange={(e) => handleInputChange(e, 'login')}
                      required
                      placeholder="Enter your password"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-800">
                    <strong>Default Admin:</strong> username: <code>admin</code>, password: <code>admin</code>
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card className="border-accent/20">
              <CardHeader>
                <CardTitle className="text-primary">Create Account</CardTitle>
                <CardDescription>
                  Create a new staff account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-username">Username</Label>
                    <Input
                      id="register-username"
                      name="username"
                      value={registerData.username}
                      onChange={(e) => handleInputChange(e, 'register')}
                      required
                      placeholder="Choose a username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      name="password"
                      type="password"
                      value={registerData.password}
                      onChange={(e) => handleInputChange(e, 'register')}
                      required
                      placeholder="Create a password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm">Confirm Password</Label>
                    <Input
                      id="register-confirm"
                      name="confirmPassword"
                      type="password"
                      value={registerData.confirmPassword}
                      onChange={(e) => handleInputChange(e, 'register')}
                      required
                      placeholder="Confirm your password"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
