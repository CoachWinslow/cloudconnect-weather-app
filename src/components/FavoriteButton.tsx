import { Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useIsFavorite, useAddFavorite, useRemoveFavorite } from "@/hooks/useFavorites";
import { useNavigate } from "react-router-dom";

interface Props {
  cityId?: string;
  cityName: string;
  lat: number;
  lng: number;
  className?: string;
}

export default function FavoriteButton({ cityId, cityName, lat, lng, className = "" }: Props) {
  const { user } = useAuth();
  const { isFavorite, favoriteId } = useIsFavorite(lat, lng);
  const addFav = useAddFavorite();
  const removeFav = useRemoveFavorite();
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate("/auth");
      return;
    }
    if (isFavorite && favoriteId) {
      removeFav.mutate(favoriteId);
    } else {
      addFav.mutate({ city_id: cityId, city_name: cityName, lat, lng });
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`transition-colors ${className}`}
      title={isFavorite ? "Remove favorite" : "Add to favorites"}
    >
      <Heart
        className={`w-4 h-4 ${isFavorite ? "text-red-500 fill-red-500" : "text-muted-foreground hover:text-red-400"}`}
      />
    </button>
  );
}
