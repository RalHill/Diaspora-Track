import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = signal<any>(null);
  loading = signal(true);

  constructor(
    private supabase: SupabaseService,
    private router: Router
  ) {
    this.loadUser();
  }

  async loadUser() {
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
    const { data, error } = await this.supabase.client.auth.signInWithPassword({
      email,
      password
    });
    if (!error) this.user.set(data.user);
    return { data, error };
  }

  async signOut() {
    await this.supabase.client.auth.signOut();
    this.user.set(null);
    this.router.navigate(['/login']);
  }
}
