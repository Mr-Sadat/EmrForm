// src/app/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
private readonly USERS_KEY = 'demo_users';
  private readonly CURRENT_USER_KEY = 'demo_current_user';

  constructor() {
    this.initDefaultUsers();
  }

  private initDefaultUsers() {
    if (!localStorage.getItem(this.USERS_KEY)) {
      const users: User[] = [
        { id: 1, username: 'amir', password: '1234' ,name:'نماینده '},
        { id: 2, username: 'sadat', password: '1545' ,name:'احمد-سادات' },
        { id: 3, username: 'admin', password: '2222',name:'مسئول کامپویتر' },
        { id: 4, username: 'hasan', password: '3333',name:'حسن حیدری' },
        { id: 5, username: 'user', password: '4444',name:'کاربر عادی' }
      ];

      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      console.log('✅ Default users created');
    }
  }

  login(username: string, password: string): boolean {
    const users: User[] = JSON.parse(
      localStorage.getItem(this.USERS_KEY) || '[]'
    );

    const user = users.find(
      u => u.username === username && u.password === password
    );

    if (user) {
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
      return true;
    }
    return false;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.CURRENT_USER_KEY);
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem(this.CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  logout() {
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }
}
