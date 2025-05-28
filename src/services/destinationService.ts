// src/services/destinationService.ts

import { Destination } from '../types/destination'; // 타입 정의 경로를 프로젝트에 맞게 확인하세요.
import { mockDestinations } from '../data/mockDestinations'; // ✨ mock 데이터 import
import { supabase } from '../lib/supabase'; // Supabase 클라이언트 import 경로 확인

// ---------------------------------------------------------------------------------
// Mock 데이터를 사용하는 함수들 (주로 프론트엔드 테스트 및 초기 개발용)
// ---------------------------------------------------------------------------------

// 인기 여행지 가져오기 (mockDestinations의 처음 6개 사용)
export const getPopularDestinations = async (): Promise<Destination[]> => {
  console.log('getPopularDestinations called (using mock data)');
  return new Promise((resolve) => {
    setTimeout(() => {
      const popularDestinations = mockDestinations.slice(0, 6);
      resolve(popularDestinations);
    }, 300); // 지연 시간 단축
  });
};

// MBTI 유형별 추천 여행지 가져오기
export const getMbtiDestinations = async (mbtiType: string): Promise<Destination[]> => {
  console.log(`getMbtiDestinations called for ${mbtiType} (using mock data)`);
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredDestinations = mockDestinations.filter(
        (dest) => dest.mbtiTypes.includes(mbtiType.toUpperCase()) // 대소문자 구분 없이 비교
      );
      resolve(filteredDestinations);
    }, 300); // 지연 시간 단축
  });
};

// 여행지 ID로 상세 정보 가져오기
export const getDestinationById = async (id: string): Promise<Destination | null> => {
  console.log(`getDestinationById called for ID: ${id} (using mock data)`);
  return new Promise((resolve) => {
    setTimeout(() => {
      const destination = mockDestinations.find((dest) => dest.id === id);
      resolve(destination || null);
    }, 300); // 지연 시간 단축
  });
};

// 모든 여행지 가져오기 (검색 및 필터용)
export const getAllDestinations = async (): Promise<Destination[]> => {
  console.log('getAllDestinations CALLED from service');
  if (!mockDestinations || mockDestinations.length === 0) {
    console.error('mockDestinations is empty or undefined in service! Check import from ../data/mockDestinations.ts');
    return Promise.resolve([]);
  }
  console.log('Total mockDestinations count in service:', mockDestinations.length);
  console.log('First mock destination name in service:', mockDestinations[0]?.name);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockDestinations); // Import된 mockDestinations를 반환
    }, 300); // 지연 시간 단축
  });
};

// 키워드로 여행지 검색하기
export const searchDestinations = async (keyword: string): Promise<Destination[]> => {
  console.log(`searchDestinations called with keyword: "${keyword}" (using mock data)`);
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!keyword.trim()) {
        resolve([]);
        return;
      }
      
      const lowercaseKeyword = keyword.toLowerCase();
      const results = mockDestinations.filter(
        (dest) =>
          dest.name.toLowerCase().includes(lowercaseKeyword) ||
          dest.description.toLowerCase().includes(lowercaseKeyword) ||
          dest.location.toLowerCase().includes(lowercaseKeyword) ||
          dest.tags.some((tag) => tag.toLowerCase().includes(lowercaseKeyword))
      );
      
      resolve(results);
    }, 300); // 지연 시간 단축
  });
};


// ---------------------------------------------------------------------------------
// Supabase와 연동되는 함수들 (실제 DB 사용 시)
// 이 함수들은 현재 mockDestinations와 Supabase 데이터를 조합하는 형태로 되어 있습니다.
// 실제 서비스에서는 Supabase에서 여행지 정보까지 모두 가져오거나,
// 또는 Supabase에는 ID와 사용자 정보만 저장하고, 여행지 상세 정보는 mockDestinations (또는 다른 DB)에서 가져올 수 있습니다.
// ---------------------------------------------------------------------------------

// 저장된 여행지 가져오기
export const getSavedDestinations = async (userId: string): Promise<(Destination & { savedDate: string })[]> => {
  console.log(`getSavedDestinations called for user: ${userId} (Supabase + mock data)`);
  try {
    const { data: savedData, error: savedError } = await supabase
      .from('saved_destinations')
      .select('destination_id, created_at') // 컬럼명은 실제 Supabase 테이블 스키마에 맞게
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (savedError) {
      console.error('Supabase error fetching saved destination IDs:', savedError);
      throw savedError;
    }
    if (!savedData) {
      console.warn('No saved destination IDs found for user from Supabase.');
      return [];
    }

    // 저장된 여행지 ID들에 해당하는 여행지 정보 mockDestinations에서 찾기
    const savedDestinationsList = savedData
      .map(saved => {
        const destinationInfo = mockDestinations.find(dest => dest.id === saved.destination_id);
        if (destinationInfo) {
          return {
            ...destinationInfo,
            savedDate: new Date(saved.created_at).toLocaleDateString()
          };
        }
        return null; // ID에 해당하는 여행지가 mockDestinations에 없을 경우
      })
      .filter(Boolean) as (Destination & { savedDate: string })[]; // null 제거 및 타입 단언

    console.log('Combined saved destinations:', savedDestinationsList);
    return savedDestinationsList;
  } catch (error) {
    console.error('Error in getSavedDestinations:', error);
    return []; // 에러 발생 시 빈 배열 반환
  }
};

// 좋아요한 여행지 가져오기
export const getLikedDestinations = async (userId: string): Promise<(Destination & { likedDate: string })[]> => {
  console.log(`getLikedDestinations called for user: ${userId} (Supabase + mock data)`);
  try {
    const { data: likedData, error: likedError } = await supabase
      .from('liked_destinations')
      .select('destination_id, created_at') // 컬럼명은 실제 Supabase 테이블 스키마에 맞게
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (likedError) {
      console.error('Supabase error fetching liked destination IDs:', likedError);
      throw likedError;
    }
    if (!likedData) {
      console.warn('No liked destination IDs found for user from Supabase.');
      return [];
    }
    
    const likedDestinationsList = likedData
      .map(liked => {
        const destinationInfo = mockDestinations.find(dest => dest.id === liked.destination_id);
        if (destinationInfo) {
          return {
            ...destinationInfo,
            likedDate: new Date(liked.created_at).toLocaleDateString()
          };
        }
        return null;
      })
      .filter(Boolean) as (Destination & { likedDate: string })[];

    console.log('Combined liked destinations:', likedDestinationsList);
    return likedDestinationsList;
  } catch (error) {
    console.error('Error in getLikedDestinations:', error);
    return [];
  }
};

// 여행지 저장하기
export const saveDestination = async (userId: string, destinationId: string): Promise<void> => {
  console.log(`saveDestination called for user: ${userId}, destination: ${destinationId} (Supabase)`);
  try {
    const { error } = await supabase
      .from('saved_destinations')
      .insert([{ user_id: userId, destination_id: destinationId }]);

    if (error) {
      console.error('Supabase error saving destination:', error);
      throw error;
    }
    console.log('Destination saved successfully to Supabase.');
  } catch (error) {
    console.error('Error in saveDestination:', error);
    throw error; // 에러를 다시 throw하여 호출한 쪽에서 처리할 수 있도록 함
  }
};

// 여행지 저장 취소하기
export const unsaveDestination = async (userId: string, destinationId: string): Promise<void> => {
  console.log(`unsaveDestination called for user: ${userId}, destination: ${destinationId} (Supabase)`);
  try {
    const { error } = await supabase
      .from('saved_destinations')
      .delete()
      .eq('user_id', userId)
      .eq('destination_id', destinationId);

    if (error) {
      console.error('Supabase error unsaving destination:', error);
      throw error;
    }
    console.log('Destination unsaved successfully from Supabase.');
  } catch (error) {
    console.error('Error in unsaveDestination:', error);
    throw error;
  }
};

// 여행지 좋아요하기
export const likeDestination = async (userId: string, destinationId: string): Promise<void> => {
  console.log(`likeDestination called for user: ${userId}, destination: ${destinationId} (Supabase)`);
  try {
    const { error } = await supabase
      .from('liked_destinations')
      .insert([{ user_id: userId, destination_id: destinationId }]);

    if (error) {
      console.error('Supabase error liking destination:', error);
      throw error;
    }
    console.log('Destination liked successfully in Supabase.');
  } catch (error) {
    console.error('Error in likeDestination:', error);
    throw error;
  }
};

// 여행지 좋아요 취소하기
export const unlikeDestination = async (userId: string, destinationId: string): Promise<void> => {
  console.log(`unlikeDestination called for user: ${userId}, destination: ${destinationId} (Supabase)`);
  try {
    const { error } = await supabase
      .from('liked_destinations')
      .delete()
      .eq('user_id', userId)
      .eq('destination_id', destinationId);

    if (error) {
      console.error('Supabase error unliking destination:', error);
      throw error;
    }
    console.log('Destination unliked successfully from Supabase.');
  } catch (error) {
    console.error('Error in unlikeDestination:', error);
    throw error;
  }
};