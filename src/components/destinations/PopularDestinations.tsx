import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPopularDestinations, saveDestination, unsaveDestination } from '../../services/destinationService';
import { Destination } from '../../types/destination';
import { BookmarkPlus, MapPin } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const PopularDestinations = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savedDestinations, setSavedDestinations] = useState<Set<string>>(new Set());

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
        <DestinationCard 
          key={destination.id} 
          destination={destination}
          savedDestinations={savedDestinations}
          setSavedDestinations={setSavedDestinations}
        />
      ))}
    </div>
  );
};

interface DestinationCardProps {
  destination: Destination;
  savedDestinations: Set<string>;
  setSavedDestinations: React.Dispatch<React.SetStateAction<Set<string>>>;
}

const DestinationCard = ({ destination, savedDestinations, setSavedDestinations }: DestinationCardProps) => {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const isSaved = savedDestinations.has(destination.id);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user || isSaving) return;

    setIsSaving(true);
    try {
      if (isSaved) {
        await unsaveDestination(user.id, destination.id);
        setSavedDestinations(prev => {
          const newSet = new Set(prev);
          newSet.delete(destination.id);
          return newSet;
        });
      } else {
        await saveDestination(user.id, destination.id);
        setSavedDestinations(prev => new Set([...prev, destination.id]));
      }
    } catch (error) {
      console.error('Error saving destination:', error);
    } finally {
      setIsSaving(false);
    }
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
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-xl font-bold text-white">{destination.name}</h3>
                <div className="flex items-center text-white/90 text-sm">
                  <MapPin size={14} className="mr-1" />
                  <span>{destination.location}</span>
                </div>
              </div>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`rounded-full p-2 ${
                  isSaved ? 'bg-indigo-500 text-white' : 'bg-white/80 text-gray-600'
                } hover:bg-indigo-500 hover:text-white transition-colors ${
                  isSaving ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <BookmarkPlus size={18} fill={isSaved ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex flex-wrap gap-2 mb-3">
            {destination.tags.map((tag, index) => (
              <span 
                key={index}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <p className="text-gray-600 mb-4 line-clamp-2">{destination.description}</p>
          
          <div className="flex flex-wrap gap-2">
            {destination.mbtiTypes.map((type, index) => (
              <span 
                key={index}
                className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded"
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PopularDestinations;