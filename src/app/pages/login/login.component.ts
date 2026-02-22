import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-primary-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 sm:p-6">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md">
        <h1 class="text-2xl sm:text-3xl font-bold text-center mb-2 text-gray-900 dark:text-white">Diaspora Track</h1>
        <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 text-center mb-6 sm:mb-8">Track your remittance expenses</p>

        <!-- Demo Credentials Info -->
        <div class="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
          <p class="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">🔑 Demo Login Credentials</p>
          <div class="space-y-1 text-sm text-blue-800 dark:text-blue-300">
            <p><strong>Email:</strong> demo&#64;diasporatrack.com</p>
            <p><strong>Password:</strong> demo123</p>
          </div>
          <p class="text-xs text-blue-600 dark:text-blue-400 mt-2">Use these credentials to explore the app with sample data</p>
        </div>

        @if (error()) {
          <div class="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl mb-4">
            {{ error() }}
          </div>
        }

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Email</label>
            <input type="email" formControlName="email"
                   class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-h-[44px]"
                   placeholder="you@example.com">
          </div>

          <div>
            <label class="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Password</label>
            <input type="password" formControlName="password"
                   class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-h-[44px]"
                   placeholder="••••••••">
          </div>

          <button type="submit" 
                  [disabled]="loading() || form.invalid"
                  class="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]">
            @if (loading()) {
              Signing in...
            } @else {
              Sign In
            }
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?
            <button (click)="toggleMode()" class="text-primary-600 dark:text-primary-400 font-semibold ml-1 min-h-[44px] px-2 inline-flex items-center">
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLogin = signal(true);
  loading = signal(false);
  error = signal<string | null>(null);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  toggleMode() {
    this.isLogin.update(v => !v);
    this.error.set(null);
  }

  async onSubmit() {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.error.set(null);

    const { email, password } = this.form.value;

    const result = this.isLogin()
      ? await this.authService.signIn(email!, password!)
      : await this.authService.signUp(email!, password!);

    if (result.error) {
      this.error.set(result.error.message);
      this.loading.set(false);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
}
