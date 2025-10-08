import { db, appId } from '../config/firebase';
import { doc, getDoc, setDoc, updateDoc, onSnapshot, collection } from 'firebase/firestore';
import { getStorageData, setStorageData, CART_STORAGE_KEY } from '../utils/Storage';

const getCartDocRef = (userId) => {
    const cartCollectionPath = `/artifacts/${appId}/public/data/carts`;
    return doc(db, cartCollectionPath, userId);
};

export const subscribeToCart = (userId, callback) => {
  if (!userId) return () => {};
  
  const docRef = getCartDocRef(userId);

  const unsubscribe = onSnapshot(docRef, async (docSnapshot) => {
    if (docSnapshot.exists()) {
      const cartData = docSnapshot.data();

      await setStorageData(CART_STORAGE_KEY, cartData);
      callback(cartData);
    } else {

      const initialCart = { userId, items: {} };

      callback(initialCart);
    }
  }, (error) => {
    console.error("Firestore: Error subscribing to cart:", error);
    loadCartFromStorage().then(callback);
  });

  return unsubscribe;
};

export const saveCartToDatabase = async (userId, items) => {
  if (!userId) {
      console.warn("Cannot save cart: userId is null.");
      return;
  }
  
  const docRef = getCartDocRef(userId);
  const cartData = { userId, items };
  
  try {
    await setDoc(docRef, cartData, { merge: true });

    await setStorageData(CART_STORAGE_KEY, cartData);
    
    console.log("Cart successfully saved to Firestore and AsyncStorage.");
  } catch (error) {
    console.error("Firestore: Error saving cart data:", error);
    await setStorageData(CART_STORAGE_KEY, cartData);
  }
};

export const loadCartFromStorage = async () => {
    const cartData = await getStorageData(CART_STORAGE_KEY);
    return cartData || { userId: null, items: {} };
};
