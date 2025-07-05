module.exports = {
  // Environnement de test
  testEnvironment: 'node',
  
  // Timeout pour les tests (important pour les tests réseau)
  testTimeout: 30000, // 30 secondes
  
  // Pattern des fichiers de test
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js'
  ],
  
  // Répertoires à ignorer
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/'
  ],
  
  // Configuration de la couverture
  collectCoverage: false, // Désactivé pour les tests d'endpoints
  
  // Variables d'environnement pour les tests
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Verbose pour voir les détails des tests
  verbose: true,
  
  // Forcer la sortie des console.log dans les tests
  silent: false,
  
  // Configuration pour les tests d'endpoints
  globals: {
    'API_BASE_URL': process.env.API_BASE_URL || 'https://moodcycle.irimwebforge.com'
  }
}; 