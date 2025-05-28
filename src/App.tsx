// src/App.tsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext'; // AuthContext 경로 확인
import Header from './components/layout/Header';     // Header 경로 확인
import Footer from './components/layout/Footer';     // Footer 경로 확인
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MbtiDestinationsPage from './pages/MbtiDestinationsPage';
import DestinationDetailPage from './pages/DestinationDetailPage';
import MyPage from './pages/MyPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/auth/ProtectedRoute'; // ProtectedRoute 경로 확인
import AllDestinationsPage from './pages/AllDestinationsPage';   // AllDestinationsPage 경로 확인

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-slate-50">
          <Header />
          <main className="flex-grow">
            <Routes>
              {/* 일반 페이지 라우트 */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/about" element={<AboutPage />} />

              {/* 여행지 관련 라우트 - 순서 중요! */}
              {/* "/destinations/all"을 가장 구체적인 경로 중 하나로 먼저 배치 */}
              <Route path="/destinations/all" element={<AllDestinationsPage />} />
              
              {/* MBTI별 여행지 목록 */}
              <Route path="/destinations/mbti/:mbtiType" element={<MbtiDestinationsPage />} />
              
              {/* 특정 여행지 상세 정보 (동적 파라미터 :id) */}
              {/* 이 라우트는 "/destinations/all" 보다 반드시 뒤에 와야 합니다. */}
              <Route path="/destinations/:id" element={<DestinationDetailPage />} />

              {/* 보호된 라우트 (로그인 필요) */}
              <Route 
                path="/mypage" 
                element={
                  <ProtectedRoute>
                    <MyPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* 일치하는 경로가 없을 때 보여줄 404 페이지 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;