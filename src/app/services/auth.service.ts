import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase.service';
import { DemoService } from './demo.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = signal<any>(null);
  loading = signal(true);

  constructor(
    private supabase: SupabaseService,
    private router: Router,
    private demoService: DemoService
  ) {
    this.loadUser();
  }

  async loadUser() {
    // Check for demo mode
    if (this.demoService.checkDemoMode()) {
      const demoUser = this.demoService.getCurrentDemoUser();
      if (demoUser) {
        this.user.set(demoUser);
      }
      this.loading.set(false);
      return;
    }

    const { data: { user } } = await this.supabase.client.auth.getUser();
    this.user.set(user);
    this.loading.set(false);
  }

  async signUp(email: string, password: string) {
    const { data, error } = await this.supabase.client.auth.signUp({
      email,
      password
    });
    if (!error) this.user.set(data.user);
    return { data, error };
  }

  async signIn(email: string, password: string) {
    // Check for demo login
    const demoUser = this.demoService.getDemoUser(email, password);
    if (demoUser) {
      this.demoService.enableDemoMode();
      this.demoService.setDemoUser(demoUser);
      this.user.set(demoUser);
      return { data: { user: demoUser }, error: null };
    }

    const { data, error } = await this.supabase.client.auth.signInWithPassword({
      email,
      password
    });
    if (!error) this.user.set(data.user);
    return { data, error };
  }

  async signOut() {
    if (this.demoService.isDemoMode()) {
      this.demoService.disableDemoMode();
      this.user.set(null);
      this.router.navigate(['/login']);
      return;
    }

    await this.supabase.client.auth.signOut();
    this.user.set(null);
    this.router.navigate(['/login']);
  }
}
