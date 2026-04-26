import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './Navigation/header/header.component';
import { SideNavComponent } from './Navigation/side-nav/side-nav.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './Matrial.module';
import { DialysisFormComponent } from './dialysis-form/dialysis-form.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HeartformComponent } from './heartform/heartform.component';
import { AdmissionFilterComponentComponent } from './admission-filter-component/admission-filter-component.component';
import { HttpClientModule } from '@angular/common/http';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { PersianDateAdapter } from './persian-date.adapter';
import { PERSIAN_DATE_FORMATS } from './persian-date-formats';
import { DialysisPrintComponent } from './dialysis-print/dialysis-print.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SideNavComponent,
    LoginComponent,
    DialysisFormComponent,
    HeartformComponent,
    AdmissionFilterComponentComponent,
    DialysisPrintComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [ 
     { provide: DateAdapter, useClass: PersianDateAdapter },
  { provide: MAT_DATE_FORMATS, useValue: PERSIAN_DATE_FORMATS }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


