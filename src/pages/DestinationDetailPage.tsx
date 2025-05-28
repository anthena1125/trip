import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDestinationById } from '../services/destinationService';
import { Destination } from '../types/destination';
import { MapPin, Calendar, Clock, Heart, Share2, BookmarkPlus, Star, Info } from 'lucide-react';

const DestinationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchDestination = async () => {
      setIsLoading(true);
      try {
        const data = await getDestinationById(id);
        setDestination(data);
      } catch (error) {
        console.error('여행지 상세 정보 로딩 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDestination();
  }, [id]);

  if (!id || isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">여행지를 찾을 수 없습니다</h2>
        <p className="text-gray-600">요청하신 여행지 정보가 존재하지 않습니다.</p>
      </div>
    );
  }

  const { 
    name, 
    location, 
    description, 
    imageUrl, 
    tags, 
    mbtiTypes, 
    mbtiReasons,
    attractions,
    bestTimeToVisit,
    avgCost,
    travelTips
  } = destination;

  return (
    <div>
      {/* 히어로 섹션 */}
      <div className="relative h-[50vh] md:h-[60vh]">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-end z-20">
          <div className="container mx-auto px-4 pb-8 md:pb-12">
            <div className="max-w-4xl">
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="text-xs bg-white/90 text-gray-800 px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{name}</h1>
              <div className="flex items-center text-white/90 mb-4">
                <MapPin size={18} className="mr-1" />
                <span className="text-lg">{location}</span>
              </div>
              <div className="flex items-center text-white space-x-4">
                <button 
                  onClick={() => setIsLiked(!isLiked)}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-full transition-colors ${
                    isLiked 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
                  <span>좋아요</span>
                </button>
                <button 
                  onClick={() => setIsSaved(!isSaved)}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-full transition-colors ${
                    isSaved 
                      ? 'bg-indigo-500 text-white' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <BookmarkPlus size={18} fill={isSaved ? 'currentColor' : 'none'} />
                  <span>저장</span>
                </button>
                <button className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors">
                  <Share2 size={18} />
                  <span>공유</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 콘텐츠 섹션 */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* 메인 콘텐츠 */}
          <div className="md:w-2/3">
            {/* 탭 네비게이션 */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex overflow-x-auto -mb-px">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-4 px-1 mr-8 font-medium text-sm border-b-2 whitespace-nowrap ${
                    activeTab === 'overview'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  개요
                </button>
                <button
                  onClick={() => setActiveTab('attractions')}
                  className={`py-4 px-1 mr-8 font-medium text-sm border-b-2 whitespace-nowrap ${
                    activeTab === 'attractions'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  볼거리
                </button>
                <button
                  onClick={() => setActiveTab('mbti')}
                  className={`py-4 px-1 mr-8 font-medium text-sm border-b-2 whitespace-nowrap ${
                    activeTab === 'mbti'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  MBTI 맞춤 가이드
                </button>
                <button
                  onClick={() => setActiveTab('tips')}
                  className={`py-4 px-1 mr-8 font-medium text-sm border-b-2 whitespace-nowrap ${
                    activeTab === 'tips'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  여행 팁
                </button>
              </nav>
            </div>

            {/* 탭 콘텐츠 */}
            <div className="pb-8">
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">여행지 소개</h2>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 mb-6 leading-relaxed whitespace-pre-line">
                      {description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Calendar size={18} className="text-indigo-600 mr-2" />
                          <h3 className="font-medium">최적 방문 시기</h3>
                        </div>
                        <p className="text-gray-700">{bestTimeToVisit || '연중 방문 가능'}</p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Clock size={18} className="text-indigo-600 mr-2" />
                          <h3 className="font-medium">추천 체류 기간</h3>
                        </div>
                        <p className="text-gray-700">{destination.recommendedStay || '2~3일'}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <div className="flex items-center mb-2">
                        <Info size={18} className="text-indigo-600 mr-2" />
                        <h3 className="font-medium">예상 비용</h3>
                      </div>
                      <p className="text-gray-700">{avgCost || '1인당 약 15만원~25만원 (교통, 숙박, 식사 포함)'}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'attractions' && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">주요 볼거리</h2>
                  <div className="space-y-6">
                    {attractions ? (
                      attractions.map((attraction, index) => (
                        <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
                          <h3 className="text-xl font-medium mb-2">{attraction.name}</h3>
                          <p className="text-gray-700 mb-3">{attraction.description}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin size={14} className="mr-1" />
                            <span>{attraction.location}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600">볼거리 정보가 준비 중입니다.</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'mbti' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">MBTI 유형별 맞춤 가이드</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {mbtiTypes.map((type) => (
                      <div key={type} className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium text-indigo-700 mb-2">{type} 유형</h3>
                        <p className="text-gray-700">
                          {mbtiReasons?.[type] || '이 여행지는 당신의 MBTI 성향과 잘 맞는 곳입니다.'}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-indigo-50 p-5 rounded-lg mb-6">
                    <h3 className="text-lg font-medium text-indigo-800 mb-3">여행 스타일 팁</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 mr-2 shrink-0">E</span>
                        <span><strong>외향형(E):</strong> 현지 투어나 그룹 활동에 참여해보세요. 새로운 사람들과의 만남을 통해 색다른 경험을 할 수 있어요.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 mr-2 shrink-0">I</span>
                        <span><strong>내향형(I):</strong> 한적한 시간대를 선택하여 여유롭게 관광지를 둘러보세요. 조용한 카페에서의 시간도 좋은 추억이 됩니다.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 mr-2 shrink-0">S</span>
                        <span><strong>감각형(S):</strong> 실제 경험을 중시하는 당신, 현지 음식 맛보기나 전통 체험을 놓치지 마세요.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 mr-2 shrink-0">N</span>
                        <span><strong>직관형(N):</strong> 장소의 역사와 의미를 알아보면 더 깊은 여행이 됩니다. 가이드북에 없는 숨은 명소를 발견해보세요.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'tips' && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">여행 팁</h2>
                  <div className="prose max-w-none">
                    {travelTips ? (
                      <ul className="space-y-4">
                        {travelTips.map((tip, index) => (
                          <li key={index} className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-700">{tip}</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                        <h3 className="font-medium text-yellow-800 mb-2">현지 여행 팁</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                          <li>방문 전 날씨를 확인하고 적절한 옷차림을 준비하세요.</li>
                          <li>현지 교통 옵션을 미리 알아두면 이동이 편리합니다.</li>
                          <li>주요 관광지는 오전 일찍 방문하면 혼잡함을 피할 수 있어요.</li>
                          <li>지역 특산품과 현지 음식을 꼭 맛보세요.</li>
                          <li>여행자 보험 가입을 권장합니다.</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 사이드바 */}
          <div className="md:w-1/3">
            <div className="sticky top-24">
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-medium mb-4">이 여행지에 잘 맞는 MBTI</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {mbtiTypes.map((type) => (
                    <span 
                      key={type}
                      className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-800"
                    >
                      <Star size={14} className="mr-1" fill="currentColor" />
                      {type}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  위 MBTI 유형과 여행 성향이 잘 맞는 여행지입니다.
                </p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-medium">주변 추천 여행지</h3>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-16 h-16 rounded-md overflow-hidden shrink-0 mr-3">
                        <img 
                          src="https://images.pexels.com/photos/1268482/pexels-photo-1268482.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                          alt="추천 여행지" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">주변 명소 1</h4>
                        <p className="text-sm text-gray-600 mb-1">12km 거리</p>
                        <div className="flex items-center text-yellow-500 text-sm">
                          <span>4.5</span>
                          <div className="flex ml-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                size={12} 
                                fill={star <= 4 ? 'currentColor' : 'none'} 
                                stroke={star <= 4 ? 'none' : 'currentColor'}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-16 h-16 rounded-md overflow-hidden shrink-0 mr-3">
                        <img 
                          src="https://images.pexels.com/photos/3361490/pexels-photo-3361490.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                          alt="추천 여행지" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">주변 명소 2</h4>
                        <p className="text-sm text-gray-600 mb-1">18km 거리</p>
                        <div className="flex items-center text-yellow-500 text-sm">
                          <span>4.2</span>
                          <div className="flex ml-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                size={12} 
                                fill={star <= 4 ? 'currentColor' : 'none'} 
                                stroke={star <= 4 ? 'none' : 'currentColor'}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 text-center">
                  <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                    더 많은 여행지 보기
                  </a>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-100 to-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-indigo-800 mb-3">여행 계획 도움이 필요하신가요?</h3>
                <p className="text-gray-700 mb-4">
                  MBTI 유형에 맞는 맞춤형 여행 계획을 세워보세요. 당신의 성향에 꼭 맞는 특별한 경험을 발견할 수 있습니다.
                </p>
                <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                  여행 계획 시작하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetailPage;