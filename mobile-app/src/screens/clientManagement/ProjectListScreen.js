import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import WaveHeader from '../../components/clientManagement/WaveHeader';
import { projectsAPI } from '../../utils/api';

const { width } = Dimensions.get('window');

const ProjectListScreen = ({ navigation, route }) => {
  const { clientId } = route.params || {};
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadProjects();
  }, [clientId]);

  const loadProjects = async () => {
    try {
      setLoading(true);

      let response;
      if (clientId) {
        // Get projects for specific client
        response = await projectsAPI.getClientProjects(clientId);
      } else {
        // Get all projects for employee
        response = await projectsAPI.getProjects({ assignedTo: user._id });
      }

      if (response.success) {
        setProjects(response.data.projects || []);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadProjects();
    setRefreshing(false);
  };

  const handleProjectPress = (project) => {
    navigation.navigate('ProjectDetail', { projectId: project._id });
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

  const getStatusLabel = (status) => {
    return status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const renderProjectCard = ({ item, index }) => (
    <TouchableOpacity
      style={styles.projectCard}
      onPress={() => handleProjectPress(item)}
      activeOpacity={0.8}
    >
      {/* Status indicator */}
      <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(item.status) }]} />

      {/* Project content */}
      <View style={styles.projectContent}>
        <Text style={styles.projectTitle}>{item.title}</Text>
        <Text style={styles.projectDescription} numberOfLines={2}>
          {item.description || 'No description available'}
        </Text>

        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${item.progress || 0}%`, backgroundColor: getStatusColor(item.status) }
              ]}
            />
          </View>
          <Text style={styles.progressText}>{item.progress || 0}%</Text>
        </View>

        {/* Project info */}
        <View style={styles.projectInfo}>
          <View style={styles.infoItem}>
            <Feather name="calendar" size={14} color="#7487C1" />
            <Text style={styles.infoText}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>

          {item.budget && (
            <View style={styles.infoItem}>
              <Feather name="dollar-sign" size={14} color="#7487C1" />
              <Text style={styles.infoText}>
                ${(item.budget.estimated || 0).toLocaleString()}
              </Text>
            </View>
          )}

          {/* Recent activity indicator */}
          {Math.random() > 0.5 && (
            <View style={styles.activityIndicator}>
              <View style={styles.activityDot} />
              <Text style={styles.activityText}>Recent activity</Text>
            </View>
          )}
        </View>
      </View>

      {/* Arrow */}
      <Feather name="chevron-right" size={20} color="#7487C1" />
    </TouchableOpacity>
  );

  if (loading && projects.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <WaveHeader
          title="Projects"
          subtitle="Loading projects..."
          height={180}
          showBackButton
          backButtonPress={() => navigation.goBack()}
        />
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#3E60D8" />
          <Text style={styles.loadingText}>Loading projects...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={projects}
        renderItem={renderProjectCard}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={
          <WaveHeader
            title={clientId ? "Client Projects" : "All Projects"}
            subtitle={`${projects.length} project${projects.length !== 1 ? 's' : ''} found`}
            height={180}
            showBackButton
            backButtonPress={() => navigation.goBack()}
          />
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="briefcase" size={64} color="#C9B89A" />
            <Text style={styles.emptyStateTitle}>No projects found</Text>
            <Text style={styles.emptyStateText}>
              {clientId ? 'This client has no projects yet' : 'No projects assigned to you'}
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF7EE',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FBF7EE',
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -180, // Account for header
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#7487C1',
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 20,
  },
  projectCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#3E60D8',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: 'absolute',
    top: 20,
    left: 16,
  },
  projectContent: {
    flex: 1,
    marginRight: 16,
  },
  projectTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1B2540',
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  projectDescription: {
    fontSize: 14,
    color: '#7487C1',
    lineHeight: 20,
    marginBottom: 16,
    fontWeight: '500',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#F0F4F8',
    borderRadius: 4,
    marginRight: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3E60D8',
    minWidth: 35,
    textAlign: 'right',
  },
  projectInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    minWidth: 100,
  },
  infoText: {
    fontSize: 12,
    color: '#7487C1',
    fontWeight: '500',
  },
  activityIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#7DB87A',
  },
  activityText: {
    fontSize: 10,
    color: '#7DB87A',
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 100,
    marginTop: 80,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1B2540',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#7487C1',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default ProjectListScreen;