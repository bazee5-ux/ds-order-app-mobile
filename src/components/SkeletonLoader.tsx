import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { COLORS, BORDER_RADIUS } from '../theme/colors';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: any;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = BORDER_RADIUS.sm,
  style,
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.base,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
};

export const ProductCardSkeleton: React.FC = () => {
  return (
    <View style={styles.card}>
      <Skeleton height={140} borderRadius={BORDER_RADIUS.md} />
      <View style={styles.content}>
        <Skeleton width="40%" height={12} style={styles.space} />
        <Skeleton width="80%" height={16} style={styles.space} />
        <Skeleton width="50%" height={12} style={styles.space} />
        <View style={styles.footer}>
          <Skeleton width="35%" height={14} borderRadius={BORDER_RADIUS.round} />
          <Skeleton width="45%" height={32} borderRadius={BORDER_RADIUS.sm} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: '#E2E8F0',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 10,
    marginBottom: 16,
    width: '48%', // double column layout default
  },
  content: {
    marginTop: 12,
  },
  space: {
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});
