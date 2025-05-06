import { ScrollView, StyleSheet, Text } from 'react-native';

import colors from '@/types/colors';

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.white,
    marginBottom: 12,
  },
  content: {
    fontSize: 12,
    color: colors.text.white,
    marginBottom: 24,
    lineHeight: 28,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.white,
    marginBottom: 20,
  },
});

export const PrivacyPolicy = () => {
  return (
    <ScrollView style={{ flex: 1 }}>
      <Text style={styles.heading}>개인정보 처리방침</Text>

      <Text style={styles.title}>제1조 (목적)</Text>
      <Text style={styles.content}>
        본 방침은 반짝이맵(이하 “회사”)이 제공하는 위치 기반 게시글 서비스 ‘반짝이맵’(이하 “서비스”) 이용자의 개인정보를
        안전하게 처리하고, 관련 법령(「개인정보 보호법」 등) 및 앱스토어·플레이스토어 정책에 따라 처리 절차 및 기준을
        안내함을 목적으로 합니다.
      </Text>

      <Text style={styles.title}>제2조 (정의)</Text>
      <Text style={styles.content}>
        1. 개인정보: 생존 개인에 관한 정보로서 이메일, 웹메일, 위치정보 등 식별 가능한 정보를 말합니다.{'\n'}2.
        민감정보: 별도 동의가 필요한 건강·사상·신념 등 정보를 의미합니다. {'\n'}3. 처리: 수집·저장·조회·수정·파기 등
        개인정보에 대한 일체의 행위를 말합니다. {'\n'}4. 정보주체: 개인정보를 제공하는 ‘회원’ 및 ‘비회원’을 말합니다.{' '}
        {'\n'}5. 수탁자: 개인정보 처리 업무를 위탁받아 수행하는 자를 말합니다. {'\n'}6. 제3자 제공: 회사가 이용자의 동의
        또는 법령에 따라 개인정보를 외부에 제공하는 행위를 말합니다.
      </Text>

      <Text style={styles.title}>제3조 (수집 항목 및 방법)</Text>
      <Text style={styles.content}>
        1. 수집 항목:{'\n'} • 필수: 소속 대학 웹메일, 이름, 생년월일, 성별, 비밀번호{'\n'} • 자동수집: 위치정보(GPS), IP
        주소, 기기 정보(OS 버전, User‑Agent), 서비스 이용 기록(접속 시간, 클릭 로그), 쿠키·트래킹 정보{'\n'}2. 수집
        방법:{'\n'} • 회원가입, 서비스 이용, 고객문의 시 수집{'\n'} • SDK·API 자동 수집{'\n'} • 위치정보는 “앱 사용 중”
        동의 후 수집{'\n'}3. 광고·추적 비사용:{'\n'} • 회사는 광고 목적이나 제3자 추적을 위해 어떠한 개인정보도
        사용·제공하지 않습니다.
      </Text>

      <Text style={styles.title}>제4조 (개인정보 이용 목적)</Text>
      <Text style={styles.content}>
        회사는 수집한 개인정보를 다음 목적에만 이용합니다:{'\n'}1. 회원 관리(본인 인증·부정 이용 방지){'\n'}2. 서비스
        제공(위치 기반 게시글){'\n'}3. 서비스 개선(통계 분석){'\n'}4. 고객문의 응대{'\n'}5. 법령상 의무 이행(계약·과금
        처리)
      </Text>

      <Text style={styles.title}>제5조 (보유 기간 및 파기 절차)</Text>
      <Text style={styles.content}>
        1. 보유 기간:{'\n'} • 회원정보: 탈퇴 후 14일 이내{'\n'} • 위치정보: 게시글 유효기간(48시간) 경과 후 즉시{'\n'} •
        로그·접속 기록: 6개월{'\n'} • 블랙리스트: 영구{'\n'}2. 파기 절차:{'\n'} • 전자적 파일: 복구 불가 방식 영구 삭제
        {'\n'} • 종이 문서: 분쇄·소각
      </Text>

      <Text style={styles.title}>제6조 (제3자 제공)</Text>
      <Text style={styles.content}>
        회사는 원칙적으로 개인정보를 외부에 제공하지 않으나, 아래 경우에 한해 제공합니다:{'\n'}1. 이용자 동의 시{'\n'}2.
        법령에 따른 요청 시{'\n'}3. 업무 위탁 수탁사 제공 시(‘위탁처리업체 목록’ 공지)
      </Text>

      <Text style={styles.title}>제7조 (위탁 처리)</Text>
      <Text style={styles.content}>
        1. 서비스 운영을 위해 아래 업무를 외부 위탁하며, 수탁자는 방침 준수 관리·감독합니다:{'\n'} • 클라우드 서버 운영
        {'\n'} • 위치정보 처리{'\n'} • SMS·이메일 발송{'\n'} • 고객지원(CS){'\n'}2. 위탁계약서에 안전조치·재위탁
        제한·파기 절차 명시
      </Text>

      <Text style={styles.title}>제8조 (국외 이전)</Text>
      <Text style={styles.content}>
        회사는 글로벌 서비스 제공을 위해 개인정보를 국외로 이전할 수 있으며, 이 경우 아래 사항을 고지합니다:{'\n'} •
        이전 국가·수탁자{'\n'} • 이전 목적·보유 기간{'\n'} • 정보주체 권리·구제 절차
      </Text>

      <Text style={styles.title}>제9조 (정보주체 권리 및 행사 방법)</Text>
      <Text style={styles.content}>
        이용자는 언제든 아래 권리를 행사할 수 있습니다:{'\n'}1. 열람·정정·삭제 요청{'\n'}2. 처리정지·동의철회 요청{'\n'}
        3. 자동화 의사결정 거부·설명 요구{'\n'}4. 개인정보 이동권 요청{'\n'} • 행사는 이메일(admin@banjjak.me) 또는 ‘내
        정보’ 메뉴를 통해 가능
      </Text>

      <Text style={styles.title}>제10조 (개인정보 보호를 위한 안전 조치)</Text>
      <Text style={styles.content}>
        1. 통신 구간 암호화: HTTPS 프로토콜로 전송 중 암호화{'\n'}2. 서버 접근 통제: 서울 AWS Lightsail, 보안 키 파일로
        인증{'\n'}3. 데이터 백업·복구: AWS 자동 스냅샷{'\n'}4. 보안 솔루션·교육 계획: 현재 미도입, 향후 도입 예정
      </Text>

      <Text style={styles.title}>제11조 (쿠키 및 트래킹 기술)</Text>
      <Text style={styles.content}>
        1. 회사는 서비스 개선 목적의 내부 쿠키·트래킹을 사용하며, 제3자 SDK(광고·분석 등)는 일체 사용하지 않습니다.
        {'\n'}2. 이용자는 브라우저 설정으로 쿠키 거부 가능하나, 일부 기능 제한될 수 있습니다.
      </Text>

      <Text style={styles.title}>제12조 (앱 프라이버시(App Store) 및 Data Safety(Google Play))</Text>
      <Text style={styles.content}>
        1. App Store App Privacy:{'\n'} • 수집 데이터: 위치(정확), 연락처(이메일), 식별자(IDFV), 사용 기록{'\n'} • 공유
        데이터: 없음{'\n'}2. Google Play Data safety:{'\n'} • 수집: 위치, 이메일, 기기 정보, 사용 데이터{'\n'} • 공유:
        없음{'\n'} • 보호: 전송 암호화, 접근 통제, 백업
      </Text>

      <Text style={styles.title}>제13조 (개인정보처리방침 변경)</Text>
      <Text style={styles.content}>
        1. 본 방침은 법령·정책 변경 시 개정되며, 시행 7일 전 서비스 내 공지·이메일 안내합니다.{'\n'}2. 회사는 향후 유료
        서비스를 제공할 수 있으며, 유료 서비스 이용 시 결제 정보(예: 카드사, 결제 일시 등)를 수집하며, 이는 결제 처리 및
        고객 문의 대응을 위해 사용됩니다.
      </Text>

      <Text style={styles.title}>제14조 (회원 탈퇴 및 개인정보 처리)</Text>
      <Text style={styles.content}>
        1. 회원 탈퇴 요청: 이용자는 언제든지 본 서비스에서 회원 탈퇴를 요청할 수 있습니다. 탈퇴를 요청한 경우, 회사는
        이용자의 개인정보를 즉시 삭제합니다. 탈퇴 후 30일 이내에는 복구 요청이 가능하지만, 그 이후에는 데이터 복구가
        불가능합니다.{'\n'}2. 탈퇴 후 개인정보 처리: 회원 탈퇴 후에는 이용자의 개인정보가 안전하게 삭제됩니다. 그러나
        법령에 따라 일정 기간 보관해야 하는 정보는 예외적으로 보관될 수 있습니다.{'\n'}3. 탈퇴 후 보유 기간: 탈퇴 후
        14일 이내에 회원의 개인정보는 완전히 삭제되며, 그 이후에는 복구가 불가능합니다.
      </Text>

      <Text style={styles.title}>제15조 (문의 및 고충처리)</Text>
      <Text style={styles.content}>
        개인정보 관련 문의·불만은 아래로 연락 바랍니다.{'\n'} • 이메일: admin@banjjak.me{'\n'}
        시행일: 2025년 5월 5일
      </Text>
    </ScrollView>
  );
};

export default PrivacyPolicy;
