export const TWINS = [
  {
    id: 'twin-001',
    cat: '물류센터',
    title: '스마트 물류센터 A동',
    desc: '자동 분류 라인 실시간 트윈',
    thumb:
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=640&h=420&fit=crop&auto=format',
    by: '관리자 / hnadmin',
    at: '2026.06.18',
  },
  {
    id: 'twin-002',
    cat: '물류센터',
    title: '출하 도크 컨베이어',
    desc: '도크 8라인 가동 모니터링',
    thumb:
      'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=640&h=420&fit=crop&auto=format',
    by: '관리자 / hnadmin',
    at: '2026.06.17',
  },
  {
    id: 'twin-005',
    cat: '물류센터',
    title: '자동 창고 (AS/RS)',
    desc: '고층 랙 24열 재고 트윈',
    thumb:
      'https://images.unsplash.com/photo-1553413077-190dd305871c?w=640&h=420&fit=crop&auto=format',
    by: '관리자 / hnadmin',
    at: '2026.06.12',
  },
  {
    id: 'twin-007',
    cat: '물류센터',
    title: '피킹 스테이션',
    desc: 'AGV 동선 시뮬레이션',
    thumb:
      'https://images.unsplash.com/photo-1567789884554-0b844b597180?w=640&h=420&fit=crop&auto=format',
    by: '관리자 / hnadmin',
    at: '2026.06.09',
  },
  {
    id: 'twin-009',
    cat: '물류센터',
    title: '입고 검수 라인',
    desc: '입고 바코드 검수 트윈',
    thumb:
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=640&h=420&fit=crop&auto=format',
    by: '관리자 / hnadmin',
    at: '2026.06.05',
  },
  {
    id: 'twin-003',
    cat: '제조센터',
    title: '제조 1공장 가공 라인',
    desc: 'CNC 12기 디지털 트윈',
    thumb:
      'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=640&h=420&fit=crop&auto=format',
    by: '관리자 / kim',
    at: '2026.06.15',
  },
  {
    id: 'twin-004',
    cat: '제조센터',
    title: '제조 2공장 조립 셀',
    desc: '협동로봇 조립 셀 트윈',
    thumb:
      'https://images.unsplash.com/photo-1716191299980-a6e8827ba10b?w=640&h=420&fit=crop&auto=format',
    by: '관리자 / kim',
    at: '2026.06.14',
  },
  {
    id: 'twin-006',
    cat: '제조센터',
    title: '품질 검사 라인',
    desc: '비전 검사 스테이션 트윈',
    thumb:
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=640&h=420&fit=crop&auto=format',
    by: '관리자 / lee',
    at: '2026.06.10',
  },
  {
    id: 'twin-008',
    cat: '제조센터',
    title: '포장 자동화 셀',
    desc: '포장·라벨링 통합 트윈',
    thumb:
      'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=640&h=420&fit=crop&auto=format',
    by: '관리자 / lee',
    at: '2026.06.08',
  },
  {
    id: 'twin-010',
    cat: '제조센터',
    title: '도장 부스',
    desc: '스프레이 도장 공정 트윈',
    thumb:
      'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=640&h=420&fit=crop&auto=format',
    by: '관리자 / lee',
    at: '2026.06.04',
  },
];

export const logisticsTwins = TWINS.filter((t) => t.cat === '물류센터');
export const manufacturingTwins = TWINS.filter((t) => t.cat === '제조센터');
