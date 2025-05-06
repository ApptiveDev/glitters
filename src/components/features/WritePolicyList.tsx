import { Text, View } from 'react-native';

import colors from '@/types/colors';

interface ListItemProps {
  title: string;
  content: string;
}

const ListItem = ({ title, content }: ListItemProps) => {
  return (
    <View
      style={{
        gap: 4,
      }}
    >
      <Text
        style={{
          fontSize: 12,
          fontWeight: 'bold',
          color: colors.text.white,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: 10,
          color: colors.text.lightgray,
        }}
      >
        {content}
      </Text>
    </View>
  );
};

export const WritePolicyList = () => {
  return (
    <View style={{ width: '100%', height: 'auto', gap: 20 }}>
      <ListItem
        title="비식별 정보만 기재"
        content="실명, 신체적 특징에 대한 구체적 묘사, 연락처 등 식별 가능한 정보 기재 금지"
      />
      <ListItem title="스토킹 금지" content="특정인을 추적하거나 위치 변동을 기록하는 행위 금지" />
      <ListItem title="표현 제한" content="혐오, 차별, 위협, 명예훼손 등 부적절한 표현 사용 금지" />
      <ListItem title="불법 행위 금지" content="사생활 침해, 동의 없는 게시물, 불법 조장 등 법령 위반 금지" />
    </View>
  );
};

export default WritePolicyList;
