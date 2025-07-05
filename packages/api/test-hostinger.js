#!/usr/bin/env node

/**
 * Script de test pour l'API Hostinger
 * Usage: node test-hostinger.js
 */

require('dotenv').config();
const HostingerService = require('./src/services/HostingerService');

async function testHostingerIntegration() {
  console.log('🧪 Test de l\'intégration Hostinger...\n');
  
  // Vérifier les variables d'environnement
  console.log('📋 Configuration:');
  console.log('- API Key:', process.env.HOSTINGER_API_KEY ? '✅ Configurée' : '❌ Manquante');
  console.log('- Domain ID:', process.env.HOSTINGER_DOMAIN_ID ? '✅ Configurée' : '❌ Manquante');
  console.log('- Server ID:', process.env.HOSTINGER_SERVER_ID ? `✅ ${process.env.HOSTINGER_SERVER_ID}` : '❌ Manquante');
  console.log('');
  
  const hostingerService = new HostingerService();
  
  try {
    // Test 1: Métriques serveur
    console.log('🖥️  Test 1: Métriques serveur...');
    const serverMetrics = await hostingerService.getServerMetrics();
    console.log('✅ Métriques serveur récupérées:');
    console.log(`   - Statut: ${serverMetrics.status}`);
    console.log(`   - Uptime: ${serverMetrics.uptime}%`);
    console.log(`   - CPU: ${serverMetrics.cpu.usage}%`);
    console.log(`   - RAM: ${serverMetrics.memory.percentage}%`);
    console.log(`   - Disque: ${serverMetrics.disk.percentage}%`);
    console.log('');
    
    // Test 2: Informations domaine
    console.log('🌐 Test 2: Informations domaine...');
    const domainInfo = await hostingerService.getDomainInfo();
    console.log('✅ Informations domaine récupérées:');
    console.log(`   - SSL valide: ${domainInfo.ssl.valid ? 'Oui' : 'Non'}`);
    console.log(`   - SSL expire le: ${domainInfo.ssl.expiresAt}`);
    console.log(`   - Jours restants: ${domainInfo.ssl.daysUntilExpiry}`);
    console.log(`   - Domaines: ${domainInfo.domains.length}`);
    console.log('');
    
    // Test 3: Métriques sécurité
    console.log('🔒 Test 3: Métriques sécurité...');
    const securityMetrics = await hostingerService.getSecurityMetrics();
    console.log('✅ Métriques sécurité récupérées:');
    console.log(`   - Firewall: ${securityMetrics.firewall.status}`);
    console.log(`   - Vulnérabilités critiques: ${securityMetrics.vulnerabilities.critical}`);
    console.log(`   - Dernière sauvegarde: ${securityMetrics.backups.status}`);
    console.log('');
    
    // Test 4: Toutes les métriques
    console.log('📊 Test 4: Toutes les métriques...');
    const allMetrics = await hostingerService.getAllMetrics();
    console.log('✅ Toutes les métriques récupérées:');
    console.log(`   - Dernière mise à jour: ${allMetrics.lastUpdate}`);
    console.log('');
    
    console.log('🎉 Tous les tests ont réussi !');
    console.log('');
    console.log('📝 Prochaines étapes:');
    console.log('1. Vérifiez que les données correspondent à votre serveur');
    console.log('2. Si les données sont simulées, vérifiez vos credentials API');
    console.log('3. Testez l\'endpoint /api/infrastructure/metrics dans votre admin');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    console.log('');
    console.log('🔧 Vérifications:');
    console.log('1. Vos credentials Hostinger sont-ils corrects ?');
    console.log('2. Votre API key a-t-elle les bonnes permissions ?');
    console.log('3. Le server_id 747559 est-il correct ?');
    console.log('4. Êtes-vous connecté à internet ?');
  }
}

// Exécuter le test
if (require.main === module) {
  testHostingerIntegration();
}

module.exports = { testHostingerIntegration }; 