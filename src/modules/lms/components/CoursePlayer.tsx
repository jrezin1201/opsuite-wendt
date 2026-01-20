"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  description?: string;
  completed?: boolean;
}

export interface CourseSection {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface CoursePlayerProps {
  courseTitle?: string;
  sections: CourseSection[];
  onLessonComplete?: (lessonId: string) => void;
}

export function CoursePlayer({
  sections,
  onLessonComplete,
}: CoursePlayerProps) {
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(
    sections[0]?.lessons[0] || null
  );
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(
    new Set()
  );

  const handleLessonSelect = (lesson: Lesson) => {
    setCurrentLesson(lesson);
  };

  const handleMarkComplete = () => {
    if (!currentLesson) return;

    setCompletedLessons((prev) => new Set(prev).add(currentLesson.id));

    if (onLessonComplete) {
      onLessonComplete(currentLesson.id);
    }

    // Auto-advance to next lesson
    const allLessons = sections.flatMap((s) => s.lessons);
    const currentIndex = allLessons.findIndex((l) => l.id === currentLesson.id);
    if (currentIndex < allLessons.length - 1) {
      setCurrentLesson(allLessons[currentIndex + 1]);
    }
  };

  const getTotalLessons = () => sections.reduce((sum, s) => sum + s.lessons.length, 0);
  const getProgressPercentage = () =>
    Math.round((completedLessons.size / getTotalLessons()) * 100);

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Video Player - 2/3 width */}
      <div className="lg:col-span-2 space-y-4">
        {/* Video */}
        <Card>
          <div className="aspect-video bg-black">
            {currentLesson ? (
              <iframe
                src={currentLesson.videoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={currentLesson.title}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-white/60">
                Select a lesson to start
              </div>
            )}
          </div>
        </Card>

        {/* Lesson Info */}
        {currentLesson && (
          <Card>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {currentLesson.title}
                  </h2>
                  <p className="text-white/60">{currentLesson.duration}</p>
                </div>

                {!completedLessons.has(currentLesson.id) && (
                  <Button onClick={handleMarkComplete}>Mark Complete</Button>
                )}
              </div>

              {currentLesson.description && (
                <p className="text-white/80">{currentLesson.description}</p>
              )}
            </div>
          </Card>
        )}
      </div>

      {/* Sidebar - 1/3 width */}
      <div className="space-y-4">
        {/* Progress Card */}
        <Card>
          <div className="p-4">
            <h3 className="font-semibold text-white mb-2">Course Progress</h3>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-300"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
              <span className="text-sm font-medium text-white">
                {getProgressPercentage()}%
              </span>
            </div>
            <p className="text-xs text-white/60">
              {completedLessons.size} of {getTotalLessons()} lessons completed
            </p>
          </div>
        </Card>

        {/* Curriculum */}
        <Card>
          <div className="p-4">
            <h3 className="font-semibold text-white mb-4">Course Content</h3>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {sections.map((section) => (
                <div key={section.id}>
                  <h4 className="text-sm font-medium text-white/80 mb-2">
                    {section.title}
                  </h4>
                  <div className="space-y-1">
                    {section.lessons.map((lesson) => {
                      const isActive = currentLesson?.id === lesson.id;
                      const isCompleted = completedLessons.has(lesson.id);

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => handleLessonSelect(lesson)}
                          className={`w-full text-left p-3 rounded-lg transition-colors ${
                            isActive
                              ? "bg-purple-500/20 border border-purple-500"
                              : "bg-white/5 border border-white/10 hover:bg-white/10"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {/* Status Icon */}
                            <div className="flex-shrink-0 mt-0.5">
                              {isCompleted ? (
                                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                                  <svg
                                    className="w-3 h-3 text-white"
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
                                </div>
                              ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-white/20" />
                              )}
                            </div>

                            {/* Lesson Info */}
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm font-medium ${
                                  isActive ? "text-white" : "text-white/80"
                                }`}
                              >
                                {lesson.title}
                              </p>
                              <p className="text-xs text-white/40 mt-0.5">
                                {lesson.duration}
                              </p>
                            </div>

                            {/* Play Icon */}
                            {isActive && (
                              <div className="flex-shrink-0">
                                <svg
                                  className="w-4 h-4 text-purple-400"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
