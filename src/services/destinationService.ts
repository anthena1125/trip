import { Destination } from '../types/destination';
import { mockDestinations } from '../data/mockDestinations';
import { supabase } from '../lib/supabase';

// 인기 여행지 가져오기
export const getPopularDestinations = async (): Promise<Destination[]> => {
  return new Promise((resolve) => {
    // 실제 API 호출을 시뮬레이션 (지연 추가)
    setTimeout(() => {
      // 인기 여행지만 필터링 (실제로는 서버에서 처리)
      const popularDestinations = mockDestinations.slice(0, 6);
      resolve(popularDestinations);
    }, 500);
  });
};

// MBTI 유형별 추천 여행지 가져오기
export const getMbtiDestinations = async (mbtiType: string): Promise<Destination[]> => {
  return new Promise((resolve) => {
    // 실제 API 호출을 시뮬레이션 (지연 추가)
    setTimeout(() => {
      // 해당 MBTI 유형에 맞는 여행지 필터링 (실제로는 서버에서 처리)
      const filteredDestinations = mockDestinations.filter(
        (dest) => dest.mbtiTypes.includes(mbtiType)
      );
      resolve(filteredDestinations);
    }, 700);
  });
};

// 여행지 ID로 상세 정보 가져오기
export const getDestinationById = async (id: string): Promise<Destination | null> => {
  return new Promise((resolve) => {
    // 실제 API 호출을 시뮬레이션 (지연 추가)
    setTimeout(() => {
      const destination = mockDestinations.find((dest) => dest.id === id);
      resolve(destination || null);
    }, 500);
  });
};

// 모든 여행지 가져오기 (검색 및 필터용)
export const getAllDestinations = async (): Promise<Destination[]> => {
  return new Promise((resolve) => {
    // 실제 API 호출을 시뮬레이션 (지연 추가)
    setTimeout(() => {
      resolve(mockDestinations);
    }, 700);
  });
};

// 키워드로 여행지 검색하기
export const searchDestinations = async (keyword: string): Promise<Destination[]> => {
  return new Promise((resolve) => {
    // 실제 API 호출을 시뮬레이션 (지연 추가)
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
    }, 500);
  });
};

// 저장된 여행지 가져오기
export const getSavedDestinations = async (userId: string): Promise<Destination[]> => {
  try {
    const { data: savedData, error: savedError } = await supabase
      .from('saved_destinations')
      .select('destination_id, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (savedError) throw savedError;

    // 저장된 여행지 ID들에 해당하는 여행지 정보 찾기
    const savedDestinations = savedData
      .map(saved => ({
        ...mockDestinations.find(dest => dest.id === saved.destination_id),
        savedDate: new Date(saved.created_at).toLocaleDateString()
      }))
      .filter(Boolean) as (Destination & { savedDate: string })[];

    return savedDestinations;
  } catch (error) {
    console.error('Error fetching saved destinations:', error);
    return [];
  }
};

// 좋아요한 여행지 가져오기
export const getLikedDestinations = async (userId: string): Promise<Destination[]> => {
  try {
    const { data: likedData, error: likedError } = await supabase
      .from('liked_destinations')
      .select('destination_id, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (likedError) throw likedError;

    // 좋아요한 여행지 ID들에 해당하는 여행지 정보 찾기
    const likedDestinations = likedData
      .map(liked => ({
        ...mockDestinations.find(dest => dest.id === liked.destination_id),
        likedDate: new Date(liked.created_at).toLocaleDateString()
      }))
      .filter(Boolean) as (Destination & { likedDate: string })[];

    return likedDestinations;
  } catch (error) {
    console.error('Error fetching liked destinations:', error);
    return [];
  }
};

// 여행지 저장하기
export const saveDestination = async (userId: string, destinationId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('saved_destinations')
      .insert([{ user_id: userId, destination_id: destinationId }]);

    if (error) throw error;
  } catch (error) {
    console.error('Error saving destination:', error);
    throw error;
  }
};

// 여행지 저장 취소하기
export const unsaveDestination = async (userId: string, destinationId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('saved_destinations')
      .delete()
      .eq('user_id', userId)
      .eq('destination_id', destinationId);

    if (error) throw error;
  } catch (error) {
    console.error('Error unsaving destination:', error);
    throw error;
  }
};

// 여행지 좋아요하기
export const likeDestination = async (userId: string, destinationId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('liked_destinations')
      .insert([{ user_id: userId, destination_id: destinationId }]);

    if (error) throw error;
  } catch (error) {
    console.error('Error liking destination:', error);
    throw error;
  }
};

// 여행지 좋아요 취소하기
export const unlikeDestination = async (userId: string, destinationId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('liked_destinations')
      .delete()
      .eq('user_id', userId)
      .eq('destination_id', destinationId);

    if (error) throw error;
  } catch (error) {
    console.error('Error unliking destination:', error);
    throw error;
  }
};