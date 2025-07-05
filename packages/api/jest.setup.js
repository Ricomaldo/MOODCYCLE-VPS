/**
 * Configuration Jest pour les tests MoodCycle API
 */

// Configuration globale pour les tests
global.console = {
  ...console,
  // Garder les logs pour voir les métriques de performance
  log: jest.fn((...args) => {
    process.stdout.write(args.join(' ') + '\n');
  }),
  error: jest.fn((...args) => {
    process.stderr.write(args.join(' ') + '\n');
  }),
  warn: jest.fn((...args) => {
    process.stdout.write('⚠️  ' + args.join(' ') + '\n');
  }),
  info: jest.fn((...args) => {
    process.stdout.write('ℹ️  ' + args.join(' ') + '\n');
  })
};

// Configuration des timeouts par défaut
jest.setTimeout(30000);

// Variables d'environnement pour les tests
process.env.NODE_ENV = 'test';

// Gestion des promesses non gérées
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Configuration avant tous les tests
beforeAll(() => {
  console.log('🧪 === DÉBUT DES TESTS ENDPOINTS MOODCYCLE API ===');
  console.log(`🌐 URL de test: ${process.env.API_BASE_URL || 'https://moodcycle.irimwebforge.com'}`);
  console.log(`⏰ Timeout: ${30000}ms`);
  console.log('');
});

// Configuration après tous les tests
afterAll(() => {
  console.log('');
  console.log('🎯 === FIN DES TESTS ENDPOINTS ===');
}); 