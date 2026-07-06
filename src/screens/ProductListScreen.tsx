import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  SafeAreaView, 
  ActivityIndicator, 
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, BORDER_RADIUS, SHADOWS } from '../theme/colors';
import { useApp, Product } from '../context/AppContext';
import catalogData from '../catalog/catalog.json';
import { ProductCard } from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/SkeletonLoader';

export const ProductListScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { favorites } = useApp();
  
  const categoryName = route.params?.categoryName;
  const searchQuery = route.params?.searchQuery;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFilteredProducts = () => {
    setLoading(true);
    // Simulate loading for premium Skeleton loaders feel
    setTimeout(() => {
      let filtered = catalogData as Product[];

      if (categoryName === 'Favorites') {
        filtered = filtered.filter(p => favorites.includes(p.id));
      } else if (categoryName) {
        filtered = filtered.filter(p => p.category.toLowerCase() === categoryName.toLowerCase());
      } else if (searchQuery) {
        const query = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(p => 
          p.brand.toLowerCase().includes(query) ||
          p.model.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
        );
      }

      setProducts(filtered);
      setLoading(false);
      setRefreshing(false);
    }, 600);
  };

  useEffect(() => {
    fetchFilteredProducts();
  }, [categoryName, searchQuery, favorites]); // refetch when filters or favorites change

  const handleRefresh = () => {
    setRefreshing(true);
    fetchFilteredProducts();
  };

  const renderHeader = () => {
    if (categoryName === 'Favorites') {
      return (
        <View style={styles.listHeader}>
          <Text style={styles.listHeaderTitle}>Your Favorite Products</Text>
          <Text style={styles.listHeaderSub}>{products.length} Items Saved</Text>
        </View>
      );
    }
    
    return (
      <View style={styles.listHeader}>
        <Text style={styles.listHeaderTitle}>
          {categoryName ? `${categoryName}` : `Search Results for "${searchQuery}"`}
        </Text>
        <Text style={styles.listHeaderSub}>{products.length} Products Found</Text>
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.skeletonContainer}>
          {Array.from({ length: 6 }).map((_, idx) => (
            <ProductCardSkeleton key={idx} />
          ))}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => <ProductCard product={item} />}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Ionicons 
                name={categoryName === 'Favorites' ? "heart-dislike-outline" : "search-outline"} 
                size={48} 
                color={COLORS.textMuted} 
              />
            </View>
            <Text style={styles.emptyTitle}>
              {categoryName === 'Favorites' ? "No Favorites Yet" : "No Products Found"}
            </Text>
            <Text style={styles.emptyDesc}>
              {categoryName === 'Favorites' 
                ? "Tap the heart icon on any product to save it for quick browsing here."
                : "We couldn't find any products matching your selection. Please try searching with a different term."}
            </Text>
            {searchQuery && (
              <TouchableOpacity 
                style={styles.resetBtn}
                onPress={() => navigation.navigate('Home')}
              >
                <Text style={styles.resetBtnText}>Go to Home</Text>
              </TouchableOpacity>
            )}
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  skeletonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  listHeader: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 16,
  },
  listHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  listHeaderSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 48,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
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
  resetBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.soft,
  },
  resetBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
