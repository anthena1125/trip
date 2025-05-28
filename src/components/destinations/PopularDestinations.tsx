import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPopularDestinations, saveDestination, unsaveDestination } from '../../services/destinationService';
import { Destination } from '../../types/destination';
import { Heart, BookmarkPlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const PopularDestinations = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await getPopularDestinations();
        setDestinations(data);
      } catch (error) {
        console.error('인기 여행지 로딩 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {destinations.map((destination) => (
        <DestinationCard key={destination.id} destination={destination} />
      ))}
    </div>
  );
};

interface DestinationCardProps {
  destination: Destination;
}

const DestinationCard = ({ destination }: DestinationCardProps) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user || isProcessing) return;

    setIsProcessing(true);
    try {
      if (isSaved) {
        await unsaveDestination(user.id, destination.id);
      } else {
        await saveDestination(user.id, destination.id);
      }
      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Error saving destination:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsLiked(!isLiked);
  };

  return (
    <Link to={`/destinations/${destination.id}`} className="group">
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
        <div className="relative h-56 overflow-hidden">
          <img 
            src={destination.imageUrl} 
            alt={destination.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={handleSave}
              disabled={isProcessing}
              className={`rounded-full p-2 ${
                isSaved ? 'bg-indigo-500 text-white' : 'bg-white/80 text-gray-600'
              } hover:bg-indigo-500 hover:text-white transition-colors ${
                isProcessing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <BookmarkPlus size={18} fill={isSaved ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={toggleLike}
              className={`rounded-full p-2 ${
                isLiked ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-600'
              } hover:bg-red-500 hover:text-white transition-colors`}
            >
              <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-800">{destination.name}</h3>
            <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
              {destination.mbtiTypes.join(', ')}
            </span>
          </div>
          
          <p className="text-gray-600 mb-3 line-clamp-2">{destination.description}</p>
          
          <div className="flex flex-wrap gap-2">
            {destination.tags.map((tag, index) => (
              <span 
                key={index}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PopularDestinations;