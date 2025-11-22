import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import WaveHeader from '../../components/clientManagement/WaveHeader';
import { projectsAPI } from '../../utils/api';

const ProjectDetailScreen = ({ navigation, route }) => {
  const { projectId } = route.params;
  const { user, isAuthenticated } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');

  const tabs = ['Overview', 'Timeline', 'Media', 'Invoices', 'Files', 'Notes'];

  useEffect(() => {
    if (isAuthenticated && user) {
      loadProject();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user, projectId]);

  const loadProject = async () => {
    try {
      // Check if user is authenticated before making API call
      if (!isAuthenticated || !user) {
        console.log('User not authenticated, skipping project load');
        setLoading(false);
        return;
      }
      
      setLoading(true);
      const response = await projectsAPI.getProject(projectId);

      if (response.success) {
        setProject(response.data.project);
      }
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!isAuthenticated || !user) {
      console.log('User not authenticated, skipping refresh');
      setRefreshing(false);
      return;
    }
    
    setRefreshing(true);
    await loadProject();
    setRefreshing(false);
  };

  const getStatusColor = (status) => {
    const colors = {
      planning: '#7487C1',
      'in-progress': '#3E60D8',
      'on-hold': '#E8B25D',
      completed: '#7DB87A',
      cancelled: '#D75A5A',
    };
    return colors[status] || colors.planning;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3E60D8" />
        <Text style={styles.loadingText}>Loading project details...</Text>
      </View>
    );
  }

  if (!project) {
    return (
      <View style={styles.errorContainer}>
        <Feather name="alert-circle" size={64} color="#D75A5A" />
        <Text style={styles.errorText}>Project not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Wave Header */}
        <WaveHeader
          title={project.title}
          subtitle={`${getStatusColor(project.status)} • ${project.progress?.percentage || 0}% complete`}
          height={200}
          showBackButton
          backButtonPress={() => navigation.goBack()}
        />

        {/* Interactive Tabs */}
        <View style={styles.tabsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsScroll}
          >
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tab,
                  activeTab === tab && styles.activeTab,
                ]}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'Overview' && (
            <OverviewTab project={project} navigation={navigation} />
          )}
          {activeTab === 'Timeline' && (
            <TimelineTab projectId={projectId} navigation={navigation} />
          )}
          {activeTab === 'Media' && (
            <MediaTab projectId={projectId} navigation={navigation} />
          )}
          {activeTab === 'Invoices' && (
            <InvoicesTab projectId={projectId} navigation={navigation} />
          )}
          {activeTab === 'Files' && (
            <FilesTab projectId={projectId} navigation={navigation} />
          )}
          {activeTab === 'Notes' && (
            <NotesTab projectId={projectId} navigation={navigation} />
          )}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

// Tab Components
const OverviewTab = ({ project, navigation }) => (
  <View style={styles.tabContainer}>
    <Text style={styles.tabDescription}>
      {project.description || 'No description available'}
    </Text>

    <View style={styles.statsGrid}>
      <View style={styles.statCard}>
        <Text style={styles.statValue}>{project.progress?.percentage || 0}%</Text>
        <Text style={styles.statLabel}>Progress</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statValue}>
          ${(project.budget?.estimated || 0).toLocaleString()}
        </Text>
        <Text style={styles.statLabel}>Budget</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statValue}>
          {new Date(project.createdAt).toLocaleDateString()}
        </Text>
        <Text style={styles.statLabel}>Start Date</Text>
      </View>
    </View>
  </View>
);

const TimelineTab = ({ projectId, navigation }) => (
  <View style={styles.tabContainer}>
    <View style={styles.placeholderContainer}>
      <Feather name="clock" size={48} color="#C9B89A" />
      <Text style={styles.placeholderTitle}>Timeline Events</Text>
      <Text style={styles.placeholderText}>
        Project timeline events will appear here
      </Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddTimelineEvent', { projectId })}
      >
        <Feather name="plus" size={20} color="#fff" />
        <Text style={styles.addButtonText}>Add Timeline Event</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const MediaTab = ({ projectId, navigation }) => (
  <View style={styles.tabContainer}>
    <View style={styles.placeholderContainer}>
      <Feather name="image" size={48} color="#C9B89A" />
      <Text style={styles.placeholderTitle}>Project Media</Text>
      <Text style={styles.placeholderText}>
        Project photos and media will appear here
      </Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('UploadMedia', { projectId })}
      >
        <Feather name="camera" size={20} color="#fff" />
        <Text style={styles.addButtonText}>Upload Media</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const InvoicesTab = ({ projectId, navigation }) => (
  <View style={styles.tabContainer}>
    <View style={styles.placeholderContainer}>
      <Feather name="file-text" size={48} color="#C9B89A" />
      <Text style={styles.placeholderTitle}>Invoices</Text>
      <Text style={styles.placeholderText}>
        Project invoices will appear here
      </Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('CreateInvoice', { projectId })}
      >
        <Feather name="plus" size={20} color="#fff" />
        <Text style={styles.addButtonText}>Create Invoice</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const FilesTab = ({ projectId, navigation }) => (
  <View style={styles.tabContainer}>
    <View style={styles.placeholderContainer}>
      <Feather name="folder" size={48} color="#C9B89A" />
      <Text style={styles.placeholderTitle}>Project Files</Text>
      <Text style={styles.placeholderText}>
        Project documents and files will appear here
      </Text>
    </View>
  </View>
);

const NotesTab = ({ projectId, navigation }) => (
  <View style={styles.tabContainer}>
    <View style={styles.placeholderContainer}>
      <Feather name="edit-3" size={48} color="#C9B89A" />
      <Text style={styles.placeholderTitle}>Project Notes</Text>
      <Text style={styles.placeholderText}>
        Project notes and observations will appear here
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF7EE',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#7487C1',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#D75A5A',
    marginTop: 20,
    marginBottom: 30,
  },
  scrollView: {
    flex: 1,
  },
  tabsContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F8',
  },
  tabsScroll: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F0F4F8',
    marginRight: 12,
  },
  activeTab: {
    backgroundColor: '#3E60D8',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7487C1',
  },
  activeTabText: {
    color: '#fff',
  },
  tabContent: {
    flex: 1,
  },
  tabContainer: {
    padding: 24,
  },
  tabDescription: {
    fontSize: 16,
    color: '#1B2540',
    lineHeight: 24,
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#3E60D8',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#7487C1',
    fontWeight: '600',
    textAlign: 'center',
  },
  placeholderContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  placeholderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1B2540',
    marginTop: 20,
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 16,
    color: '#7487C1',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3E60D8',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  bottomPadding: {
    height: 40,
  },
});

export default ProjectDetailScreen;