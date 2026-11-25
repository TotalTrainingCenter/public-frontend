/**
 * 사업자 정보 — 전자상거래법 제10조(사이버몰 운영자 표시).
 * 화면 하단 표시(BusinessInfoFooter)와 오른쪽 아래 사업자 정보 창(BusinessInfoWidget)이 이 한 곳의 값을 쓴다.
 * ⚠️ 법적 등록 정보다. 번역하지 말 것. 라벨만 i18n 키(business.*)를 쓴다.
 */
export const businessInfo = {
  companyName: '종합 훈련 센터 (Total Training Center)',
  ceo: '김태민',
  regNo: '684-17-02954',

  // 통신판매업 신고번호 — 2026-11-25 해운대구청 수리(신고증은 document 맨 위). 비면 business.mailOrderExempt 를 보인다.
  mailOrderNo: '제2026-부산해운대-1546호' as string | null,
  address: '부산광역시 해운대구 재반로30번길 135, 1동 605호(재송동, 센텀안성타워)',
  tel: '010-3980-2818',
  email: 'help@training-center.org',

  // 불법촬영물·허위영상물·아동·청소년성착취물 신고 전용 메일(2026-11 법률 자문 C, 비회원·피해자도 보낼 수 있는 공개 창구)
  reportEmail: 'report@training-center.org',
  privacyOfficer: '김태민',

  // 처리방침의 위탁·국외 이전 항목과 같은 표기
  hostingProvider: 'Amazon Web Services, Inc.',
}

/** 공정거래위원회 사업자 정보 공개 페이지(사업자등록번호는 하이픈을 빼고 조회) */
export const businessFtcUrl = `https://www.ftc.go.kr/bizCommPop.do?wrkr_no=${businessInfo.regNo.replaceAll('-', '')}`
