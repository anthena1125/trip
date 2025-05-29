// src/pages/MyPage.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Settings, Map, LogOut } from 'lucide-react'; 
import { Destination } from '../types/destination';
import { getSavedDestinations, unsaveDestination } from '../services/destinationService'; 

const MyPage = () => {
  const { user, profile, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile'); // 기본 탭
  const [isLoading, setIsLoading] = useState(false); // 프로필 업데이트 로딩
  const [error, setError] = useState(''); // 프로필 업데이트 에러
  const [success, setSuccess] = useState(''); // 프로필 업데이트 성공 메시지
  const [formData, setFormData] = useState({
    nickname: '', // 초기값은 useEffect에서 설정
    mbtiType: '', // 초기값은 useEffect에서 설정
    travelStyles: [] as string[] // 이 필드는 현재 updateProfile에서 사용되지 않음
  });

  const [savedDestinations, setSavedDestinations] = useState<(Destination & { savedDate: string })[]>([]);
  // const [likedDestinations, setLikedDestinations] = useState<(Destination & { likedDate: string })[]>([]); // "좋아요" 상태 제거
  const [isLoadingDestinations, setIsLoadingDestinations] = useState(false); // 저장된 여행지 로딩 상태

  // profile이 로드되면 formData 초기화
  useEffect(() => {
    if (profile) {
      setFormData({
        nickname: profile.nickname || '',
        mbtiType: profile.mbtiType || '',
        travelStyles: [] // 필요하다면 프로필에서 가져오도록 수정
      });
    }
  }, [profile]);

  // 탭 변경 시 또는 사용자 변경 시 데이터 로드
  useEffect(() => {
    if (user && activeTab === 'saved') {
      fetchUserSavedDestinations();
    }
    // 'liked' 탭 관련 로직은 제거되었으므로 fetchUserDestinations 직접 호출 필요 없음
  }, [user, activeTab]); // activeTab 변경 시 저장된 여행지 다시 불러오기

  const fetchUserSavedDestinations = async () => {
    if (!user) return;
    
    setIsLoadingDestinations(true);
    try {
      const saved = await getSavedDestinations(user.id);
      setSavedDestinations(saved);
    } catch (error) {
      console.error('Error fetching saved destinations:', error);
      setSavedDestinations([]); // 에러 시 빈 배열로 초기화
    } finally {
      setIsLoadingDestinations(false);
    }
  };

  const handleUnsave = async (destinationId: string) => {
    if (!user) return;
    
    try {
      await unsaveDestination(user.id, destinationId);
      // 성공적으로 삭제 후 목록 다시 불러오기 또는 로컬에서 제거
      setSavedDestinations(prev => prev.filter(dest => dest.id !== destinationId));
      // 또는 fetchUserSavedDestinations(); // 목록을 다시 불러와서 정확한 상태 반영
    } catch (error) {
      console.error('Error removing saved destination:', error);
      alert('저장된 여행지를 삭제하는 중 오류가 발생했습니다.');
    }
  };

  // "좋아요 취소" 핸들러 함수 제거
  // const handleUnlike = async (destinationId: string) => { ... };

  if (!user || !profile) { // 사용자와 프로필 모두 로드될 때까지 로딩 또는 메시지 표시
    // AuthContext의 isLoading 상태를 활용하여 더 정교한 로딩 UI 표시 가능
    return <div className="text-center py-20">{ AuthContext.isLoading ? '사용자 정보를 불러오는 중...' : '로그인이 필요합니다.'}</div>;
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      // nickname이나 mbtiType이 비어있지 않은지 등 유효성 검사 추가 가능
      await updateProfile({
        nickname: formData.nickname,
        mbtiType: formData.mbtiType,
        // id, email은 여기서 업데이트하지 않음
      });
      setSuccess('프로필이 성공적으로 업데이트되었습니다.');
    } catch (err) {
      setError('프로필 업데이트에 실패했습니다. 다시 시도해주세요.');
      console.error("Profile update error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTravelStyleChange = (style: string) => {
    // 이 기능은 현재 updateProfile에서 사용되지 않으므로, 필요 시 DB 스키마 및 updateProfile 로직 수정 필요
    setFormData(prev => ({
      ...prev,
      travelStyles: prev.travelStyles.includes(style)
        ? prev.travelStyles.filter(s => s !== style)
        : [...prev.travelStyles, style]
    }));
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* 사이드바 (프로필 정보) */}
        <div className="md:w-1/4">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                <User size={40} className="text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold">{profile.nickname}</h2>
              <p className="text-gray-600">{profile.email}</p>
              <div className="mt-2 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                {profile.mbtiType || 'MBTI 미설정'}
              </div>
            </div>
            
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center w-full px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <User size={18} className="mr-2" />
                프로필 정보
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`flex items-center w-full px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'saved'
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Map size={18} className="mr-2" />
                저장한 여행지
              </button>
              {/* "좋아요한 여행지" 탭 버튼 제거 */}
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center w-full px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Settings size={18} className="mr-2" />
                설정
              </button>
            </nav>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={logout}
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors"
              >
                <LogOut size={18} className="mr-2" />
                로그아웃
              </button>
            </div>
          </div>
        </div>
        
        {/* 메인 컨텐츠 */}
        <div className="md:w-3/4">
          {activeTab === 'profile' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-6">프로필 정보</h2>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">
                  {success}
                </div>
              )}
              
              <form onSubmit={handleProfileSubmit} className="space-y-6 max-w-2xl">
                <div>
                  <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1">
                    닉네임
                  </label>
                  <input
                    id="nickname" // htmlFor와 맞추기
                    type="text"
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required // 닉네임 필수 입력으로 가정
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    이메일
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={profile.email} // profile에서 직접 가져옴
                    disabled
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-500 cursor-not-allowed"
                  />
                  <p className="mt-1 text-sm text-gray-500">이메일은 변경할 수 없습니다.</p>
                </div>
                
                <div>
                  <label htmlFor="mbtiType" className="block text-sm font-medium text-gray-700 mb-1">
                    MBTI 유형
                  </label>
                  <select
                    id="mbtiType"
                    name="mbtiType"
                    value={formData.mbtiType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">MBTI 유형 선택 안 함</option> {/* 선택 안 함 옵션 */}
                    {['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'].map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                {/* 선호하는 여행 스타일은 현재 DB와 연동되지 않으므로 UI만 남기거나 주석 처리/삭제 */}
                {/*
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    선호하는 여행 스타일 (구현 예정)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {['자연/풍경', '역사/문화', '음식/맛집', '쇼핑', '액티비티', '휴양/힐링', '예술/건축', '축제/이벤트'].map((style) => (
                      <div key={style} className="flex items-center">
                        <input
                          id={`style-${style}`}
                          type="checkbox"
                          checked={formData.travelStyles.includes(style)}
                          onChange={() => handleTravelStyleChange(style)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`style-${style}`} className="ml-2 text-sm text-gray-700">
                          {style}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                */}
                
                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? '저장 중...' : '프로필 저장'}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {activeTab === 'saved' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-6">저장한 여행지</h2>
              
              {isLoadingDestinations ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : savedDestinations.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 mb-4">저장한 여행지가 없습니다.</p>
                  <a 
                    href="/destinations/all" // Link 컴포넌트 사용 권장: import { Link } from 'react-router-dom'; <Link to=...>
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    여행지 둘러보기
                  </a>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> {/* 반응형 컬럼 수 조정 */}
                  {savedDestinations.map((destination) => (
                    <div key={destination.id} className="border border-gray-200 rounded-lg overflow-hidden flex flex-col">
                      <div className="h-36 overflow-hidden">
                        <img 
                          src={destination.imageUrl} 
                          alt={destination.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 flex flex-col flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-lg line-clamp-1">{destination.name}</h3>
                            {destination.savedDate && <p className="text-sm text-gray-500">{destination.savedDate} 저장</p>}
                          </div>
                          <button 
                            onClick={() => handleUnsave(destination.id)}
                            className="text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-red-100 transition-colors"
                            title="저장 취소"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3 flex-grow">{destination.description}</p>
                        <a 
                          href={`/destinations/${destination.id}`} // Link 컴포넌트 사용 권장
                          className="mt-auto inline-block w-full text-center py-1.5 px-3 border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50 text-sm font-medium transition-colors"
                        >
                          상세정보 보기
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* "좋아요한 여행지" 탭 콘텐츠 전체 제거 */}
          
          {activeTab === 'settings' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-6">설정</h2>
              {/* ... (설정 탭 UI - 기존과 동일) ... */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPage;