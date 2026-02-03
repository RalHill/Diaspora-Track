import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TransactionsService } from '../../services/transactions.service';
import { RatesService } from '../../services/rates.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-add-transaction',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="p-4">
      <!-- Header -->
      <div class="flex items-center mb-6">
        <button (click)="router.navigate(['/dashboard'])" 
                class="mr-4">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 class="text-2xl font-bold">Log Transaction</h1>
      </div>

      @if (error()) {
        <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
          {{ error() }}
        </div>
      }

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
        <!-- Provider -->
        <div>
          <label class="block text-sm font-semibold mb-2">Provider</label>
          <select formControlName="provider" 
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
            <option value="">Select provider</option>
            <option value="Western Union">Western Union</option>
            <option value="Remitly">Remitly</option>
            <option value="MoneyGram">MoneyGram</option>
            <option value="Wise">Wise</option>
            <option value="WorldRemit">WorldRemit</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <!-- Amount Sent -->
        <div>
          <label class="block text-sm font-semibold mb-2">Amount Sent</label>
          <input type="number" step="0.01" formControlName="amount_sent"
                 class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                 placeholder="0.00">
        </div>

        <!-- Currency Sent -->
        <div>
          <label class="block text-sm font-semibold mb-2">Currency Sent</label>
          <select formControlName="currency_sent"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
            <option value="CAD">CAD - Canadian Dollar</option>
            <option value="USD">USD - US Dollar</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="EUR">EUR - Euro</option>
          </select>
        </div>

        <!-- Target Currency -->
        <div>
          <label class="block text-sm font-semibold mb-2">Target Currency</label>
          <select formControlName="target_currency"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
            <option value="NGN">NGN - Nigerian Naira</option>
            <option value="GHS">GHS - Ghanaian Cedi</option>
            <option value="KES">KES - Kenyan Shilling</option>
            <option value="INR">INR - Indian Rupee</option>
            <option value="PHP">PHP - Philippine Peso</option>
          </select>
        </div>

        <!-- Exchange Rate & Get Live Rate Button -->
        <div>
          <div class="flex justify-between items-center mb-2">
            <label class="block text-sm font-semibold">Exchange Rate</label>
            <button type="button" (click)="getLiveRate()"
                    [disabled]="ratesService.loading()"
                    class="text-sm text-primary-600 font-semibold disabled:opacity-50">
              @if (ratesService.loading()) {
                Getting rate...
              } @else {
                Get Live Rate
              }
            </button>
          </div>
          <input type="number" step="0.000001" formControlName="exchange_rate"
                 class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                 placeholder="0.00">
          @if (marketRate()) {
            <p class="text-sm text-gray-600 mt-1">
              Market rate: {{ marketRate() | number:'1.6-6' }}
            </p>
          }
        </div>

        <!-- Fee Amount -->
        <div>
          <label class="block text-sm font-semibold mb-2">Fee Amount</label>
          <input type="number" step="0.01" formControlName="fee_amount"
                 class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                 placeholder="0.00">
        </div>

        <!-- Category -->
        <div>
          <label class="block text-sm font-semibold mb-2">Category</label>
          <select formControlName="category"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
            <option value="Family Support">Family Support</option>
            <option value="Education">Education</option>
            <option value="Medical">Medical</option>
            <option value="Business">Business</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <!-- Recipient Country -->
        <div>
          <label class="block text-sm font-semibold mb-2">Recipient Country</label>
          <input type="text" formControlName="recipient_country"
                 class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                 placeholder="e.g., Nigeria">
        </div>

        <!-- Notes -->
        <div>
          <label class="block text-sm font-semibold mb-2">Notes (Optional)</label>
          <textarea formControlName="notes" rows="3"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Any additional information..."></textarea>
        </div>

        <!-- Submit Button -->
        <button type="submit" 
                [disabled]="form.invalid || loading()"
                class="w-full bg-primary-600 text-white py-4 rounded-xl font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed">
          @if (loading()) {
            Saving...
          } @else {
            Save Transaction
          }
        </button>
      </form>
    </div>
  `
})
export class AddTransactionComponent {
  private fb = inject(FormBuilder);
  router = inject(Router);
  ratesService = inject(RatesService);
  private transactionsService = inject(TransactionsService);
  private authService = inject(AuthService);

  loading = signal(false);
  error = signal<string | null>(null);
  marketRate = signal<number | null>(null);

  form = this.fb.group({
    provider: ['', Validators.required],
    amount_sent: [0, [Validators.required, Validators.min(0.01)]],
    currency_sent: ['CAD', Validators.required],
    target_currency: ['NGN', Validators.required],
    exchange_rate: [0, [Validators.required, Validators.min(0)]],
    fee_amount: [0, [Validators.required, Validators.min(0)]],
    category: ['Family Support', Validators.required],
    recipient_country: ['', Validators.required],
    notes: ['']
  });

  async getLiveRate() {
    const source = this.form.value.currency_sent!;
    const target = this.form.value.target_currency!;

    const rate = await this.ratesService.getRate(source, target);
    
    if (rate) {
      this.marketRate.set(rate);
      this.form.patchValue({ exchange_rate: rate });
    }
  }

  async onSubmit() {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.error.set(null);

    const values = this.form.value;
    const marketRate = this.marketRate() || values.exchange_rate!;
    
    // Calculate rate difference percentage
    const rate_diff_pct = ((values.exchange_rate! - marketRate) / marketRate) * 100;

    const transaction = {
      provider: values.provider!,
      amount_sent: values.amount_sent!,
      currency_sent: values.currency_sent!,
      target_currency: values.target_currency!,
      exchange_rate: values.exchange_rate!,
      market_rate: marketRate,
      fee_amount: values.fee_amount!,
      rate_diff_pct: rate_diff_pct,
      category: values.category!,
      recipient_country: values.recipient_country!,
      notes: values.notes || undefined,
      user_id: this.authService.user()?.id
    };

    const result = await this.transactionsService.createTransaction(transaction);

    if (result.error) {
      this.error.set(result.error.message);
      this.loading.set(false);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
}
