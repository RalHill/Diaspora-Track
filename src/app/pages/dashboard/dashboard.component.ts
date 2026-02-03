import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TransactionsService } from '../../services/transactions.service';
import { AuthService } from '../../services/auth.service';
import { RatesService } from '../../services/rates.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <!-- Sidebar -->
      <aside class="w-64 bg-[#1e3a8a] dark:bg-gray-800 text-white flex flex-col">
        <div class="p-6 flex items-center space-x-3">
          <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 5h2v2H9V5zm0 4h2v6H9V9z"/>
            </svg>
          </div>
          <h1 class="text-xl font-bold">DiaspoTrack</h1>
        </div>

        <nav class="flex-1 px-3 py-4 space-y-1">
          <a routerLink="/dashboard" routerLinkActive="bg-orange-500" 
             class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            <span class="font-medium">Dashboard</span>
          </a>
          <a routerLink="/expenses" class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition opacity-70">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="font-medium">Expenses</span>
          </a>
          <a routerLink="/add-transaction" class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition opacity-70">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
            <span class="font-medium">Remittances</span>
          </a>
          <a routerLink="/reports" class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition opacity-70">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            <span class="font-medium">Reports</span>
          </a>
          <a routerLink="/alerts" class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition opacity-70">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            <span class="font-medium">Alerts</span>
          </a>
          <a routerLink="/settings" class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition opacity-70">
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
            <div class="flex-1">
              <p class="font-medium text-sm">{{ authService.user()?.email?.split('@')[0] || 'User' }}</p>
              <p class="text-xs text-blue-300">{{ authService.user()?.email }}</p>
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
      <main class="flex-1 overflow-auto">
        <!-- Header -->
        <header class="bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-8 py-4 flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h2>
          </div>
          <div class="flex items-center space-x-4">
            <button (click)="themeService.toggle()" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              @if (themeService.isDarkMode()) {
                <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
              } @else {
                <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                </svg>
              }
            </button>
            <span class="text-sm text-gray-600 dark:text-gray-300">Welcome, <strong>{{ authService.user()?.email?.split('@')[0] || 'User' }}</strong></span>
          </div>
        </header>

        <!-- Dashboard Content -->
        <div class="p-8">
          <div class="mb-6">
            <h3 class="text-xl font-bold text-gray-800 dark:text-white">Your Financial Dashboard</h3>
            <p class="text-gray-600 dark:text-gray-400">Track and manage your finances across Nigeria and United States</p>
          </div>

          <!-- Top Row -->
          <div class="grid grid-cols-3 gap-6 mb-6">
            <!-- Currency Converter -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h4 class="text-lg font-semibold mb-4 flex items-center dark:text-white">
                <span class="text-orange-500 mr-2">💱</span>
                Currency Converter
              </h4>
              <form [formGroup]="converterForm" class="space-y-4">
                <div>
                  <label class="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Amount</label>
                  <input type="number" formControlName="amount"
                         class="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <div>
                    <label class="text-sm text-gray-600 dark:text-gray-400 mb-1 block">From</label>
                    <select formControlName="fromCurrency"
                            class="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      <option value="USD">🇺🇸 USD</option>
                      <option value="CAD">🇨🇦 CAD</option>
                      <option value="GBP">🇬🇧 GBP</option>
                      <option value="EUR">🇪🇺 EUR</option>
                    </select>
                  </div>
                  <div>
                    <label class="text-sm text-gray-600 dark:text-gray-400 mb-1 block">To</label>
                    <select formControlName="toCurrency"
                            class="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      <option value="NGN">🇳🇬 NGN</option>
                      <option value="GHS">🇬🇭 GHS</option>
                      <option value="KES">🇰🇪 KES</option>
                      <option value="INR">🇮🇳 INR</option>
                      <option value="PHP">🇵🇭 PHP</option>
                    </select>
                  </div>
                </div>
                <button type="button" (click)="convert()" 
                        class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                  ⇅ Convert
                </button>
                @if (conversionResult()) {
                  <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mt-4">
                    <p class="text-2xl font-bold text-gray-800 dark:text-white">{{ conversionResult()?.result | number:'1.2-2' }} {{ converterForm.value.toCurrency }}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">1 {{ converterForm.value.fromCurrency }} = {{ conversionResult()?.rate | number:'1.2-2' }} {{ converterForm.value.toCurrency }}</p>
                  </div>
                }
              </form>
            </div>

            <!-- Expense Summary -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h4 class="text-lg font-semibold mb-4 flex items-center dark:text-white">
                <span class="text-orange-500 mr-2">💰</span>
                Expense Summary
              </h4>
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <span class="text-gray-600 dark:text-gray-400">Total Expenses</span>
                  <span class="text-2xl font-bold dark:text-white">\${{ totalExpenses() | number:'1.2-2' }}</span>
                </div>
                <div class="space-y-3">
                  <div>
                    <div class="flex justify-between items-center mb-2">
                      <div class="flex items-center space-x-2">
                        <span class="px-3 py-1 bg-blue-900 text-white text-xs rounded-full">United States</span>
                      </div>
                      <span class="font-semibold dark:text-white">\${{ usExpenses() | number:'1.2-2' }}</span>
                    </div>
                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div class="bg-blue-900 h-2 rounded-full" [style.width.%]="(usExpenses() / totalExpenses()) * 100"></div>
                    </div>
                  </div>
                  <div>
                    <div class="flex justify-between items-center mb-2">
                      <div class="flex items-center space-x-2">
                        <span class="px-3 py-1 bg-orange-500 text-white text-xs rounded-full">Nigeria</span>
                      </div>
                      <span class="font-semibold dark:text-white">\${{ nigeriaExpenses() | number:'1.2-2' }}</span>
                    </div>
                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div class="bg-orange-500 h-2 rounded-full" [style.width.%]="(nigeriaExpenses() / totalExpenses()) * 100"></div>
                    </div>
                  </div>
                </div>
                <div class="pt-4 border-t dark:border-gray-700">
                  <p class="text-sm text-gray-600 dark:text-gray-400">Nigeria Original</p>
                  <p class="text-xl font-bold dark:text-white">NGN {{ nigeriaOriginal() | number:'1.2-2' }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Exchange Rate: 1 USD = NGN 1,423.50</p>
                </div>
              </div>
            </div>

            <!-- Exchange Rates -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h4 class="text-lg font-semibold mb-4 flex items-center dark:text-white">
                <span class="text-orange-500 mr-2">📈</span>
                Exchange Rates
              </h4>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Base currency: <strong>USD</strong></p>
              <div class="space-y-3">
                <div class="flex items-center justify-between py-2 border-b dark:border-gray-700">
                  <div class="flex items-center space-x-2">
                    <span class="text-sm font-medium dark:text-white">EU</span>
                    <div>
                      <p class="text-sm font-medium dark:text-white">EUR</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">Euro</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="font-semibold dark:text-white">1.0870</p>
                    <p class="text-xs text-red-600">-0.33%</p>
                  </div>
                </div>
                <div class="flex items-center justify-between py-2 border-b dark:border-gray-700">
                  <div class="flex items-center space-x-2">
                    <span class="text-sm font-medium dark:text-white">GB</span>
                    <div>
                      <p class="text-sm font-medium dark:text-white">GBP</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">British Pound</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="font-semibold dark:text-white">1.2658</p>
                    <p class="text-xs text-red-600">-0.34%</p>
                  </div>
                </div>
                <div class="flex items-center justify-between py-2 border-b dark:border-gray-700">
                  <div class="flex items-center space-x-2">
                    <span class="text-sm font-medium dark:text-white">NG</span>
                    <div>
                      <p class="text-sm font-medium dark:text-white">NGN</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">Nigerian Naira</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="font-semibold dark:text-white">0.0007</p>
                    <p class="text-xs text-green-600">+0.0%</p>
                  </div>
                </div>
                <div class="flex items-center justify-between py-2 border-b dark:border-gray-700">
                  <div class="flex items-center space-x-2">
                    <span class="text-sm font-medium dark:text-white">IN</span>
                    <div>
                      <p class="text-sm font-medium dark:text-white">INR</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">Indian Rupee</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="font-semibold dark:text-white">0.0120</p>
                    <p class="text-xs text-red-600">-0.37%</p>
                  </div>
                </div>
                <div class="flex items-center justify-between py-2">
                  <div class="flex items-center space-x-2">
                    <span class="text-sm font-medium dark:text-white">GH</span>
                    <div>
                      <p class="text-sm font-medium dark:text-white">GHS</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">Ghanaian Cedi</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="font-semibold dark:text-white">0.0687</p>
                    <p class="text-xs text-red-600">-0.92%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Middle Row -->
          <div class="grid grid-cols-2 gap-6 mb-6">
            <!-- Expense by Category -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h4 class="text-lg font-semibold mb-6 flex items-center dark:text-white">
                <span class="text-orange-500 mr-2">📊</span>
                Expense by Category
              </h4>
              <div class="flex items-center justify-center">
                <div class="relative w-64 h-64">
                  <svg viewBox="0 0 100 100" class="transform -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#1e3a8a" stroke-width="20" 
                            stroke-dasharray="120 251" stroke-dashoffset="0"/>
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#60a5fa" stroke-width="20" 
                            stroke-dasharray="25 251" stroke-dashoffset="-120"/>
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#93c5fd" stroke-width="20" 
                            stroke-dasharray="35 251" stroke-dashoffset="-145"/>
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#bfdbfe" stroke-width="20" 
                            stroke-dasharray="13 251" stroke-dashoffset="-180"/>
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#f97316" stroke-width="20" 
                            stroke-dasharray="50 251" stroke-dashoffset="-193"/>
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#fb923c" stroke-width="20" 
                            stroke-dasharray="8 251" stroke-dashoffset="-243"/>
                  </svg>
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div class="text-center">
                      <p class="text-sm text-gray-600 dark:text-gray-400">Housing</p>
                      <p class="text-2xl font-bold dark:text-white">48%</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-6 grid grid-cols-2 gap-3 text-sm">
                <div class="flex items-center space-x-2">
                  <div class="w-3 h-3 bg-[#1e3a8a] rounded-sm"></div>
                  <span class="dark:text-gray-300">Housing</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-3 h-3 bg-[#60a5fa] rounded-sm"></div>
                  <span class="dark:text-gray-300">Utilities</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-3 h-3 bg-[#93c5fd] rounded-sm"></div>
                  <span class="dark:text-gray-300">Groceries</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-3 h-3 bg-[#bfdbfe] rounded-sm"></div>
                  <span class="dark:text-gray-300">Transportation</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-3 h-3 bg-[#f97316] rounded-sm"></div>
                  <span class="dark:text-gray-300">Family Support</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-3 h-3 bg-[#fb923c] rounded-sm"></div>
                  <span class="dark:text-gray-300">Entertainment</span>
                </div>
              </div>
            </div>

            <!-- Remittance Comparison -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h4 class="text-lg font-semibold mb-4 flex items-center dark:text-white">
                <span class="text-orange-500 mr-2">✈️</span>
                Remittance Comparison
              </h4>
              <form [formGroup]="remittanceForm" class="mb-4">
                <label class="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Send Amount</label>
                <input type="number" formControlName="sendAmount"
                       (input)="updateRemittanceComparison()"
                       class="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <div class="flex items-center space-x-2 mt-2">
                  <span class="px-3 py-1 bg-blue-900 text-white text-xs rounded-full">USD</span>
                  <span class="text-gray-400">→</span>
                  <span class="px-3 py-1 bg-orange-500 text-white text-xs rounded-full">NGN</span>
                  <span class="ml-auto text-xs text-gray-500 dark:text-gray-400">From United States to Nigeria</span>
                </div>
              </form>
              <div class="space-y-3 max-h-64 overflow-y-auto">
                @if (!showDetailedFees()) {
                  <!-- Simple View -->
                  <div class="grid grid-cols-4 gap-2 text-xs font-semibold text-gray-600 dark:text-gray-400 pb-2 border-b dark:border-gray-700">
                    <div>Provider</div>
                    <div class="text-right">Fee</div>
                    <div class="text-right">Rate</div>
                    <div class="text-right">Recipient Gets</div>
                  </div>
                  @for (provider of remittanceProviders; track provider.name) {
                    <div class="grid grid-cols-4 gap-2 text-sm py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded px-2">
                      <div>
                        <p class="font-medium dark:text-white">{{ provider.name }}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">{{ provider.speed }}</p>
                      </div>
                      <div class="text-right dark:text-gray-300">\${{ provider.fee }}</div>
                      <div class="text-right dark:text-gray-300">{{ provider.rate }}</div>
                      <div class="text-right font-semibold dark:text-white">NGN {{ calculateRecipientAmount(provider) | number:'1.2-2' }}</div>
                    </div>
                  }
                } @else {
                  <!-- Detailed View -->
                  <div class="grid grid-cols-7 gap-2 text-xs font-semibold text-gray-600 dark:text-gray-400 pb-2 border-b dark:border-gray-700">
                    <div>Provider</div>
                    <div class="text-right">Total Fees</div>
                    <div class="text-right">Markup %</div>
                    <div class="text-right">Speed</div>
                    <div class="text-right">Rating</div>
                    <div class="text-right">Savings</div>
                    <div class="text-right">You Get</div>
                  </div>
                  @for (provider of remittanceProviders; track provider.name) {
                    <div [ngClass]="{'bg-green-50 dark:bg-green-900': provider.name === getBestProvider().name}"
                         class="grid grid-cols-7 gap-2 text-sm py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded px-2">
                      <div>
                        <p class="font-medium dark:text-white flex items-center">
                          {{ provider.name }}
                          @if (provider.name === getBestProvider().name) {
                            <span class="ml-1 text-green-600 text-xs">⭐ Best</span>
                          }
                        </p>
                      </div>
                      <div class="text-right dark:text-gray-300">
                        <p class="font-medium">\${{ calculateTotalFees(provider) | number:'1.2-2' }}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">\${{ provider.fee }} + \${{ provider.hiddenFees }}</p>
                      </div>
                      <div class="text-right">
                        <span class="text-red-600 font-medium">{{ calculateMarkup(provider) | number:'1.2-2' }}%</span>
                      </div>
                      <div class="text-right text-xs dark:text-gray-300">{{ provider.speed }}</div>
                      <div class="text-right">
                        <span class="text-yellow-500">★</span>
                        <span class="dark:text-gray-300">{{ provider.rating }}</span>
                      </div>
                      <div class="text-right">
                        @if (calculateSavings(provider) > 0) {
                          <span class="text-green-600 font-medium">+NGN {{ calculateSavings(provider) | number:'1.2-2' }}</span>
                        } @else if (calculateSavings(provider) < 0) {
                          <span class="text-red-600 font-medium">NGN {{ calculateSavings(provider) | number:'1.2-2' }}</span>
                        } @else {
                          <span class="text-gray-500 dark:text-gray-400">—</span>
                        }
                      </div>
                      <div class="text-right font-semibold dark:text-white">NGN {{ calculateRecipientAmount(provider) | number:'1.2-2' }}</div>
                    </div>
                  }
                }
              </div>
              <button (click)="toggleDetailedFees()" class="w-full mt-4 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 font-semibold flex items-center justify-center space-x-2">
                @if (!showDetailedFees()) {
                  <span>Compare Detailed Fees</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                } @else {
                  <span>Show Simple View</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
                  </svg>
                }
              </button>
            </div>
          </div>

          <!-- Bottom Row -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h4 class="text-lg font-semibold mb-6 flex items-center dark:text-white">
              <span class="text-orange-500 mr-2">📅</span>
              Monthly Expenses
            </h4>
            <div class="h-64">
              <svg viewBox="0 0 800 250" class="w-full h-full">
                <!-- Grid lines -->
                <line x1="100" y1="200" x2="750" y2="200" stroke="#e5e7eb" stroke-width="1"/>
                <line x1="100" y1="150" x2="750" y2="150" stroke="#e5e7eb" stroke-width="1"/>
                <line x1="100" y1="100" x2="750" y2="100" stroke="#e5e7eb" stroke-width="1"/>
                <line x1="100" y1="50" x2="750" y2="50" stroke="#e5e7eb" stroke-width="1"/>
                
                <!-- Y-axis labels -->
                <text x="80" y="205" class="text-xs" fill="#6b7280">0</text>
                <text x="60" y="155" class="text-xs" fill="#6b7280">600</text>
                <text x="50" y="105" class="text-xs" fill="#6b7280">1200</text>
                <text x="50" y="55" class="text-xs" fill="#6b7280">1800</text>
                <text x="50" y="30" class="text-xs" fill="#6b7280">2400</text>
                
                <!-- Bars -->
                @for (month of monthlyData; track month.name; let i = $index) {
                  <g [attr.transform]="'translate(' + (120 + i * 110) + ', 0)'">
                    <!-- Host Country (Blue) -->
                    <rect x="0" [attr.y]="200 - (month.host / 12)" width="35" [attr.height]="month.host / 12" fill="#1e3a8a"/>
                    <!-- Home Country (Orange) -->
                    <rect x="40" [attr.y]="200 - (month.home / 12)" width="35" [attr.height]="month.home / 12" fill="#f97316"/>
                    <!-- Month label -->
                    <text x="20" y="220" class="text-xs" fill="#6b7280">{{ month.name }}</text>
                  </g>
                }
              </svg>
            </div>
            <div class="flex items-center justify-center space-x-6 mt-4">
              <div class="flex items-center space-x-2">
                <div class="w-4 h-4 bg-[#1e3a8a] rounded-sm"></div>
                <span class="text-sm dark:text-gray-300">Host Country</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-4 h-4 bg-[#f97316] rounded-sm"></div>
                <span class="text-sm dark:text-gray-300">Home Country</span>
              </div>
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
export class DashboardComponent implements OnInit {
  transactionsService = inject(TransactionsService);
  authService = inject(AuthService);
  router = inject(Router);
  ratesService = inject(RatesService);
  themeService = inject(ThemeService);
  private fb = inject(FormBuilder);

  conversionResult = signal<{ result: number; rate: number } | null>(null);
  showDetailedFees = signal(false);

  converterForm = this.fb.group({
    amount: [100, [Validators.required, Validators.min(0)]],
    fromCurrency: ['USD', Validators.required],
    toCurrency: ['NGN', Validators.required]
  });

  remittanceForm = this.fb.group({
    sendAmount: [500, [Validators.required, Validators.min(0)]]
  });

  remittanceProviders = [
    { name: 'Wise', speed: '1-2 days', fee: 3.50, rate: 1419.25, hiddenFees: 0, rating: 4.8 },
    { name: 'Western Union', speed: 'Same day', fee: 5.00, rate: 1388.75, hiddenFees: 2.50, rating: 4.2 },
    { name: 'Remitly', speed: '3-5 days', fee: 3.99, rate: 1412.30, hiddenFees: 1.00, rating: 4.5 },
    { name: 'WorldRemit', speed: '1-3 days', fee: 4.99, rate: 1410.15, hiddenFees: 1.50, rating: 4.4 }
  ];

  marketRate = 1423.50; // Current market rate USD to NGN

  monthlyData = [
    { name: 'Jan', host: 2100, home: 350 },
    { name: 'Feb', host: 2200, home: 300 },
    { name: 'Mar', host: 2050, home: 450 },
    { name: 'Apr', host: 2300, home: 400 },
    { name: 'May', host: 1900, home: 350 },
    { name: 'Jun', host: 2400, home: 300 }
  ];

  totalExpenses = signal(1660.50);
  usExpenses = signal(1605.00);
  nigeriaExpenses = signal(55.50);
  nigeriaOriginal = signal(79000.00);

  ngOnInit() {
    this.transactionsService.loadTransactions();
  }

  async convert() {
    if (this.converterForm.invalid) return;

    const { amount, fromCurrency, toCurrency } = this.converterForm.value;
    const rate = await this.ratesService.getRate(fromCurrency!, toCurrency!);
    
    if (rate) {
      this.conversionResult.set({
        result: amount! * rate,
        rate: rate
      });
    }
  }

  calculateRecipientAmount(provider: any): number {
    const sendAmount = this.remittanceForm.value.sendAmount || 500;
    return (sendAmount - provider.fee) * provider.rate;
  }

  calculateMarkup(provider: any): number {
    return ((this.marketRate - provider.rate) / this.marketRate) * 100;
  }

  calculateTotalFees(provider: any): number {
    return provider.fee + provider.hiddenFees;
  }

  calculateSavings(provider: any): number {
    const worstProvider = this.remittanceProviders.reduce((worst, current) => {
      const worstAmount = this.calculateRecipientAmount(worst);
      const currentAmount = this.calculateRecipientAmount(current);
      return currentAmount < worstAmount ? current : worst;
    });
    
    const bestAmount = this.calculateRecipientAmount(provider);
    const worstAmount = this.calculateRecipientAmount(worstProvider);
    return bestAmount - worstAmount;
  }

  getBestProvider(): any {
    return this.remittanceProviders.reduce((best, current) => {
      const bestAmount = this.calculateRecipientAmount(best);
      const currentAmount = this.calculateRecipientAmount(current);
      return currentAmount > bestAmount ? current : best;
    });
  }

  toggleDetailedFees() {
    this.showDetailedFees.update(v => !v);
  }

  updateRemittanceComparison() {
    // This triggers the view to recalculate
  }
}
