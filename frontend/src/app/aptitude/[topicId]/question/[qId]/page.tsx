"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, BrainCircuit } from "lucide-react";
import { topics } from "../../../data";

export default function QuestionPage() {
  const params = useParams();
  const topicId = params.topicId as string;
  const qId = params.qId as string;

  const topic = topics.find(t => t.id === topicId);
  if (!topic) return notFound();

  const qIndex = topic.questions.findIndex(q => q.id === qId);
  if (qIndex === -1) return notFound();

  const question = topic.questions[qIndex];
  
  // Determine Next/Previous navigation paths
  const prevPath = qIndex === 0 
    ? `/aptitude/${topic.id}/notes` 
    : `/aptitude/${topic.id}/question/${topic.questions[qIndex - 1].id}`;
    
  const nextPath = qIndex === topic.questions.length - 1 
    ? `/aptitude` // End of topic, go back to list
    : `/aptitude/${topic.id}/question/${topic.questions[qIndex + 1].id}`;

  // Interactive State
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-24 min-h-screen">
      
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-8 border-b pb-4">
        <Link href="/aptitude">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground pl-0">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Topics
          </Button>
        </Link>
        <span className="text-sm font-medium text-muted-foreground">
          Question {qIndex + 1} of {topic.questions.length}
        </span>
      </div>

      {/* Main Content Area */}
      <Card className="border-border shadow-sm mb-8">
        <CardHeader className="bg-primary/5 border-b pb-6 rounded-t-lg">
          <div className="flex items-center gap-2 mb-2">
            <BrainCircuit className="h-5 w-5 text-primary" />
            <span className="text-sm font-bold text-primary uppercase tracking-wider">
              {topic.title}
            </span>
          </div>
          <CardTitle className="text-2xl leading-relaxed mt-2 font-medium">
            {question.text}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6 md:p-8">
          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {question.options.map((opt, i) => {
              const isSelected = selected === i;
              const isCorrect = i === question.answer;
              
              let btnClass = "justify-start h-auto min-h-16 py-4 px-6 text-left whitespace-normal text-base transition-all ";
              
              if (selected !== null) {
                if (isCorrect) {
                  btnClass += "bg-green-500/15 border-green-500 text-green-700 dark:text-green-400 hover:bg-green-500/15";
                } else if (isSelected) {
                  btnClass += "bg-red-500/15 border-red-500 text-red-700 dark:text-red-400 hover:bg-red-500/15";
                } else {
                  btnClass += "opacity-50 cursor-not-allowed";
                }
              } else {
                btnClass += "hover:bg-muted";
              }

              return (
                <Button
                  key={i}
                  variant={selected !== null && (isCorrect || isSelected) ? "outline" : "secondary"}
                  className={btnClass}
                  onClick={() => { 
                    if (selected === null) {
                      setSelected(i);
                      if (isCorrect) {
                        try {
                          const stored = JSON.parse(localStorage.getItem("aptitude_completed_items") || "[]");
                          const id = `${topic.id}-${question.id}`;
                          if (!stored.includes(id)) {
                            localStorage.setItem("aptitude_completed_items", JSON.stringify([...stored, id]));
                          }
                        } catch (e) {
                          // ignore
                        }
                      }
                    } 
                  }}
                  disabled={selected !== null}
                >
                  <span className="mr-3 font-bold opacity-70">{String.fromCharCode(65 + i)}.</span> {opt}
                  {selected !== null && isCorrect && <CheckCircle2 className="ml-auto h-6 w-6 text-green-600" />}
                  {selected !== null && isSelected && !isCorrect && <XCircle className="ml-auto h-6 w-6 text-red-600" />}
                </Button>
              );
            })}
          </div>

          {/* Explanation Reveal */}
          {selected !== null && (
            <div className="mt-8 pt-6 border-t animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Solution</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowExplanation(!showExplanation)}
                >
                  {showExplanation ? "Hide Explanation" : "View Explanation"}
                </Button>
              </div>
              
              {showExplanation && (
                <div className="p-5 bg-muted/40 rounded-lg border text-foreground leading-relaxed animate-in fade-in zoom-in-95 duration-200">
                  {question.explanation}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Footer Navigation (Prev / Next) */}
      <div className="flex items-center justify-between pt-4">
        <Link href={prevPath}>
          <Button variant="outline" size="lg" className="px-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
        </Link>

        {qIndex === topic.questions.length - 1 ? (
          <Link href={nextPath}>
            <Button size="lg" className="px-6 font-semibold">
              Finish Topic
              <CheckCircle2 className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        ) : (
          <Link href={nextPath}>
            <Button size="lg" className="px-6 font-semibold">
              Next Question
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>

    </div>
  );
}
