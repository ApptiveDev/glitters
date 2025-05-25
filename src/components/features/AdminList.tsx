import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { getSchoolList } from '@/api/auth';
import { getBoundMarkers } from '@/api/markers';
import { usePost } from '@/contexts/PostContext';
import { useUser } from '@/contexts/UserContext';
import colors from '@/types/colors';
import { SchoolListResponse, SchoolListType } from '@/types/utils';
import { showErrorAlert } from '@/utils/errorMessage';

export const AdminList = () => {
  const { user, updateUser } = useUser();
  const [selectedSchool, setSelectedSchool] = useState<number | null>(user?.institution?.id || null);
  const [modalVisible, setModalVisible] = useState(false);
  const { setBound } = usePost();

  const { data } = useQuery<SchoolListResponse>({
    queryKey: ['school_list'],
    queryFn: () => getSchoolList(),
    enabled: true,
  });

  const handleSelectSchool = async (school: SchoolListType) => {
    setSelectedSchool(school.id);
    setModalVisible(false);
    try {
      const response: Record<string, any> = await getBoundMarkers();
      setBound(response[school.id]);
      updateUser({
        institution: {
          id: school.id,
          name: school.name,
          emailDomain: school.emailDomain,
          isActive: school.isActive,
          createdAt: school.createdAt,
          updatedAt: school.updatedAt,
        },
      });
    } catch (error) {
      showErrorAlert('오류', error);
    }
  };

  return (
    <View
      style={{
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        flexDirection: 'row',
        gap: 8,
      }}
    >
      <Text style={{ fontSize: 16, color: colors.text.white }}>학교</Text>
      <TouchableOpacity
        style={{ alignItems: 'center', borderWidth: 1, borderColor: colors.text.white, borderRadius: 8, padding: 8 }}
        onPress={() => setModalVisible(true)}
      >
        <Text style={{ fontSize: 16, color: colors.text.white }}>
          {selectedSchool
            ? data?.institutions?.find((school) => school.id === selectedSchool)?.name
            : '학교를 선택하세요'}
        </Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <View style={{ backgroundColor: '#fff', borderRadius: 10, padding: 20, width: 320, height: 300 }}>
            <ScrollView>
              {data?.institutions?.map((school) => (
                <TouchableOpacity key={school.id} style={{ padding: 12 }} onPress={() => handleSelectSchool(school)}>
                  <Text style={{ fontSize: 16, color: colors.text.darkgray }}>{school.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={{
                backgroundColor: colors.background,
                padding: 12,
                borderRadius: 5,
                marginTop: 10,
                alignItems: 'center',
              }}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ fontSize: 16, color: '#fff' }}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AdminList;
