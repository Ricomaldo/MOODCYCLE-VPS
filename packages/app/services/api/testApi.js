// services/api/testApi.js - version fixée
import { getApiRequestConfig } from '../../config/api.js';

export const testApiConnection = async () => {
    try {
      const apiConfig = getApiRequestConfig('test-device-123');
      
      const response = await fetch(`${apiConfig.baseURL}/api/chat`, {
        method: 'POST',
        headers: apiConfig.headers,
        body: JSON.stringify({
          message: "Bonjour Melune, comment vas-tu ?",
          context: {
            persona: "emma",
            userProfile: { 
              prenom: "Test", 
              ageRange: "18-25" 
            },
            currentPhase: "follicular"
          }
        })
      });
  
      const data = await response.json();
      console.log('✅ API Response:', data);
      return data;
    } catch (error) {
      console.error('❌ API Error:', error);
      throw error;
    }
  };