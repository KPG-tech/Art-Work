
export interface User {
  id: string;
  username: string;
  email: string;
  profilePicture: string;
  bio: string;
  followers: string[];
  following: string[];
  createdAt: Date;
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  userProfilePicture: string;
  title: string;
  image: string;
  description: string;
  likes: string[];
  comments: Comment[];
  createdAt: Date;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  userProfilePicture: string;
  content: string;
  createdAt: Date;
}

export interface Poll {
  id: string;
  userId: string;
  username: string;
  userProfilePicture: string;
  question: string;
  options: PollOption[];
  createdAt: Date;
}

export interface PollOption {
  id: string;
  text: string;
  votes: string[];
}

export interface LearningMaterial {
  id: string;
  userId: string;
  username: string;
  userProfilePicture: string;
  title: string;
  description: string;
  type: 'link' | 'pdf';
  url: string;
  createdAt: Date;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
  date: Date;
}
