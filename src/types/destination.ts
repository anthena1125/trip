// src/types/destination.ts (예시, 실제 필드에 맞게 조정)
export interface Attraction {
  name: string;
  description: string;
  location: string;
}

export interface Destination {
  id: string;
  name: string;
  location: string;
  description: string;
  imageUrl: string;
  tags: string[];
  mbtiTypes: string[];
  mbtiReasons?: { [key: string]: string }; // mbtiType을 키로 가짐
  attractions?: Attraction[];
  bestTimeToVisit?: string;
  recommendedStay?: string; // DestinationDetailPage.tsx 에서 사용 확인
  avgCost?: string;
  travelTips?: string[];
  // MyPage.tsx 에서 사용될 수 있는 추가 필드 (선택 사항)
  savedDate?: string;
  likedDate?: string;
}