import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TransactionsService } from '../../services/transactions.service';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <!-- Mobile Header -->
      <div class="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#1e3a8a] dark:bg-gray-800 text-white px-4 py-3 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 5h2v2H9V5zm0 4h2v6H9V9z"/>
            </svg>
          </div>
          <h1 class="text-lg font-bold">DiaspoTrack</h1>
        </div>
        <button (click)="toggleMobileMenu()" class="p-2 hover:bg-blue-800 rounded-lg">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            @if (mobileMenuOpen()) {
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            } @else {
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            }
          </svg>
        </button>
      </div>

      <!-- Mobile Menu Overlay -->
      @if (mobileMenuOpen()) {
        <div class="lg:hidden fixed inset-0 z-40 bg-black/50" (click)="toggleMobileMenu()"></div>
      }

      <!-- Sidebar -->
      <aside [class]="'fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#1e3a8a] dark:bg-gray-800 text-white flex flex-col transform transition-transform duration-300 lg:transform-none ' + (mobileMenuOpen() ? 'translate-x-0' : '-translate-x-full lg:translate-x-0')">
        <div class="p-6 flex items-center space-x-3">
          <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 5h2v2H9V5zm0 4h2v6H9V9z"/>
            </svg>
          </div>
          <h1 class="text-xl font-bold">DiaspoTrack</h1>
        </div>

        <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <a routerLink="/dashboard" (click)="closeMobileMenu()" class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition opacity-70">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            <span class="font-medium">Dashboard</span>
          </a>
          <a routerLink="/expenses" (click)="closeMobileMenu()" class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition opacity-70">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="font-medium">Expenses</span>
          </a>
          <a routerLink="/add-transaction" (click)="closeMobileMenu()" class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition opacity-70">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
            <span class="font-medium">Remittances</span>
          </a>
          <a routerLink="/reports" routerLinkActive="bg-orange-500" (click)="closeMobileMenu()" class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            <span class="font-medium">Reports</span>
          </a>
          <a routerLink="/alerts" (click)="closeMobileMenu()" class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition opacity-70">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            <span class="font-medium">Alerts</span>
          </a>
          <a routerLink="/settings" (click)="closeMobileMenu()" class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition opacity-70">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span class="font-medium">Settings</span>
          </a>
        </nav>

        <div class="p-4 border-t border-blue-700">
          <div class="flex items-center space-x-3 mb-3">
            <div class="w-10 h-10 bg-gray-300 rounded-full"></div>
            <div class="flex-1 min-w-0">
              <p class="font-medium text-sm truncate">{{ authService.user()?.email?.split('@')[0] || 'User' }}</p>
              <p class="text-xs text-blue-300 truncate">{{ authService.user()?.email }}</p>
            </div>
          </div>
          <button (click)="authService.signOut()" 
                  class="flex items-center space-x-2 text-sm text-blue-200 hover:text-white">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 overflow-auto lg:ml-0 pt-14 lg:pt-0">
        <!-- Header -->
        <header class="bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-4 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 class="text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">Reports</h2>
          </div>
          <div class="flex items-center justify-between sm:justify-end space-x-2 lg:space-x-4">
            <button class="px-3 lg:px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold flex items-center space-x-2 text-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              <span class="hidden sm:inline">Export Report</span>
              <span class="sm:hidden">Export</span>
            </button>
            <span class="hidden md:inline text-sm text-gray-600 dark:text-gray-400">Welcome, <strong>{{ authService.user()?.email?.split('@')[0] || 'User' }}</strong></span>
          </div>
        </header>

        <!-- Reports Content -->
        <div class="p-4 lg:p-8">
          <!-- Summary Cards -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 lg:p-6">
              <div class="flex items-center justify-between mb-2">
                <p class="text-xs lg:text-sm text-gray-600 dark:text-gray-400">Total Remitted</p>
                <svg class="w-4 h-4 lg:w-5 lg:h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                </svg>
              </div>
              <p class="text-xl lg:text-3xl font-bold text-gray-900 dark:text-white">\${{ totalRemitted() | number:'1.0-0' }}</p>
              <p class="text-xs lg:text-sm text-green-600 mt-1">+12.5% YoY</p>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 lg:p-6">
              <div class="flex items-center justify-between mb-2">
                <p class="text-xs lg:text-sm text-gray-600 dark:text-gray-400">Total Fees</p>
                <svg class="w-4 h-4 lg:w-5 lg:h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <p class="text-xl lg:text-3xl font-bold text-gray-900 dark:text-white">\${{ totalFees() | number:'1.2-2' }}</p>
              <p class="text-xs lg:text-sm text-red-600 mt-1">{{ feePercentage() }}%</p>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 lg:p-6">
              <div class="flex items-center justify-between mb-2">
                <p class="text-xs lg:text-sm text-gray-600 dark:text-gray-400">Transactions</p>
                <svg class="w-4 h-4 lg:w-5 lg:h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
              <p class="text-xl lg:text-3xl font-bold text-gray-900 dark:text-white">{{ transactionCount() }}</p>
              <p class="text-xs lg:text-sm text-gray-600 mt-1">This year</p>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 lg:p-6">
              <div class="flex items-center justify-between mb-2">
                <p class="text-xs lg:text-sm text-gray-600 dark:text-gray-400">Rate Loss</p>
                <svg class="w-4 h-4 lg:w-5 lg:h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <p class="text-xl lg:text-3xl font-bold text-gray-900 dark:text-white">{{ avgRateLoss() | number:'1.2-2' }}%</p>
              <p class="text-xs lg:text-sm text-gray-600 mt-1">vs market</p>
            </div>
          </div>

          <!-- Monthly Breakdown -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 lg:p-6">
              <h3 class="text-base lg:text-lg font-semibold mb-4 dark:text-white">Monthly Remittance Summary</h3>
              <div class="space-y-3">
                @for (month of monthlyData; track month.month) {
                  <div class="flex items-center justify-between py-2 border-b dark:border-gray-700 last:border-0">
                    <div>
                      <p class="font-medium text-sm lg:text-base text-gray-800 dark:text-white">{{ month.month }}</p>
                      <p class="text-xs lg:text-sm text-gray-500 dark:text-gray-400">{{ month.transactions }} transactions</p>
                    </div>
                    <div class="text-right">
                      <p class="font-semibold text-sm lg:text-base text-gray-900 dark:text-white">\${{ month.amount | number:'1.2-2' }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">Fee: \${{ month.fees | number:'1.2-2' }}</p>
                    </div>
                  </div>
                }
              </div>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 lg:p-6">
              <h3 class="text-base lg:text-lg font-semibold mb-4 dark:text-white">Category Breakdown</h3>
              <div class="space-y-3">
                @for (cat of categoryBreakdown; track cat.name) {
                  <div>
                    <div class="flex items-center justify-between mb-1">
                      <div class="flex items-center space-x-2">
                        <span class="text-base lg:text-lg">{{ cat.icon }}</span>
                        <span class="text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300">{{ cat.name }}</span>
                      </div>
                      <span class="text-xs lg:text-sm font-semibold text-gray-900 dark:text-white">\${{ cat.amount | number:'1.2-2' }}</span>
                    </div>
                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div class="h-2 rounded-full" [style.width.%]="cat.percentage" [style.background-color]="cat.color"></div>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>

          <!-- Provider Comparison -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 lg:p-6">
            <h3 class="text-base lg:text-lg font-semibold mb-4 dark:text-white">Provider Performance</h3>
            <div class="overflow-x-auto -mx-4 lg:mx-0">
              <table class="w-full min-w-[600px]">
                <thead class="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                  <tr>
                    <th class="px-3 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Provider</th>
                    <th class="px-3 lg:px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Txns</th>
                    <th class="px-3 lg:px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Sent</th>
                    <th class="px-3 lg:px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Fees</th>
                    <th class="px-3 lg:px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Rate Loss</th>
                    <th class="px-3 lg:px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Rating</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                  @for (provider of providerStats; track provider.name) {
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="px-3 lg:px-6 py-3 lg:py-4">
                        <div class="flex items-center">
                          <div class="w-6 h-6 lg:w-8 lg:h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-2 lg:mr-3">
                            <span class="text-xs lg:text-sm font-semibold text-blue-600 dark:text-blue-300">{{ provider.name.charAt(0) }}</span>
                          </div>
                          <span class="font-medium text-sm lg:text-base text-gray-900 dark:text-white">{{ provider.name }}</span>
                        </div>
                      </td>
                      <td class="px-3 lg:px-6 py-3 lg:py-4 text-right text-sm text-gray-900 dark:text-white">{{ provider.transactions }}</td>
                      <td class="px-3 lg:px-6 py-3 lg:py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">\${{ provider.totalSent | number:'1.0-0' }}</td>
                      <td class="px-3 lg:px-6 py-3 lg:py-4 text-right text-sm text-red-600">\${{ provider.totalFees | number:'1.2-2' }}</td>
                      <td class="px-3 lg:px-6 py-3 lg:py-4 text-right text-sm" [class.text-red-600]="provider.avgRateLoss < -1" [class.text-orange-600]="provider.avgRateLoss >= -1">
                        {{ provider.avgRateLoss | number:'1.2-2' }}%
                      </td>
                      <td class="px-3 lg:px-6 py-3 lg:py-4 text-right">
                        <div class="flex items-center justify-end space-x-0.5">
                          @for (star of [1,2,3,4,5]; track star) {
                            <svg class="w-3 h-3 lg:w-4 lg:h-4" [class.text-yellow-400]="star <= provider.rating" [class.text-gray-300]="star > provider.rating" 
                                 fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>
                          }
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ReportsComponent implements OnInit {
  transactionsService = inject(TransactionsService);
  authService = inject(AuthService);
  themeService = inject(ThemeService);

  totalRemitted = this.transactionsService.totalSent;
  totalFees = this.transactionsService.totalFees;
  mobileMenuOpen = signal(false);

  toggleMobileMenu() {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }

  transactionCount() {
    return this.transactionsService.transactions().length;
  }

  feePercentage() {
    const total = this.totalRemitted();
    const fees = this.totalFees();
    return total > 0 ? ((fees / total) * 100).toFixed(2) : 0;
  }

  avgRateLoss() {
    const txs = this.transactionsService.transactions();
    if (txs.length === 0) return 0;
    const sum = txs.reduce((acc, tx) => acc + tx.rate_diff_pct, 0);
    return sum / txs.length;
  }

  monthlyData = [
    { month: 'January 2026', amount: 500, fees: 15.99, transactions: 2 },
    { month: 'February 2026', amount: 800, fees: 29.98, transactions: 3 },
    { month: 'March 2026', amount: 1000, fees: 18.50, transactions: 4 },
    { month: 'April 2026', amount: 600, fees: 21.98, transactions: 2 },
    { month: 'May 2026', amount: 300, fees: 12.99, transactions: 1 },
    { month: 'June 2026', amount: 0, fees: 0, transactions: 0 }
  ];

  categoryBreakdown = [
    { name: 'Family Support', icon: '👨‍👩‍👧', amount: 2000, percentage: 62, color: '#f97316' },
    { name: 'Education', icon: '📚', amount: 800, percentage: 25, color: '#eab308' },
    { name: 'Medical', icon: '🏥', amount: 300, percentage: 9, color: '#ef4444' },
    { name: 'Business', icon: '💼', amount: 100, percentage: 3, color: '#8b5cf6' }
  ];

  providerStats = [
    { name: 'Wise', transactions: 2, totalSent: 1500, totalFees: 17.00, avgRateLoss: -0.24, rating: 5 },
    { name: 'Western Union', transactions: 1, totalSent: 500, totalFees: 15.99, avgRateLoss: -2.59, rating: 3 },
    { name: 'Remitly', transactions: 1, totalSent: 800, totalFees: 9.99, avgRateLoss: -1.62, rating: 4 },
    { name: 'WorldRemit', transactions: 1, totalSent: 600, totalFees: 11.99, avgRateLoss: -2.43, rating: 4 }
  ];

  ngOnInit() {
    this.transactionsService.loadTransactions();
  }
}
