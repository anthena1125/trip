import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight, Map, Compass } from 'lucide-react';
import MbtiTypeSelector from '../components/mbti/MbtiTypeSelector';
import PopularDestinations from '../components/destinations/PopularDestinations';

const HomePage = () => {
  const { user, profile } = useAuth();

  const personalizedGreeting = profile 
    ? `${profile.nickname}님, ${profile.mbtiType ? `${profile.mbtiType} 유형에` : ''} 맞는 여행지를 찾아보세요!`
    : '당신의 MBTI에 맞는 특별한 여행지를 발견하세요!';

  return (
    <div>
      {/* 히어로 섹션 */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-30"></div>
          <img 
            src="https://images.pexels.com/photos/2385210/pexels-photo-2385210.jpeg" 
            alt="여행 배경 이미지" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {personalizedGreeting}
            </h1>
            <p className="text-xl md:text-2xl mb-8 leading-relaxed">
              성격 유형에 맞는 여행지 추천으로 더 특별한 경험을 만드세요.
              나에게 딱 맞는 여행 스타일을 발견하고 새로운 추억을 만들어보세요.
            </p>
            
            {profile && profile.mbtiType ? (
              <Link 
                to={`/destinations/mbti/${profile.mbtiType}`}
                className="inline-flex items-center px-6 py-3 bg-white text-indigo-700 rounded-lg font-medium shadow-lg hover:bg-gray-100 transition duration-300"
              >
                나의 여행지 추천 보기
                <ArrowRight size={20} className="ml-2" />
              </Link>
            ) : (
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 max-w-md">
                <h3 className="text-xl font-medium mb-4">당신의 MBTI 유형은?</h3>
                <MbtiTypeSelector />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* MBTI 유형 소개 섹션 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">MBTI 유형별 여행 스타일</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              16가지 성격 유형에 따라 선호하는 여행 스타일과 목적지가 다릅니다.
              당신의 MBTI 유형을 선택하고 맞춤형 여행지를 추천받아보세요!
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MbtiCategoryCard 
              title="분석가형" 
              types={['INTJ', 'INTP', 'ENTJ', 'ENTP']}
              description="깊이 있는 탐험과 새로운 지식을 추구하는 여행"
              color="bg-blue-50"
              textColor="text-blue-700"
            />
            <MbtiCategoryCard 
              title="외교관형"
              types={['INFJ', 'INFP', 'ENFJ', 'ENFP']}
              description="의미 있는 경험과 문화적 교류를 중시하는 여행"
              color="bg-green-50"
              textColor="text-green-700"
            />
            <MbtiCategoryCard 
              title="관리자형"
              types={['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ']}
              description="체계적이고 안정적인 계획에 따른 여행"
              color="bg-purple-50"
              textColor="text-purple-700"
            />
            <MbtiCategoryCard 
              title="탐험가형"
              types={['ISTP', 'ISFP', 'ESTP', 'ESFP']}
              description="자유롭고 즉흥적인 모험을 즐기는 여행"
              color="bg-amber-50"
              textColor="text-amber-700"
            />
          </div>
        </div>
      </section>

      {/* 인기 여행지 섹션 */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center">인기 여행지</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto text-center mb-10">
            다양한 MBTI 유형에서 사랑받는 인기 여행지를 만나보세요!
          </p>
          
          <PopularDestinations />
          
          <div className="text-center mt-10">
            <Link 
              to="/destinations/all"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition duration-300"
            >
              모든 여행지 보기
              <Map size={20} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* 사용 방법 섹션 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center">내 MBTI 맞춤여행 이용 방법</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto text-center mb-12">
            간단한 3단계로 나에게 딱 맞는 여행지를 찾아보세요!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-gray-50 hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-6">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3">MBTI 유형 선택</h3>
              <p className="text-gray-600">
                자신의 MBTI 유형을 선택하거나, 간단한 테스트를 통해 확인해보세요.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-gray-50 hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-6">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3">맞춤형 추천 확인</h3>
              <p className="text-gray-600">
                당신의 성격 유형에 어울리는 최적의 여행지 추천을 받아보세요.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-gray-50 hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-6">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3">여행 계획 세우기</h3>
              <p className="text-gray-600">
                마음에 드는 여행지를 저장하고 나만의 여행 계획을 만들어보세요.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Link 
              to="/register"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition duration-300"
            >
              지금 시작하기
              <Compass size={20} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

// MBTI 카테고리 카드 컴포넌트
interface MbtiCategoryCardProps {
  title: string;
  types: string[];
  description: string;
  color: string;
  textColor: string;
}

const MbtiCategoryCard = ({ title, types, description, color, textColor }: MbtiCategoryCardProps) => {
  return (
    <div className={`p-6 rounded-lg ${color} hover:shadow-md transition-shadow`}>
      <h3 className={`${textColor} text-xl font-bold mb-3`}>{title}</h3>
      <div className="flex flex-wrap gap-2 mb-3">
        {types.map((type) => (
          <Link 
            key={type}
            to={`/destinations/mbti/${type}`}
            className={`px-2 py-1 rounded bg-white ${textColor} text-sm font-medium hover:bg-gray-100 transition-colors`}
          >
            {type}
          </Link>
        ))}
      </div>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

export default HomePage;