import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

const { width, height } = Dimensions.get('window');

// Import components
import WaveHeader from '../../components/clientManagement/WaveHeader';
import GradientButton from '../../components/clientManagement/GradientButton';
import { clientsAPI } from '../../utils/api';

const HomeDashboardScreen = ({ navigation }) => {
  const { user, isAuthenticated } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dashboardStats, setDashboardStats] = useState({
    totalClients: 0,
    activeProjects: 0,
    recentInvoices: 0,
    recentMedia: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadDashboardData();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  const loadDashboardData = async () => {
    try {
      // Check if user is authenticated before making API call
      if (!isAuthenticated || !user) {
        console.log('User not authenticated, skipping dashboard data load');
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);

      // Get dashboard stats
      const statsResponse = await clientsAPI.getDashboardStats();
      if (statsResponse.success) {
        setDashboardStats(statsResponse.data);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    if (!isAuthenticated || !user) {
      console.log('User not authenticated, skipping refresh');
      setRefreshing(false);
      return;
    }
    
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleTilePress = (route) => {
    navigation.navigate(route);
  };

  const tiles = [
    {
      id: 'clients',
      title: 'View Clients',
      subtitle: `${dashboardStats.totalClients} total clients`,
      icon: 'users',
      color: ['#7DB87A', '#6BA869'],
      route: 'ClientsList',
    },
    {
      id: 'projects',
      title: 'View Projects',
      subtitle: `${dashboardStats.activeProjects} active projects`,
      icon: 'briefcase',
      color: ['#3E60D8', '#566FE0'],
      route: 'ProjectList',
    },
    {
      id: 'invoices',
      title: 'Create Invoice',
      subtitle: 'New billing document',
      icon: 'file-text',
      color: ['#E8B25D', '#D4A34D'],
      route: 'CreateInvoice',
    },
    {
      id: 'media',
      title: 'Upload Media',
      subtitle: 'Add project photos',
      icon: 'image',
      color: ['#7487C1', '#6475B1'],
      route: 'UploadMedia',
    },
  ];

  const DashboardTile = ({ tile }) => (
    <TouchableOpacity
      style={styles.tile}
      activeOpacity={0.8}
      onPress={() => handleTilePress(tile.route)}
    >
      <LinearGradient
        colors={tile.color}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.tileGradient}
      >
        <View style={styles.tileContent}>
          <View style={styles.tileIconContainer}>
            <Feather name={tile.icon} size={32} color="#fff" />
          </View>
          <Text style={styles.tileTitle}>{tile.title}</Text>
          <Text style={styles.tileSubtitle}>{tile.subtitle}</Text>
        </View>

        {/* Wave decoration */}
        <View style={styles.tileWave}>
          <View style={[styles.waveCircle, styles.wave1]} />
          <View style={[styles.waveCircle, styles.wave2]} />
          <View style={[styles.waveCircle, styles.wave3]} />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3E60D8" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Wave Header */}
        <WaveHeader
          title="Client Management"
          subtitle="Manage your clients and projects"
          height={220}
        />

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Feather name="search" size={20} color="#7487C1" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search clients, projects..."
              placeholderTextColor="#7487C1"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{dashboardStats.totalClients}</Text>
              <Text style={styles.statLabel}>Total Clients</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{dashboardStats.activeProjects}</Text>
              <Text style={styles.statLabel}>Active Projects</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{dashboardStats.recentInvoices}</Text>
              <Text style={styles.statLabel}>Recent Invoices</Text>
            </View>
          </View>
        </View>

        {/* Creative Tiles */}
        <View style={styles.tilesSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.tilesGrid}>
            {tiles.map((tile) => (
              <DashboardTile key={tile.id} tile={tile} />
            ))}
          </View>
        </View>

        {/* Recent Activity Preview */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ClientsList')}>
              <Text style={styles.seeAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.activityPreview}>
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: '#E8F5E8' }]}>
                <Feather name="user-plus" size={20} color="#7DB87A" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>New client added</Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
            </View>

            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: '#E8EEF4' }]}>
                <Feather name="file-plus" size={20} color="#3E60D8" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Invoice created</Text>
                <Text style={styles.activityTime}>5 hours ago</Text>
              </View>
            </View>

            <View style={[styles.activityItem, styles.activityItemLastChild]}>
              <View style={[styles.activityIcon, { backgroundColor: '#FEF5E7' }]}>
                <Feather name="camera" size={20} color="#E8B25D" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Media uploaded</Text>
                <Text style={styles.activityTime}>1 day ago</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bottom padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF7EE',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FBF7EE',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#7487C1',
    fontWeight: '500',
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginTop: -30, // Overlap with header
    zIndex: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(62, 96, 216, 0.1)',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1B2540',
    fontWeight: '500',
  },
  statsSection: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1B2540',
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  seeAllText: {
    fontSize: 16,
    color: '#3E60D8',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#3E60D8',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#7487C1',
    fontWeight: '600',
    textAlign: 'center',
  },
  tilesSection: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  tilesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tile: {
    width: (width - 56) / 2, // 24px padding on each side, 8px gap
    height: 160,
    marginBottom: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
    overflow: 'hidden',
  },
  tileGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  tileContent: {
    alignItems: 'center',
    zIndex: 2,
  },
  tileIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  tileTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  tileSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    textAlign: 'center',
  },
  tileWave: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    overflow: 'hidden',
  },
  waveCircle: {
    position: 'absolute',
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  wave1: {
    width: 120,
    height: 120,
    bottom: -60,
    left: -30,
  },
  wave2: {
    width: 80,
    height: 80,
    bottom: -40,
    right: 20,
  },
  wave3: {
    width: 60,
    height: 60,
    bottom: -30,
    left: '40%',
  },
  recentSection: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  activityPreview: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F8',
  },
  activityItemLastChild: {
    borderBottomWidth: 0,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B2540',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 13,
    color: '#7487C1',
    fontWeight: '500',
  },
  bottomPadding: {
    height: 40,
  },
});

export default HomeDashboardScreen;