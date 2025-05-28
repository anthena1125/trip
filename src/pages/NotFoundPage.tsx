import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[calc(100vh-300px)] flex items-center justify-center px-4 py-16">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-indigo-100 text-indigo-600 mb-6">
          <Compass size={48} />
        </div>
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-6">페이지를 찾을 수 없습니다</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          요청하신 페이지가 삭제되었거나, 이름이 변경되었거나, 일시적으로 사용이 불가능합니다.
        </p>
        <Link 
          to="/"
          className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition duration-300"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;