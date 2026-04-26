import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DialysisFormComponent } from './dialysis-form/dialysis-form.component';
import { HeartformComponent } from './heartform/heartform.component';
import { AdmissionFilterComponentComponent } from './admission-filter-component/admission-filter-component.component';
import { authGuard } from './auth/auth.guard';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'emr-form',
    component: AdmissionFilterComponentComponent,
    canActivate: [authGuard],
  },
  {
    path: 'emr-form/dialysis',
    component: DialysisFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'emr-form/tee-echo',
    component: HeartformComponent,
    canActivate: [authGuard],
  },
  { path: '**',  redirectTo: 'login', pathMatch: 'full' },
 

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
