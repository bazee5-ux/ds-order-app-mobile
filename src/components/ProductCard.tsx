import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, BORDER_RADIUS, SHADOWS } from '../theme/colors';
import { useApp, Product } from '../context/AppContext';
import { productImages } from '../assets/productImages';

interface ProductCardProps {
  product: Product;
  horizontal?: boolean;
}

const { width } = Dimensions.get('window');
const GRID_CARD_WIDTH = (width - 48) / 2; // Page margin 16 * 2 + spacing 16

export const ProductCard: React.FC<ProductCardProps> = ({ product, horizontal = false }) => {
  const navigation = useNavigation<any>();
  const { addToCart, toggleFavorite, isFavorite } = useApp();
  const favorite = isFavorite(product.id);

  const handlePress = () => {
    navigation.navigate('ProductDetails', { product });
  };

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  // Safe image lookup
  const imageSource = (productImages as any)[product.imageKey] || require('../assets/logo.png');

  if (horizontal) {
    return (
      <TouchableOpacity style={styles.cardHorizontal} onPress={handlePress} activeOpacity={0.85}>
        <Image source={imageSource} style={styles.imageHorizontal} resizeMode="contain" />
        <View style={styles.infoHorizontal}>
          <Text style={styles.category} numberOfLines={1}>{product.category}</Text>
          <Text style={styles.model} numberOfLines={1}>{product.model}</Text>
          <Text style={styles.brand}>{product.brand}</Text>
          
          <View style={styles.rowHorizontal}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{product.availability}</Text>
            </View>
            <TouchableOpacity 
              style={styles.actionBtnHorizontal}
              onPress={handleAddToCart}
              activeOpacity={0.7}
            >
              <Ionicons name="cart-outline" size={16} color="#FFFFFF" />
              <Text style={styles.actionBtnTextHorizontal}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.favoriteBtn} 
          onPress={() => toggleFavorite(product.id)}
          activeOpacity={0.7}
        >
          <Ionicons 
            name={favorite ? "heart" : "heart-outline"} 
            size={18} 
            color={favorite ? COLORS.error : COLORS.textMuted} 
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.cardGrid} onPress={handlePress} activeOpacity={0.85}>
      <View style={styles.imageContainer}>
        <Image source={imageSource} style={styles.imageGrid} resizeMode="contain" />
        <TouchableOpacity 
          style={styles.favoriteBtnGrid} 
          onPress={() => toggleFavorite(product.id)}
          activeOpacity={0.7}
        >
          <Ionicons 
            name={favorite ? "heart" : "heart-outline"} 
            size={18} 
            color={favorite ? COLORS.error : COLORS.textMuted} 
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.infoGrid}>
        <Text style={styles.categoryGrid} numberOfLines={1}>{product.category}</Text>
        <Text style={styles.modelGrid} numberOfLines={1}>{product.model}</Text>
        <Text style={styles.brandGrid}>{product.brand}</Text>
        
        <View style={styles.badgeGrid}>
          <View style={styles.badgeIndicator} />
          <Text style={styles.badgeTextGrid}>{product.availability}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.actionBtnGrid}
          onPress={handleAddToCart}
          activeOpacity={0.7}
        >
          <Ionicons name="cart-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.actionBtnTextGrid}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Horizontal layout
  cardHorizontal: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    marginBottom: 12,
    position: 'relative',
    ...SHADOWS.soft,
  },
  imageHorizontal: {
    width: 90,
    height: 90,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: '#F8FAFC',
  },
  infoHorizontal: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  category: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  model: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 2,
  },
  brand: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  rowHorizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  badge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.round,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.success,
  },
  actionBtnHorizontal: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.sm,
  },
  actionBtnTextHorizontal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  favoriteBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
  },

  // Grid layout
  cardGrid: {
    width: GRID_CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
    overflow: 'hidden',
    ...SHADOWS.soft,
  },
  imageContainer: {
    width: '100%',
    height: 120,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    padding: 8,
  },
  imageGrid: {
    width: '90%',
    height: '90%',
  },
  favoriteBtnGrid: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: 6,
    borderRadius: BORDER_RADIUS.round,
    ...SHADOWS.soft,
  },
  infoGrid: {
    padding: 12,
  },
  categoryGrid: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modelGrid: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 2,
  },
  brandGrid: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  badgeGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 10,
  },
  badgeIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success,
    marginRight: 6,
  },
  badgeTextGrid: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.success,
  },
  actionBtnGrid: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.sm,
    ...SHADOWS.soft,
  },
  actionBtnTextGrid: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
