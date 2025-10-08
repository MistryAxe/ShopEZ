const API_BASE_URL = 'https://fakestoreapi.com';

export const fetchProducts = async (category = null) => {
  try {
    let url = `${API_BASE_URL}/products`;
    if (category && category !== 'all') {
      url = `${API_BASE_URL}/products/category/${category}`;
    }
    
    console.log(`Fetching products from: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/categories`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    return ['all', ...data];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};
