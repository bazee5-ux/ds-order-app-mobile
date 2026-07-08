import React, { useState, useEffect } from 'react';
import { View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Platform,
  TextInput } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Minus, Plus, ShoppingCart } from 'lucide-react-native';
import { COLORS, FONTS, BORDER_RADIUS, SHADOWS } from '../theme/colors';
import { useApp, Product } from '../context/AppContext';
import { productImages } from '../assets/productImages';
import { Ionicons } from '@expo/vector-icons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const getCategoryDescription = (category: string, brand: string, model: string): string => {
  const cat = category.toLowerCase();
  if (cat.includes('head')) {
    return `Professional industrial safety helmet from ${brand} (Model: ${model}). Engineered with a high-density, impact-resistant outer shell to absorb external forces. Features a highly adjustable inner suspension system for superior comfort, balanced weight distribution, and secure wear during long shifts. Ideal for construction, utilities, and heavy manufacturing sites.`;
  }
  if (cat.includes('eye protection')) {
    return `Premium protective eyewear from ${brand} (Model: ${model}). Features high-clarity polycarbonate lenses with anti-scratch, anti-fog, and full UV protection treatments. Designed with a lightweight frame, non-slip nose pads, and wrap-around temples for complete peripheral coverage and all-day comfort.`;
  }
  if (cat.includes('foot')) {
    return `Heavy-duty industrial safety footwear from ${brand} (Model: ${model}). Crafted with a premium oil-resistant upper and a steel or composite safety toe cap for robust protection. Features a slip-resistant outsole, cushioned footbed, and shock-absorbing heel to minimize fatigue. Certified compliant with workplace safety regulations.`;
  }
  if (cat.includes('hand')) {
    return `High-performance industrial safety gloves from ${brand} (Model: ${model}). Specially designed to provide a secure grip under dry, wet, or oily conditions while offering excellent abrasion, cut, and puncture resistance. Features breathable materials and ergonomic shaping to minimize hand fatigue.`;
  }
  if (cat.includes('face')) {
    return `Full-coverage industrial face shield from ${brand} (Model: ${model}). Equipped with a crystal-clear, high-impact window that protects against chemical splashes, flying debris, and sparks. Includes an adjustable ratchet headgear assembly for a customizable fit.`;
  }
  if (cat.includes('respiratory')) {
    return `High-efficiency respiratory protection respirator/mask from ${brand} (Model: ${model}). Designed to filter out particulate matter, dust, aerosols, and toxic airborne substances. Features low breathing resistance, soft skin-friendly materials, and adjustable head straps for a tight, reliable seal.`;
  }
  if (cat.includes('body')) {
    return `Certified protective coverall/clothing by ${brand} (Model: ${model}). Provides an effective barrier against liquid spray, dust, and light chemical hazards while maintaining breathability for the wearer. Features reinforced seams, elastic waist, and cuffs for a comfortable, secure fit.`;
  }
  if (cat.includes('fall')) {
    return `Premium full-body safety harness from ${brand} (Model: ${model}) designed for fall arrest and work-at-height operations. Features high-strength polyester webbing, heavy-duty alloy D-rings, adjustable chest and leg straps, and a cushioned back pad for maximum ergonomics and load distribution.`;
  }
  if (cat.includes('electrical')) {
    return `Specialized electrical safety protection equipment by ${brand} (Model: ${model}). Rated for high-voltage insulation and tested to strict ASTM/EN safety compliance standards. Protects utility workers, maintenance engineers, and electricians from electrical arc and shock hazards.`;
  }
  if (cat.includes('gas')) {
    return `Advanced gas detection monitor from ${brand} (Model: ${model}). Engineered to provide fast, reliable sensing of hazardous gases. Features bright visual indicators, loud alarms, a clear digital display, and robust housing to survive harsh field environments.`;
  }
  if (cat.includes('fire')) {
    return `Professional fire safety equipment from ${brand} (Model: ${model}). Designed for instant deployment during fire emergency events. Manufactured in strict compliance with fire protection regulations to ensure reliability and safety in commercial and industrial settings.`;
  }
  if (cat.includes('road')) {
    return `High-visibility road safety device by ${brand} (Model: ${model}). Features retroreflective detailing, weather-resistant materials, and a durable structure to withstand heavy vehicle impacts. Ideal for traffic management, highway construction, and parking facilities.`;
  }
  if (cat.includes('ropes') || cat.includes('slings')) {
    return `Heavy-duty industrial lifting slings and nets from ${brand} (Model: ${model}). Woven from high-tenacity fibers with reinforced loops. Tested and certified for specific load limits, offering extreme durability, flexibility, and safety in heavy cargo handling.`;
  }
  if (cat.includes('wash') || cat.includes('shower')) {
    return `Emergency eye wash/shower station component from ${brand} (Model: ${model}). Designed to deliver rapid, flushing water flow to decontaminate eyes and skin from chemicals. Built with corrosive-resistant materials for reliable plumbing operation.`;
  }
  if (cat.includes('ear')) {
    return `High-reduction ear protection earmuffs/plugs from ${brand} (Model: ${model}). Offers excellent noise attenuation (NRR/SNR rating) to protect hearing in high-decibel environments. Features soft ear cushions and padded headband for long wearing comfort.`;
  }
  if (cat.includes('first aid')) {
    return `Comprehensive first aid equipment by ${brand} (Model: ${model}). Packed with essential medical supplies, dressings, and treatments for responding to workplace injuries and maintaining safety compliance. Ideal for industrial offices, factories, and utility kits.`;
  }
  return `Certified industrial safety product from ${brand} (Model: ${model}). Designed to provide robust protection, comfort, and durability in commercial and industrial work environments. Fully compliant with safety regulations.`;
};

export const ProductDetailsScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { product } = route.params as { product: Product };
  
  const { addToCart, toggleFavorite, isFavorite, addToRecentlyViewed, cart, updateCartQuantity } = useApp();
  
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

  // Add to recently viewed on mount
  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product);
    }
  }, [product]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity 
          style={{ marginRight: 16, position: 'relative' }} 
          onPress={() => navigation.navigate('Cart')}
        >
          <ShoppingCart size={24} color={COLORS.primary} />
          {cartCount > 0 && (
            <View style={{
              position: 'absolute',
              top: -6,
              right: -8,
              backgroundColor: COLORS.error,
              borderRadius: 10,
              minWidth: 18,
              height: 18,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 4,
            }}>
              <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>
                {cartCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      )
    });
  }, [navigation, cartCount]);

  const handleAddToCart = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    addToCart(product, 1);
  };

  const handleUpdateQty = (newQty: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    updateCartQuantity(product.id, newQty);
  };

  const imageSource = (productImages as any)[product.imageKey] || require('../assets/logo1.png');
  const description = getCategoryDescription(product.category, product.brand, product.model);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Large Product Image Container */}
        <View style={styles.imageContainer}>
          <Image source={imageSource} style={styles.image} resizeMode="contain" />
          <TouchableOpacity 
            style={styles.favoriteBtn} 
            onPress={() => toggleFavorite(product.id)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={favorite ? "heart" : "heart-outline"} 
              size={24} 
              color={favorite ? COLORS.error : COLORS.textMuted} 
            />
          </TouchableOpacity>
        </View>

        {/* Product Information */}
        <View style={styles.infoSection}>
          <Text style={styles.category}>{product.category}</Text>
          <Text style={styles.model}>{product.model}</Text>
          <Text style={styles.brand}>Brand: {product.brand}</Text>

          {/* Availability Badge */}
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <View style={styles.badgeIndicator} />
              <Text style={styles.badgeText}>{product.availability}</Text>
            </View>
            <Text style={styles.codeText}>ID: {product.id}</Text>
          </View>

          <View style={styles.divider} />

          {/* Product Description */}
          <Text style={styles.sectionTitle}>Product Details</Text>
          <Text style={styles.description}>{description}</Text>

          <View style={styles.divider} />

          {/* Removed Quantity Selector */}
        </View>
      </ScrollView>

      {/* Fixed Bottom Action Panel */}
      <View style={[styles.bottomPanel, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        {currentQty > 0 ? (
          <View style={styles.activeCartPanel}>
            <View style={styles.qtySelectorCompact}>
              <TouchableOpacity onPress={() => handleUpdateQty(currentQty - 1)} style={styles.qtyBtnCompact}>
                <Minus size={20} color={COLORS.primary} />
              </TouchableOpacity>
              <TextInput
                style={styles.qtyInputCompact}
                keyboardType="numeric"
                value={inputValue}
                onChangeText={setInputValue}
                onBlur={handleBlur}
                selectTextOnFocus
              />
              <TouchableOpacity onPress={() => handleUpdateQty(currentQty + 1)} style={styles.qtyBtnCompact}>
                <Plus size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
              style={styles.goToCartBtn} 
              onPress={() => navigation.navigate('Cart')}
              activeOpacity={0.8}
            >
              <Text style={styles.goToCartBtnText}>View Cart</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.addToCartBtn} 
            onPress={handleAddToCart}
            activeOpacity={0.8}
          >
            <Ionicons name="cart-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.addToCartBtnText}>Add To Enquiry Cart</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  imageContainer: {
    width: '100%',
    height: 280,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  image: {
    width: '90%',
    height: '90%',
  },
  favoriteBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: BORDER_RADIUS.round,
    ...SHADOWS.medium,
  },
  infoSection: {
    padding: 20,
    paddingBottom: 100, // Margin to allow scrolling past the fixed button panel
  },
  category: {
    fontSize: 12,
    fontFamily: FONTS.extraBold,
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  model: {
    fontSize: 24,
    fontFamily: FONTS.extraBold,
    color: COLORS.text,
    marginTop: 6,
  },
  brand: {
    fontSize: 16,
    color: COLORS.textMuted,
    fontFamily: FONTS.semiBold,
    marginTop: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.round,
  },
  badgeIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    color: COLORS.success,
  },
  codeText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontFamily: FONTS.semiBold,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: FONTS.extraBold,
    color: COLORS.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: COLORS.textMuted,
    lineHeight: 22,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  qtyBtn: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyDisplay: {
    width: 60,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 18,
    fontFamily: FONTS.extraBold,
    color: COLORS.text,
  },
  qtyUnit: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontFamily: FONTS.semiBold,
    marginLeft: 12,
  },
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.medium,
  },
  addToCartBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.soft,
  },
  addToCartBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  activeCartPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  qtySelectorCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EEF2F6',
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    flex: 0.45,
  },
  qtyBtnCompact: {
    padding: 4,
  },
  qtyInputCompact: {
    fontSize: 18,
    fontFamily: FONTS.extraBold,
    color: COLORS.primary,
    minWidth: 40,
    textAlign: 'center',
    padding: 0,
  },
  goToCartBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS.md,
    flex: 0.5,
    ...SHADOWS.soft,
  },
  goToCartBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: FONTS.bold,
  },
});
