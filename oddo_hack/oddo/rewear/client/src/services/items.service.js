import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Items service
export const itemsService = {
  // Get all items with pagination and filtering
  getItems: async (params = {}) => {
    try {
      // For demo purposes, return mock data
      const mockData = {
        data: {
          items: [
            {
              id: 1,
              title: 'Blue Denim Jacket',
              description: 'Lightly worn denim jacket, perfect for fall weather',
              category: 'Jackets',
              size: 'M',
              condition: 'Good',
              imageUrl: 'https://via.placeholder.com/300x200?text=Blue+Denim+Jacket',
              status: 'Available'
            },
            {
              id: 2,
              title: 'Red T-Shirt',
              description: 'Cotton t-shirt, like new condition',
              category: 'Shirts',
              size: 'L',
              condition: 'Excellent',
              imageUrl: 'https://via.placeholder.com/300x200?text=Red+T-Shirt',
              status: 'Available'
            },
            {
              id: 3,
              title: 'Black Jeans',
              description: 'Stylish black jeans, barely worn',
              category: 'Pants',
              size: 'M',
              condition: 'Good',
              imageUrl: 'https://via.placeholder.com/300x200?text=Black+Jeans',
              status: 'Available'
            },
            {
              id: 4,
              title: 'Leather Boots',
              description: 'Brown leather boots, some wear on soles',
              category: 'Shoes',
              size: '42',
              condition: 'Fair',
              imageUrl: 'https://via.placeholder.com/300x200?text=Leather+Boots',
              status: 'Available'
            }
          ],
          total: 4,
          page: 1,
          pages: 1
        }
      };
      
      return mockData;
      
      // In a real app, you would uncomment this:
      // return await api.get('/items', { params });
    } catch (error) {
      throw error;
    }
  },
  
  // Get featured items
  getFeaturedItems: async () => {
    try {
      // For demo purposes, use mock data
      const mockData = {
        data: [
          {
            id: 1,
            title: 'Blue Denim Jacket',
            description: 'Lightly worn denim jacket, perfect for fall weather',
            category: 'Jackets',
            size: 'M',
            condition: 'Good',
            imageUrl: 'https://via.placeholder.com/800x400?text=Blue+Denim+Jacket',
            status: 'Available',
            uploader: { username: 'user1', city: 'New York' }
          },
          {
            id: 2,
            title: 'Red T-Shirt',
            description: 'Cotton t-shirt, like new condition',
            category: 'Shirts',
            size: 'L',
            condition: 'Excellent',
            imageUrl: 'https://via.placeholder.com/800x400?text=Red+T-Shirt',
            status: 'Available',
            uploader: { username: 'user2', city: 'San Francisco' }
          },
          {
            id: 3,
            title: 'Black Jeans',
            description: 'Stylish black jeans, barely worn',
            category: 'Pants',
            size: 'M',
            condition: 'Good',
            imageUrl: 'https://via.placeholder.com/800x400?text=Black+Jeans',
            status: 'Available',
            uploader: { username: 'user3', city: 'Chicago' }
          }
        ]
      };
      
      return mockData;
      
      // In a real app, you would uncomment this:
      // return await api.get('/items/featured');
    } catch (error) {
      throw error;
    }
  },
  
  // Get item by ID
  getItemById: async (id) => {
    try {
      // For demo purposes, use mock data
      const mockData = {
        data: {
          id: id,
          title: 'Blue Denim Jacket',
          description: 'Lightly worn denim jacket, perfect for fall weather',
          category: 'Jackets',
          size: 'M',
          condition: 'Good',
          imageUrl: 'https://via.placeholder.com/800x400?text=Blue+Denim+Jacket',
          status: 'Available',
          createdAt: '2023-09-15T14:30:00Z',
          uploader: { 
            username: 'user1', 
            city: 'New York'
          }
        }
      };
      
      return mockData;
      
      // In a real app, you would uncomment this:
      // return await api.get(`/items/${id}`);
    } catch (error) {
      throw error;
    }
  },
  
  // Get similar items
  getSimilarItems: async (id) => {
    try {
      // For demo purposes, use mock data
      const mockData = {
        data: [
          {
            id: 2,
            title: 'Denim Shirt',
            description: 'Classic denim shirt, great condition',
            category: 'Shirts',
            size: 'L',
            condition: 'Excellent',
            imageUrl: 'https://via.placeholder.com/300x200?text=Denim+Shirt',
            status: 'Available',
            uploader: { username: 'user2', city: 'Boston' }
          },
          {
            id: 3,
            title: 'Denim Skirt',
            description: 'Casual denim skirt, like new',
            category: 'Skirts',
            size: 'S',
            condition: 'New',
            imageUrl: 'https://via.placeholder.com/300x200?text=Denim+Skirt',
            status: 'Available',
            uploader: { username: 'user3', city: 'Miami' }
          }
        ]
      };
      
      return mockData;
      
      // In a real app, you would uncomment this:
      // return await api.get(`/items/similar/${id}`);
    } catch (error) {
      throw error;
    }
  },
  
  // Get categories
  getCategories: async () => {
    try {
      // For demo purposes, use mock data
      const mockData = {
        data: [
          { id: 'shirts', name: 'Shirts' },
          { id: 'tshirts', name: 'T-Shirts' },
          { id: 'pants', name: 'Pants' },
          { id: 'jeans', name: 'Jeans' },
          { id: 'dresses', name: 'Dresses' },
          { id: 'skirts', name: 'Skirts' },
          { id: 'jackets', name: 'Jackets' },
          { id: 'hoodies', name: 'Hoodies' },
          { id: 'sweaters', name: 'Sweaters' },
          { id: 'shoes', name: 'Shoes' },
          { id: 'accessories', name: 'Accessories' }
        ]
      };
      
      return mockData;
      
      // In a real app, you would uncomment this:
      // return await api.get('/items/categories');
    } catch (error) {
      throw error;
    }
  },
  
  // Create item
  createItem: async (formData) => {
    try {
      // For demo purposes, return mock success response
      const mockResponse = {
        status: 'success',
        message: 'Item created successfully',
        data: {
          item_id: Math.floor(Math.random() * 1000),
          status: 'pending'
        }
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return mockResponse;
      
      // In a real app, you would uncomment this:
      // return await api.post('/items', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data'
      //   }
      // });
    } catch (error) {
      throw error;
    }
  }
};