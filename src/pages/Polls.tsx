
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useContent } from '../context/ContentContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
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
  BarChart, 
  Plus,
  User
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const Polls: React.FC = () => {
  const { currentUser } = useAuth();
  const { polls, createPoll, voteInPoll } = useContent();
  
  const [newPollQuestion, setNewPollQuestion] = useState('');
  const [newPollOptions, setNewPollOptions] = useState(['', '', '']);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreatePoll = () => {
    if (!newPollQuestion || newPollOptions.some(option => !option)) return;
    
    createPoll(newPollQuestion, newPollOptions);
    
    setNewPollQuestion('');
    setNewPollOptions(['', '', '']);
    setIsCreateModalOpen(false);
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...newPollOptions];
    updatedOptions[index] = value;
    setNewPollOptions(updatedOptions);
  };

  const getVotePercentage = (votes: string[], totalVotes: number) => {
    if (totalVotes === 0) return 0;
    return (votes.length / totalVotes) * 100;
  };

  const hasVoted = (poll: any) => {
    if (!currentUser) return false;
    return poll.options.some((option: any) => option.votes.includes(currentUser.id));
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Polls</h1>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-art-primary hover:bg-art-secondary">
              <Plus className="h-5 w-5 mr-2" />
              Create Poll
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Poll</DialogTitle>
              <DialogDescription>
                Ask the community about art techniques, preferences or advice
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="question" className="text-sm font-medium">Question</label>
                <Input
                  id="question"
                  value={newPollQuestion}
                  onChange={(e) => setNewPollQuestion(e.target.value)}
                  placeholder="Ask a question..."
                />
              </div>
              {newPollOptions.map((option, index) => (
                <div key={index} className="grid gap-2">
                  <label htmlFor={`option-${index}`} className="text-sm font-medium">Option {index + 1}</label>
                  <Input
                    id={`option-${index}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                  />
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="button" 
                onClick={handleCreatePoll}
                disabled={!newPollQuestion || newPollOptions.some(option => !option)}
                className="bg-art-primary hover:bg-art-secondary"
              >
                Create Poll
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {polls.length === 0 ? (
        <div className="text-center py-10">
          <div className="inline-flex rounded-full bg-art-light p-4 mb-4">
            <BarChart className="h-8 w-8 text-art-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No polls yet</h2>
          <p className="text-muted-foreground mb-4">Be the first to create a poll!</p>
          <Button onClick={() => setIsCreateModalOpen(true)}>Create a Poll</Button>
        </div>
      ) : (
        <div className="space-y-6">
          {polls.map((poll) => {
            const totalVotes = poll.options.reduce((sum, option) => sum + option.votes.length, 0);
            
            return (
              <Card key={poll.id} className="overflow-hidden">
                <CardHeader className="p-4 pb-0">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                      <img 
                        src={poll.userProfilePicture}
                        alt={poll.username}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{poll.username}</p>
                      <p className="text-xs text-muted-foreground">
                        {poll.createdAt instanceof Date 
                          ? formatDistanceToNow(poll.createdAt, { addSuffix: true })
                          : formatDistanceToNow(new Date(poll.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="mb-4 text-xl">{poll.question}</CardTitle>
                  <div className="space-y-3">
                    {poll.options.map((option) => {
                      const percentage = getVotePercentage(option.votes, totalVotes);
                      const userVoted = currentUser && option.votes.includes(currentUser.id);
                      
                      return (
                        <div key={option.id} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <Button 
                              variant={userVoted ? "default" : "outline"}
                              className={`w-full justify-start h-auto py-2 ${userVoted ? 'bg-art-primary text-white' : ''}`}
                              onClick={() => currentUser && voteInPoll(poll.id, option.id)}
                              disabled={!currentUser}
                            >
                              {option.text}
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={percentage} className="h-2" />
                            <span className="text-sm w-12 text-right">
                              {percentage.toFixed(0)}%
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {option.votes.length} {option.votes.length === 1 ? 'vote' : 'votes'}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground">
                    {totalVotes} total {totalVotes === 1 ? 'vote' : 'votes'}
                  </p>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Polls;
