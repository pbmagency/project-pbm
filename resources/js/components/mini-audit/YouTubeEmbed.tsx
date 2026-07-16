import { useState } from 'react';
import { Play } from 'lucide-react';

interface YouTubeEmbedProps {
    videoId: string;
    title?: string;
    className?: string;
}

export default function YouTubeEmbed({
    videoId,
    title = 'YouTube video',
    className = '',
}: YouTubeEmbedProps) {
    const [isPlaying, setIsPlaying] = useState(false);

    if (isPlaying) {
        return (
            <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`}
                title={title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className={`rounded-lg ${className}`}
            />
        );
    }

    return (
        <button
            type="button"
            onClick={() => setIsPlaying(true)}
            className={`group relative flex h-full w-full items-center justify-center rounded-lg ${className}`}
            aria-label={`Play ${title}`}
        >
            <img
                src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                alt={title}
                className="absolute inset-0 h-full w-full rounded-lg object-cover"
                loading="lazy"
            />
            <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-primary/90 transition-transform group-hover:scale-110 sm:h-20 sm:w-20">
                <Play className="h-8 w-8 fill-primary-foreground text-primary-foreground sm:h-10 sm:w-10" />
            </div>
        </button>
    );
}
