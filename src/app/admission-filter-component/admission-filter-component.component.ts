import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PatientsStoreService } from '../services/patients-store.service';
import { SelectedFormService } from '../services/selected-form.service';

@Component({
  selector: 'app-admission-filter-component',
  templateUrl: './admission-filter-component.component.html',
  styleUrls: ['./admission-filter-component.component.css'],
})
export class AdmissionFilterComponentComponent {
  admCodeCtrl = new FormControl('');



  constructor(
    private router: Router,
    private patientsStore: PatientsStoreService,
    private selectedFormService: SelectedFormService,
    private snackBar: MatSnackBar,
  ) {}
  
  onSubmitAdmCode() {
    const admCode = this.admCodeCtrl.value?.toString().trim();
    const form = this.selectedFormService.getForm();

    if (!admCode) {
      this.snackBar.open(' کد پذیرش  مورد نظر را وارد  کنید', '', {
        duration: 3000, // ۳ ثانیه
        panelClass: ['snackbar-warning'],
        horizontalPosition: 'end',
      });
      return;
    }

    if (!form) {
      this.snackBar.open('لطفا ابتدا فرم مورد نظر را انتخاب نمائید', '', {
        duration: 3000, // ۳ ثانیه
        panelClass: ['snackbar-warning'],
        horizontalPosition: 'end',
      });
      return;
    }

    const found = this.patientsStore.getAdmissionByAdmCode(admCode);

    if (!found) {
      this.snackBar.open('بیمار مورد نظر در سیستم وجود ندارد', '', {
        duration: 3000, // ۳ ثانیه
        panelClass: ['snackbar-error'],
        horizontalPosition: 'end',
      });
      return;
    }

    this.router.navigate(['/emr-form', form.name], {
      queryParams: {
        id: admCode,
        admCode: admCode,
        loadByAdmCode: true,
        formCode: form.code,
      },
    });
  }

  



  







}
