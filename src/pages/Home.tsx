
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useContent } from '../context/ContentContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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
  Heart, 
  MessageSquare, 
  Share, 
  Plus,
  User,
  Image as ImageIcon
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const Home: React.FC = () => {
  const { currentUser, followUser, unfollowUser } = useAuth();
  const { posts, createPost, likePost, unlikePost, addComment } = useContent();
  
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostImage, setNewPostImage] = useState('');
  const [newPostDescription, setNewPostDescription] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // For comments
  const [commentContent, setCommentContent] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

  const handleCreatePost = () => {
    if (!newPostTitle || !newPostImage || !newPostDescription) return;
    
    createPost(newPostTitle, newPostImage, newPostDescription);
    
    setNewPostTitle('');
    setNewPostImage('');
    setNewPostDescription('');
    setIsCreateModalOpen(false);
  };

  const toggleComments = (postId: string) => {
    setExpandedComments({
      ...expandedComments,
      [postId]: !expandedComments[postId]
    });
  };

  const handleAddComment = (postId: string) => {
    const content = commentContent[postId];
    if (!content) return;
    
    addComment(postId, content);
    
    setCommentContent({
      ...commentContent,
      [postId]: ''
    });
  };

  const handleFollow = (userId: string) => {
    followUser(userId);
  };

  const handleUnfollow = (userId: string) => {
    unfollowUser(userId);
  };

  const isFollowing = (userId: string) => {
    return currentUser?.following.includes(userId);
  };

  const placeholderImages = [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
    'https://images.unsplash.com/photo-1518495973542-4542c06a5843',
    'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843',
    'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7',
    'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Art Feed</h1>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-art-primary hover:bg-art-secondary">
              <Plus className="h-5 w-5 mr-2" />
              Create Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Post</DialogTitle>
              <DialogDescription>
                Share your artwork or creative thoughts with the community
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="title" className="text-sm font-medium">Title</label>
                <Input
                  id="title"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="Title of your post"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="image" className="text-sm font-medium">Image URL</label>
                <div className="space-y-2">
                  <Input
                    id="image"
                    value={newPostImage}
                    onChange={(e) => setNewPostImage(e.target.value)}
                    placeholder="URL of your image"
                  />
                  <div className="text-sm text-muted-foreground">
                    Need an image? Try one of these:
                    <div className="flex flex-wrap gap-2 mt-2">
                      {placeholderImages.map((url, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setNewPostImage(url)}
                          className="w-10 h-10 rounded-md border overflow-hidden"
                        >
                          <img src={url} alt={`Sample ${index + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <Textarea
                  id="description"
                  value={newPostDescription}
                  onChange={(e) => setNewPostDescription(e.target.value)}
                  placeholder="Describe your artwork or share your thoughts"
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleCreatePost} className="bg-art-primary hover:bg-art-secondary">
                Post
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-10">
          <div className="inline-flex rounded-full bg-art-light p-4 mb-4">
            <ImageIcon className="h-8 w-8 text-art-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No posts yet</h2>
          <p className="text-muted-foreground mb-4">Be the first to share your artwork!</p>
          <Button onClick={() => setIsCreateModalOpen(true)}>Create a Post</Button>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <CardHeader className="p-4 pb-0">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                      <img 
                        src={post.userProfilePicture}
                        alt={post.username}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{post.username}</p>
                      <p className="text-xs text-muted-foreground">
                        {post.createdAt instanceof Date 
                          ? formatDistanceToNow(post.createdAt, { addSuffix: true })
                          : formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  
                  {currentUser && post.userId !== currentUser.id && (
                    isFollowing(post.userId) ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleUnfollow(post.userId)}
                      >
                        Unfollow
                      </Button>
                    ) : (
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => handleFollow(post.userId)}
                      >
                        Follow
                      </Button>
                    )
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                <div className="mb-4 rounded-md overflow-hidden border bg-slate-50 h-64">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-gray-700">{post.description}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex flex-col">
                <div className="flex justify-between items-center w-full">
                  <div className="flex space-x-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center gap-1 px-2"
                      onClick={() => currentUser && (
                        post.likes.includes(currentUser.id) 
                          ? unlikePost(post.id) 
                          : likePost(post.id)
                      )}
                    >
                      <Heart 
                        className={`h-5 w-5 ${currentUser && post.likes.includes(currentUser.id) ? 'fill-red-500 text-red-500' : ''}`} 
                      />
                      <span>{post.likes.length}</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center gap-1 px-2"
                      onClick={() => toggleComments(post.id)}
                    >
                      <MessageSquare className="h-5 w-5" />
                      <span>{post.comments.length}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1 px-2">
                      <Share className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {post.likes.length} likes · {post.comments.length} comments
                  </div>
                </div>
                
                {expandedComments[post.id] && (
                  <div className="mt-4 w-full">
                    <Separator className="my-2" />
                    <div className="space-y-3 max-h-60 overflow-y-auto my-3">
                      {post.comments.length === 0 ? (
                        <div className="text-center py-4 text-muted-foreground">
                          No comments yet. Be the first to comment!
                        </div>
                      ) : (
                        post.comments.map((comment) => (
                          <div key={comment.id} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                              <img 
                                src={comment.userProfilePicture}
                                alt={comment.username}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="bg-slate-50 rounded-lg p-2">
                                <p className="font-medium text-sm">{comment.username}</p>
                                <p className="text-sm">{comment.content}</p>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {comment.createdAt instanceof Date 
                                  ? formatDistanceToNow(comment.createdAt, { addSuffix: true })
                                  : formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    
                    {currentUser && (
                      <div className="flex gap-2 mt-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                          <img 
                            src={currentUser.profilePicture}
                            alt={currentUser.username}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 flex">
                          <Input
                            placeholder="Add a comment..."
                            value={commentContent[post.id] || ''}
                            onChange={(e) => setCommentContent({
                              ...commentContent,
                              [post.id]: e.target.value
                            })}
                            className="rounded-r-none"
                          />
                          <Button 
                            onClick={() => handleAddComment(post.id)}
                            disabled={!commentContent[post.id]}
                            className="rounded-l-none bg-art-primary hover:bg-art-secondary"
                          >
                            Post
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
