
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { fetchProducts } from '../services/FakeStoreAPI';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { colors, spacing, typography } from '../theme';

const HomeScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { logout } = useContext(AuthContext);
  const { cartItemCount } = useContext(CartContext);

  const loadProducts = async (category) => {
    try {
      setLoading(true);
      const data = await fetchProducts(category);
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError('Failed to load products. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts(selectedCategory);
  }, [selectedCategory]);

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { product });
  };

  const renderProduct = ({ item }) => (
    <ProductCard product={item} onPress={handleProductPress} />
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'ShopEZ Products',
      headerRight: () => (
        <View style={styles.headerRightContainer}>
          <TouchableOpacity 
            style={styles.cartButton}
            onPress={() => navigation.navigate('Cart')}
            >
            <Text style={styles.cartIcon}>🛒</Text>
            {cartItemCount > 0 && (
                <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
                </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={logout}
          >
            <Text style={styles.logoutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, logout, cartItemCount]);


  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Fetching awesome products...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={() => loadProducts(selectedCategory)}>
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CategoryFilter 
        onSelectCategory={setSelectedCategory} 
        selectedCategory={selectedCategory} 
      />
      
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProduct}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No products found in this category.</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.textSecondary,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.sizes.lg,
    marginBottom: spacing.md,
  },
  listContent: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  buttonText: {
    color: colors.surface,
    fontWeight: typography.weights.semibold,
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  logoutButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    marginLeft: spacing.md,
    backgroundColor: colors.error,
    borderRadius: 6,
  },
  logoutButtonText: {
    color: colors.surface,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  cartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    padding: spacing.xs,
  },
  cartIcon: {
    fontSize: typography.sizes.xl,
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: colors.secondary,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: colors.surface,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  }
});

export default HomeScreen;
