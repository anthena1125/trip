// src/components/layout/Header.tsx

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // 경로가 맞는지 확인해주세요.
import { Menu, X, User, LogOut } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // ✨ 드롭다운 상태를 위한 별도의 상태 (선택 사항이지만, 복잡한 상호작용 시 유용할 수 있음)
  // const [isMbtiDropdownOpen, setIsMbtiDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false); // 모바일 메뉴가 열려있다면 닫기
  };

  const mbtiTypes = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40"> {/* 헤더 자체에 z-index 추가 (다른 페이지 요소들과의 관계 고려) */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-indigo-600">내 MBTI 맞춤여행</Link>
          
          {/* 데스크톱 메뉴 */}
          <nav className="hidden md:flex items-center space-x-6">
            <div className="relative group">
              <button 
                className="flex items-center text-gray-700 hover:text-indigo-600 focus:outline-none"
                // onMouseEnter={() => setIsMbtiDropdownOpen(true)} // JS로 상태 관리 시
                // onMouseLeave={() => setIsMbtiDropdownOpen(false)} // JS로 상태 관리 시
              >
                MBTI별 여행지
                {/* <ChevronDown size={16} className="ml-1 group-hover:rotate-180 transition-transform" />  // 필요시 드롭다운 아이콘 추가 */}
              </button>
              {/* 
                Tailwind의 group-hover 사용 시:
                - opacity-0 invisible group-hover:opacity-100 group-hover:visible
                JavaScript 상태 관리 시 (isMbtiDropdownOpen):
                - ${isMbtiDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
              */}
              <div 
                className="absolute z-50 left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out transform-gpu group-hover:scale-100 scale-95"
                // onMouseEnter={() => setIsMbtiDropdownOpen(true)} // 드롭다운 위에 마우스 있어도 유지
                // onMouseLeave={() => setIsMbtiDropdownOpen(false)}
              >
                <div className="py-1 grid grid-cols-2 gap-0"> {/* gap-1에서 gap-0으로 변경 또는 세부 조정 */}
                  {mbtiTypes.map((type) => (
                    <Link
                      key={type}
                      to={`/destinations/mbti/${type}`}
                      // ✨ leading-normal 추가, 패딩 및 폰트 크기 확인
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 leading-normal w-full text-left"
                    >
                      {type}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Link to="/about" className="text-gray-700 hover:text-indigo-600">소개</Link>
            
            {user ? (
              <>
                <Link to="/mypage" className="text-gray-700 hover:text-indigo-600">마이페이지</Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center text-gray-700 hover:text-indigo-600"
                >
                  <LogOut size={18} className="mr-1" />
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-indigo-600">로그인</Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                >
                  회원가입
                </Link>
              </>
            )}
          </nav>

          {/* 모바일 메뉴 버튼 */}
          <button 
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white md:hidden"> {/* md:hidden 추가하여 데스크탑에서 안보이게 */}
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center mb-8">
              <Link to="/" className="text-2xl font-bold text-indigo-600" onClick={() => setIsMenuOpen(false)}>
                내 MBTI 맞춤여행
              </Link>
              <button 
                className="text-gray-700 focus:outline-none"
                onClick={toggleMenu}
                aria-label="메뉴 닫기"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="flex flex-col space-y-1"> {/* space-y-4에서 space-y-1로 줄여봄 */}
              <div className="mb-2">
                <div className="font-medium text-gray-800 mb-2 px-2">MBTI별 여행지</div> {/* px-2 추가 */}
                <div className="grid grid-cols-4 gap-x-1 gap-y-1 ml-2"> {/* gap-2에서 gap-1로 줄여봄 */}
                  {mbtiTypes.map((type) => (
                    <Link
                      key={type}
                      to={`/destinations/mbti/${type}`}
                      className="block px-1 py-2 text-xs text-center text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md leading-normal" // ✨ leading-normal, text-xs, text-center, px-1, py-2, rounded-md 추가/조정
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {type}
                    </Link>
                  ))}
                </div>
              </div>
              
              <Link 
                to="/about" 
                className="block px-2 py-3 text-gray-700 hover:text-indigo-600 border-t border-gray-100" // px-2, py-3으로 조정
                onClick={() => setIsMenuOpen(false)}
              >
                소개
              </Link>
              
              {user ? (
                <>
                  <Link 
                    to="/mypage" 
                    className="flex items-center px-2 py-3 text-gray-700 hover:text-indigo-600 border-t border-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={18} className="mr-2" />
                    마이페이지
                  </Link>
                  <button 
                    onClick={handleLogout} // handleLogout 호출
                    className="flex items-center w-full text-left px-2 py-3 text-gray-700 hover:text-indigo-600 border-t border-gray-100"
                  >
                    <LogOut size={18} className="mr-2" />
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="block px-2 py-3 text-gray-700 hover:text-indigo-600 border-t border-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    로그인
                  </Link>
                  <Link 
                    to="/register" 
                    className="block px-2 py-3 text-gray-700 hover:text-indigo-600 border-t border-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    회원가입
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;