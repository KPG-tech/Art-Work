
import React, { useState, useEffect, useRef } from 'react';
import { useContent } from '../context/ContentContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Palette, Download, BrainCircuit } from 'lucide-react';
import html2canvas from 'html2canvas';

const Quiz: React.FC = () => {
  const { quizQuestions } = useContent();
  const { currentUser } = useAuth();
  const certificateRef = useRef<HTMLDivElement>(null);

  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [currentQuestions, setCurrentQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds

  // Function to shuffle array (Fisher-Yates algorithm)
  const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const startQuiz = () => {
    // Select 10 random questions
    const shuffledQuestions = shuffleArray(quizQuestions).slice(0, 10);
    setCurrentQuestions(shuffledQuestions);
    setIsStarted(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswers(new Array(10).fill(-1));
    setTimeRemaining(600); // Reset timer
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishQuiz();
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const finishQuiz = () => {
    // Calculate score
    let correctCount = 0;
    selectedAnswers.forEach((selected, index) => {
      if (selected === currentQuestions[index].correctAnswer) {
        correctCount++;
      }
    });
    
    const finalScore = (correctCount / currentQuestions.length) * 100;
    setScore(finalScore);
    setIsFinished(true);
  };

  const downloadCertificate = () => {
    if (certificateRef.current) {
      html2canvas(certificateRef.current).then(canvas => {
        const link = document.createElement('a');
        link.download = 'art-quiz-certificate.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
  };

  const resetQuiz = () => {
    setIsStarted(false);
    setIsFinished(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setScore(0);
  };

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (isStarted && !isFinished && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer as NodeJS.Timeout);
            finishQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isStarted, isFinished, timeRemaining]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  if (!isStarted) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <div className="inline-flex rounded-full bg-art-light p-6 mb-4">
            <BrainCircuit className="h-12 w-12 text-art-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Art Knowledge Quiz</h1>
          <p className="mb-6 text-lg text-muted-foreground">
            Test your art knowledge with this 10-question quiz. 
            Score 70% or higher to receive a certificate of achievement!
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Quiz Rules</CardTitle>
            <CardDescription>Please read before starting</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-left space-y-2 list-disc pl-5">
              <li>The quiz consists of 10 multiple-choice questions</li>
              <li>You have 10 minutes to complete the quiz</li>
              <li>You can navigate between questions</li>
              <li>Your final score will be calculated once you finish</li>
              <li>A score of 70% or higher earns you a certificate</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button onClick={startQuiz} className="w-full bg-art-primary hover:bg-art-secondary">
              Start Quiz
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (isFinished) {
    const isPassing = score >= 70;
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return (
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-2">Quiz Results</h1>
        <p className="text-lg mb-8">
          You scored <span className="font-bold text-art-primary">{score.toFixed(0)}%</span> ({Math.round(score / 10)} out of 10 questions correct)
        </p>
        
        {isPassing ? (
          <>
            <div className="mb-8 relative p-1 bg-gradient-to-r from-purple-500 via-art-primary to-indigo-500 rounded-lg">
              <div 
                ref={certificateRef}
                className="bg-white p-10 rounded-md relative shadow-inner"
              >
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                  <Palette className="w-full h-full" />
                </div>
                <div className="border-8 border-double border-art-light p-8 relative">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-art-primary mb-2">Certificate of Achievement</h2>
                    <p className="text-lg italic mb-6">This certifies that</p>
                    <p className="text-2xl font-bold mb-6">{currentUser?.username || "Art Enthusiast"}</p>
                    <p className="text-lg mb-6">
                      Has successfully completed the Art Knowledge Quiz<br />
                      with a score of {score.toFixed(0)}%
                    </p>
                    <p className="text-lg italic mb-1">Awarded on</p>
                    <p className="text-xl mb-6">{today}</p>
                    <div className="w-48 mx-auto mb-4">
                      <div className="h-0.5 bg-art-primary"></div>
                    </div>
                    <p className="text-lg font-semibold">Art Work Learning Platform</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Button onClick={downloadCertificate} className="mb-4 bg-art-primary hover:bg-art-secondary">
              <Download className="h-4 w-4 mr-2" />
              Download Certificate
            </Button>
          </>
        ) : (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-amber-600">Almost there!</CardTitle>
              <CardDescription>
                You need a score of 70% or higher to receive a certificate.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Keep learning and try again.</p>
            </CardContent>
          </Card>
        )}
        
        <Button onClick={resetQuiz} variant="outline" className="w-32">
          Try Again
        </Button>
      </div>
    );
  }

  const currentQuestion = currentQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold">Question {currentQuestionIndex + 1} of {currentQuestions.length}</span>
        <span className="text-muted-foreground">Time: {formatTime(timeRemaining)}</span>
      </div>
      <Progress value={progress} className="h-2 mb-6" />
      
      <Card>
        <CardHeader>
          <CardTitle>{currentQuestion.question}</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={selectedAnswers[currentQuestionIndex]?.toString()} 
            onValueChange={(value) => handleAnswerSelect(parseInt(value))}
            className="space-y-3"
          >
            {currentQuestion.options.map((option: string, idx: number) => (
              <div key={idx} className="flex items-center space-x-2 border rounded-md p-3 hover:bg-slate-50">
                <RadioGroupItem value={idx.toString()} id={`option-${idx}`} />
                <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={previousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          <Button 
            onClick={nextQuestion}
            className="bg-art-primary hover:bg-art-secondary"
          >
            {currentQuestionIndex === currentQuestions.length - 1 ? 'Finish Quiz' : 'Next'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Quiz;
