import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, LayoutAnimation, UIManager, Platform, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ShoppingCart, Plus, Minus } from 'lucide-react-native';
import { COLORS, FONTS, BORDER_RADIUS, SHADOWS } from '../theme/colors';
import { useApp, Product } from '../context/AppContext';
import { productImages } from '../assets/productImages';
import Ionicons from '@expo/vector-icons/Ionicons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface ProductCardProps {
  product: Product;
  horizontal?: boolean;
}

const { width } = Dimensions.get('window');
const GRID_CARD_WIDTH = (width - 48) / 2; // Page margin 16 * 2 + spacing 16

export const ProductCard: React.FC<ProductCardProps> = ({ product, horizontal = false }) => {
  const navigation = useNavigation<any>();
  const { addToCart, toggleFavorite, isFavorite, cart, updateCartQuantity } = useApp();
  const favorite = isFavorite(product.id);

  const cartItem = cart.find(item => item.product.id === product.id);
  const currentQty = cartItem ? cartItem.quantity : 0;

  const [inputValue, setInputValue] = useState(String(currentQty));

  useEffect(() => {
    setInputValue(String(currentQty));
  }, [currentQty]);

  const handleBlur = () => {
    let num = parseInt(inputValue, 10);
    if (isNaN(num) || num < 0) {
      num = 0;
    }
    if (num !== currentQty) {
      updateCartQuantity(product.id, num);
    }
    setInputValue(String(num));
  };

  const handlePress = () => {
    navigation.navigate('ProductDetails', { product });
  };

  const handleAddToCart = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    addToCart(product, 1);
  };

  const handleUpdateQty = (newQty: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    updateCartQuantity(product.id, newQty);
  };

  // Safe image lookup
  const imageSource = (productImages as any)[product.imageKey] || require('../assets/logo1.png');

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
            {currentQty > 0 ? (
              <View style={styles.qtySelectorHorizontal}>
                <TouchableOpacity onPress={() => handleUpdateQty(currentQty - 1)} style={styles.qtyBtnHorizontal}>
                  <Minus size={14} color={COLORS.primary} />
                </TouchableOpacity>
                <TextInput
                  style={styles.qtyInputHorizontal}
                  keyboardType="numeric"
                  value={inputValue}
                  onChangeText={setInputValue}
                  onBlur={handleBlur}
                  selectTextOnFocus
                />
                <TouchableOpacity onPress={() => handleUpdateQty(currentQty + 1)} style={styles.qtyBtnHorizontal}>
                  <Plus size={14} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.actionBtnHorizontal}
                onPress={handleAddToCart}
                activeOpacity={0.7}
              >
                <Text style={styles.actionBtnTextHorizontal}>Add</Text>
              </TouchableOpacity>
            )}
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
        
        {currentQty > 0 ? (
          <View style={styles.qtySelectorGrid}>
            <TouchableOpacity onPress={() => handleUpdateQty(currentQty - 1)} style={styles.qtyBtnGrid}>
              <Minus size={16} color={COLORS.primary} />
            </TouchableOpacity>
            <TextInput
              style={styles.qtyInputGrid}
              keyboardType="numeric"
              value={inputValue}
              onChangeText={setInputValue}
              onBlur={handleBlur}
              selectTextOnFocus
            />
            <TouchableOpacity onPress={() => handleUpdateQty(currentQty + 1)} style={styles.qtyBtnGrid}>
              <Plus size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.actionBtnGrid}
            onPress={handleAddToCart}
            activeOpacity={0.7}
          >
            <Text style={styles.actionBtnTextGrid}>Add</Text>
          </TouchableOpacity>
        )}
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
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  model: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginTop: 2,
  },
  brand: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontFamily: FONTS.medium,
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
    fontFamily: FONTS.semiBold,
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
    fontFamily: FONTS.bold,
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
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modelGrid: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginTop: 2,
  },
  brandGrid: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontFamily: FONTS.medium,
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
    fontFamily: FONTS.semiBold,
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
    fontSize: 13,
    fontFamily: FONTS.bold,
    color: '#FFFFFF',
  },
  qtySelectorHorizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2F6',
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  qtyBtnHorizontal: {
    padding: 4,
  },
  qtyInputHorizontal: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    marginHorizontal: 4,
    minWidth: 24,
    textAlign: 'center',
    padding: 0,
    height: 20,
  },
  qtySelectorGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EEF2F6',
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  qtyBtnGrid: {
    padding: 4,
  },
  qtyInputGrid: {
    fontSize: 14,
    fontFamily: FONTS.extraBold,
    color: COLORS.primary,
    minWidth: 32,
    textAlign: 'center',
    padding: 0,
    height: 24,
  },
});
