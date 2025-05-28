import { Link } from 'react-router-dom';
import { MapPin, Users, Mail } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* 헤더 섹션 */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">내 MBTI 맞춤여행 소개</h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          당신의 성격 유형에 딱 맞는 여행 경험을 찾아드립니다.
          MBTI 기반 여행지 추천 서비스로 더 즐겁고 의미 있는 여행을 계획하세요.
        </p>
      </div>
      
      {/* 미션 & 비전 섹션 */}
      <div className="bg-indigo-50 rounded-2xl p-8 md:p-12 mb-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4 text-indigo-800">우리의 미션</h2>
              <p className="text-gray-700 leading-relaxed">
                여행자들이 자신의 성격과 선호도에 맞는 최적의 여행지를 발견할 수 있도록 지원하여,
                단순한 관광을 넘어 진정한 여행의 기쁨을 경험할 수 있도록 돕는 것입니다.
                모든 사람은 고유한 성격을 가지고 있으며, 그에 맞는 특별한 여행 경험이 있다고 믿습니다.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4 text-indigo-800">우리의 비전</h2>
              <p className="text-gray-700 leading-relaxed">
                내 MBTI 맞춤여행은 개인화된 여행 경험의 선두주자가 되어, 모든 여행자가 자신의 내면과 
                조화를 이루는 의미 있는 여행을 계획할 수 있도록 혁신적인 도구와 인사이트를 제공하는 
                플랫폼이 되고자 합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* 서비스 특징 섹션 */}
      <div className="max-w-5xl mx-auto mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">서비스 특징</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-4 text-indigo-600">
              <MapPin size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">MBTI 맞춤 추천</h3>
            <p className="text-gray-600">
              16가지 MBTI 성격 유형별로 최적화된 여행지와 활동을 추천합니다. 
              당신의 성향에 맞는 여행지를 발견하세요.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">성격 기반 여행 팁</h3>
            <p className="text-gray-600">
              당신의 MBTI에 맞는 여행 스타일, 주의사항, 여행 팁을 제공하여 
              더 만족스러운 여행을 계획할 수 있도록 도와드립니다.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mb-4 text-amber-600">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">맞춤형 경험</h3>
            <p className="text-gray-600">
              로그인하여 나만의 여행 프로필을 만들고, 저장한 여행지를 관리하며
              맞춤형 여행 경험을 쌓아가세요.
            </p>
          </div>
        </div>
      </div>
      
      {/* 팀 소개 섹션 */}
      <div className="max-w-5xl mx-auto mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">팀 소개</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/3778603/pexels-photo-3778603.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="팀원 1" 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold mb-1">김여행</h3>
            <p className="text-indigo-600 mb-3">CEO & 창립자</p>
            <p className="text-gray-600 mb-3">ENFP | 세계 여행가</p>
            <p className="text-gray-600 text-sm">
              "모든 여행에는 그 사람만의 의미가 있습니다. 우리는 그 의미를 찾아드립니다."
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/5378700/pexels-photo-5378700.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="팀원 2" 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold mb-1">이성격</h3>
            <p className="text-indigo-600 mb-3">MBTI 전문가</p>
            <p className="text-gray-600 mb-3">INTJ | 심리학 박사</p>
            <p className="text-gray-600 text-sm">
              "MBTI와 여행의 연결점에서 개인에게 가장 적합한 경험을 발견합니다."
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/8107039/pexels-photo-8107039.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="팀원 3" 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold mb-1">박웹디</h3>
            <p className="text-indigo-600 mb-3">개발 책임자</p>
            <p className="text-gray-600 mb-3">ISFJ | 풀스택 개발자</p>
            <p className="text-gray-600 text-sm">
              "기술을 통해 여행자와 목적지를 완벽하게 연결하는 것이 목표입니다."
            </p>
          </div>
        </div>
      </div>
      
      {/* 연락처 섹션 */}
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">연락하기</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">문의하기</h3>
            <p className="text-gray-600 mb-6">
              서비스에 대한 질문이나 제안사항이 있으신가요? 언제든지 연락주세요!
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-indigo-600 mt-1 mr-3" />
                <div>
                  <h4 className="font-medium">이메일</h4>
                  <p className="text-gray-600">info@mbtitravel.kr</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-indigo-600 mt-1 mr-3" />
                <div>
                  <h4 className="font-medium">주소</h4>
                  <p className="text-gray-600">서울특별시 강남구 테헤란로 123 여행빌딩 4층</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  이름
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="홍길동"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  이메일
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="name@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  메시지
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="문의 내용을 입력해주세요."
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                메시지 보내기
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* CTA 섹션 */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">지금 바로 시작하세요!</h2>
        <p className="text-xl mb-8 max-w-3xl mx-auto">
          여러분의 MBTI에 딱 맞는 특별한 여행지를 발견하고, 잊지 못할 여행 경험을 만들어보세요.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            to="/register"
            className="px-6 py-3 bg-white text-indigo-700 rounded-lg font-medium shadow-lg hover:bg-gray-100 transition duration-300"
          >
            회원가입하기
          </Link>
          <Link 
            to="/"
            className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg font-medium hover:bg-white/10 transition duration-300"
          >
            여행지 둘러보기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;