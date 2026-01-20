"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
  explanation?: string;
}

interface QuizComponentProps {
  title: string;
  questions: QuizQuestion[];
  passingScore?: number; // percentage
  onComplete?: (score: number, passed: boolean) => void;
}

export function QuizComponent({
  title,
  questions,
  passingScore = 70,
  onComplete,
}: QuizComponentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Map<string, number>>(
    new Map()
  );
  const [showResults, setShowResults] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswerSelect = (optionIndex: number) => {
    setSelectedAnswers((prev) => {
      const newMap = new Map(prev);
      newMap.set(currentQuestion.id, optionIndex);
      return newMap;
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
    const score = calculateScore();
    const passed = score >= passingScore;

    if (onComplete) {
      onComplete(score, passed);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      const selected = selectedAnswers.get(q.id);
      if (selected === q.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  const getCorrectCount = () => {
    let correct = 0;
    questions.forEach((q) => {
      const selected = selectedAnswers.get(q.id);
      if (selected === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const resetQuiz = () => {
    setSelectedAnswers(new Map());
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setIsReviewing(false);
  };

  if (showResults && !isReviewing) {
    const score = calculateScore();
    const passed = score >= passingScore;
    const correctCount = getCorrectCount();

    return (
      <Card glow={passed ? "cyan" : undefined}>
        <div className="p-8 text-center">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
              passed ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {passed ? (
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </div>

          <h2 className="text-3xl font-bold text-white mb-2">
            {passed ? "Congratulations!" : "Keep Learning"}
          </h2>

          <p className="text-white/60 mb-6">
            {passed
              ? "You passed the quiz!"
              : "You didn't pass this time, but you can try again."}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8 max-w-md mx-auto">
            <div className="p-4 bg-white/5 rounded-lg">
              <p className="text-sm text-white/60 mb-1">Your Score</p>
              <p className="text-3xl font-bold text-white">{score}%</p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <p className="text-sm text-white/60 mb-1">Passing Score</p>
              <p className="text-3xl font-bold text-white">{passingScore}%</p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg col-span-2">
              <p className="text-sm text-white/60 mb-1">Correct Answers</p>
              <p className="text-3xl font-bold text-white">
                {correctCount} / {questions.length}
              </p>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Button onClick={() => setIsReviewing(true)} variant="secondary">
              Review Answers
            </Button>
            <Button onClick={resetQuiz}>Try Again</Button>
          </div>
        </div>
      </Card>
    );
  }

  if (isReviewing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Review Answers</h2>
          <Button onClick={resetQuiz} variant="secondary">
            Retake Quiz
          </Button>
        </div>

        {questions.map((question, index) => {
          const selected = selectedAnswers.get(question.id);
          const isCorrect = selected === question.correctAnswer;

          return (
            <Card key={question.id}>
              <div className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      isCorrect ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {isCorrect ? (
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium mb-4">
                      {index + 1}. {question.question}
                    </p>
                    <div className="space-y-2">
                      {question.options.map((option, optIndex) => {
                        const isSelected = selected === optIndex;
                        const isCorrectOption = optIndex === question.correctAnswer;

                        return (
                          <div
                            key={optIndex}
                            className={`p-3 rounded-lg border ${
                              isCorrectOption
                                ? "border-green-500 bg-green-500/10"
                                : isSelected
                                ? "border-red-500 bg-red-500/10"
                                : "border-white/10 bg-white/5"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-white/80">{option}</span>
                              {isCorrectOption && (
                                <span className="ml-auto text-xs font-medium text-green-400">
                                  Correct
                                </span>
                              )}
                              {isSelected && !isCorrectOption && (
                                <span className="ml-auto text-xs font-medium text-red-400">
                                  Your answer
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {question.explanation && (
                      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <p className="text-sm text-blue-300">
                          <span className="font-medium">Explanation:</span>{" "}
                          {question.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <span className="text-sm text-white/60">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-500 transition-all duration-300"
            style={{
              width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question Card */}
      <Card>
        <div className="p-8">
          <h3 className="text-xl font-medium text-white mb-6">
            {currentQuestion.question}
          </h3>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswers.get(currentQuestion.id) === index;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    isSelected
                      ? "border-purple-500 bg-purple-500/20"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? "border-purple-500 bg-purple-500"
                          : "border-white/20"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="text-white">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          variant="secondary"
        >
          Previous
        </Button>

        <div className="flex gap-2">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentQuestionIndex
                  ? "bg-purple-500"
                  : selectedAnswers.has(questions[index].id)
                  ? "bg-white/40"
                  : "bg-white/20"
              }`}
            />
          ))}
        </div>

        {isLastQuestion ? (
          <Button
            onClick={handleSubmit}
            disabled={selectedAnswers.size !== questions.length}
          >
            Submit Quiz
          </Button>
        ) : (
          <Button onClick={handleNext}>Next</Button>
        )}
      </div>
    </div>
  );
}
