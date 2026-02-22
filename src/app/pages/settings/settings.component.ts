import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
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
      <aside [ngClass]="{
        'fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#1e3a8a] dark:bg-gray-800 text-white flex flex-col': true,
        'transform transition-transform duration-300 lg:transform-none': true,
        'translate-x-0': mobileMenuOpen(),
        '-translate-x-full lg:translate-x-0': !mobileMenuOpen()
      }">
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
          <a routerLink="/reports" (click)="closeMobileMenu()" class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition opacity-70">
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
          <a routerLink="/settings" routerLinkActive="bg-orange-500" (click)="closeMobileMenu()" class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition">
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
        <header class="bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-4 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h2 class="text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">Settings</h2>
          </div>
          <div class="flex items-center space-x-2 lg:space-x-4">
            <button class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" (click)="toggleDarkMode()">
              <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
              </svg>
            </button>
            <span class="hidden sm:inline text-sm text-gray-600 dark:text-gray-300">Welcome, <strong>{{ authService.user()?.email?.split('@')[0] || 'User' }}</strong></span>
          </div>
        </header>

        <!-- Settings Content -->
        <div class="p-4 lg:p-8">
          <div class="max-w-4xl mx-auto space-y-4 lg:space-y-6">
            <!-- Profile Settings -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 lg:p-6">
              <h3 class="text-base lg:text-lg font-semibold mb-4 flex items-center dark:text-white">
                <span class="text-orange-500 mr-2">👤</span>
                Profile Information
              </h3>
              <form [formGroup]="profileForm" class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">First Name</label>
                    <input type="text" formControlName="firstName" 
                           class="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  </div>
                  <div>
                    <label class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Last Name</label>
                    <input type="text" formControlName="lastName" 
                           class="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  </div>
                </div>
                <div>
                  <label class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Email</label>
                  <input type="email" formControlName="email" 
                         class="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white" 
                         readonly>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <label class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Phone Number</label>
                  <input type="tel" formControlName="phone" 
                         class="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                </div>
                <button type="button" (click)="saveProfile()"
                        class="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold">
                  Save Changes
                </button>
              </form>
            </div>

            <!-- Currency Preferences -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 lg:p-6">
              <h3 class="text-base lg:text-lg font-semibold mb-4 flex items-center dark:text-white">
                <span class="text-orange-500 mr-2">💱</span>
                Currency Preferences
              </h3>
              <form [formGroup]="currencyForm" class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Base Currency</label>
                    <select formControlName="baseCurrency" 
                            class="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      <option value="USD">USD - US Dollar</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="EUR">EUR - Euro</option>
                    </select>
                  </div>
                  <div>
                    <label class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Home Currency</label>
                    <select formControlName="homeCurrency" 
                            class="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      <option value="NGN">NGN - Nigerian Naira</option>
                      <option value="GHS">GHS - Ghanaian Cedi</option>
                      <option value="KES">KES - Kenyan Shilling</option>
                      <option value="INR">INR - Indian Rupee</option>
                      <option value="PHP">PHP - Philippine Peso</option>
                    </select>
                  </div>
                </div>
                <button type="button" (click)="saveCurrency()"
                        class="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold">
                  Update Preferences
                </button>
              </form>
            </div>

            <!-- Notification Settings -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 lg:p-6">
              <h3 class="text-base lg:text-lg font-semibold mb-4 flex items-center dark:text-white">
                <span class="text-orange-500 mr-2">🔔</span>
                Notification Settings
              </h3>
              <div class="space-y-3">
                @for (pref of notificationPreferences; track pref.id) {
                  <label class="flex items-center justify-between py-2 cursor-pointer">
                    <div class="flex-1 mr-4">
                      <p class="font-medium text-sm lg:text-base text-gray-800 dark:text-white">{{ pref.label }}</p>
                      <p class="text-xs lg:text-sm text-gray-500 dark:text-gray-400">{{ pref.description }}</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer flex-shrink-0">
                      <input type="checkbox" [checked]="pref.enabled" (change)="toggleNotification(pref.id)" class="sr-only peer">
                      <div class="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </label>
                }
              </div>
            </div>

            <!-- Security Settings -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 lg:p-6">
              <h3 class="text-base lg:text-lg font-semibold mb-4 flex items-center dark:text-white">
                <span class="text-orange-500 mr-2">🔒</span>
                Security
              </h3>
              <div class="space-y-3 lg:space-y-4">
                <div>
                  <button type="button" 
                          class="w-full text-left px-3 lg:px-4 py-3 border dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between">
                    <div>
                      <p class="font-medium text-sm lg:text-base text-gray-800 dark:text-white">Change Password</p>
                      <p class="text-xs lg:text-sm text-gray-500 dark:text-gray-400">Update your account password</p>
                    </div>
                    <svg class="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
                <div>
                  <button type="button"
                          class="w-full text-left px-3 lg:px-4 py-3 border dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between">
                    <div>
                      <p class="font-medium text-sm lg:text-base text-gray-800 dark:text-white">Two-Factor Authentication</p>
                      <p class="text-xs lg:text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security</p>
                    </div>
                    <span class="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-semibold rounded flex-shrink-0">Enabled</span>
                  </button>
                </div>
                <div>
                  <button type="button"
                          class="w-full text-left px-3 lg:px-4 py-3 border dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between">
                    <div>
                      <p class="font-medium text-sm lg:text-base text-gray-800 dark:text-white">Active Sessions</p>
                      <p class="text-xs lg:text-sm text-gray-500 dark:text-gray-400">Manage your active sessions</p>
                    </div>
                    <svg class="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Danger Zone -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 lg:p-6 border-2 border-red-200 dark:border-red-900">
              <h3 class="text-base lg:text-lg font-semibold mb-4 flex items-center text-red-600">
                <span class="mr-2">⚠️</span>
                Danger Zone
              </h3>
              <div class="space-y-3">
                <button type="button"
                        class="w-full text-left px-3 lg:px-4 py-3 border border-red-300 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center justify-between">
                  <div>
                    <p class="font-medium text-sm lg:text-base text-red-600">Export All Data</p>
                    <p class="text-xs lg:text-sm text-gray-500 dark:text-gray-400">Download all your transaction data</p>
                  </div>
                  <svg class="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                  </svg>
                </button>
                <button type="button"
                        class="w-full text-left px-3 lg:px-4 py-3 border border-red-300 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center justify-between">
                  <div>
                    <p class="font-medium text-sm lg:text-base text-red-600">Delete Account</p>
                    <p class="text-xs lg:text-sm text-gray-500 dark:text-gray-400">Permanently delete your account</p>
                  </div>
                  <svg class="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
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
export class SettingsComponent {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  private fb = inject(FormBuilder);

  mobileMenuOpen = signal(false);

  toggleMobileMenu() {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }

  profileForm = this.fb.group({
    firstName: ['John', Validators.required],
    lastName: ['Doe', Validators.required],
    email: [{ value: this.authService.user()?.email || '', disabled: true }],
    phone: ['']
  });

  currencyForm = this.fb.group({
    baseCurrency: ['CAD', Validators.required],
    homeCurrency: ['NGN', Validators.required]
  });

  notificationPreferences = [
    { id: 1, label: 'Email Notifications', description: 'Receive email updates about your account', enabled: true },
    { id: 2, label: 'Push Notifications', description: 'Get push notifications on your device', enabled: true },
    { id: 3, label: 'SMS Notifications', description: 'Receive text messages for important alerts', enabled: false },
    { id: 4, label: 'Marketing Emails', description: 'Receive emails about new features and promotions', enabled: false }
  ];

  saveProfile() {
    if (this.profileForm.valid) {
      alert('Profile updated successfully!');
    }
  }

  saveCurrency() {
    if (this.currencyForm.valid) {
      alert('Currency preferences updated!');
    }
  }

  toggleNotification(id: number) {
    const pref = this.notificationPreferences.find(p => p.id === id);
    if (pref) pref.enabled = !pref.enabled;
  }

  toggleDarkMode() {
    this.themeService.toggle();
  }
}
