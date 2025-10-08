

import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { CartContext } from '../../context/CartContext';
import { colors, spacing, typography } from '../theme';

const StatusMessage = ({ message, type }) => {
  if (!message) return null;
  const backgroundColor = type === 'success' ? colors.success : colors.error;

  const [isVisible, setIsVisible] = useState(true);
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [message]);
  
  if (!isVisible) return null;

  return (
    <View style={[styles.messageContainer, { backgroundColor }]}>
      <Text style={styles.messageText}>{message}</Text>
    </View>
  );
};

const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const { addToCart, cartLoading } = useContext(CartContext);
  const [status, setStatus] = useState({ message: null, type: null });

  if (!product) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>Product data is missing.</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const handleAddToCart = () => {
    addToCart(product);
    setStatus({ message: `${product.title} added to cart!`, type: 'success' });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          style={styles.image}
          source={{ uri: product.image }}
          onError={({ nativeEvent: { error } }) => console.log('Image Load Error:', error)}
        />
        
        <View style={styles.detailsBox}>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>
                ⭐ {product.rating.rate.toFixed(1)} Rating ({product.rating.count} reviews)
            </Text>
          </View>

          <Text style={styles.subtitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>
          
          <Text style={styles.categoryText}>Category: {product.category}</Text>
        </View>
      </ScrollView>
      
      <StatusMessage message={status.message} type={status.type} />
      
      <View style={styles.footerBar}>
        <Text style={styles.footerPrice}>${product.price.toFixed(2)}</Text>
        <TouchableOpacity 
          style={styles.addToCartButton} 
          onPress={handleAddToCart}
          disabled={cartLoading}
        >
          {cartLoading ? (
            <ActivityIndicator color={colors.surface} />
          ) : (
            <Text style={styles.addToCartButtonText}>Add to Cart</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 100, 
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailsBox: {
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  price: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  ratingText: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  categoryText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  errorText: {
    color: colors.error,
    fontSize: typography.sizes.lg,
  },
  footerBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerPrice: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  addToCartButton: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    minWidth: 150,
  },
  addToCartButtonText: {
    color: colors.surface,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  messageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    alignItems: 'center',
    zIndex: 10,
    opacity: 0.95,
  },
  messageText: {
    color: colors.surface,
    fontWeight: typography.weights.medium,
  },
});

export default ProductDetailScreen;
