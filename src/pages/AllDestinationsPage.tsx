import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllDestinations, saveDestination, unsaveDestination } from '../services/destinationService';
import { Destination } from '../types/destination';
import { BookmarkPlus, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface DestinationCardProps {
  destination: Destination;
}

const DestinationCard = ({ destination }: DestinationCardProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user || isSaving) return;

    setIsSaving(true);
    try {
      if (isSaved) {
        await unsaveDestination(user.id, destination.id);
        setIsSaved(false);
      } else {
        await saveDestination(user.id, destination.id);
        setIsSaved(true);
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
              {user && (
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
              )}
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
        </div>
      </div>
    </Link>
  );
};

const AllDestinationsPage = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchAllDestinationsData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getAllDestinations();
        setDestinations(data);
      } catch (err) {
        console.error('Error fetching all destinations:', err);
        setError('여행지 정보를 불러오는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllDestinationsData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="container mx-auto px-4 py-12 text-center text-red-600">{error}</div>;
  }

  const filteredDestinations = filter === 'all' 
    ? destinations 
    : destinations.filter(dest => dest.tags.includes(filter));

  const allTags = [...new Set(destinations.flatMap(dest => dest.tags))];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-bold mb-6">모든 여행지</h1>
        <p className="text-lg text-gray-600 mb-8">
          다양한 매력을 가진 추천 여행지를 만나보세요.
        </p>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h2 className="text-2xl font-bold">
            추천 여행지 <span className="text-indigo-600">{filteredDestinations.length}곳</span>
          </h2>
          
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              전체
            </button>
            
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setFilter(tag)}
                className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                  filter === tag
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {destinations.length === 0 && !isLoading && !error && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-600">현재 추천 가능한 여행지가 없습니다.</p>
        </div>
      )}

      {filteredDestinations.length === 0 && destinations.length > 0 && !isLoading && !error && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-600">해당 필터에 맞는 여행지가 없습니다.</p>
        </div>
      )}
      
      {filteredDestinations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map((destination) => (
            <DestinationCard 
              key={destination.id} 
              destination={destination}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllDestinationsPage;