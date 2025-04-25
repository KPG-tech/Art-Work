
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Palette, User, Home, BarChart, BookOpen, BrainCircuit, LogOut } from 'lucide-react';

const Layout: React.FC = () => {
  const { currentUser, logout } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white border-b shadow-sm py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Palette className="h-6 w-6 text-art-primary mr-2" />
            <h1 className="text-2xl font-bold text-art-primary">Art Work</h1>
          </div>
          
          {currentUser ? (
            <div className="flex items-center space-x-4">
              <NavLink to="/profile" className="flex items-center hover:text-art-primary">
                <img 
                  src={currentUser.profilePicture} 
                  alt={currentUser.username}
                  className="h-8 w-8 rounded-full object-cover mr-2 border border-art-light" 
                />
                <span className="font-medium">{currentUser.username}</span>
              </NavLink>
              <Button 
                variant="ghost" 
                onClick={logout}
                className="flex items-center text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex space-x-3">
              <Button variant="outline" asChild>
                <NavLink to="/login">Login</NavLink>
              </Button>
              <Button asChild>
                <NavLink to="/signup">Sign Up</NavLink>
              </Button>
            </div>
          )}
        </div>
      </header>

      {currentUser && (
        <nav className="bg-white border-b shadow-sm">
          <div className="container mx-auto px-6">
            <ul className="flex space-x-6">
              <li>
                <NavLink 
                  to="/" 
                  className={({ isActive }) => 
                    `flex items-center py-4 border-b-2 ${isActive ? 'border-art-primary text-art-primary' : 'border-transparent hover:text-art-primary'}`
                  }
                  end
                >
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/polls" 
                  className={({ isActive }) => 
                    `flex items-center py-4 border-b-2 ${isActive ? 'border-art-primary text-art-primary' : 'border-transparent hover:text-art-primary'}`
                  }
                >
                  <BarChart className="h-4 w-4 mr-2" />
                  Polls
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/materials" 
                  className={({ isActive }) => 
                    `flex items-center py-4 border-b-2 ${isActive ? 'border-art-primary text-art-primary' : 'border-transparent hover:text-art-primary'}`
                  }
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Learning Materials
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/quiz" 
                  className={({ isActive }) => 
                    `flex items-center py-4 border-b-2 ${isActive ? 'border-art-primary text-art-primary' : 'border-transparent hover:text-art-primary'}`
                  }
                >
                  <BrainCircuit className="h-4 w-4 mr-2" />
                  Quiz
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/profile" 
                  className={({ isActive }) => 
                    `flex items-center py-4 border-b-2 ${isActive ? 'border-art-primary text-art-primary' : 'border-transparent hover:text-art-primary'}`
                  }
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
      )}

      <main className="flex-1 bg-slate-50">
        <div className="container mx-auto px-6 py-8">
          <Outlet />
        </div>
      </main>

      <footer className="bg-white border-t py-6">
        <div className="container mx-auto px-6 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Art Work. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
