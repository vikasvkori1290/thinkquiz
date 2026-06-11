"use client";

import dynamic from "next/dynamic";
import { ThemeInput } from "react-activity-calendar";

// Dynamically import ActivityCalendar with SSR disabled to prevent hydration errors
const ActivityCalendar = dynamic(() => import("react-activity-calendar").then(mod => mod.ActivityCalendar), { 
  ssr: false,
  loading: () => <div className="animate-pulse bg-muted h-[150px] w-full rounded-md"></div>
});

interface ActivityGraphClientProps {
  data: Array<{ date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }>;
  theme: ThemeInput;
}

export function ActivityGraphClient({ data, theme }: ActivityGraphClientProps) {
  return (
    <ActivityCalendar 
      data={data} 
      theme={theme}
      labels={{
        totalCount: `{{count}} quizzes played in the last year`,
      }}
      showWeekdayLabels={true}
      blockSize={14}
      blockRadius={4}
      blockMargin={4}
      fontSize={14}
    />
  );
}
