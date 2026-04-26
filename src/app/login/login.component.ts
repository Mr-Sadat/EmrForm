import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/Auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
 username = '';
  password = '';
  error = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  login() {
    const success = this.auth.login(this.username, this.password);
    if (success) {
      this.router.navigate(['/emr-form']);
    } else {
      this.error = 'نام کاربری یا رمز عبور نادرست است.';
    }
  }













  selectedDate: Date | null = null;
DrName?: string;
 DrNames = [
  { value: '1', label: 'علی احمدی' },
  { value: '2', label: 'محمد رضایی' },
  { value: '3', label: 'حسین کریمی' },
  { value: '4', label: 'مهدی موسوی' },
  { value: '5', label: 'رضا جعفری' },
  { value: '6', label: 'امیر حسینی' },
  { value: '7', label: 'سجاد مرادی' },
  { value: '8', label: 'میلاد قربانی' },
  { value: '9', label: 'یاسر اکبری' },
  { value: '10', label: 'پیمان شریفی' },
  { value: '11', label: 'وحید عباسی' },
  { value: '12', label: 'محسن نادری' },
  { value: '13', label: 'نیما کاظمی' },
  { value: '14', label: 'مجتبی قاسمی' },
  { value: '15', label: 'فرهاد صالحی' },
  { value: '16', label: 'بهزاد رستمی' },
  { value: '17', label: 'رامین تقوی' },
  { value: '18', label: 'اشکان فراهانی' },
  { value: '19', label: 'کیوان زمانی' },
  { value: '20', label: 'سامان یوسفی' },
];

}
