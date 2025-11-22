import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg, Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

const WaveHeader = ({
  title,
  subtitle,
  height = 200,
  gradientColors = ['#3E60D8', '#566FE0', '#7487C1'],
  showBackButton = false,
  backButtonPress,
  rightComponent,
}) => {
  return (
    <View style={[styles.container, { height }]}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Wave shape at bottom */}
      <Svg
        width={width}
        height={80}
        style={styles.wave}
        viewBox={`0 0 ${width} 80`}
        preserveAspectRatio="none"
      >
        <Path
          d={`M0,40 Q${width * 0.25},20 ${width * 0.5},40 T${width},40 L${width},80 L0,80 Z`}
          fill="#FBF7EE"
        />
      </Svg>

      {/* Content */}
      <View style={styles.content}>
        {showBackButton && (
          <View style={styles.backButtonContainer}>
            <Text onPress={backButtonPress} style={styles.backButton}>
              ← Back
            </Text>
          </View>
        )}

        <View style={showBackButton ? styles.textContainerCentered : styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>

        {rightComponent && (
          <View style={styles.rightComponent}>
            {rightComponent}
          </View>
        )}
      </View>

      {/* Decorative floating circles */}
      <View style={[styles.floatingCircle, styles.circle1]} />
      <View style={[styles.floatingCircle, styles.circle2]} />
      <View style={[styles.floatingCircle, styles.circle3]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  wave: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 50, // For status bar
    paddingBottom: 20,
  },
  backButtonContainer: {
    position: 'absolute',
    top: 50,
    left: 24,
    zIndex: 10,
  },
  backButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  textContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  textContainerCentered: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  rightComponent: {
    position: 'absolute',
    top: 50,
    right: 24,
    zIndex: 10,
  },
  floatingCircle: {
    position: 'absolute',
    borderRadius: 1000,
    opacity: 0.1,
  },
  circle1: {
    width: 120,
    height: 120,
    backgroundColor: '#fff',
    top: -40,
    left: -40,
  },
  circle2: {
    width: 80,
    height: 80,
    backgroundColor: '#fff',
    top: 60,
    right: -20,
  },
  circle3: {
    width: 60,
    height: 60,
    backgroundColor: '#fff',
    bottom: 20,
    left: '30%',
  },
});

export default WaveHeader;