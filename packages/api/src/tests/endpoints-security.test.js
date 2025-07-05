/**
 * Tests de sécurité et fonctionnement des endpoints MoodCycle API
 * 
 * Ces tests valident :
 * - La sécurité des endpoints avec deviceAuth
 * - Le bon fonctionnement des endpoints publics sécurisés
 * - La structure des données retournées
 * - Les codes de statut HTTP appropriés
 */

const request = require('supertest');
const express = require('express');
const path = require('path');

// Configuration de test
const API_BASE_URL = process.env.API_BASE_URL || 'https://moodcycle.irimwebforge.com';
const TEST_DEVICE_ID = 'test-jest-endpoints';
const TEST_APP_VERSION = '1.0.0-test';

describe('🔒 Endpoints Sécurisés - Tests de Sécurité', () => {
  
  describe('Authentification Device ID', () => {
    
    test('GET /api/insights - REFUSE sans X-Device-ID', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/insights')
        .expect(401);
      
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('code', 'DEVICE_ID_REQUIRED');
    });

    test('GET /api/phases - REFUSE sans X-Device-ID', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/phases')
        .expect(401);
      
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error.code).toBe('DEVICE_ID_REQUIRED');
    });

    test('GET /api/closings - REFUSE sans X-Device-ID', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/closings')
        .expect(401);
      
      expect(response.body).toHaveProperty('success', false);
    });

    test('GET /api/vignettes - REFUSE sans X-Device-ID', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/vignettes')
        .expect(401);
      
      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('Authentification Admin', () => {
    
    test('GET /api/admin/insights - REFUSE sans token', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/admin/insights')
        .expect(401);
      
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });
  });
});

describe('✅ Endpoints Sécurisés - Tests Fonctionnels', () => {
  
  describe('Endpoints avec Device ID valide', () => {
    
    test('GET /api/insights - AUTORISE avec X-Device-ID', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/insights')
        .set('X-Device-ID', TEST_DEVICE_ID)
        .set('X-App-Version', TEST_APP_VERSION)
        .expect(200);
      
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('deviceId', TEST_DEVICE_ID);
      
      // Vérification structure des insights
      expect(response.body.data).toHaveProperty('menstrual');
      expect(response.body.data).toHaveProperty('follicular');
      expect(response.body.data).toHaveProperty('ovulatory');
      expect(response.body.data).toHaveProperty('luteal');
      
      // Vérification contenu des insights menstruels
      expect(Array.isArray(response.body.data.menstrual)).toBe(true);
      expect(response.body.data.menstrual.length).toBeGreaterThan(0);
      
      // Vérification structure d'un insight
      const firstInsight = response.body.data.menstrual[0];
      expect(firstInsight).toHaveProperty('id');
      expect(firstInsight).toHaveProperty('baseContent');
      expect(firstInsight).toHaveProperty('tone');
      expect(firstInsight).toHaveProperty('phase', 'menstrual');
    });

    test('GET /api/phases - AUTORISE avec X-Device-ID', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/phases')
        .set('X-Device-ID', TEST_DEVICE_ID)
        .expect(200);
      
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('deviceId', TEST_DEVICE_ID);
      
      // Vérification des 4 phases cycliques
      const phases = response.body.data;
      expect(phases).toHaveProperty('menstrual');
      expect(phases).toHaveProperty('follicular');
      expect(phases).toHaveProperty('ovulatory');
      expect(phases).toHaveProperty('luteal');
      
      // Vérification structure d'une phase
      const menstrualPhase = phases.menstrual;
      expect(menstrualPhase).toHaveProperty('id', 'menstrual');
      expect(menstrualPhase).toHaveProperty('name');
      expect(menstrualPhase).toHaveProperty('color');
      expect(menstrualPhase).toHaveProperty('duration');
      expect(menstrualPhase).toHaveProperty('energy');
      expect(menstrualPhase).toHaveProperty('mood');
      expect(menstrualPhase).toHaveProperty('symbol');
      expect(menstrualPhase).toHaveProperty('archetype');
    });

    test('GET /api/closings - AUTORISE avec X-Device-ID', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/closings')
        .set('X-Device-ID', TEST_DEVICE_ID)
        .expect(200);
      
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      
      // Vérification des personas
      const closings = response.body.data;
      expect(closings).toHaveProperty('emma');
      expect(closings).toHaveProperty('laure');
      expect(closings).toHaveProperty('clara');
      expect(closings).toHaveProperty('sylvie');
      expect(closings).toHaveProperty('christine');
      
      // Vérification structure d'un closing
      const emmaClosing = closings.emma;
      expect(emmaClosing).toHaveProperty('body');
      expect(emmaClosing).toHaveProperty('nature');
      expect(emmaClosing).toHaveProperty('emotions');
      expect(typeof emmaClosing.body).toBe('string');
    });

    test('GET /api/vignettes - AUTORISE avec X-Device-ID', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/vignettes')
        .set('X-Device-ID', TEST_DEVICE_ID)
        .expect(200);
      
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      
      // Vérification metadata
      const vignettes = response.body.data;
      expect(vignettes).toHaveProperty('version');
      expect(vignettes).toHaveProperty('lastUpdated');
      expect(vignettes).toHaveProperty('metadata');
      
      // Vérification phases
      expect(vignettes).toHaveProperty('menstrual');
      expect(vignettes).toHaveProperty('follicular');
      expect(vignettes).toHaveProperty('ovulatory');
      expect(vignettes).toHaveProperty('luteal');
      
      // Vérification personas dans une phase
      const menstrualVignettes = vignettes.menstrual;
      expect(menstrualVignettes).toHaveProperty('emma');
      expect(menstrualVignettes).toHaveProperty('laure');
      
      // Vérification structure d'une vignette
      const emmaVignettes = menstrualVignettes.emma;
      expect(Array.isArray(emmaVignettes)).toBe(true);
      expect(emmaVignettes.length).toBeGreaterThan(0);
      
      const firstVignette = emmaVignettes[0];
      expect(firstVignette).toHaveProperty('id');
      expect(firstVignette).toHaveProperty('icon');
      expect(firstVignette).toHaveProperty('title');
      expect(firstVignette).toHaveProperty('action');
      expect(firstVignette).toHaveProperty('category');
    });
  });
});

describe('🏥 Endpoint de Santé', () => {
  
  test('GET /api/health - ACCESSIBLE sans authentification', async () => {
    const response = await request(API_BASE_URL)
      .get('/api/health')
      .expect(200);
    
    expect(response.body).toHaveProperty('status', 'healthy');
    expect(response.headers['content-type']).toMatch(/json/);
  });
});

describe('📊 Validation des Données', () => {
  
  test('Cohérence des données entre endpoints', async () => {
    // Récupération des insights et phases
    const [insightsResponse, phasesResponse] = await Promise.all([
      request(API_BASE_URL)
        .get('/api/insights')
        .set('X-Device-ID', TEST_DEVICE_ID),
      request(API_BASE_URL)
        .get('/api/phases')
        .set('X-Device-ID', TEST_DEVICE_ID)
    ]);
    
    const insights = insightsResponse.body.data;
    const phases = phasesResponse.body.data;
    
    // Les phases dans insights doivent correspondre aux phases disponibles
    const insightPhases = Object.keys(insights);
    const availablePhases = Object.keys(phases);
    
    expect(insightPhases.sort()).toEqual(availablePhases.sort());
    
    // Chaque insight doit référencer une phase existante
    for (const phase of insightPhases) {
      expect(phases).toHaveProperty(phase);
      
      for (const insight of insights[phase]) {
        expect(insight.phase).toBe(phase);
      }
    }
  });

  test('Validation des IDs uniques', async () => {
    const response = await request(API_BASE_URL)
      .get('/api/insights')
      .set('X-Device-ID', TEST_DEVICE_ID);
    
    const insights = response.body.data;
    const allIds = [];
    
    // Collecte de tous les IDs
    for (const phase in insights) {
      for (const insight of insights[phase]) {
        allIds.push(insight.id);
      }
    }
    
    // Vérification unicité
    const uniqueIds = [...new Set(allIds)];
    expect(uniqueIds.length).toBe(allIds.length);
  });
});

describe('🔧 Headers et Métadonnées', () => {
  
  test('Headers de réponse appropriés', async () => {
    const response = await request(API_BASE_URL)
      .get('/api/insights')
      .set('X-Device-ID', TEST_DEVICE_ID);
    
    expect(response.headers['content-type']).toMatch(/application\/json/);
    expect(response.body.deviceId).toBe(TEST_DEVICE_ID);
  });

  test('Gestion des headers optionnels', async () => {
    const response = await request(API_BASE_URL)
      .get('/api/insights')
      .set('X-Device-ID', TEST_DEVICE_ID)
      .set('X-App-Version', TEST_APP_VERSION);
    
    expect(response.body.deviceId).toBe(TEST_DEVICE_ID);
    // Note: X-App-Version est accepté mais pas nécessairement retourné
  });
}); 