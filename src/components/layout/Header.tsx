import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Menu, X, User, LogOut } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const mbtiTypes = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'];

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-indigo-600">내 MBTI 맞춤여행</Link>
          
          {/* 데스크톱 메뉴 */}
          <nav className="hidden md:flex items-center space-x-6">
            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-indigo-600">
                MBTI별 여행지
              </button>
              <div className="absolute z-10 left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="py-2 grid grid-cols-2 gap-1">
                  {mbtiTypes.map((type) => (
                    <Link
                      key={type}
                      to={`/destinations/mbti/${type}`}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
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
            className="md:hidden text-gray-700"
            onClick={toggleMenu}
            aria-label="메뉴 열기"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center mb-8">
              <Link to="/" className="text-2xl font-bold text-indigo-600" onClick={() => setIsMenuOpen(false)}>
                내 MBTI 맞춤여행
              </Link>
              <button 
                className="text-gray-700"
                onClick={toggleMenu}
                aria-label="메뉴 닫기"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="flex flex-col space-y-4">
              <div className="mb-2">
                <div className="font-medium mb-2">MBTI별 여행지</div>
                <div className="grid grid-cols-4 gap-2 ml-2">
                  {mbtiTypes.map((type) => (
                    <Link
                      key={type}
                      to={`/destinations/mbti/${type}`}
                      className="py-1 text-sm text-gray-700 hover:text-indigo-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {type}
                    </Link>
                  ))}
                </div>
              </div>
              
              <Link 
                to="/about" 
                className="py-2 text-gray-700 hover:text-indigo-600 border-t border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                소개
              </Link>
              
              {user ? (
                <>
                  <Link 
                    to="/mypage" 
                    className="py-2 text-gray-700 hover:text-indigo-600 border-t border-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={18} className="inline mr-2" />
                    마이페이지
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="py-2 text-left text-gray-700 hover:text-indigo-600 border-t border-gray-100"
                  >
                    <LogOut size={18} className="inline mr-2" />
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="py-2 text-gray-700 hover:text-indigo-600 border-t border-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    로그인
                  </Link>
                  <Link 
                    to="/register" 
                    className="py-2 text-gray-700 hover:text-indigo-600 border-t border-gray-100"
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