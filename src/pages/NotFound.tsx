
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Palette } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <Palette className="h-20 w-20 text-art-primary mx-auto mb-6" />
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Oops! This page has gone off the canvas</p>
        <Button asChild size="lg" className="bg-art-primary hover:bg-art-secondary">
          <Link to="/">Return to Gallery</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
