import React, { useState } from 'react';
import { Star, Clock, Calendar, Ticket, ArrowUpRight } from 'lucide-react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  onSelect: (movie: Movie) => void;
  onBookNow?: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onSelect,
  onBookNow,
}) => {
  const [imageError, setImageError] = useState(false);

  const formattedDate = new Date(movie.releaseDate).toLocaleDateString(
    'en-US',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }
  );

  const isUpcoming = movie.releaseStatus === 'upcoming';

  const handleBookNow = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (onBookNow) {
      onBookNow(movie);
    } else {
      onSelect(movie);
    }
  };

  return (
    <article
      onClick={() => onSelect(movie)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(movie);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${movie.title}`}
      className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-[#111113] transition-all duration-300 hover:-translate-y-1 hover:border-red-600/60 hover:shadow-xl hover:shadow-red-950/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a45c]"
    >
      {/* Movie poster */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-950">
        {!imageError && movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={`${movie.title} movie poster`}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-neutral-900 via-[#171113] to-black p-5 text-center">
            <span className="mb-3 text-3xl font-black tracking-tight text-red-600">
              IMOVIES
            </span>
            <span className="line-clamp-2 text-lg font-bold text-white">
              {movie.title}
            </span>
            <span className="mt-2 text-xs text-neutral-500">
              {movie.genres?.join(' · ')}
            </span>
          </div>
        )}

        {/* Poster gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/20" />

        {/* Rating */}
        <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-lg border border-[#c9a45c]/30 bg-black/80 px-2.5 py-1.5 text-xs font-bold text-[#e5c477] backdrop-blur-md">
          <Star className="h-3.5 w-3.5 fill-current" />
          <span>{Number(movie.rating ?? 0).toFixed(1)}</span>
        </div>

        {/* Age classification */}
        {movie.ageClassification && (
          <span className="absolute left-3 top-3 rounded-md border border-white/20 bg-black/70 px-2 py-1 text-[10px] font-bold tracking-wide text-white backdrop-blur-md">
            {movie.ageClassification}
          </span>
        )}

        {/* Release status */}
        {isUpcoming && (
          <span className="absolute bottom-3 left-3 rounded-md border border-[#c9a45c]/40 bg-black/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[#e5c477] backdrop-blur-md">
            Coming Soon
          </span>
        )}

        {/* Hover booking action */}
        <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
          <button
            type="button"
            onClick={handleBookNow}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500 bg-red-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-red-950/40 transition-colors hover:bg-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a45c]"
          >
            <Ticket className="h-4 w-4" />
            {isUpcoming ? 'View Premiere Details' : 'Book Tickets'}
          </button>
        </div>
      </div>

      {/* Movie details */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-neutral-400">
            <span className="max-w-full truncate">
              {movie.genres?.slice(0, 2).join(' / ') || 'Movie'}
            </span>

            <span className="text-neutral-700">•</span>

            <span className="flex shrink-0 items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-[#c9a45c]" />
              {movie.duration} min
            </span>
          </div>

          <h3 className="line-clamp-1 text-base font-bold text-white transition-colors group-hover:text-red-400">
            {movie.title}
          </h3>

          <p className="mt-2 line-clamp-2 min-h-10 text-xs leading-relaxed text-neutral-400">
            {movie.description}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2 border-t border-neutral-800 pt-3">
          <span className="truncate text-xs font-medium text-neutral-300">
            {movie.language}
          </span>

          <span className="flex shrink-0 items-center gap-1.5 text-[11px] text-neutral-500">
            <Calendar className="h-3.5 w-3.5 text-[#c9a45c]" />
            {formattedDate}
          </span>
        </div>

        {/* Always-visible details hint on touch devices */}
        <div className="mt-3 flex items-center justify-between text-xs font-semibold text-neutral-500 transition-colors group-hover:text-[#c9a45c]">
          <span>{isUpcoming ? 'Explore movie' : 'View movie details'}</span>
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>
    </article>
  );
};