import { Injectable, signal } from '@angular/core';
import { Transaction } from './transactions.service';

export interface DemoUser {
  id: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class DemoService {
  isDemoMode = signal(false);
  
  demoUsers: DemoUser[] = [
    { id: 'demo-user-1', email: 'demo@diasporatrack.com', password: 'demo123' },
    { id: 'demo-user-2', email: 'test@diasporatrack.com', password: 'test123' }
  ];

  mockTransactions: Transaction[] = [
    {
      id: 'tx-1',
      user_id: 'demo-user-1',
      provider: 'Western Union',
      amount_sent: 500,
      currency_sent: 'CAD',
      target_currency: 'NGN',
      exchange_rate: 1150.00,
      market_rate: 1180.50,
      fee_amount: 15.99,
      rate_diff_pct: -2.59,
      category: 'Family Support',
      recipient_country: 'Nigeria',
      notes: 'Monthly support',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'tx-2',
      user_id: 'demo-user-1',
      provider: 'Remitly',
      amount_sent: 800,
      currency_sent: 'CAD',
      target_currency: 'PHP',
      exchange_rate: 42.50,
      market_rate: 43.20,
      fee_amount: 9.99,
      rate_diff_pct: -1.62,
      category: 'Education',
      recipient_country: 'Philippines',
      notes: 'Tuition payment',
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'tx-3',
      user_id: 'demo-user-1',
      provider: 'Wise',
      amount_sent: 1000,
      currency_sent: 'CAD',
      target_currency: 'INR',
      exchange_rate: 62.80,
      market_rate: 62.95,
      fee_amount: 8.50,
      rate_diff_pct: -0.24,
      category: 'Business',
      recipient_country: 'India',
      notes: 'Business investment',
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'tx-4',
      user_id: 'demo-user-1',
      provider: 'MoneyGram',
      amount_sent: 300,
      currency_sent: 'CAD',
      target_currency: 'GHS',
      exchange_rate: 10.20,
      market_rate: 10.55,
      fee_amount: 12.99,
      rate_diff_pct: -3.32,
      category: 'Medical',
      recipient_country: 'Ghana',
      notes: 'Medical emergency',
      created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'tx-5',
      user_id: 'demo-user-1',
      provider: 'WorldRemit',
      amount_sent: 600,
      currency_sent: 'CAD',
      target_currency: 'KES',
      exchange_rate: 112.50,
      market_rate: 115.30,
      fee_amount: 11.99,
      rate_diff_pct: -2.43,
      category: 'Family Support',
      recipient_country: 'Kenya',
      notes: 'Family celebration',
      created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  enableDemoMode() {
    this.isDemoMode.set(true);
    localStorage.setItem('demo_mode', 'true');
  }

  disableDemoMode() {
    this.isDemoMode.set(false);
    localStorage.removeItem('demo_mode');
    localStorage.removeItem('demo_user');
  }

  checkDemoMode() {
    const isDemo = localStorage.getItem('demo_mode') === 'true';
    this.isDemoMode.set(isDemo);
    return isDemo;
  }

  getDemoUser(email: string, password: string): DemoUser | null {
    return this.demoUsers.find(u => u.email === email && u.password === password) || null;
  }

  setDemoUser(user: DemoUser) {
    localStorage.setItem('demo_user', JSON.stringify(user));
  }

  getCurrentDemoUser(): DemoUser | null {
    const userStr = localStorage.getItem('demo_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getTransactionsForUser(userId: string): Transaction[] {
    return this.mockTransactions.filter(tx => tx.user_id === userId);
  }

  addTransaction(transaction: Transaction): Transaction {
    const newTx = {
      ...transaction,
      id: `tx-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    this.mockTransactions.unshift(newTx);
    return newTx;
  }
}
