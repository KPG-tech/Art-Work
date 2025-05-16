
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { toast } from '../components/ui/use-toast';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users data
const mockUsers: User[] = [
  {
    id: '1',
    username: 'artmaster',
    email: 'artmaster@example.com',
    profilePicture: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    bio: 'Professional artist with 10 years of experience.',
    followers: ['2', '3'],
    following: ['2'],
    createdAt: new Date('2023-01-10')
  },
  {
    id: '2',
    username: 'creativemind',
    email: 'creative@example.com',
    profilePicture: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
    bio: 'Digital artist and UI/UX designer.',
    followers: ['1'],
    following: ['1', '3'],
    createdAt: new Date('2023-02-15')
  },
  {
    id: '3',
    username: 'artlover',
    email: 'artlover@example.com',
    profilePicture: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843',
    bio: 'Art enthusiast and collector.',
    followers: ['2'],
    following: ['1'],
    createdAt: new Date('2023-03-20')
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>(mockUsers);

  useEffect(() => {
    // Check for stored user data in localStorage
    const storedUser = localStorage.getItem('artWorkUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('artWorkUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user by email (in a real app, we'd validate password)
      const user = users.find(u => u.email === email);
      if (user) {
        setCurrentUser(user);
        localStorage.setItem('artWorkUser', JSON.stringify(user));
        toast({
          title: "Login successful",
          description: `Welcome back, ${user.username}!`,
        });
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    setLoading(true);
    try {
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email already exists
      if (users.some(u => u.email === email)) {
        toast({
          title: "Signup failed",
          description: "Email already in use",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Check if username already exists
      if (users.some(u => u.username === username)) {
        toast({
          title: "Signup failed",
          description: "Username already in use",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Create new user
      const newUser: User = {
        id: `${users.length + 1}`,
        username,
        email,
        profilePicture: `https://images.unsplash.com/photo-1500673922987-e212871fec22`,
        bio: '',
        followers: [],
        following: [],
        createdAt: new Date()
      };

      // Add user to users array
      setUsers([...users, newUser]);
      
      // Set as current user
      setCurrentUser(newUser);
      localStorage.setItem('artWorkUser', JSON.stringify(newUser));
      
      toast({
        title: "Signup successful",
        description: `Welcome to Art Work, ${username}!`,
      });
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Signup failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('artWorkUser');
    toast({
      title: "Logout successful",
      description: "You've been logged out",
    });
  };

  const followUser = (userId: string) => {
    if (!currentUser) return;

    setUsers(prevUsers => 
      prevUsers.map(user => {
        // Add userId to current user's following list
        if (user.id === currentUser.id) {
          const updatedUser = {
            ...user,
            following: [...user.following, userId]
          };
          setCurrentUser(updatedUser);
          localStorage.setItem('artWorkUser', JSON.stringify(updatedUser));
          return updatedUser;
        }
        
        // Add current user's id to the followed user's followers list
        if (user.id === userId) {
          return {
            ...user,
            followers: [...user.followers, currentUser.id]
          };
        }
        
        return user;
      })
    );

    toast({
      title: "Success",
      description: "You are now following this user",
    });
  };

  const unfollowUser = (userId: string) => {
    if (!currentUser) return;

    setUsers(prevUsers => 
      prevUsers.map(user => {
        // Remove userId from current user's following list
        if (user.id === currentUser.id) {
          const updatedUser = {
            ...user,
            following: user.following.filter(id => id !== userId)
          };
          setCurrentUser(updatedUser);
          localStorage.setItem('artWorkUser', JSON.stringify(updatedUser));
          return updatedUser;
        }
        
        // Remove current user's id from the unfollowed user's followers list
        if (user.id === userId) {
          return {
            ...user,
            followers: user.followers.filter(id => id !== currentUser.id)
          };
        }
        
        return user;
      })
    );

    toast({
      title: "Success",
      description: "You have unfollowed this user",
    });
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      isAuthenticated: !!currentUser,
      login,
      signup,
      logout,
      followUser,
      unfollowUser,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
