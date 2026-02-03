import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-6">Profile</h1>
      
      <div class="space-y-4">
        <div class="bg-white rounded-xl p-6">
          <h3 class="font-semibold mb-2">Email</h3>
          <p class="text-gray-600">{{ authService.user()?.email }}</p>
        </div>

        <div class="bg-white rounded-xl p-6">
          <h3 class="font-semibold mb-2">Preferred Currency</h3>
          <p class="text-gray-600">CAD - Canadian Dollar</p>
        </div>

        <button (click)="authService.signOut()"
                class="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700">
          Sign Out
        </button>
      </div>
    </div>
  `
})
export class ProfileComponent {
  constructor(public authService: AuthService) {}
}
