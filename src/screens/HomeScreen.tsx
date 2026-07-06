import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, BORDER_RADIUS, SHADOWS } from '../theme/colors';
import { useApp } from '../context/AppContext';
import catalogData from '../catalog/catalog.json';
import { ProductCard } from '../components/ProductCard';

const CATEGORIES = [
  { name: 'Head Protection', icon: 'shield-checkmark-outline' },
  { name: 'Eye Protection', icon: 'eye-outline' },
  { name: 'Foot Protection', icon: 'walk-outline' },
  { name: 'Hand Protection', icon: 'hand-left-outline' },
  { name: 'Face Protection', icon: 'body-outline' },
  { name: 'Respiratory Protection', icon: 'medical-outline' },
  { name: 'Body Protection', icon: 'shirt-outline' },
  { name: 'Fall Protection', icon: 'git-compare-outline' },
  { name: 'Electrical Protection', icon: 'flash-outline' },
  { name: 'Gas Detectors', icon: 'speedometer-outline' },
  { name: 'Fire Safety', icon: 'flame-outline' },
  { name: 'Road Safety', icon: 'warning-outline' },
  { name: 'Ropes, Slings & Nets', icon: 'link-outline' },
  { name: 'Eye Wash & Showers', icon: 'water-outline' },
  { name: 'Ear Protection', icon: 'ear-outline' },
  { name: 'First Aid & First Aid Kits', icon: 'medkit-outline' },
];

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { cart, recentlyViewed, favorites } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Get some static featured products (e.g. 3M 9320, Udyogi Rescue Kit, JCB Ounce, Palex Fire Bucket)
  const featuredProducts = catalogData.filter(p => 
    ['DS00001', 'DS00017', 'DS00027', 'DS00097', 'DS00150', 'DS00200'].includes(p.id)
  ).slice(0, 6);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigation.navigate('ProductList', { searchQuery: searchQuery.trim() });
    }
  };

  const handleCategoryPress = (categoryName: string) => {
    navigation.navigate('ProductList', { categoryName });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <Image 
          source={require('../assets/logo.png')} 
          style={styles.logo} 
          resizeMode="contain" 
        />
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerBtn}
            onPress={() => navigation.navigate('ProductList', { categoryName: 'Favorites' })}
          >
            <Ionicons name="heart-outline" size={24} color={COLORS.text} />
            {favorites.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{favorites.length}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerBtn}
            onPress={() => navigation.navigate('Cart')}
          >
            <Ionicons name="cart-outline" size={24} color={COLORS.text} />
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Welcome Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerSubtitle}>DS ENGINEERING ENTERPRISES</Text>
            <Text style={styles.bannerTitle}>Industrial Safety & PPE Solutions</Text>
            <Text style={styles.bannerDesc}>Premium quality protective gear certified to global standards.</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={COLORS.textMuted} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by brand, model, category..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              placeholderTextColor={COLORS.textMuted}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
            <Text style={styles.searchBtnText}>Search</Text>
          </TouchableOpacity>
        </View>

        {/* Categories Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Product Categories</Text>
        </View>
        <View style={styles.categoriesGrid}>
          {CATEGORIES.map((cat, idx) => (
            <TouchableOpacity 
              key={idx} 
              style={styles.categoryCard}
              onPress={() => handleCategoryPress(cat.name)}
              activeOpacity={0.7}
            >
              <View style={styles.categoryIconContainer}>
                <Ionicons name={cat.icon as any} size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.categoryName} numberOfLines={2}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <View style={styles.recentSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recently Viewed</Text>
            </View>
            <FlatList
              horizontal
              data={recentlyViewed}
              keyExtractor={(item) => `recent-${item.id}`}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.recentItemContainer}>
                  <ProductCard product={item} />
                </View>
              )}
              contentContainerStyle={styles.recentList}
            />
          </View>
        )}

        {/* Featured Products */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Safety Gear</Text>
        </View>
        <View style={styles.featuredGrid}>
          {featuredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </View>

        {/* Footer Info */}
        <View style={styles.footerInfo}>
          <Text style={styles.footerText}>DS Engineering Enterprises © 2026</Text>
          <Text style={styles.footerSubText}>Trusted Partner for Workplace Safety Compliance</Text>
          <View style={styles.contactContainer}>
            <Text style={styles.footerContactLabel}>Admin Contact:</Text>
            <Text style={styles.footerContact}>Email: dsengineering.py@gmail.com</Text>
            <Text style={styles.footerContact}>Phone: +91 99441 82596, 6384239858</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  logo: {
    width: 140,
    height: 40,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerBtn: {
    marginLeft: 16,
    padding: 4,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.accent,
    borderRadius: BORDER_RADIUS.round,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: COLORS.text,
    fontSize: 9,
    fontWeight: '800',
  },
  banner: {
    backgroundColor: COLORS.primary,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.soft,
  },
  bannerOverlay: {
    padding: 24,
    backgroundColor: 'rgba(0, 91, 172, 0.95)',
  },
  bannerSubtitle: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.accent,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 6,
  },
  bannerDesc: {
    fontSize: 13,
    color: '#E2E8F0',
    marginTop: 6,
    lineHeight: 18,
  },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: 12,
    height: 48,
    ...SHADOWS.soft,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    height: '100%',
  },
  searchBtn: {
    backgroundColor: COLORS.primary,
    height: 48,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.md,
    marginLeft: 8,
    ...SHADOWS.soft,
  },
  searchBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },
  categoryCard: {
    width: '25%',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.soft,
  },
  categoryName: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 2,
  },
  recentSection: {
    marginTop: 8,
  },
  recentList: {
    paddingHorizontal: 16,
  },
  recentItemContainer: {
    marginRight: 12,
  },
  featuredGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  footerInfo: {
    alignItems: 'center',
    marginTop: 32,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  footerSubText: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  contactContainer: {
    marginTop: 16,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  footerContactLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  footerContact: {
    fontSize: 11,
    color: COLORS.text,
    marginTop: 2,
  },
});
