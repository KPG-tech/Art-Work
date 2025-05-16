import React, { createContext, useContext, useState, useEffect } from 'react';
import { Post, Comment, Poll, LearningMaterial, QuizQuestion } from '../types';
import { useAuth } from './AuthContext';
import { toast } from '../components/ui/use-toast';

interface ContentContextType {
  // Posts
  posts: Post[];
  createPost: (title: string, image: string, description: string) => void;
  updatePost: (postId: string, title: string, image: string, description: string) => void;
  deletePost: (postId: string) => void;
  likePost: (postId: string) => void;
  unlikePost: (postId: string) => void;
  addComment: (postId: string, content: string) => void;
  
  // Polls
  polls: Poll[];
  createPoll: (question: string, options: string[]) => void;
  deletePoll: (pollId: string) => void;
  voteInPoll: (pollId: string, optionId: string) => void;
  
  // Learning Materials
  learningMaterials: LearningMaterial[];
  createLearningMaterial: (title: string, description: string, type: 'link' | 'pdf', url: string) => void;
  deleteLearningMaterial: (materialId: string) => void;
  
  // Quiz
  quizQuestions: QuizQuestion[];
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

const initialPosts: Post[] = [
  {
    id: '1',
    userId: '2',
    username: 'creativemind',
    userProfilePicture: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
    title: 'Abstract Art Exploration',
    image: 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843',
    description: 'Exploring the boundaries of abstract expressionism through color and form.',
    likes: ['1', '3'],
    comments: [
      {
        id: '1',
        userId: '3',
        username: 'artlover',
        userProfilePicture: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843',
        content: 'I love the use of color in this piece!',
        createdAt: new Date('2023-04-15T08:30:00')
      }
    ],
    createdAt: new Date('2023-04-15')
  },
  {
    id: '2',
    userId: '1',
    username: 'artmaster',
    userProfilePicture: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    title: 'Portrait Techniques',
    image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7',
    description: 'Sharing my approach to realistic portrait painting with acrylics.',
    likes: ['2'],
    comments: [],
    createdAt: new Date('2023-04-10')
  }
];

const initialPolls: Poll[] = [
  {
    id: '1',
    userId: '1',
    username: 'artmaster',
    userProfilePicture: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    question: 'What medium do you prefer for landscapes?',
    options: [
      { id: '1', text: 'Oil Paint', votes: ['2'] },
      { id: '2', text: 'Watercolor', votes: ['3'] },
      { id: '3', text: 'Digital', votes: [] }
    ],
    createdAt: new Date('2023-04-05')
  }
];

const initialLearningMaterials: LearningMaterial[] = [
  {
    id: '1',
    userId: '1',
    username: 'artmaster',
    userProfilePicture: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    title: 'Color Theory Basics',
    description: 'Learn the fundamentals of color theory and how to apply it in your artwork.',
    type: 'link',
    url: 'https://www.example.com/color-theory',
    createdAt: new Date('2023-03-28')
  },
  {
    id: '2',
    userId: '2',
    username: 'creativemind',
    userProfilePicture: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
    title: 'Digital Art Tutorial',
    description: 'Step-by-step guide to creating digital art in Procreate.',
    type: 'pdf',
    url: 'https://www.example.com/digital-art-tutorial.pdf',
    createdAt: new Date('2023-03-20')
  }
];

const initialQuizQuestions: QuizQuestion[] = [
  {
    id: '1',
    question: 'Which color is created by mixing blue and yellow?',
    options: ['Red', 'Green', 'Purple', 'Orange'],
    correctAnswer: 1
  },
  {
    id: '2',
    question: 'Who painted "Starry Night"?',
    options: ['Pablo Picasso', 'Leonardo da Vinci', 'Vincent van Gogh', 'Claude Monet'],
    correctAnswer: 2
  },
  {
    id: '3',
    question: 'Which art movement is characterized by dreamlike imagery?',
    options: ['Impressionism', 'Surrealism', 'Cubism', 'Baroque'],
    correctAnswer: 1
  },
  {
    id: '4',
    question: 'What is chiaroscuro?',
    options: ['A type of brush', 'The use of light and shadow', 'A framing technique', 'A type of paint'],
    correctAnswer: 1
  },
  {
    id: '5',
    question: 'Which of these is NOT a primary color?',
    options: ['Red', 'Blue', 'Green', 'Yellow'],
    correctAnswer: 2
  },
  {
    id: '6',
    question: 'The "Golden Ratio" is approximately equal to:',
    options: ['1.414', '1.618', '2.718', '3.142'],
    correctAnswer: 1
  },
  {
    id: '7',
    question: 'Which artist is known for cutting off part of his ear?',
    options: ['Salvador Dalí', 'Vincent van Gogh', 'Pablo Picasso', 'Claude Monet'],
    correctAnswer: 1
  },
  {
    id: '8',
    question: 'What is the art of beautiful handwriting called?',
    options: ['Typography', 'Calligraphy', 'Iconography', 'Lithography'],
    correctAnswer: 1
  },
  {
    id: '9',
    question: 'Which art movement emphasized pure abstraction and geometric forms?',
    options: ['Expressionism', 'Surrealism', 'Constructivism', 'Dadaism'],
    correctAnswer: 2
  },
  {
    id: '10',
    question: 'What is "sfumato"?',
    options: [
      'A painting technique that creates softened outlines',
      'A type of canvas',
      'A famous art museum',
      'A sculpting tool'
    ],
    correctAnswer: 0
  },
  {
    id: '11',
    question: 'Which artist is associated with the Campbell\'s Soup Cans?',
    options: ['Andy Warhol', 'Roy Lichtenstein', 'Jackson Pollock', 'Mark Rothko'],
    correctAnswer: 0
  },
  {
    id: '12',
    question: 'What material is traditionally used in fresco painting?',
    options: ['Oil', 'Acrylic', 'Wet plaster', 'Watercolor'],
    correctAnswer: 2
  },
  {
    id: '13',
    question: 'Which of these is a technique for manipulating metal?',
    options: ['Lithography', 'Etching', 'Pointillism', 'Impasto'],
    correctAnswer: 1
  },
  {
    id: '14',
    question: 'What is a triptych?',
    options: [
      'A three-panel artwork',
      'A painting technique',
      'A type of sculpture',
      'A drawing tool'
    ],
    correctAnswer: 0
  },
  {
    id: '15',
    question: 'Which art movement emerged in reaction to World War I?',
    options: ['Impressionism', 'Fauvism', 'Dadaism', 'Pop Art'],
    correctAnswer: 2
  },
  {
    id: '16',
    question: 'What does "contrapposto" refer to in sculpture?',
    options: [
      'A type of material',
      'A stance where weight is shifted to one leg',
      'A method of casting',
      'A decorative element'
    ],
    correctAnswer: 1
  },
  {
    id: '17',
    question: 'What is the term for a painting of inanimate objects?',
    options: ['Portrait', 'Landscape', 'Still life', 'Genre scene'],
    correctAnswer: 2
  },
  {
    id: '18',
    question: 'Which artist pioneered the "drip painting" technique?',
    options: ['Mark Rothko', 'Jackson Pollock', 'Willem de Kooning', 'Wassily Kandinsky'],
    correctAnswer: 1
  },
  {
    id: '19',
    question: 'What is gouache?',
    options: [
      'A painting technique',
      'A type of opaque watercolor paint',
      'A sculpture material',
      'A digital art software'
    ],
    correctAnswer: 1
  },
  {
    id: '20',
    question: 'Which culture is known for creating totem poles?',
    options: ['Australian Aboriginal', 'Native American', 'Ancient Egyptian', 'Celtic'],
    correctAnswer: 1
  },
  {
    id: '21',
    question: 'What is the difference between warm and cool colors?',
    options: [
      'Warm colors contain red, cool colors contain blue',
      'Warm colors are lighter, cool colors are darker',
      'Warm colors are primary, cool colors are secondary',
      'There is no technical difference'
    ],
    correctAnswer: 0
  },
  {
    id: '22',
    question: 'Which famous painting features a woman with an enigmatic smile?',
    options: ['The Scream', 'Mona Lisa', 'Girl with a Pearl Earring', 'American Gothic'],
    correctAnswer: 1
  },
  {
    id: '23',
    question: 'What does "perspective" refer to in art?',
    options: [
      'The artist\'s opinion',
      'The technique of representing 3D objects on a 2D surface',
      'The brightness of colors',
      'The emotional impact of a work'
    ],
    correctAnswer: 1
  },
  {
    id: '24',
    question: 'Which art movement is characterized by hyper-realistic scenes with surreal elements?',
    options: ['Abstract Expressionism', 'Magical Realism', 'Futurism', 'Minimalism'],
    correctAnswer: 1
  },
  {
    id: '25',
    question: 'What is a monochromatic color scheme?',
    options: [
      'Using only one color and its shades',
      'Using contrasting colors',
      'Using no color at all',
      'Using primary colors only'
    ],
    correctAnswer: 0
  }
];

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  
  const [posts, setPosts] = useState<Post[]>(() => {
    const storedPosts = localStorage.getItem('artWorkPosts');
    return storedPosts ? JSON.parse(storedPosts) : initialPosts;
  });
  
  const [polls, setPolls] = useState<Poll[]>(() => {
    const storedPolls = localStorage.getItem('artWorkPolls');
    return storedPolls ? JSON.parse(storedPolls) : initialPolls;
  });
  
  const [learningMaterials, setLearningMaterials] = useState<LearningMaterial[]>(() => {
    const storedMaterials = localStorage.getItem('artWorkMaterials');
    return storedMaterials ? JSON.parse(storedMaterials) : initialLearningMaterials;
  });
  
  const [quizQuestions] = useState<QuizQuestion[]>(initialQuizQuestions);

  useEffect(() => {
    localStorage.setItem('artWorkPosts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('artWorkPolls', JSON.stringify(polls));
  }, [polls]);

  useEffect(() => {
    localStorage.setItem('artWorkMaterials', JSON.stringify(learningMaterials));
  }, [learningMaterials]);

  const createPost = (title: string, image: string, description: string) => {
    if (!currentUser) return;

    const newPost: Post = {
      id: Date.now().toString(),
      userId: currentUser.id,
      username: currentUser.username,
      userProfilePicture: currentUser.profilePicture,
      title,
      image,
      description,
      likes: [],
      comments: [],
      createdAt: new Date()
    };

    setPosts([newPost, ...posts]);
    toast({
      title: "Post created",
      description: "Your post has been published",
    });
  };

  const updatePost = (postId: string, title: string, image: string, description: string) => {
    if (!currentUser) return;

    setPosts(posts.map(post => {
      if (post.id === postId && post.userId === currentUser.id) {
        return {
          ...post,
          title,
          image,
          description
        };
      }
      return post;
    }));

    toast({
      title: "Post updated",
      description: "Your post has been updated",
    });
  };

  const deletePost = (postId: string) => {
    if (!currentUser) return;

    setPosts(posts.filter(post => !(post.id === postId && post.userId === currentUser.id)));
    toast({
      title: "Post deleted",
      description: "Your post has been removed",
    });
  };

  const likePost = (postId: string) => {
    if (!currentUser) return;

    setPosts(posts.map(post => {
      if (post.id === postId && !post.likes.includes(currentUser.id)) {
        return {
          ...post,
          likes: [...post.likes, currentUser.id]
        };
      }
      return post;
    }));
  };

  const unlikePost = (postId: string) => {
    if (!currentUser) return;

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.likes.filter(id => id !== currentUser.id)
        };
      }
      return post;
    }));
  };

  const addComment = (postId: string, content: string) => {
    if (!currentUser) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      userId: currentUser.id,
      username: currentUser.username,
      userProfilePicture: currentUser.profilePicture,
      content,
      createdAt: new Date()
    };

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    }));
  };

  const createPoll = (question: string, options: string[]) => {
    if (!currentUser) return;

    const newPoll: Poll = {
      id: Date.now().toString(),
      userId: currentUser.id,
      username: currentUser.username,
      userProfilePicture: currentUser.profilePicture,
      question,
      options: options.map((text, index) => ({
        id: `${Date.now()}-${index}`,
        text,
        votes: []
      })),
      createdAt: new Date()
    };

    setPolls([newPoll, ...polls]);
    toast({
      title: "Poll created",
      description: "Your poll has been published",
    });
  };

  const deletePoll = (pollId: string) => {
    if (!currentUser) return;

    setPolls(polls.filter(poll => !(poll.id === pollId && poll.userId === currentUser.id)));
    toast({
      title: "Poll deleted",
      description: "Your poll has been removed",
    });
  };

  const voteInPoll = (pollId: string, optionId: string) => {
    if (!currentUser) return;

    setPolls(polls.map(poll => {
      if (poll.id === pollId) {
        const hasVoted = poll.options.some(option => option.votes.includes(currentUser.id));
        
        if (hasVoted) {
          const updatedOptions = poll.options.map(option => ({
            ...option,
            votes: option.votes.filter(id => id !== currentUser.id)
          }));
          
          return {
            ...poll,
            options: updatedOptions.map(option => {
              if (option.id === optionId) {
                return {
                  ...option,
                  votes: [...option.votes, currentUser.id]
                };
              }
              return option;
            })
          };
        } else {
          return {
            ...poll,
            options: poll.options.map(option => {
              if (option.id === optionId) {
                return {
                  ...option,
                  votes: [...option.votes, currentUser.id]
                };
              }
              return option;
            })
          };
        }
      }
      return poll;
    }));
  };

  const createLearningMaterial = (title: string, description: string, type: 'link' | 'pdf', url: string) => {
    if (!currentUser) return;

    const newMaterial: LearningMaterial = {
      id: Date.now().toString(),
      userId: currentUser.id,
      username: currentUser.username,
      userProfilePicture: currentUser.profilePicture,
      title,
      description,
      type,
      url,
      createdAt: new Date()
    };

    setLearningMaterials([newMaterial, ...learningMaterials]);
    toast({
      title: "Material created",
      description: "Your learning material has been published",
    });
  };

  const deleteLearningMaterial = (materialId: string) => {
    if (!currentUser) return;

    setLearningMaterials(learningMaterials.filter(
      material => !(material.id === materialId && material.userId === currentUser.id)
    ));
    toast({
      title: "Material deleted",
      description: "Your learning material has been removed",
    });
  };

  return (
    <ContentContext.Provider value={{
      posts,
      createPost,
      updatePost,
      deletePost,
      likePost,
      unlikePost,
      addComment,
      polls,
      createPoll,
      deletePoll,
      voteInPoll,
      learningMaterials,
      createLearningMaterial,
      deleteLearningMaterial,
      quizQuestions
    }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
