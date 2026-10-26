
import React, { useState, useEffect } from 'react';
import {
  Ticket,
  Star,
  Clock,
  ChevronRight,
  Sparkles,
  Film,
  ArrowRight,
  Play,
  Clapperboard,
} from 'lucide-react';
import { Movie } from '../types';
import { MovieCard } from '../components/MovieCard';
import { api } from '../services/api';

interface HomePageProps {
  onSelectMovie: (movie: Movie) => void;
  onBookMovie: (movie: Movie) => void;
  onNavigate: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectMovie,
  onBookMovie,
  onNavigate,
}) => {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [nowShowing, setNowShowing] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [genres, setGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    Promise.all([
      api.getMovies({ status: 'now_showing', limit: 8 }),
      api.getMovies({ status: 'upcoming', limit: 4 }),
    ])
      .then(([nowRes, upRes]) => {
        if (!active) return;

        if (nowRes.success && nowRes.data) {
          setNowShowing(nowRes.data);

          const featured =
            nowRes.data.find((movie) => movie.featured) ||
            nowRes.data[0];

          setFeaturedMovie(featured || null);

          if (nowRes.meta?.genres) {
            setGenres(['All', ...nowRes.meta.genres]);
          }
        }

        if (upRes.success && upRes.data) {
          setUpcoming(upRes.data);
        }
      })
      .catch((error) => {
        console.error('Failed to load home movies:', error);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredNowShowing = nowShowing.filter((movie) => {
    if (selectedGenre === 'All') return true;
    return movie.genres?.includes(selectedGenre) ?? false;
  });

  return (
    <main className="min-h-screen space-y-16 pb-20">
      {/* Cinematic hero */}
      {featuredMovie && (
        <section className="relative isolate flex min-h-[540px] items-center overflow-hidden border-b border-white/10 bg-[#090909] sm:min-h-[610px]">
          <div className="absolute inset-0 -z-20">
            <img
              src={featuredMovie.backdropUrl || featuredMovie.posterUrl}
              alt=""
              className="h-full w-full object-cover object-center opacity-50"
            />
          </div>

          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/85 to-black/20" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0a0a0b] via-transparent to-black/20" />

          <div className="absolute left-0 top-1/4 -z-10 h-64 w-64 rounded-full bg-red-700/15 blur-[110px]" />

          <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
            <div className="max-w-2xl space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-950/50 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-red-300">
                <Sparkles className="h-4 w-4" />
                The IMovies premiere
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-neutral-300">
                {featuredMovie.genres?.slice(0, 3).map((genre) => (
                  <span key={genre}>{genre}</span>
                ))}
                <span className="text-neutral-600">/</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#c9a45c]" />
                  {featuredMovie.duration} min
                </span>
              </div>

              <h1 className="text-4xl font-black leading-[1.06] tracking-tight text-white sm:text-6xl lg:text-7xl">
                {featuredMovie.title}
              </h1>

              <p className="max-w-xl text-sm leading-7 text-neutral-300 sm:text-base">
                {featuredMovie.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="inline-flex items-center gap-2 rounded-lg border border-[#c9a45c]/30 bg-black/50 px-3 py-2 font-bold text-[#e6c783]">
                  <Star className="h-4 w-4 fill-current" />
                  {Number(featuredMovie.rating || 0).toFixed(1)} / 10
                </span>

                <span className="rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-neutral-300">
                  {featuredMovie.ageClassification || 'Movie'}
                </span>

                {featuredMovie.director && (
                  <span className="text-xs text-neutral-400">
                    Directed by {featuredMovie.director}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onBookMovie(featuredMovie)}
                  className="inline-flex items-center gap-2.5 rounded-xl bg-[#c8102e] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-950/40 transition hover:-translate-y-0.5 hover:bg-[#e01938] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c9a45c]"
                >
                  <Ticket className="h-4 w-4" />
                  Book tickets
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onSelectMovie(featuredMovie)}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.06] px-5 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:border-[#c9a45c]/60 hover:bg-white/10"
                >
                  <Play className="h-4 w-4" />
                  Explore movie
                </button>
              </div>

              <div className="flex items-center gap-2 pt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                <Clapperboard className="h-4 w-4 text-[#c9a45c]" />
                Your next great cinema experience
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#c9a45c]/40 to-transparent" />
        </section>
      )}

      <div className="mx-auto max-w-7xl space-y-20 px-5 sm:px-8 lg:px-10">
        {/* Now showing */}
        <section className="space-y-7">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#c9a45c]">
                <span className="h-px w-7 bg-[#c9a45c]" />
                On the big screen
              </div>

              <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                Now Showing<span className="text-[#c8102e]">.</span>
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-400">
                Find your next favourite film and make it a cinema night.
              </p>
            </div>

            {genres.length > 0 && (
              <div className="flex max-w-full gap-2 overflow-x-auto pb-2">
                {genres.map((genre) => (
                  <button
                    type="button"
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    aria-pressed={selectedGenre === genre}
                    className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition ${
                      selectedGenre === genre
                        ? 'border-red-600 bg-red-600 text-white'
                        : 'border-white/10 bg-white/[0.03] text-neutral-400 hover:border-white/25 hover:text-white'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="aspect-[3/4] animate-pulse rounded-2xl border border-white/5 bg-white/[0.04]"
                />
              ))}
            </div>
          ) : filteredNowShowing.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-16 text-center">
              <Film className="mx-auto mb-4 h-9 w-9 text-neutral-500" />
              <p className="font-semibold text-white">No movies found</p>
              <p className="mt-2 text-sm text-neutral-400">
                Try a different genre to discover more films.
              </p>
              <button
                type="button"
                onClick={() => setSelectedGenre('All')}
                className="mt-5 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-500"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredNowShowing.map((movie) => (
                <MovieCard
                  key={movie._id}
                  movie={movie}
                  onSelect={onSelectMovie}
                  onBookNow={onBookMovie}
                />
              ))}
            </div>
          )}

          <div className="flex justify-center pt-3">
            <button
              type="button"
              onClick={() => onNavigate('movies')}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-neutral-300 transition hover:border-[#c9a45c]/50 hover:text-white"
            >
              Explore all movies
              <ArrowRight className="h-4 w-4 text-[#c9a45c]" />
            </button>
          </div>
        </section>

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <section className="space-y-7 border-t border-white/10 pt-14">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#c9a45c]">
                  <span className="h-px w-7 bg-[#c9a45c]" />
                  Coming soon
                </div>
                <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                  Upcoming Premieres<span className="text-[#c8102e]">.</span>
                </h2>
                <p className="mt-2 text-sm text-neutral-400">
                  Add a little anticipation to your watchlist.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('upcoming')}
                className="hidden items-center gap-1 text-sm font-semibold text-neutral-400 transition hover:text-white sm:inline-flex"
              >
                All releases
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {upcoming.map((movie) => (
                <MovieCard
                  key={movie._id}
                  movie={movie}
                  onSelect={onSelectMovie}
                  onBookNow={onSelectMovie}
                />
              ))}
            </div>
          </section>
        )}

        {/* Cinema experience */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#181416] via-[#101012] to-[#11100d] p-6 sm:p-10 lg:p-12">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-red-800/10 blur-[90px]" />

          <div className="relative">
            <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#c9a45c]">
              <Sparkles className="h-4 w-4" />
              The IMovies standard
            </div>

            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <h2 className="max-w-2xl text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
                  More than a movie.
                  <span className="block text-neutral-400">
                    An experience.
                  </span>
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-400">
                  Discover immersive sound, incredible visuals, and a more comfortable way to enjoy the big screen.
                </p>
              </div>
              <Film className="hidden h-14 w-14 text-[#c9a45c]/70 md:block" />
            </div>

            <div className="mt-9 grid gap-4 md:grid-cols-3">
              {[
                {
                  number: '01',
                  title: 'Immersive sound',
                  description:
                    'Experience rich, detailed audio that brings every scene to life.',
                },
                {
                  number: '02',
                  title: 'Remarkable visuals',
                  description:
                    'Enjoy striking cinematic images and details on the big screen.',
                },
                {
                  number: '03',
                  title: 'Your perfect seat',
                  description:
                    'Choose your preferred seats and plan your next movie outing.',
                },
              ].map((feature) => (
                <div
                  key={feature.number}
                  className="rounded-2xl border border-white/[0.08] bg-black/20 p-5 transition hover:border-[#c9a45c]/30"
                >
                  <span className="text-xs font-bold tracking-[0.2em] text-[#c9a45c]">
                    {feature.number}
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
