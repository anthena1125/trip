import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMbtiDestinations } from '../services/destinationService';
import { Destination } from '../types/destination';
import { getMbtiDescription } from '../utils/mbtiUtils';
import { BookmarkPlus, MapPin } from 'lucide-react';

const MbtiDestinationsPage = () => {
  const { mbtiType } = useParams<{ mbtiType: string }>();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!mbtiType) return;

    const fetchDestinations = async () => {
      setIsLoading(true);
      try {
        const data = await getMbtiDestinations(mbtiType);
        setDestinations(data);
      } catch (error) {
        console.error('여행지 로딩 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDestinations();
  }, [mbtiType]);

  if (!mbtiType) {
    return <div className="text-center py-20">MBTI 유형이 지정되지 않았습니다.</div>;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const mbtiInfo = getMbtiDescription(mbtiType);
  
  const filteredDestinations = filter === 'all' 
    ? destinations 
    : destinations.filter(dest => dest.tags.includes(filter));

  // 태그 목록 추출 (중복 제거)
  const allTags = [...new Set(destinations.flatMap(dest => dest.tags))];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm font-medium mb-3">
          {mbtiType} 유형을 위한
        </span>
        <h1 className="text-4xl font-bold mb-6">당신의 성격에 꼭 맞는 여행지</h1>
        <p className="text-lg text-gray-600 mb-8">
          {mbtiInfo?.description || '당신의 MBTI 성향에 맞는 여행지를 추천해 드립니다.'}
        </p>
        
        <div className="bg-indigo-50 rounded-lg p-6 text-left mb-8">
          <h2 className="text-xl font-bold mb-3 text-indigo-800">{mbtiType} 여행 성향</h2>
          <p className="mb-4 text-gray-700">{mbtiInfo?.travelStyle || '맞춤형 여행 가이드가 준비 중입니다.'}</p>
          
          <h3 className="text-lg font-semibold mb-2 text-indigo-700">이런 여행을 좋아해요</h3>
          <ul className="list-disc list-inside mb-4 text-gray-700">
            {mbtiInfo?.preferences?.map((pref, index) => (
              <li key={index}>{pref}</li>
            )) || <li>맞춤형 추천이 준비 중입니다.</li>}
          </ul>
          
          <h3 className="text-lg font-semibold mb-2 text-indigo-700">이런 점을 주의하세요</h3>
          <ul className="list-disc list-inside text-gray-700">
            {mbtiInfo?.challenges?.map((challenge, index) => (
              <li key={index}>{challenge}</li>
            )) || <li>맞춤형 조언이 준비 중입니다.</li>}
          </ul>
        </div>
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
      
      {filteredDestinations.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-600">해당 필터에 맞는 여행지가 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map((destination) => (
            <DestinationCard 
              key={destination.id} 
              destination={destination} 
              mbtiType={mbtiType} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface DestinationCardProps {
  destination: Destination;
  mbtiType: string;
}

const DestinationCard = ({ destination, mbtiType }: DestinationCardProps) => {
  const [isSaved, setIsSaved] = useState(false);

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSaved(!isSaved);
    
    // 여기에 저장 로직 추가
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="relative h-56 overflow-hidden">
        <img 
          src={destination.imageUrl} 
          alt={destination.name} 
          className="w-full h-full object-cover"
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
              onClick={toggleSave}
              className={`rounded-full p-2 ${
                isSaved ? 'bg-indigo-500 text-white' : 'bg-white/80 text-gray-600'
              } hover:bg-indigo-500 hover:text-white transition-colors`}
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
        
        <p className="text-gray-600 mb-4 line-clamp-3">{destination.description}</p>
        
        <div className="bg-indigo-50 p-3 rounded-md">
          <h4 className="text-sm font-medium text-indigo-800 mb-1">
            {mbtiType} 유형에게 추천하는 이유
          </h4>
          <p className="text-sm text-gray-700 line-clamp-2">
            {destination.mbtiReasons?.[mbtiType] || '이 여행지는 당신의 성향과 잘 맞는 곳입니다.'}
          </p>
        </div>
        
        <a 
          href={`/destinations/${destination.id}`}
          className="mt-4 inline-block w-full text-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
        >
          상세 정보 보기
        </a>
      </div>
    </div>
  );
};

export default MbtiDestinationsPage;