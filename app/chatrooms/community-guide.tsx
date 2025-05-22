import { router } from 'expo-router';
import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import CaretLeftIcon from '@/assets/icons/caret_left.svg';
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

export const CommunityGuide = () => {
  const handleEmailPress = () => {
    Linking.openURL('mailto:admin@banjjak.me');
  };
  return (
    <>
      <TouchableOpacity
        style={{ flexDirection: 'row', gap: 4, alignItems: 'center', marginBottom: 20 }}
        onPress={() => router.back()}
      >
        <CaretLeftIcon />
      </TouchableOpacity>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>반짝이맵 커뮤니티 가이드라인 </Text>

        <Text style={styles.title}>1. 총칙</Text>
        <Text style={styles.content}>
          1) 목적: 모든 이용자가 안전하고 즐겁게 반짝이맵을 이용할 수 있도록 행동 규범을 제정합니다.{'\n'}
          2) 적용범위: 지도, 마커, 쪽지, 채팅, 알림 등 앱 내 전 기능에 적용됩니다.{'\n'}
          3) 관련 법령 및 약관: 방송통신심의규정, 개인정보처리방침, 서비스 이용약관을 준수해야 합니다.{'\n'}
          4) 중대한 변경 시 앱 내 공지 및 푸시 알림으로 최소 7일 전 안내합니다.{'\n'}{' '}
        </Text>

        <Text style={styles.title}>2. 운영 시스템</Text>

        <Text style={styles.content}>
          1) 신고 시 관리자 검토 후 삭제{'\n'} - 이용자가 게시글, 채팅, 쪽지에서 신고 버튼을 누르면 해당 콘텐츠는 관리자
          검토 후 삭제됩니다.{'\n'}
          관리자 검토 후 비공개를 해제하거나 유지할 수 있습니다.{'\n'}
          2) 영구 블랙리스트{'\n'} - 동일 이용자가 10회 이상 신고 누적 시 계정은 블랙리스트에 등록되며, 영구 이용 불가
          처리됩니다.{'\n'}
          3) 이용 제한 기록{'\n'} - 제재 내역 및 처리 근거는 고객센터{' '}
          <Text
            onPress={handleEmailPress}
            style={{
              textDecorationLine: 'underline',
              textDecorationColor: colors.text.lightgray,
              textDecorationStyle: 'solid',
            }}
          >
            [admin@banjjak.me]
          </Text>{' '}
          로 문의 가능합니다.{'\n'}
        </Text>

        <Text style={styles.title}>3. 기본 행동 원칙{'\n'}</Text>

        <Text style={styles.content}>
          1) 존중과 배려{'\n'} - 타인의 인격과 정체성을 존중합니다. 비방, 모욕, 차별, 혐오 표현을 금지합니다.{'\n'}
          2) 정확성 및 책임{'\n'}
          허위사실 유포, 낚시성 게시, 과도한 과장 금지{'\n'} - 마커는 실제 경험 위치, 시간, 간단 인상(키·체형 등 비식별
          정보) 정도만 작성{'\n'}
          3) 익명성 보호{'\n'} - 랜덤 프로필(사진·닉네임)으로만 소통하며, 실명, 연락처, 초상, 구체 외모 묘사 등 식별
          정보는 절대 금지{'\n'}
          4) 추적성 정보 제한{'\n'} - 특정 개인의 이동 경로나 위치 변동 내역을 상세히 기록하거나 공유하여 스토킹 목적의
          정보 수집 금지{'\n'}
          5) 건전한 대화 권장{'\n'} - 채팅과 쪽지에서 음란물, 욕설 등 불건전 대화 및 과도한 개인정보(실명, 연락처, 주소,
          구체 외모 묘사) 노출은 문제가 될 수 있습니다.{'\n'}
          6) 면책 조항{'\n'} - 당사는 쪽지(1대1 대화) 및 익명 메시지 서비스 내에서 이용자 간에 발생하는 모든 대화 내용과
          분쟁에 대해 책임을 지지 않습니다.{'\n'}
        </Text>

        <Text style={styles.title}>4. 금지 행위</Text>
        <Text style={styles.content}>
          아래 행위 및 유사 행위는 모두 금지되며, 적발 시 내용 삭제, 제재, 영구 정지 대상입니다.{'\n'} - 불법·범죄 조장:
          사기, 불법 물품 거래, 저작권·초상권·개인정보 침해, 해킹·크롤링{'\n'} - 혐오·차별: 인종, 국적, 성별, 장애, 연령
          등에 대한 모욕, 비하, 조롱{'\n'} - 음란·포르노: 성적 수치심 유발, 아동 성착취, 성매매 알선 등{'\n'} -
          폭력·잔혹: 잔혹 묘사, 동물 학대, 살인·협박 묘사{'\n'} - 스팸·광고: 무단 홍보, 상업성 링크, 반복 게시, 여론
          조작 메시지{'\n'} - 시스템 악용: 오류 유발 특수문자, 대량 신고 악용, 익명성 무력화 시도{'\n'}- 외부 유출:
          스크린샷, 복제 후 외부 공유, 크롤링, 자료 무단 제공{'\n'}
        </Text>

        <Text style={styles.title}>5. 제재 기준 및 이의제기</Text>
        <Text style={styles.content}>
          1) 신고 시 24시간 이내 관리자 검토 → 제재(경고, 정지, 영구정지){'\n'}
          2) 블랙리스트: 누적 10회 신고 시 영구 이용 불가{'\n'}
          3) 이의제기: 고객센터{' '}
          <Text
            onPress={handleEmailPress}
            style={{
              textDecorationLine: 'underline',
              textDecorationColor: colors.text.lightgray,
              textDecorationStyle: 'solid',
            }}
          >
            [admin@banjjak.me]
          </Text>{' '}
          로 제재 사유 및 기간 문의 가능
          {'\n'}
        </Text>

        <Text style={styles.title}>6. 부칙</Text>
        <Text style={styles.content}>
          본 규칙은 수시 개정되며, 주요 변경 시 앱 내 알림 및 푸시로 안내합니다.{'\n'}
          신고 처리 기록 및 관련 개인정보는 개인정보처리방침에 따라 보존 후 파기됩니다.{'\n'}
        </Text>
      </ScrollView>
    </>
  );
};

export default CommunityGuide;
