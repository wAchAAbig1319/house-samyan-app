import type { Movie } from '@/api/types';

export interface MovieCardProps {
  movie: Movie;
  owned: boolean;
  inCart: boolean;
  width: number;
  onPress: (movie: Movie) => void;
  onAddToCart: (movie: Movie) => void;
}
