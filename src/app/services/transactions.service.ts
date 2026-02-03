import { Injectable, signal, computed } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { DemoService } from './demo.service';

export interface Transaction {
  id?: string;
  user_id?: string;
  provider: string;
  amount_sent: number;
  currency_sent: string;
  target_currency: string;
  exchange_rate: number;
  market_rate: number;
  fee_amount: number;
  rate_diff_pct: number;
  category: string;
  recipient_country: string;
  notes?: string;
  provider_reference?: string;
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  transactions = signal<Transaction[]>([]);
  loading = signal(false);

  totalSent = computed(() => 
    this.transactions().reduce((sum, t) => sum + t.amount_sent, 0)
  );

  totalFees = computed(() =>
    this.transactions().reduce((sum, t) => sum + t.fee_amount, 0)
  );

  constructor(
    private supabase: SupabaseService,
    private demoService: DemoService
  ) {}

  async loadTransactions() {
    this.loading.set(true);
    
    // Use demo data if in demo mode
    if (this.demoService.isDemoMode()) {
      const demoUser = this.demoService.getCurrentDemoUser();
      if (demoUser) {
        const demoTxs = this.demoService.getTransactionsForUser(demoUser.id);
        this.transactions.set(demoTxs);
      }
      this.loading.set(false);
      return { data: this.transactions(), error: null };
    }

    const { data, error } = await this.supabase.client
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (!error && data) {
      this.transactions.set(data);
    }
    this.loading.set(false);
    return { data, error };
  }

  async createTransaction(transaction: Transaction) {
    // Use demo mode if active
    if (this.demoService.isDemoMode()) {
      const newTx = this.demoService.addTransaction(transaction);
      this.transactions.update(txs => [newTx, ...txs]);
      return { data: newTx, error: null };
    }

    const { data, error } = await this.supabase.client
      .from('transactions')
      .insert([transaction])
      .select()
      .single();
    
    if (!error && data) {
      this.transactions.update(txs => [data, ...txs]);
    }
    return { data, error };
  }
}
