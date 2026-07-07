"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { topics } from "./data";

export default function AptitudePage() {
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("aptitude_completed_items");
    if (stored) {
      setCompleted(JSON.parse(stored));
    }
  }, []);
  return (
    <div className="container mx-auto max-w-4xl px-4 py-24 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Aptitude <span className="text-primary">Practice</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Structured preparation for FAANG and top tech company online assessments. Master quantitative, logical, and verbal reasoning.
        </p>
      </div>

      <Accordion type="single" collapsible defaultValue="topic-1" className="w-full space-y-4">
        {topics.map((topic) => (
          <AccordionItem key={topic.id} value={topic.id} className="border rounded-lg px-4 bg-card shadow-sm">
            <AccordionTrigger className="text-xl font-semibold hover:no-underline">
              {topic.title}
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-6 space-y-2">
              
              {/* Notes Link */}
              <div className="flex items-center justify-between p-3 rounded-md hover:bg-muted/50 transition-colors border">
                <Link href={`/aptitude/${topic.id}/notes`} className="flex-1 font-medium text-primary hover:underline">
                  Quick Notes
                </Link>
                <Checkbox id={`${topic.id}-notes`} className="ml-4" checked={completed.includes(`${topic.id}-notes`)} disabled />
              </div>

              {/* Questions Links */}
              {topic.questions.map((q, index) => (
                <div key={q.id} className="flex items-center justify-between p-3 rounded-md hover:bg-muted/50 transition-colors border">
                  <Link href={`/aptitude/${topic.id}/question/${q.id}`} className="flex-1 text-foreground hover:text-primary transition-colors">
                    <span className="font-medium mr-2">Q{index + 1}:</span> 
                    <span className="line-clamp-1 text-sm">{q.text}</span>
                  </Link>
                  <Checkbox id={`${topic.id}-${q.id}`} className="ml-4" checked={completed.includes(`${topic.id}-${q.id}`)} disabled />
                </div>
              ))}
              
              {topic.questions.length === 0 && (
                <div className="p-3 text-muted-foreground italic text-sm">
                  Content coming soon...
                </div>
              )}

            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
