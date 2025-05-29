// src/pages/MbtiDestinationsPage.tsx

import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom'; // Link import 추가
import { getMbtiDestinations, saveDestination, unsaveDestination, getSavedDestinations } from '../services/destinationService'; // getSavedDestinations 추가
import { Destination } from '../types/destination';
import { getMbtiDescription } from '../utils/mbtiUtils';
import { BookmarkPlus, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface DestinationCardProps {
  destination: Destination; // 이제 null/undefined를 허용하지 않는다고 가정 (아래 MbtiDestinationsPage에서 필터링)
  mbtiType: string;
}

const DestinationCard = ({ destination, mbtiType }: DestinationCardProps) => {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // 저장/취소 중 로딩 상태

  // ✨ 컴포넌트 마운트 시 및 user 또는 destination.id 변경 시 저장 상태 확인
  useEffect(() => {
    const checkIfSaved = async () => {
      if (user && destination?.id) { // destination이 null이 아닌지 확인
        try {
          // 각 카드마다 API 호출은 비효율적일 수 있으므로,
          // 실제 프로덕션에서는 사용자의 저장 목록을 Context API 등으로 전역 관리하는 것이 좋음
          const userSavedDestinations = await getSavedDestinations(user.id);
          const found = userSavedDestinations.some(savedDest => savedDest.id === destination.id);
          setIsSaved(found);
        } catch (error) {
          console.error(`[Card ${destination.id}] Error checking saved state:`, error);
          setIsSaved(false);
        }
      } else {
        setIsSaved(false);
      }
    };

    checkIfSaved();
  }, [user, destination?.id]); // destination.id도 의존성 배열에 추가

  const handleSaveToggle = async (e: React.MouseEvent) => { // 함수 이름 변경 및 로직 통합
    e.preventDefault();
    e.stopPropagation(); // 부모 Link의 이벤트 방지

    if (!user) {
      alert('로그인이 필요한 기능입니다.');
      return;
    }
    if (!destination?.id || isSaving) return; // destination.id 확인 및 중복 클릭 방지

    setIsSaving(true);
    try {
      if (isSaved) {
        console.log(`[Card] Attempting to UNSAVE destId: ${destination.id} for userId: ${user.id}`);
        await unsaveDestination(user.id, destination.id);
        setIsSaved(false);
      } else {
        console.log(`[Card] Attempting to SAVE destId: ${destination.id} for userId: ${user.id}`);
        await saveDestination(user.id, destination.id);
        setIsSaved(true);
      }
    } catch (error) {
      console.error(`[Card ${destination.id}] Error saving/unsaving destination:`, error);
      alert('여행지 저장/취소 중 오류가 발생했습니다.');
      // 실패 시 isSaved 상태를 원래대로 돌려놓는 로직도 고려할 수 있음
    } finally {
      setIsSaving(false);
    }
  };
  
  // ✨ destination 객체가 없을 경우 렌더링하지 않거나 로딩/에러 UI 표시 (MbtiDestinationsPage에서 필터링하므로 여기선 null 체크만)
  if (!destination) {
      return null; // 또는 <p>잘못된 여행지 정보입니다.</p>
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <Link to={`/destinations/${destination.id}`} className="block"> {/* 카드 전체를 링크로 감싸기 */}
        <div className="relative h-56 overflow-hidden">
          <img 
            src={destination.imageUrl} 
            alt={destination.name} 
            className="w-full h-full object-cover"
            onError={(e) => { // 이미지 로드 실패 시
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
              console.warn(`Image failed to load for ${destination.name}: ${destination.imageUrl}`);
            }}
          />
          {user && ( // 로그인한 경우에만 저장 버튼 표시
            <div className="absolute top-2 right-2">
              <button
                onClick={handleSaveToggle}
                disabled={isSaving}
                title={isSaved ? '저장 취소' : '저장하기'}
                className={`rounded-full p-2 transition-colors duration-200 ease-in-out
                  ${isSaving ? 'bg-gray-400 cursor-not-allowed' : ''}
                  ${isSaved 
                    ? 'bg-indigo-500 text-white hover:bg-indigo-600' 
                    : 'bg-white/80 text-gray-600 hover:bg-indigo-100 hover:text-indigo-600'
                  }`}
              >
                <BookmarkPlus size={18} fill={isSaved ? 'currentColor' : 'none'} />
              </button>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
            <h3 className="text-xl font-bold text-white truncate">{destination.name}</h3>
            <div className="flex items-center text-white/90 text-sm">
              <MapPin size={14} className="mr-1" />
              <span className="truncate">{destination.location}</span>
            </div>
          </div>
        </div>
      </Link>
      
      <div className="p-4">
        <div className="flex flex-wrap gap-2 mb-3">
          {/* destination.tags가 배열인지 확인 후 map 실행 */}
          {Array.isArray(destination.tags) && destination.tags.map((tag, index) => (
            <span 
              key={index}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-3 h-16">{destination.description}</p>
        
        <div className="bg-indigo-50 p-3 rounded-md">
          <h4 className="text-sm font-medium text-indigo-800 mb-1">
            {mbtiType} 유형에게 추천하는 이유
          </h4>
          <p className="text-sm text-gray-700 line-clamp-2">
            {destination.mbtiReasons?.[mbtiType] || '이 여행지는 당신의 성향과 잘 맞는 곳입니다.'}
          </p>
        </div>
        
        <Link 
          to={`/destinations/${destination.id}`}
          className="mt-4 inline-block w-full text-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
        >
          상세 정보 보기
        </Link>
      </div>
    </div>
  );
};

const MbtiDestinationsPage = () => {
  const { mbtiType } = useParams<{ mbtiType: string }>();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!mbtiType) {
      setIsLoading(false); // mbtiType이 없으면 로딩 종료
      return;
    }

    const fetchDestinations = async () => {
      setIsLoading(true);
      try {
        console.log(`[MbtiPage] Fetching destinations for ${mbtiType}`);
        const data = await getMbtiDestinations(mbtiType);
        // ✨ 데이터가 유효한지, 필수 필드가 있는지 여기서 한번 더 확인 가능
        console.log(`[MbtiPage] Received data for ${mbtiType}:`, data);
        setDestinations(data || []); // data가 null일 경우 빈 배열로
      } catch (error) {
        console.error('여행지 로딩 실패:', error);
        setDestinations([]); // 에러 시 빈 배열
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
  
  // destinations가 배열인지 먼저 확인
  const validDestinations = Array.isArray(destinations) ? destinations : [];
  
  const filteredDestinations = filter === 'all' 
    ? validDestinations 
    : validDestinations.filter(dest => dest && Array.isArray(dest.tags) && dest.tags.includes(filter)); // dest 및 dest.tags 유효성 검사 추가

  // allTags 추출 전 validDestinations 확인
  const allTags = [...new Set(validDestinations.flatMap(dest => dest && Array.isArray(dest.tags) ? dest.tags : []))];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* ... (상단 정보 UI는 이전과 유사) ... */}
      <div className="max-w-4xl mx-auto mb-12 text-center">
        {/* ... */}
      </div>
      
      <div className="mb-8">
        {/* ... (필터 버튼 UI는 이전과 유사) ... */}
      </div>
      
      {filteredDestinations.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-600">
            {isLoading ? '여행지를 불러오는 중...' : (mbtiType ? `${mbtiType} 유형에 맞는 추천 여행지가 없거나, 현재 필터에 맞는 결과가 없습니다.` : 'MBTI 유형을 선택해주세요.')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* ✨ map 실행 전 filteredDestinations가 배열인지, destination 객체가 유효한지 확인 */}
          {Array.isArray(filteredDestinations) && filteredDestinations.map((destination) => (
            // destination 객체가 null 이거나 undefined가 아닐 때만 DestinationCard 렌더링
            destination && destination.id ? ( // id 존재 여부로 객체 유효성 판단 (더 구체적인 검사 필요 시 추가)
              <DestinationCard 
                key={destination.id} 
                destination={destination} 
                mbtiType={mbtiType} 
              />
            ) : null
          ))}
        </div>
      )}
    </div>
  );
};

export default MbtiDestinationsPage;

/*import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMbtiDestinations, saveDestination, unsaveDestination } from '../services/destinationService';
import { Destination } from '../types/destination';
import { getMbtiDescription } from '../utils/mbtiUtils';
import { BookmarkPlus, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface DestinationCardProps {
  destination: Destination;
  mbtiType: string;
}

const DestinationCard = ({ destination, mbtiType }: DestinationCardProps) => {
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
        
        <p className="text-gray-600 mb-4 line-clamp-3">{destination.description}</p>
        
        <div className="bg-indigo-50 p-3 rounded-md">
          <h4 className="text-sm font-medium text-indigo-800 mb-1">
            {mbtiType} 유형에게 추천하는 이유
          </h4>
          <p className="text-sm text-gray-700 line-clamp-2">
            {destination.mbtiReasons?.[mbtiType] || '이 여행지는 당신의 성향과 잘 맞는 곳입니다.'}
          </p>
        </div>
        
        <Link 
          to={`/destinations/${destination.id}`}
          className="mt-4 inline-block w-full text-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
        >
          상세 정보 보기
        </Link>
      </div>
    </div>
  );
};

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

export default MbtiDestinationsPage;*/