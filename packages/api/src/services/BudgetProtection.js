// services/BudgetProtection.js
class BudgetProtection {
    constructor() {
      this.dailySpent = 0;
      this.weeklySpent = 0;
      this.monthlySpent = 0;
      this.lastResetDate = new Date().toDateString();
      this.lastResetWeek = this.getWeekNumber();
      this.lastResetMonth = new Date().getMonth();
      
      // Limites configurables via env
      this.limits = {
        daily: parseFloat(process.env.DAILY_BUDGET_LIMIT) || 10,
        weekly: parseFloat(process.env.WEEKLY_BUDGET_LIMIT) || 50,
        monthly: parseFloat(process.env.MONTHLY_BUDGET_LIMIT) || 150
      };
      
      // Seuils d'alerte
      this.alertThresholds = {
        warning: 0.7,  // 70%
        critical: 0.9  // 90%
      };
    }
  
    // Calcul coût réel avec burndown quota
    calculateCost(usage) {
      if (!usage || !usage.input_tokens || !usage.output_tokens) {
        console.warn('Usage data incomplete:', usage);
        return { dollarCost: 0, quotaConsumed: 0 };
      }
  
      // Prix Haiku actuels
      const inputCost = (usage.input_tokens / 1000000) * 0.25;   // $0.25/1M
      const outputCost = (usage.output_tokens / 1000000) * 1.25; // $1.25/1M
      
      // Quota burndown (important pour monitoring)
      const quotaConsumed = usage.input_tokens + (usage.output_tokens * 5);
      
      return {
        dollarCost: inputCost + outputCost,
        quotaConsumed: quotaConsumed,
        breakdown: {
          inputTokens: usage.input_tokens,
          outputTokens: usage.output_tokens,
          inputCost: inputCost,
          outputCost: outputCost
        }
      };
    }
  
    // Reset budgets selon période
    checkAndResetBudgets() {
      const today = new Date().toDateString();
      const currentWeek = this.getWeekNumber();
      const currentMonth = new Date().getMonth();
  
      // Reset quotidien
      if (this.lastResetDate !== today) {
        console.log(`📅 Reset budget quotidien: $${this.dailySpent.toFixed(4)} → $0`);
        this.dailySpent = 0;
        this.lastResetDate = today;
      }
  
      // Reset hebdomadaire
      if (this.lastResetWeek !== currentWeek) {
        console.log(`📅 Reset budget hebdomadaire: $${this.weeklySpent.toFixed(4)} → $0`);
        this.weeklySpent = 0;
        this.lastResetWeek = currentWeek;
      }
  
      // Reset mensuel
      if (this.lastResetMonth !== currentMonth) {
        console.log(`📅 Reset budget mensuel: $${this.monthlySpent.toFixed(4)} → $0`);
        this.monthlySpent = 0;
        this.lastResetMonth = currentMonth;
      }
    }
  
    // Vérification avant appel API
    canMakeRequest(estimatedCost = 0.001) {
      this.checkAndResetBudgets();
  
      const checks = [
        { 
          name: 'daily', 
          spent: this.dailySpent, 
          limit: this.limits.daily 
        },
        { 
          name: 'weekly', 
          spent: this.weeklySpent, 
          limit: this.limits.weekly 
        },
        { 
          name: 'monthly', 
          spent: this.monthlySpent, 
          limit: this.limits.monthly 
        }
      ];
  
      for (const check of checks) {
        if (check.spent + estimatedCost > check.limit) {
          return {
            allowed: false,
            reason: `${check.name}_budget_exceeded`,
            spent: check.spent,
            limit: check.limit,
            remaining: check.limit - check.spent
          };
        }
      }
  
      return { allowed: true };
    }
  
    // Tracking après appel API réussi
    trackUsage(deviceId, usage, cost) {
      this.checkAndResetBudgets();
      
      // Mise à jour budgets
      this.dailySpent += cost.dollarCost;
      this.weeklySpent += cost.dollarCost;
      this.monthlySpent += cost.dollarCost;
  
      // Log structuré pour monitoring
      const logEntry = {
        timestamp: new Date().toISOString(),
        deviceId: deviceId ? deviceId.substring(0, 8) + '***' : 'unknown',
        tokens: {
          input: cost.breakdown.inputTokens,
          output: cost.breakdown.outputTokens,
          quota: cost.quotaConsumed
        },
        cost: {
          input: cost.breakdown.inputCost,
          output: cost.breakdown.outputCost,
          total: cost.dollarCost
        },
        budgets: {
          daily: { spent: this.dailySpent, limit: this.limits.daily },
          weekly: { spent: this.weeklySpent, limit: this.limits.weekly },
          monthly: { spent: this.monthlySpent, limit: this.limits.monthly }
        }
      };
  
      console.log('💰 Usage tracked:', JSON.stringify(logEntry));
  
      // Vérifier alertes
      this.checkAlerts();
    }
  
    // Système d'alertes
    checkAlerts() {
      const alerts = [];
  
      // Alertes par période
      const periods = [
        { name: 'daily', spent: this.dailySpent, limit: this.limits.daily },
        { name: 'weekly', spent: this.weeklySpent, limit: this.limits.weekly },
        { name: 'monthly', spent: this.monthlySpent, limit: this.limits.monthly }
      ];
  
      periods.forEach(period => {
        const percentage = period.spent / period.limit;
        
        if (percentage >= this.alertThresholds.critical) {
          alerts.push({
            level: 'CRITICAL',
            message: `${period.name} budget at ${(percentage * 100).toFixed(1)}%`,
            spent: period.spent,
            limit: period.limit
          });
        } else if (percentage >= this.alertThresholds.warning) {
          alerts.push({
            level: 'WARNING', 
            message: `${period.name} budget at ${(percentage * 100).toFixed(1)}%`,
            spent: period.spent,
            limit: period.limit
          });
        }
      });
  
      // Log alertes
      if (alerts.length > 0) {
        console.warn('🚨 Budget alerts:', alerts);
        
        // Email/Slack notification ici si nécessaire
        this.sendBudgetAlert(alerts);
      }
    }
  
    // Notification alertes (à implémenter selon besoins)
    sendBudgetAlert(alerts) {
      // TODO: Intégrer avec système notification
      // - Email admin
      // - Slack webhook
      // - Discord webhook
      console.warn('🚨 BUDGET ALERT requires notification implementation');
    }
  
    // Utilitaire numéro de semaine
    getWeekNumber() {
      const date = new Date();
      const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
      const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
      return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }
  
    // Status budget pour debugging/monitoring
    getBudgetStatus() {
      this.checkAndResetBudgets();
      
      return {
        daily: {
          spent: this.dailySpent,
          limit: this.limits.daily,
          remaining: this.limits.daily - this.dailySpent,
          percentage: (this.dailySpent / this.limits.daily * 100).toFixed(1)
        },
        weekly: {
          spent: this.weeklySpent,
          limit: this.limits.weekly,
          remaining: this.limits.weekly - this.weeklySpent,
          percentage: (this.weeklySpent / this.limits.weekly * 100).toFixed(1)
        },
        monthly: {
          spent: this.monthlySpent,
          limit: this.limits.monthly,
          remaining: this.limits.monthly - this.monthlySpent,
          percentage: (this.monthlySpent / this.limits.monthly * 100).toFixed(1)
        }
      };
    }
  }
  
  // Instance singleton
  const budgetProtection = new BudgetProtection();
  
  module.exports = budgetProtection;