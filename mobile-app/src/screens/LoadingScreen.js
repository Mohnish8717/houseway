import React, { useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LoadingScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    console.log('[LoadingScreen] Component mounted');
    
    // Timeout to navigate to auth if stuck in loading state
    const timeout = setTimeout(() => {
      console.log('[LoadingScreen] Timeout reached, navigating to Auth');
      navigation.navigate('Auth');
    }, 5000); // 5 second timeout

    return () => clearTimeout(timeout);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo placeholder */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>🏠</Text>
          <Text style={styles.companyName}>Houseway</Text>
          <Text style={styles.tagline}>House Design Company</Text>
        </View>
        
        {/* Loading indicator */}
        <ActivityIndicator 
          size="large" 
          color="#2196F3" 
          style={styles.loader}
        />
        
        <Text style={styles.loadingText}>Loading...</Text>
        <Text style={styles.debugText}>If this screen persists, check console logs</Text>
        <Text style={styles.debugText}>Will automatically navigate to login in 5 seconds</Text>
        
        <TouchableOpacity 
          style={styles.debugButton}
          onPress={() => {
            console.log('[LoadingScreen] Manual navigation to Auth');
            navigation.navigate('Auth');
          }}
        >
          <Text style={styles.debugButtonText}>Go to Login (Debug)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logoText: {
    fontSize: 80,
    marginBottom: 10,
  },
  companyName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 5,
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  loader: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  debugText: {
    fontSize: 12,
    color: '#999',
    marginTop: 10,
    textAlign: 'center',
  },
  debugButton: {
    marginTop: 30,
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 5,
  },
  debugButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default LoadingScreen;