import { Skeleton } from './ui/skeleton';

export default function ChatroomSkeleton() {
  return (
    <div className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <Skeleton className="h-4 w-32 mb-1" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-16" />
            <span className="text-muted-foreground">•</span>
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      </div>
    </div>
  );
} 