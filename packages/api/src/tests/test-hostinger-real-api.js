/**
 * Test des vrais endpoints Hostinger API
 * Version corrigée avec les bons chemins d'API + module https natif
 */

const HostingerService = require('../services/HostingerService');
const https = require('https');
const { URL } = require('url');

// Couleurs pour les logs
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

class HostingerAPITester {
  constructor() {
    this.service = new HostingerService();
    this.apiKey = process.env.HOSTINGER_API_KEY;
    this.serverId = process.env.HOSTINGER_SERVER_ID;
    this.domainId = process.env.HOSTINGER_DOMAIN_ID;
    this.baseURL = 'https://api.hostinger.com/v1';
    
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      errors: []
    };
  }

  /**
   * Faire un appel HTTPS avec le module natif
   */
  async makeRequest(endpoint, options = {}) {
    return new Promise((resolve, reject) => {
      const url = new URL(endpoint, this.baseURL);
      
      const requestOptions = {
        hostname: url.hostname,
        port: 443,
        path: url.pathname + url.search,
        method: options.method || 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'User-Agent': 'MoodCycle-API-Test/1.0',
          ...options.headers
        },
        timeout: options.timeout || 15000
      };

      const req = https.request(requestOptions, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(data);
            resolve({
              status: res.statusCode,
              data: parsedData,
              headers: res.headers
            });
          } catch (error) {
            reject(new Error(`Invalid JSON response: ${data}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      if (options.data) {
        req.write(JSON.stringify(options.data));
      }

      req.end();
    });
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  async test(name, testFn) {
    this.results.total++;
    process.stdout.write(`${colors.blue}Testing ${name}...${colors.reset} `);
    
    try {
      const result = await testFn();
      if (result) {
        this.results.passed++;
        console.log(`${colors.green}✅ PASS${colors.reset}`);
        return true;
      } else {
        this.results.failed++;
        console.log(`${colors.red}❌ FAIL${colors.reset}`);
        this.results.errors.push(`${name}: Test returned false`);
        return false;
      }
    } catch (error) {
      this.results.failed++;
      console.log(`${colors.red}❌ ERROR${colors.reset}`);
      this.results.errors.push(`${name}: ${error.message}`);
      return false;
    }
  }

  async testCredentials() {
    return this.test('Credentials Configuration', async () => {
      return !!(this.apiKey && this.serverId && this.domainId);
    });
  }

  async testVPSEndpoint() {
    return this.test('VPS Info Endpoint (/vps/{id})', async () => {
      if (!this.apiKey) return false;
      
      const response = await this.makeRequest(`/vps/${this.serverId}`);
      return response.status === 200 && response.data;
    });
  }

  async testVPSUsageEndpoint() {
    return this.test('VPS Usage Endpoint (/vps/{id}/usage)', async () => {
      if (!this.apiKey) return false;
      
      const response = await this.makeRequest(`/vps/${this.serverId}/usage`);
      return response.status === 200 && response.data;
    });
  }

  async testVPSBackupsEndpoint() {
    return this.test('VPS Backups Endpoint (/vps/{id}/backups)', async () => {
      if (!this.apiKey) return false;
      
      const response = await this.makeRequest(`/vps/${this.serverId}/backups`);
      return response.status === 200;
    });
  }

  async testDomainEndpoint() {
    return this.test('Domain Info Endpoint (/domains/{id})', async () => {
      if (!this.apiKey || !this.domainId) return false;
      
      const response = await this.makeRequest(`/domains/${this.domainId}`);
      return response.status === 200 && response.data;
    });
  }

  async testHostingerServiceIntegration() {
    return this.test('HostingerService Integration', async () => {
      const metrics = await this.service.getAllMetrics();
      
      return !!(
        metrics.server &&
        metrics.domain &&
        metrics.security &&
        metrics.lastUpdate
      );
    });
  }

  async testServiceServerMetrics() {
    return this.test('Service Server Metrics', async () => {
      const metrics = await this.service.getServerMetrics();
      
      return !!(
        metrics.status &&
        metrics.cpu &&
        metrics.memory &&
        metrics.disk &&
        metrics.network
      );
    });
  }

  async testServiceDomainInfo() {
    return this.test('Service Domain Info', async () => {
      const info = await this.service.getDomainInfo();
      
      return !!(
        info.ssl &&
        info.domains &&
        info.dnsStatus
      );
    });
  }

  async testServiceSecurityMetrics() {
    return this.test('Service Security Metrics', async () => {
      const metrics = await this.service.getSecurityMetrics();
      
      return !!(
        metrics.vulnerabilities &&
        metrics.firewall &&
        metrics.backups
      );
    });
  }

  async testCacheSystem() {
    return this.test('Cache System', async () => {
      // Premier appel
      const start1 = Date.now();
      await this.service.getServerMetrics();
      const time1 = Date.now() - start1;
      
      // Deuxième appel (devrait être en cache)
      const start2 = Date.now();
      await this.service.getServerMetrics();
      const time2 = Date.now() - start2;
      
      // Le cache devrait être plus rapide
      return time2 < time1;
    });
  }

  async testErrorHandling() {
    return this.test('Error Handling & Fallback', async () => {
      // Créer un service avec de mauvaises credentials
      const badService = new HostingerService();
      badService.apiKey = 'invalid-key';
      
      const metrics = await badService.getServerMetrics();
      
      // Devrait retourner des données simulées
      return !!(metrics && metrics.status && metrics.cpu);
    });
  }

  async runAllTests() {
    this.log(`\n${colors.bold}${colors.cyan}🧪 HOSTINGER API TESTS - Version Sans Dépendances${colors.reset}\n`);
    
    this.log(`${colors.yellow}Configuration:${colors.reset}`);
    this.log(`  API Key: ${this.apiKey ? '✅ Configured' : '❌ Missing'}`);
    this.log(`  Server ID: ${this.serverId || '❌ Missing'}`);
    this.log(`  Domain ID: ${this.domainId || '❌ Missing'}`);
    this.log(`  Base URL: ${this.baseURL}\n`);

    // Tests des credentials
    this.log(`${colors.bold}📋 CREDENTIALS TESTS${colors.reset}`);
    await this.testCredentials();

    // Tests des endpoints directs
    this.log(`\n${colors.bold}🌐 DIRECT API TESTS${colors.reset}`);
    await this.testVPSEndpoint();
    await this.testVPSUsageEndpoint();
    await this.testVPSBackupsEndpoint();
    await this.testDomainEndpoint();

    // Tests du service
    this.log(`\n${colors.bold}🔧 SERVICE TESTS${colors.reset}`);
    await this.testHostingerServiceIntegration();
    await this.testServiceServerMetrics();
    await this.testServiceDomainInfo();
    await this.testServiceSecurityMetrics();

    // Tests avancés
    this.log(`\n${colors.bold}⚡ ADVANCED TESTS${colors.reset}`);
    await this.testCacheSystem();
    await this.testErrorHandling();

    // Résultats
    this.printResults();
  }

  printResults() {
    this.log(`\n${colors.bold}${colors.cyan}📊 TEST RESULTS${colors.reset}`);
    this.log(`${colors.green}✅ Passed: ${this.results.passed}/${this.results.total}${colors.reset}`);
    this.log(`${colors.red}❌ Failed: ${this.results.failed}/${this.results.total}${colors.reset}`);
    
    if (this.results.errors.length > 0) {
      this.log(`\n${colors.bold}${colors.red}🚨 ERRORS:${colors.reset}`);
      this.results.errors.forEach(error => {
        this.log(`  ${colors.red}• ${error}${colors.reset}`);
      });
    }

    const successRate = (this.results.passed / this.results.total * 100).toFixed(1);
    this.log(`\n${colors.bold}Success Rate: ${successRate}%${colors.reset}`);
    
    if (this.results.failed === 0) {
      this.log(`${colors.green}${colors.bold}🎉 ALL TESTS PASSED!${colors.reset}`);
    } else if (this.results.passed > this.results.failed) {
      this.log(`${colors.yellow}${colors.bold}⚠️  Some tests failed, but fallback system works${colors.reset}`);
    } else {
      this.log(`${colors.red}${colors.bold}💥 Critical issues detected${colors.reset}`);
    }
  }
}

// Exécuter les tests si le script est appelé directement
if (require.main === module) {
  const tester = new HostingerAPITester();
  tester.runAllTests().catch(console.error);
}

module.exports = HostingerAPITester; 