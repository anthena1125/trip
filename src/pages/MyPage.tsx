import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Settings, Map, Heart, LogOut } from 'lucide-react';
import { Destination } from '../types/destination';
import { getSavedDestinations, getLikedDestinations, unsaveDestination, unlikeDestination } from '../services/destinationService';

const MyPage = () => {
  const { user, profile, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    nickname: profile?.nickname || '',
    mbtiType: profile?.mbtiType || '',
    travelStyles: [] as string[]
  });

  const [savedDestinations, setSavedDestinations] = useState<(Destination & { savedDate: string })[]>([]);
  const [likedDestinations, setLikedDestinations] = useState<(Destination & { likedDate: string })[]>([]);
  const [isLoadingDestinations, setIsLoadingDestinations] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserDestinations();
    }
  }, [user]);

  const fetchUserDestinations = async () => {
    if (!user) return;
    
    setIsLoadingDestinations(true);
    try {
      const [saved, liked] = await Promise.all([
        getSavedDestinations(user.id),
        getLikedDestinations(user.id)
      ]);
      setSavedDestinations(saved as (Destination & { savedDate: string })[]);
      setLikedDestinations(liked as (Destination & { likedDate: string })[]);
    } catch (error) {
      console.error('Error fetching user destinations:', error);
    } finally {
      setIsLoadingDestinations(false);
    }
  };

  const handleUnsave = async (destinationId: string) => {
    if (!user) return;
    
    try {
      await unsaveDestination(user.id, destinationId);
      setSavedDestinations(prev => prev.filter(dest => dest.id !== destinationId));
    } catch (error) {
      console.error('Error removing saved destination:', error);
    }
  };

  const handleUnlike = async (destinationId: string) => {
    if (!user) return;
    
    try {
      await unlikeDestination(user.id, destinationId);
      setLikedDestinations(prev => prev.filter(dest => dest.id !== destinationId));
    } catch (error) {
      console.error('Error removing liked destination:', error);
    }
  };

  if (!user) {
    return <div className="text-center py-20">로그인이 필요합니다.</div>;
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await updateProfile({
        nickname: formData.nickname,
        mbtiType: formData.mbtiType,
      });
      setSuccess('프로필이 성공적으로 업데이트되었습니다.');
    } catch (err) {
      setError('프로필 업데이트에 실패했습니다. 다시 시도해주세요.');
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
              <h2 className="text-xl font-bold">{profile?.nickname}</h2>
              <p className="text-gray-600">{profile?.email}</p>
              <div className="mt-2 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                {profile?.mbtiType || 'MBTI 미설정'}
              </div>
            </div>
            
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center w-full px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'profile'
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <User size={18} className="mr-2" />
                프로필 정보
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`flex items-center w-full px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'saved'
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Map size={18} className="mr-2" />
                저장한 여행지
              </button>
              <button
                onClick={() => setActiveTab('liked')}
                className={`flex items-center w-full px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'liked'
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Heart size={18} className="mr-2" />
                좋아요한 여행지
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center w-full px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'settings'
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Settings size={18} className="mr-2" />
                설정
              </button>
            </nav>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={logout}
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
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
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
                  {success}
                </div>
              )}
              
              <form onSubmit={handleProfileSubmit} className="space-y-6 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    닉네임
                  </label>
                  <input
                    type="text"
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    이메일
                  </label>
                  <input
                    type="email"
                    value={profile?.email}
                    disabled
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-500"
                  />
                  <p className="mt-1 text-sm text-gray-500">이메일은 변경할 수 없습니다.</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    MBTI 유형
                  </label>
                  <select
                    name="mbtiType"
                    value={formData.mbtiType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="" disabled>MBTI 유형 선택</option>
                    {['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'].map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    선호하는 여행 스타일
                  </label>
                  <div className="grid grid-cols-2 gap-2">
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
                
                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
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
                    href="/destinations/all"
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    여행지 둘러보기
                  </a>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedDestinations.map((destination) => (
                    <div key={destination.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="h-36 overflow-hidden">
                        <img 
                          src={destination.imageUrl} 
                          alt={destination.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg">{destination.name}</h3>
                            <p className="text-sm text-gray-500">{destination.savedDate} 저장</p>
                          </div>
                          <button 
                            onClick={() => handleUnsave(destination.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <a 
                          href={`/destinations/${destination.id}`}
                          className="mt-3 inline-block w-full text-center py-1.5 px-3 border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50 text-sm font-medium"
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
          
          {activeTab === 'liked' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-6">좋아요한 여행지</h2>
              
              {isLoadingDestinations ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : likedDestinations.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 mb-4">좋아요한 여행지가 없습니다.</p>
                  <a 
                    href="/destinations/all"
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    여행지 둘러보기
                  </a>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {likedDestinations.map((destination) => (
                    <div key={destination.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="h-36 overflow-hidden">
                        <img 
                          src={destination.imageUrl} 
                          alt={destination.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg">{destination.name}</h3>
                            <p className="text-sm text-gray-500">{destination.likedDate} 좋아요</p>
                          </div>
                          <button 
                            onClick={() => handleUnlike(destination.id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Heart size={20} fill="currentColor" />
                          </button>
                        </div>
                        <a 
                          href={`/destinations/${destination.id}`}
                          className="mt-3 inline-block w-full text-center py-1.5 px-3 border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50 text-sm font-medium"
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
          
          {activeTab === 'settings' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-6">설정</h2>
              
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h3 className="text-lg font-medium mb-3">계정 설정</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                      <div>
                        <h4 className="font-medium">비밀번호 변경</h4>
                        <p className="text-sm text-gray-600">계정 보안을 위해 정기적으로 비밀번호를 변경하세요.</p>
                      </div>
                      <button className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm font-medium">
                        변경하기
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                      <div>
                        <h4 className="font-medium">알림 설정</h4>
                        <p className="text-sm text-gray-600">이메일 및 푸시 알림 설정을 관리하세요.</p>
                      </div>
                      <button className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm font-medium">
                        설정하기
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-medium mb-3 text-red-600">위험 구역</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border border-red-200 rounded-md bg-red-50">
                      <div>
                        <h4 className="font-medium text-red-700">계정 삭제</h4>
                        <p className="text-sm text-red-600">모든 데이터가 영구적으로 삭제됩니다. 이  작업은 되돌릴 수 없습니다.</p>
                      </div>
                      <button className="px-4 py-1.5 bg-white text-red-600 border border-red-300 rounded hover:bg-red-50 text-sm font-medium">
                        계정 삭제
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPage;