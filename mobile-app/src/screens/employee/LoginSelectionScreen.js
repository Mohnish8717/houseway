import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const LoginSelectionScreen = ({ navigation }) => {
  const cardScale1 = new Animated.Value(1);
  const cardScale2 = new Animated.Value(1);

  const handleCardPressIn = (cardScale) => {
    Animated.spring(cardScale, {
      toValue: 0.95,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();
  };

  const handleCardPressOut = (cardScale) => {
    Animated.spring(cardScale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 3,
      tension: 40,
    }).start();
  };

  const handleProjectDashboardPress = () => {
    navigation.navigate('EmployeeDashboard');
  };

  const handleClientManagementPress = () => {
    navigation.navigate('HomeDashboard');
  };

  return (
    <View style={styles.container}>
      {/* Background with gradient and floating blobs */}
      <LinearGradient
        colors={['#3E60D8', '#566FE0', '#7487C1', '#FBF7EE']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backgroundGradient}
      />

      {/* Floating circular blobs */}
      <View style={[styles.blob, styles.blob1]} />
      <View style={[styles.blob, styles.blob2]} />
      <View style={[styles.blob, styles.blob3]} />
      <View style={[styles.blob, styles.blob4]} />

      {/* Content */}
      <View style={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome Back</Text>
          <Text style={styles.subtitleText}>Choose your workspace</Text>
        </View>

        {/* Dashboard Selection Cards */}
        <View style={styles.cardsContainer}>
          {/* Project Dashboard Card */}
          <Animated.View style={[{ transform: [{ scale: cardScale1 }] }]}>
            <TouchableOpacity
              style={styles.dashboardCard}
              activeOpacity={0.9}
              onPressIn={() => handleCardPressIn(cardScale1)}
              onPressOut={() => handleCardPressOut(cardScale1)}
              onPress={handleProjectDashboardPress}
            >
              <View style={styles.cardIconContainer}>
                <Feather name="briefcase" size={40} color="#3E60D8" />
              </View>
              <Text style={styles.cardTitle}>Project Dashboard</Text>
              <Text style={styles.cardDescription}>
                Manage materials, requests, and project tasks
              </Text>
              <View style={styles.cardFeatures}>
                <View style={styles.featureItem}>
                  <Feather name="check-circle" size={16} color="#7DB87A" />
                  <Text style={styles.featureText}>Material Requests</Text>
                </View>
                <View style={styles.featureItem}>
                  <Feather name="check-circle" size={16} color="#7DB87A" />
                  <Text style={styles.featureText}>Task Management</Text>
                </View>
                <View style={styles.featureItem}>
                  <Feather name="check-circle" size={16} color="#7DB87A" />
                  <Text style={styles.featureText}>File Uploads</Text>
                </View>
              </View>
              <View style={styles.cardFooter}>
                <Text style={styles.cardActionText}>Continue →</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Client Management Card */}
          <Animated.View style={[{ transform: [{ scale: cardScale2 }] }]}>
            <TouchableOpacity
              style={styles.clientManagementCard}
              activeOpacity={0.9}
              onPressIn={() => handleCardPressIn(cardScale2)}
              onPressOut={() => handleCardPressOut(cardScale2)}
              onPress={handleClientManagementPress}
            >
              <LinearGradient
                colors={['#3E60D8', '#566FE0']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.clientManagementGradient}
              >
                <View style={[styles.cardIconContainer, styles.clientIconContainer]}>
                  <Feather name="users" size={40} color="#fff" />
                </View>
                <Text style={[styles.cardTitle, styles.clientCardTitle]}>Client Management</Text>
                <Text style={[styles.cardDescription, styles.clientCardDescription]}>
                  Premium client relationship and project management
                </Text>
              </LinearGradient>
              <View style={styles.cardFeatures}>
                <View style={styles.featureItem}>
                  <Feather name="star" size={16} color="#FFD700" />
                  <Text style={[styles.featureText, styles.clientFeatureText]}>Client Profiles</Text>
                </View>
                <View style={styles.featureItem}>
                  <Feather name="star" size={16} color="#FFD700" />
                  <Text style={[styles.featureText, styles.clientFeatureText]}>Timeline Events</Text>
                </View>
                <View style={styles.featureItem}>
                  <Feather name="star" size={16} color="#FFD700" />
                  <Text style={[styles.featureText, styles.clientFeatureText]}>Media Gallery</Text>
                </View>
              </View>
              <View style={styles.cardFooter}>
                <Text style={[styles.cardActionText, styles.clientActionText]}>Enter Portal →</Text>
              </View>

              {/* Premium badge */}
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumBadgeText}>PREMIUM</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Bottom hint */}
        <View style={styles.bottomHint}>
          <Feather name="info" size={16} color="#7487C1" />
          <Text style={styles.hintText}>
            You can switch between dashboards anytime
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF7EE',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.9,
  },
  blob: {
    position: 'absolute',
    borderRadius: width,
    opacity: 0.4,
  },
  blob1: {
    width: width * 0.6,
    height: width * 0.6,
    backgroundColor: 'rgba(62, 96, 216, 0.3)',
    top: -width * 0.2,
    left: -width * 0.2,
  },
  blob2: {
    width: width * 0.4,
    height: width * 0.4,
    backgroundColor: 'rgba(86, 111, 224, 0.25)',
    top: height * 0.3,
    right: -width * 0.1,
  },
  blob3: {
    width: width * 0.5,
    height: width * 0.5,
    backgroundColor: 'rgba(116, 135, 193, 0.2)',
    bottom: height * 0.4,
    left: -width * 0.15,
  },
  blob4: {
    width: width * 0.3,
    height: width * 0.3,
    backgroundColor: 'rgba(251, 247, 238, 0.5)',
    top: height * 0.6,
    right: width * 0.2,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: height * 0.15,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  welcomeText: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1B2540',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  subtitleText: {
    fontSize: 18,
    color: '#7487C1',
    textAlign: 'center',
    fontWeight: '500',
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 30,
  },
  dashboardCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(62, 96, 216, 0.1)',
    position: 'relative',
    overflow: 'hidden',
  },
  clientManagementCard: {
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  clientManagementGradient: {
    flex: 1,
    borderRadius: 24,
    padding: 30,
    position: 'relative',
    overflow: 'hidden',
  },
  cardIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: 'rgba(62, 96, 216, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  clientIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1B2540',
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  clientCardTitle: {
    color: '#fff',
  },
  cardDescription: {
    fontSize: 16,
    color: '#7487C1',
    lineHeight: 24,
    marginBottom: 20,
    fontWeight: '500',
  },
  clientCardDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  cardFeatures: {
    gap: 12,
    marginBottom: 25,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 15,
    color: '#1B2540',
    fontWeight: '600',
  },
  clientFeatureText: {
    color: 'rgba(255, 255, 255, 0.95)',
  },
  cardFooter: {
    alignItems: 'flex-end',
  },
  cardActionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3E60D8',
  },
  clientActionText: {
    color: '#fff',
  },
  premiumBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  premiumBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1B2540',
    letterSpacing: 1,
  },
  bottomHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 30,
    paddingHorizontal: 20,
  },
  hintText: {
    fontSize: 14,
    color: '#7487C1',
    fontWeight: '500',
  },
});

export default LoginSelectionScreen;