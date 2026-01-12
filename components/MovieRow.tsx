
import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie } from '../types';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
}

const MovieRow: React.FC<MovieRowProps> = ({ title, movies, onMovieClick }) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (movies.length === 0) return null;

  return (
    <div className="space-y-4 mb-8">
      <h3 className="text-xl md:text-2xl font-bold px-4 md:px-12 text-gray-100">{title}</h3>
      <div className="group relative flex items-center">
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 z-10 p-2 bg-black/50 h-full opacity-0 group-hover:opacity-100 transition duration-300 hover:scale-125 md:px-4"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        <div 
          ref={rowRef}
          className="row-container flex space-x-2 md:space-x-4 overflow-x-auto px-4 md:px-12 scroll-smooth"
        >
          {movies.map((movie) => (
            <div 
              key={movie.id}
              onClick={() => onMovieClick(movie)}
              className="relative flex-none w-40 h-24 md:w-64 md:h-36 cursor-pointer transition duration-300 hover:scale-110 hover:z-20 rounded-md overflow-hidden bg-zinc-900 group/card"
            >
              <img 
                src={movie.thumbnail} 
                alt={movie.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/card:opacity-100 transition-opacity flex flex-col justify-end p-2 md:p-4">
                 <p className="text-xs md:text-sm font-bold text-white truncate">{movie.title}</p>
                 <div className="flex items-center space-x-2 text-[8px] md:text-[10px] text-green-400 font-bold mt-1">
                    <span>{movie.rating}</span>
                    <span>{movie.year}</span>
                 </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 z-10 p-2 bg-black/50 h-full opacity-0 group-hover:opacity-100 transition duration-300 hover:scale-125 md:px-4"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};

export default MovieRow;
