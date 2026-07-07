"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { topics } from "../../data";

export default function NotesPage() {
  const params = useParams();
  const topicId = params.topicId as string;
  const topic = topics.find(t => t.id === topicId);
  
  if (!topic) {
    notFound();
  }

  const firstQuestion = topic.questions[0];

  const markNotesComplete = () => {
    try {
      const stored = JSON.parse(localStorage.getItem("aptitude_completed_items") || "[]");
      const id = `${topic.id}-notes`;
      if (!stored.includes(id)) {
        localStorage.setItem("aptitude_completed_items", JSON.stringify([...stored, id]));
      }
    } catch (e) {
      // ignore
    }
  };

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
      </div>

      {/* Notes Content */}
      <Card className="border-border shadow-sm mb-8">
        <CardHeader className="bg-primary/5 border-b pb-6 rounded-t-lg">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="text-sm font-bold text-primary uppercase tracking-wider">
              {topic.title}
            </span>
          </div>
          <CardTitle className="text-3xl leading-tight">
            {topic.notes.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <div className="prose prose-lg dark:prose-invert max-w-none text-foreground leading-relaxed">
            {topic.notes.content}
          </div>
        </CardContent>
      </Card>

      {/* Footer Navigation */}
      <div className="flex justify-end pt-4">
        {firstQuestion ? (
          <Link href={`/aptitude/${topic.id}/question/${firstQuestion.id}`} onClick={markNotesComplete}>
            <Button size="lg" className="px-8 font-semibold">
              Start Practice
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        ) : (
          <Link href="/aptitude" onClick={markNotesComplete}>
            <Button variant="outline" size="lg">
              Return to Topics
            </Button>
          </Link>
        )}
      </div>

    </div>
  );
}
