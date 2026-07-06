import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

export interface Product {
  id: string;
  category: string;
  brand: string;
  model: string;
  imageKey: string;
  availability: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerProfile {
  name: string;
  company: string;
  phone: string;
  email: string;
  address: string;
  remarks: string;
}

interface AppContextType {
  cart: CartItem[];
  favorites: string[];
  profile: CustomerProfile;
  recentlyViewed: Product[];
  isOffline: boolean;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  saveProfile: (profile: CustomerProfile) => Promise<void>;
  addToRecentlyViewed: (product: Product) => void;
  triggerOfflineCheck: () => Promise<boolean>;
}

const defaultProfile: CustomerProfile = {
  name: '',
  company: '',
  phone: '',
  email: '',
  address: '',
  remarks: ''
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [profile, setProfile] = useState<CustomerProfile>(defaultProfile);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [isOffline, setIsOffline] = useState<boolean>(false);

  // Monitor network connectivity
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      // NetInfo state.isConnected is boolean or null
      setIsOffline(state.isConnected === false);
    });
    return () => unsubscribe();
  }, []);

  const triggerOfflineCheck = async () => {
    const state = await NetInfo.fetch();
    const offline = state.isConnected === false;
    setIsOffline(offline);
    return offline;
  };

  // Load persisted data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedCart = await AsyncStorage.getItem('ds_cart');
        const storedFavorites = await AsyncStorage.getItem('ds_favorites');
        const storedProfile = await AsyncStorage.getItem('ds_profile');
        const storedRecent = await AsyncStorage.getItem('ds_recently_viewed');

        if (storedCart) setCart(JSON.parse(storedCart));
        if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
        if (storedProfile) setProfile(JSON.parse(storedProfile));
        if (storedRecent) setRecentlyViewed(JSON.parse(storedRecent));
      } catch (error) {
        console.error('Error loading stored data:', error);
      }
    };
    loadData();
  }, []);

  // Save Cart to AsyncStorage whenever it changes
  const saveCart = async (newCart: CartItem[]) => {
    setCart(newCart);
    try {
      await AsyncStorage.setItem('ds_cart', JSON.stringify(newCart));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  // Save Favorites to AsyncStorage
  const saveFavorites = async (newFavorites: string[]) => {
    setFavorites(newFavorites);
    try {
      await AsyncStorage.setItem('ds_favorites', JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  // Save Recently Viewed to AsyncStorage
  const saveRecentlyViewed = async (newRecent: Product[]) => {
    setRecentlyViewed(newRecent);
    try {
      await AsyncStorage.setItem('ds_recently_viewed', JSON.stringify(newRecent));
    } catch (error) {
      console.error('Error saving recently viewed:', error);
    }
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    const itemIndex = cart.findIndex(item => item.product.id === product.id);
    if (itemIndex > -1) {
      // Item exists, update quantity
      const newCart = [...cart];
      newCart[itemIndex].quantity += quantity;
      saveCart(newCart);
    } else {
      // Add new item
      saveCart([...cart, { product, quantity }]);
    }
  };

  const removeFromCart = (productId: string) => {
    saveCart(cart.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const newCart = cart.map(item => 
      item.product.id === productId ? { ...item, quantity } : item
    );
    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const toggleFavorite = (productId: string) => {
    if (favorites.includes(productId)) {
      saveFavorites(favorites.filter(id => id !== productId));
    } else {
      saveFavorites([...favorites, productId]);
    }
  };

  const isFavorite = (productId: string) => {
    return favorites.includes(productId);
  };

  const saveProfile = async (newProfile: CustomerProfile) => {
    setProfile(newProfile);
    try {
      await AsyncStorage.setItem('ds_profile', JSON.stringify(newProfile));
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const addToRecentlyViewed = (product: Product) => {
    // Remove if exists to place at the top
    const filtered = recentlyViewed.filter(p => p.id !== product.id);
    // Keep max 10 items
    const updated = [product, ...filtered].slice(0, 10);
    saveRecentlyViewed(updated);
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        favorites,
        profile,
        recentlyViewed,
        isOffline,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleFavorite,
        isFavorite,
        saveProfile,
        addToRecentlyViewed,
        triggerOfflineCheck
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
