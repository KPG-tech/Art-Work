
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useContent } from '../context/ContentContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  BookOpen, 
  Plus,
  FileText,
  File,
  ExternalLink
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const LearningMaterials: React.FC = () => {
  const { currentUser } = useAuth();
  const { learningMaterials, createLearningMaterial } = useContent();
  
  const [newMaterialTitle, setNewMaterialTitle] = useState('');
  const [newMaterialDescription, setNewMaterialDescription] = useState('');
  const [newMaterialType, setNewMaterialType] = useState<'link' | 'pdf'>('link');
  const [newMaterialUrl, setNewMaterialUrl] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateMaterial = () => {
    if (!newMaterialTitle || !newMaterialDescription || !newMaterialUrl) return;
    
    createLearningMaterial(
      newMaterialTitle,
      newMaterialDescription,
      newMaterialType,
      newMaterialUrl
    );
    
    setNewMaterialTitle('');
    setNewMaterialDescription('');
    setNewMaterialType('link');
    setNewMaterialUrl('');
    setIsCreateModalOpen(false);
  };

  const openMaterial = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Learning Materials</h1>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-art-primary hover:bg-art-secondary">
              <Plus className="h-5 w-5 mr-2" />
              Add Material
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share Learning Material</DialogTitle>
              <DialogDescription>
                Share helpful resources with the art community
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="title" className="text-sm font-medium">Title</label>
                <Input
                  id="title"
                  value={newMaterialTitle}
                  onChange={(e) => setNewMaterialTitle(e.target.value)}
                  placeholder="Title of material"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <Textarea
                  id="description"
                  value={newMaterialDescription}
                  onChange={(e) => setNewMaterialDescription(e.target.value)}
                  placeholder="Describe what this resource covers"
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="type" className="text-sm font-medium">Type</label>
                <Select
                  value={newMaterialType}
                  onValueChange={(value) => setNewMaterialType(value as 'link' | 'pdf')}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="link">Link (Website)</SelectItem>
                    <SelectItem value="pdf">PDF Document</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="url" className="text-sm font-medium">URL</label>
                <Input
                  id="url"
                  value={newMaterialUrl}
                  onChange={(e) => setNewMaterialUrl(e.target.value)}
                  placeholder={newMaterialType === 'link' ? 'https://example.com' : 'https://example.com/document.pdf'}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="button" 
                onClick={handleCreateMaterial}
                disabled={!newMaterialTitle || !newMaterialDescription || !newMaterialUrl}
                className="bg-art-primary hover:bg-art-secondary"
              >
                Share Material
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {learningMaterials.length === 0 ? (
        <div className="text-center py-10">
          <div className="inline-flex rounded-full bg-art-light p-4 mb-4">
            <BookOpen className="h-8 w-8 text-art-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No materials yet</h2>
          <p className="text-muted-foreground mb-4">Be the first to share learning resources!</p>
          <Button onClick={() => setIsCreateModalOpen(true)}>Add Material</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {learningMaterials.map((material) => (
            <Card key={material.id} className="overflow-hidden">
              <CardHeader className="p-4 pb-0">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                    <img 
                      src={material.userProfilePicture}
                      alt={material.username}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{material.username}</p>
                    <p className="text-xs text-muted-foreground">
                      {material.createdAt instanceof Date 
                        ? formatDistanceToNow(material.createdAt, { addSuffix: true })
                        : formatDistanceToNow(new Date(material.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-start mb-3">
                  <div className="p-2 rounded-lg bg-art-light mr-3">
                    {material.type === 'pdf' ? (
                      <File className="h-6 w-6 text-red-600" />
                    ) : (
                      <FileText className="h-6 w-6 text-blue-500" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{material.title}</CardTitle>
                    <p className="text-xs text-muted-foreground mb-2">
                      {material.type === 'pdf' ? 'PDF Document' : 'Web Resource'}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-3">{material.description}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button 
                  onClick={() => openMaterial(material.url)}
                  className="w-full bg-art-primary hover:bg-art-secondary"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {material.type === 'pdf' ? 'Open PDF' : 'Visit Website'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default LearningMaterials;
