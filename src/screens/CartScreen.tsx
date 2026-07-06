import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, BORDER_RADIUS, SHADOWS } from '../theme/colors';
import { useApp, CartItem } from '../context/AppContext';
import { productImages } from '../assets/productImages';

export const CartScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { cart, updateCartQuantity, removeFromCart } = useApp();

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length > 0) {
      navigation.navigate('Checkout');
    }
  };

  const renderCartItem = ({ item }: { item: CartItem }) => {
    const { product, quantity } = item;
    const imageSource = (productImages as any)[product.imageKey] || require('../assets/logo.png');

    return (
      <View style={styles.itemCard}>
        <Image source={imageSource} style={styles.itemImage} resizeMode="contain" />
        
        <View style={styles.itemDetails}>
          <Text style={styles.itemCategory} numberOfLines={1}>{product.category}</Text>
          <Text style={styles.itemModel} numberOfLines={1}>{product.model}</Text>
          <Text style={styles.itemBrand}>{product.brand}</Text>
          
          <View style={styles.itemActions}>
            {/* Quantity Adjuster */}
            <View style={styles.qtyContainer}>
              <TouchableOpacity 
                style={styles.qtyBtn} 
                onPress={() => updateCartQuantity(product.id, quantity - 1)}
                activeOpacity={0.7}
              >
                <Ionicons name="remove" size={16} color={COLORS.text} />
              </TouchableOpacity>
              <View style={styles.qtyDisplay}>
                <Text style={styles.qtyText}>{quantity}</Text>
              </View>
              <TouchableOpacity 
                style={styles.qtyBtn} 
                onPress={() => updateCartQuantity(product.id, quantity + 1)}
                activeOpacity={0.7}
              >
                <Ionicons name="add" size={16} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            {/* Trash Button */}
            <TouchableOpacity 
              style={styles.removeBtn} 
              onPress={() => removeFromCart(product.id)}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={18} color={COLORS.error} />
              <Text style={styles.removeBtnText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="cart-outline" size={54} color={COLORS.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>Enquiry Cart is Empty</Text>
          <Text style={styles.emptyDesc}>
            You haven't selected any industrial safety products yet. Browse our product catalog to select items for your enquiry.
          </Text>
          <TouchableOpacity 
            style={styles.browseBtn} 
            onPress={() => navigation.navigate('Home')}
            activeOpacity={0.7}
          >
            <Text style={styles.browseBtnText}>Browse Catalogue</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.cartContainer}>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.product.id}
            renderItem={renderCartItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
          
          {/* Bottom Panel */}
          <View style={styles.bottomPanel}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryText}>Total Selection</Text>
              <Text style={styles.summaryValue}>{totalQuantity} Units ({cart.length} Items)</Text>
            </View>
            <Text style={styles.infoText}>
              Note: This is an enquiry list. No payment is required to place this order.
            </Text>
            <TouchableOpacity 
              style={styles.checkoutBtn} 
              onPress={handleCheckout}
              activeOpacity={0.8}
            >
              <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  cartContainer: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 150, // Space for fixed bottom panel
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    ...SHADOWS.soft,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: '#F8FAFC',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  itemCategory: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  itemModel: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 2,
  },
  itemBrand: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '500',
    marginBottom: 8,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: '#F8FAFC',
  },
  qtyBtn: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyDisplay: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  removeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  removeBtnText: {
    fontSize: 12,
    color: COLORS.error,
    fontWeight: '600',
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyIconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    ...SHADOWS.soft,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  browseBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.soft,
  },
  browseBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.medium,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  summaryText: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  infoText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  checkoutBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.soft,
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
