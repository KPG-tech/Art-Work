
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useContent } from '../context/ContentContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Heart,
  MessageSquare,
  Trash2,
  Edit,
  BarChart,
  FileText,
  User,
  PenSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const Profile: React.FC = () => {
  const { currentUser } = useAuth();
  const { posts, polls, learningMaterials, updatePost, deletePost, deletePoll, deleteLearningMaterial } = useContent();
  const navigate = useNavigate();

  const [editingPost, setEditingPost] = useState<any>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedImage, setEditedImage] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Redirect to login if not authenticated
  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const userPosts = posts.filter(post => post.userId === currentUser.id);
  const userPolls = polls.filter(poll => poll.userId === currentUser.id);
  const userMaterials = learningMaterials.filter(material => material.userId === currentUser.id);

  const handleEditPost = (post: any) => {
    setEditingPost(post);
    setEditedTitle(post.title);
    setEditedImage(post.image);
    setEditedDescription(post.description);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingPost) {
      updatePost(editingPost.id, editedTitle, editedImage, editedDescription);
      setIsEditModalOpen(false);
      setEditingPost(null);
    }
  };

  const handleDeletePost = (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(postId);
    }
  };

  const handleDeletePoll = (pollId: string) => {
    if (window.confirm('Are you sure you want to delete this poll?')) {
      deletePoll(pollId);
    }
  };

  const handleDeleteMaterial = (materialId: string) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      deleteLearningMaterial(materialId);
    }
  };

  const createdAt = currentUser.createdAt instanceof Date 
    ? format(currentUser.createdAt, 'MMMM dd, yyyy')
    : format(new Date(currentUser.createdAt), 'MMMM dd, yyyy');

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
              <img 
                src={currentUser.profilePicture}
                alt={currentUser.username}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                <h1 className="text-3xl font-bold">{currentUser.username}</h1>
                <Button variant="outline" className="mt-2 md:mt-0">
                  <PenSquare className="h-4 w-4 mr-2" /> 
                  Edit Profile
                </Button>
              </div>
              <p className="text-muted-foreground mb-4">
                {currentUser.bio || 'No bio yet.'}
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  Joined: {createdAt}
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">{currentUser.followers.length}</span> Followers
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">{currentUser.following.length}</span> Following
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">{userPosts.length}</span> Posts
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="posts">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <FileText className="h-4 w-4" /> My Posts
          </TabsTrigger>
          <TabsTrigger value="polls" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" /> My Polls
          </TabsTrigger>
          <TabsTrigger value="materials" className="flex items-center gap-2">
            <FileText className="h-4 w-4" /> My Materials
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts">
          {userPosts.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-lg border">
              <div className="inline-flex rounded-full bg-slate-100 p-4 mb-4">
                <FileText className="h-8 w-8 text-slate-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No posts yet</h2>
              <p className="text-muted-foreground mb-4">You haven't created any posts yet.</p>
              <Button 
                onClick={() => navigate('/')}
                className="bg-art-primary hover:bg-art-secondary"
              >
                Create Your First Post
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {userPosts.map(post => (
                <Card key={post.id} className="overflow-hidden">
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                        <p className="text-sm text-muted-foreground mb-4">
                          {post.createdAt instanceof Date 
                            ? format(post.createdAt, 'PPP')
                            : format(new Date(post.createdAt), 'PPP')}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEditPost(post)}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeletePost(post.id)}
                          className="h-8 w-8 text-red-400 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="rounded-md overflow-hidden border bg-slate-50 h-48 mb-4">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-gray-700 mb-4">{post.description}</p>
                    
                    <div className="flex items-center text-muted-foreground text-sm">
                      <div className="flex items-center mr-4">
                        <Heart className="h-4 w-4 mr-1" />
                        <span>{post.likes.length} likes</span>
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        <span>{post.comments.length} comments</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="polls">
          {userPolls.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-lg border">
              <div className="inline-flex rounded-full bg-slate-100 p-4 mb-4">
                <BarChart className="h-8 w-8 text-slate-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No polls yet</h2>
              <p className="text-muted-foreground mb-4">You haven't created any polls yet.</p>
              <Button 
                onClick={() => navigate('/polls')}
                className="bg-art-primary hover:bg-art-secondary"
              >
                Create Your First Poll
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {userPolls.map(poll => {
                const totalVotes = poll.options.reduce((sum, option) => sum + option.votes.length, 0);
                
                return (
                  <Card key={poll.id} className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold">{poll.question}</h3>
                        <p className="text-sm text-muted-foreground">
                          {poll.createdAt instanceof Date 
                            ? format(poll.createdAt, 'PPP')
                            : format(new Date(poll.createdAt), 'PPP')}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeletePoll(poll.id)}
                        className="h-8 w-8 text-red-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      {poll.options.map((option, index) => {
                        const percentage = totalVotes === 0 
                          ? 0 
                          : (option.votes.length / totalVotes) * 100;
                        
                        return (
                          <div key={option.id} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{option.text}</span>
                              <span>{percentage.toFixed(0)}% ({option.votes.length})</span>
                            </div>
                            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-art-primary"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {totalVotes} total {totalVotes === 1 ? 'vote' : 'votes'}
                    </p>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="materials">
          {userMaterials.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-lg border">
              <div className="inline-flex rounded-full bg-slate-100 p-4 mb-4">
                <FileText className="h-8 w-8 text-slate-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No materials yet</h2>
              <p className="text-muted-foreground mb-4">You haven't shared any learning materials yet.</p>
              <Button 
                onClick={() => navigate('/materials')}
                className="bg-art-primary hover:bg-art-secondary"
              >
                Share Your First Material
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userMaterials.map(material => (
                <Card key={material.id} className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{material.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {material.createdAt instanceof Date 
                          ? format(material.createdAt, 'PPP')
                          : format(new Date(material.createdAt), 'PPP')}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteMaterial(material.id)}
                      className="h-8 w-8 text-red-400 hover:text-red-500 flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    <div className="bg-slate-100 p-2 rounded-full mr-3">
                      <FileText className="h-4 w-4 text-art-primary" />
                    </div>
                    <div className="text-sm">
                      {material.type === 'pdf' ? 'PDF Document' : 'Web Resource'}
                    </div>
                  </div>
                  
                  <p className="text-sm mb-4">{material.description}</p>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => window.open(material.url, '_blank', 'noopener,noreferrer')}
                  >
                    View {material.type === 'pdf' ? 'PDF' : 'Website'}
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Post Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
            <DialogDescription>
              Update your post details
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="edit-title" className="text-sm font-medium">Title</label>
              <Input
                id="edit-title"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="edit-image" className="text-sm font-medium">Image URL</label>
              <Input
                id="edit-image"
                value={editedImage}
                onChange={(e) => setEditedImage(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="edit-description" className="text-sm font-medium">Description</label>
              <Textarea
                id="edit-description"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleSaveEdit}
              className="bg-art-primary hover:bg-art-secondary"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
