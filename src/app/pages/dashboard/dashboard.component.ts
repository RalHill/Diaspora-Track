import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TransactionsService } from '../../services/transactions.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4 space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold">Dashboard</h1>
        <button (click)="authService.signOut()" 
                class="text-gray-600 text-sm">
          Sign Out
        </button>
      </div>

      <!-- Total Sent Card -->
      <div class="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-6 text-white">
        <p class="text-sm opacity-90">Total Sent (YTD)</p>
        <h2 class="text-4xl font-bold mt-2">
          {{ transactionsService.totalSent() | currency:'CAD':'symbol':'1.2-2' }}
        </h2>
        <div class="mt-4 h-16 opacity-30">
          <!-- Placeholder for mini chart -->
          <svg class="w-full h-full" viewBox="0 0 200 50">
            <polyline fill="none" stroke="white" stroke-width="2" 
                      points="0,40 50,30 100,35 150,20 200,25"/>
          </svg>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="grid grid-cols-2 gap-3">
        <button (click)="router.navigate(['/add-transaction'])"
                class="bg-primary-600 text-white py-4 rounded-xl font-semibold hover:bg-primary-700">
          Log Sent Money
        </button>
        <button (click)="router.navigate(['/calculator'])"
                class="bg-white border-2 border-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-50">
          Rate Calculator
        </button>
      </div>

      <!-- Recent Transactions -->
      <div>
        <h3 class="text-lg font-semibold mb-3">Recent Transactions</h3>
        
        @if (transactionsService.loading()) {
          <div class="space-y-3">
            @for (i of [1,2,3]; track i) {
              <div class="bg-white rounded-xl p-4 animate-pulse">
                <div class="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div class="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            }
          </div>
        } @else if (transactionsService.transactions().length === 0) {
          <div class="bg-white rounded-xl p-8 text-center text-gray-500">
            <svg class="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p>No transactions yet</p>
            <p class="text-sm mt-1">Start tracking your remittances</p>
          </div>
        } @else {
          <div class="space-y-3">
            @for (tx of transactionsService.transactions().slice(0, 5); track tx.id) {
              <div class="bg-white rounded-xl p-4 flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span class="text-primary-600 font-semibold text-sm">
                      {{ tx.provider.charAt(0) }}
                    </span>
                  </div>
                  <div>
                    <p class="font-semibold">{{ tx.provider }}</p>
                    <p class="text-sm text-gray-500">
                      {{ tx.created_at | date:'MMM d' }}
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="font-semibold">
                    {{ tx.amount_sent | currency:tx.currency_sent:'symbol':'1.2-2' }}
                  </p>
                  <p class="text-sm" 
                     [class.text-red-600]="tx.rate_diff_pct < 0"
                     [class.text-green-600]="tx.rate_diff_pct >= 0">
                    {{ tx.rate_diff_pct | number:'1.2-2' }}% loss
                  </p>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  transactionsService = inject(TransactionsService);
  authService = inject(AuthService);
  router = inject(Router);

  ngOnInit() {
    this.transactionsService.loadTransactions();
  }
}

