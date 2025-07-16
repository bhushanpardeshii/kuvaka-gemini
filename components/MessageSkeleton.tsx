import { Skeleton } from './ui/skeleton';

interface MessageSkeletonProps {
  isUser?: boolean;
}

export default function MessageSkeleton({ isUser = false }: MessageSkeletonProps) {
  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar skeleton */}
      <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />

      {/* Message content skeleton */}
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} w-full`}>
        <div className={`relative inline-block min-w-[60px] max-w-[75%] sm:max-w-md ${
          isUser 
            ? 'bg-primary' 
            : 'bg-card border border-border'
        } rounded-2xl p-3 ${isUser ? 'rounded-br-sm' : 'rounded-bl-sm'}`}>
          
          {/* Message text skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>

          {/* Timestamp skeleton */}
          <div className={`mt-2 ${isUser ? 'text-right' : 'text-left'}`}>
            <Skeleton className="h-3 w-12 inline-block" />
          </div>
        </div>
      </div>
    </div>
  );
} 