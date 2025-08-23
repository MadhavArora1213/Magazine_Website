const API_BASE_URL = 'http://localhost:5000/api';

class CategoryService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/categories`;
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('adminToken');
  }

  // Get auth headers
  getAuthHeaders() {
    const token = this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  }

  // Get all categories
  async getAllCategories() {
    try {
      const response = await fetch(this.baseURL, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  // Get category by ID
  async getCategoryById(id) {
    try {
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  }

  // Create new category
  async createCategory(categoryData) {
    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(categoryData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  // Update category
  async updateCategory(id, categoryData) {
    try {
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(categoryData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  // Delete category
  async deleteCategory(id) {
    try {
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }

  // Toggle category status
  async toggleCategoryStatus(id) {
    try {
      const response = await fetch(`${this.baseURL}/${id}/status`, {
        method: 'PATCH',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error toggling category status:', error);
      throw error;
    }
  }

  // Update category design
  async updateCategoryDesign(id, design) {
    try {
      const response = await fetch(`${this.baseURL}/${id}/design`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ design })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating category design:', error);
      throw error;
    }
  }
}

export default new CategoryService();
