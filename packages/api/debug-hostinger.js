/**
 * Script de debug pour trouver le server_id Hostinger
 * À exécuter temporairement pour récupérer les IDs
 */

const axios = require('axios');
require('dotenv').config();

async function findHostingerServerID() {
  const apiKey = process.env.HOSTINGER_API_KEY;
  
  if (!apiKey) {
    console.log('❌ HOSTINGER_API_KEY non trouvée dans .env');
    console.log('Ajoutez: HOSTINGER_API_KEY=votre_clé_api');
    return;
  }

  try {
    console.log('🔍 Recherche des serveurs Hostinger...');
    
    // Lister tous les serveurs/VPS
    const response = await axios.get('https://api.hostinger.com/v1/vps', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    console.log('✅ Réponse API reçue');
    console.log('📊 Données serveurs:', JSON.stringify(response.data, null, 2));
    
    // Extraire les IDs des serveurs
    if (response.data && response.data.data) {
      const servers = response.data.data;
      console.log('\n🎯 Serveurs trouvés:');
      
      servers.forEach((server, index) => {
        console.log(`\n--- Serveur ${index + 1} ---`);
        console.log(`ID: ${server.id}`);
        console.log(`Nom: ${server.name || 'N/A'}`);
        console.log(`Statut: ${server.status || 'N/A'}`);
        console.log(`IP: ${server.ip || 'N/A'}`);
        console.log(`OS: ${server.os || 'N/A'}`);
      });
      
      if (servers.length > 0) {
        console.log(`\n✅ Votre HOSTINGER_SERVER_ID est probablement: ${servers[0].id}`);
        console.log(`\nAjoutez dans votre .env:`);
        console.log(`HOSTINGER_SERVER_ID=${servers[0].id}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur API Hostinger:', error.message);
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
      
      if (error.response.status === 401) {
        console.log('\n🔑 Problème d\'authentification:');
        console.log('- Vérifiez que votre API key est correcte');
        console.log('- Vérifiez que l\'API key a les permissions VPS');
      }
    }
  }
}

// Essayer aussi avec l'endpoint servers
async function findHostingerServersAlternative() {
  const apiKey = process.env.HOSTINGER_API_KEY;
  
  try {
    console.log('\n🔍 Tentative avec endpoint /servers...');
    
    const response = await axios.get('https://api.hostinger.com/v1/servers', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    console.log('✅ Réponse /servers:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.log('❌ Endpoint /servers non disponible:', error.message);
  }
}

// Exécuter les deux méthodes
async function main() {
  console.log('🚀 Début du debug Hostinger API\n');
  
  await findHostingerServerID();
  await findHostingerServersAlternative();
  
  console.log('\n✅ Debug terminé');
}

main().catch(console.error); 