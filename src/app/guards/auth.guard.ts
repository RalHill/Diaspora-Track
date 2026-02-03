import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DemoService } from '../services/demo.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const demoService = inject(DemoService);
  const router = inject(Router);

  // Allow access if user is logged in (real or demo)
  if (authService.user() || demoService.isDemoMode()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
