import {
  StyleSheet,
  FlatList,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated, Image,
  RefreshControl
} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { getStorage } from '../service/Storage';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { store } from '../config/db';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

type Medicine = {
  id: string;
  medName: string;
  type: string;
  dose: string;
  startDate: string;
  endDate: string;
  reminder: string;
  user: string;
  userId: string;
};

const Med = () => {
  const [medicine, setMedicine] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const route = useRouter();


  const medlist = async () => {
    const user = await getStorage('userDetail');
    try {
      setLoading(true);
      const q = query(collection(store, 'medicine'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const meds: Medicine[] = [];
      querySnapshot.forEach((doc) => {
        meds.push({
          id: doc.id,
          ...(doc.data() as Omit<Medicine, 'id'>),
        });
      });
      setMedicine(meds);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await medlist();
    setRefreshing(false);
  };

  useEffect(() => {
    medlist();
  }, []);

  const getMedicineTypeIcon = (type: string) => {
    const icons = {
      tablet: '💊',
      pill: '💊',
      capsule: '💊',
      syrup: '🧴',
      liquid: '🧴',
      injection: '💉',
      cream: '🧴',
      ointment: '🧴',
      drops: '💧',
      inhaler: '🫁',
      spray: '💨'
    };
    return icons[type.toLowerCase() as keyof typeof icons] || '💊';
  };

  const getReminderConfig = (reminder: string) => {
    const configs = {
      daily: { color: '#10B981', gradient: ['#10B981', '#059669'], bgColor: '#ECFDF5' },
      weekly: { color: '#3B82F6', gradient: ['#3B82F6', '#2563EB'], bgColor: '#EFF6FF' },
      monthly: { color: '#8B5CF6', gradient: ['#8B5CF6', '#7C3AED'], bgColor: '#F3E8FF' },
      'as needed': { color: '#F59E0B', gradient: ['#F59E0B', '#D97706'], bgColor: '#FFFBEB' }
    };
    return configs[reminder.toLowerCase() as keyof typeof configs] ||
      { color: '#6B7280', gradient: ['#6B7280', '#4B5563'], bgColor: '#F9FAFB' };
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: 'Expired', color: '#EF4444', bgColor: '#FEF2F2' };
    if (diffDays === 0) return { text: 'Last day', color: '#F59E0B', bgColor: '#FFFBEB' };
    if (diffDays <= 3) return { text: `${diffDays} days left`, color: '#F59E0B', bgColor: '#FFFBEB' };
    return { text: `${diffDays} days left`, color: '#10B981', bgColor: '#ECFDF5' };
  };

  const renderMedicineCard = ({ item, index }: { item: Medicine; index: number }) => {
    const reminderConfig = getReminderConfig(item.reminder);
    const daysInfo = getDaysRemaining(item.endDate);

    return (
      <Animated.View
        style={[
          styles.cardWrapper,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        <TouchableOpacity
          style={[styles.card, { marginTop: index === 0 ? 8 : 0 }]}
          activeOpacity={0.8}
        >
          {/* Gradient overlay */}
          <View style={[styles.gradientOverlay, { backgroundColor: reminderConfig.bgColor }]} />

          {/* Header Section */}
          <View style={styles.cardHeader}>
            <View style={styles.medicineMainInfo}>
              <View style={styles.iconWrapper}>
                <Text style={styles.medicineIcon}>
                  {getMedicineTypeIcon(item.type)}
                </Text>
              </View>
              <View style={styles.nameContainer}>
                <Text style={styles.medName} numberOfLines={2}>
                  {item.medName}
                </Text>
                <View style={styles.typeRow}>
                  <Text style={styles.medType}>{item.type}</Text>
                  <View style={styles.typeSeparator} />
                  <Text style={styles.doseText}>{item.dose}</Text>
                </View>
              </View>
            </View>

            <View style={styles.badgesContainer}>
              <View style={[styles.reminderBadge, { backgroundColor: reminderConfig.color }]}>
                <Text style={styles.reminderText}>{item.reminder}</Text>
              </View>
              <View style={[styles.daysBadge, { backgroundColor: daysInfo.bgColor }]}>
                <Text style={[styles.daysText, { color: daysInfo.color }]}>
                  {daysInfo.text}
                </Text>
              </View>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: reminderConfig.color,
                    width: `${Math.max(10, Math.min(90, (new Date().getTime() - new Date(item.startDate).getTime()) / (new Date(item.endDate).getTime() - new Date(item.startDate).getTime()) * 100))}%`
                  }
                ]}
              />
            </View>
          </View>

          {/* Details Section */}
          <View style={styles.detailsSection}>
            <View style={styles.dateGrid}>
              <View style={styles.dateCard}>
                <View style={styles.dateIconContainer}>
                  <Text style={styles.dateIcon}>📅</Text>
                </View>
                <View style={styles.dateInfo}>
                  <Text style={styles.dateLabel}>Started</Text>
                  <Text style={styles.dateValue}>{item.startDate}</Text>
                </View>
              </View>

              <View style={styles.dateDivider} />

              <View style={styles.dateCard}>
                <View style={styles.dateIconContainer}>
                  <Text style={styles.dateIcon}>🏁</Text>
                </View>
                <View style={styles.dateInfo}>
                  <Text style={styles.dateLabel}>Ends</Text>
                  <Text style={styles.dateValue}>{item.endDate}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Action Indicators */}
          <View style={styles.actionIndicators}>
            <View style={styles.indicatorDot} />
            <View style={styles.indicatorDot} />
            <View style={styles.indicatorDot} />
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderEmptyState = () => (
    <Animated.View
      style={[styles.emptyContainer, { opacity: fadeAnim }]}
    >
      <View style={styles.emptyIconContainer}>
        <Text style={styles.emptyIcon}>💊</Text>
        <View style={styles.emptyIconBg} />
      </View>
      <Text style={styles.emptyTitle}>No Medications Yet</Text>
      <Text style={styles.emptySubtitle}>
        Start your health journey by adding{'\n'}
        your first medication schedule
      </Text>
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Add Medication</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="white" />
        <View style={styles.loadingSpinner}>
          <Text style={styles.loadingIcon}>💊</Text>
          <Text style={styles.loadingText}>Loading your medications...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667EEA" />
      <FlatList
        data={medicine}
        keyExtractor={(item) => item.id}
        renderItem={renderMedicineCard}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#667EEA']}
            tintColor="#667EEA"
          />
        }
      />
      <Image source={require('../../assets/images/1393514.png')} style={styles.img} />
      <TouchableOpacity style={styles.btn} onPress={() => route.push('/components/AddMed')}>
        <Text style={styles.btnText}>Add New Medication</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Med;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  img: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginTop: 100,
  },
  btn: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 20,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    marginBottom: 20,
    marginTop: 10,
  },
  headerBackground: {
    position: 'absolute',
    top: -100,
    left: -20,
    right: -20,
    height: 200,
    backgroundColor: '#667EEA',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 4,
  },
  greetingSection: {
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 16,
    color: '#E0E7FF',
    fontWeight: '500',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#E0E7FF',
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 20,
  },

  // Card Styles
  cardWrapper: {
    marginVertical: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
    position: 'relative',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 100,
    height: 100,
    opacity: 0.1,
    borderTopRightRadius: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  medicineMainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  medicineIcon: {
    fontSize: 24,
  },
  nameContainer: {
    flex: 1,
  },
  medName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medType: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  typeSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 8,
  },
  doseText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '700',
  },
  badgesContainer: {
    alignItems: 'flex-end',
    gap: 8,
  },
  reminderBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  reminderText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  daysBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  daysText: {
    fontSize: 11,
    fontWeight: '600',
  },

  // Progress Bar
  progressContainer: {
    marginBottom: 20,
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },

  // Details Section
  detailsSection: {
    marginBottom: 16,
  },
  dateGrid: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  dateCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  dateIcon: {
    fontSize: 16,
  },
  dateInfo: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  dateValue: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '700',
  },
  dateDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 16,
  },

  // Action Indicators
  actionIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
  },
  indicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
  },

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  emptyIcon: {
    fontSize: 64,
    zIndex: 1,
  },
  emptyIconBg: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
    backgroundColor: '#EEF2FF',
    borderRadius: 30,
    zIndex: 0,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  addButton: {
    backgroundColor: '#667EEA',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: '#667EEA',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  loadingSpinner: {
    alignItems: 'center',
  },
  loadingIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});