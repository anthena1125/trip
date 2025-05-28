import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const MbtiTypeSelector = () => {
  const [mbtiType, setMbtiType] = useState('');
  const navigate = useNavigate();
  const { user, updateUserMbti } = useAuth();

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMbtiType(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mbtiType) {
      if (user) {
        try {
          await updateUserMbti(mbtiType);
        } catch (error) {
          console.error('MBTI 유형 업데이트 실패:', error);
        }
      }
      
      navigate(`/destinations/mbti/${mbtiType}`);
    }
  };

  const mbtiTypes = [
    'INTJ', 'INTP', 'ENTJ', 'ENTP', 
    'INFJ', 'INFP', 'ENFJ', 'ENFP', 
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 
    'ISTP', 'ISFP', 'ESTP', 'ESFP'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <select
          value={mbtiType}
          onChange={handleSelectionChange}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
          required
        >
          <option value="" disabled>MBTI 유형 선택</option>
          {mbtiTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      
      <div>
        <button
          type="submit"
          disabled={!mbtiType}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          여행지 추천 보기
        </button>
      </div>
    </form>
  );
};

export default MbtiTypeSelector;