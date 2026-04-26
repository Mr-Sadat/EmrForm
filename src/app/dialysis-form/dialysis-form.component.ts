import {
  animate,keyframes,style,transition,trigger,} from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { FormsStoreService } from '../services/forms-store.service';
import { PatientsStoreService } from '../services/patients-store.service';
import { ReferenceDataService } from '../services/reference-data.service';
import { SelectedFormService } from '../services/selected-form.service';
import { Patient } from '../models/patient.interface';
import { firstValueFrom, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Person } from '../models/Person.model';
import { druglist } from '../models/druglist.model';





@Component({
  selector: 'app-dialysis-form',
  templateUrl: './dialysis-form.component.html',
  styleUrls: ['./dialysis-form.component.css'],
  animations: [
    trigger('AddBlock', [
      transition('void=>*', [
        animate(
          '500ms',
          keyframes([
            style({ transform: 'translateY(-100px)', offset: 0, opacity: 0 }),
            style({
              transform: 'translateY(-70px)',
              offset: 0.3,
              opacity: 0.3,
            }),
            style({
              transform: 'translateY(-50px)',
              offset: 0.5,
              opacity: 0.5,
            }),
            style({
              transform: 'translateY(-20px)',
              offset: 0.7,
              opacity: 0.7,
            }),
            style({ transform: 'translateY(0)', offset: 1, opacity: 1 }),
          ])
        ),
      ]),
    ]),
    trigger('RemoveBlock', [
      transition('* => void', [
        animate(
          '500ms',
          keyframes([
            style({ transform: 'translateY(0px)', opacity: 1, offset: 0 }),
            style({
              transform: 'translateY(-20px)',
              opacity: 0.7,
              offset: 0.2,
            }),
            style({
              transform: 'translateY(-50px)',
              opacity: 0.5,
              offset: 0.5,
            }),
            style({
              transform: 'translateY(-70px)',
              opacity: 0.3,
              offset: 0.7,
            }),
            style({ transform: 'translateY(-100px)', opacity: 0, offset: 1 }),
          ])
        ),
      ]),
    ]),
  ],
})
export class DialysisFormComponent implements OnInit {
  
  dialysisForm!: FormGroup;
  patient$!: Observable<Patient | null>;
  nurse: Person[] = []
  isPrinting = false;
  savedData: any = null;
  query: string = '';
  druglist: druglist[] = [];
  filtereddrug: druglist[] = [];
  drugUsageKeys: string[] = [];
  drugUsageMap: Record<string, string> = {
    '1': 'خوراکی',
    '2': 'تزریقی',
    '3': 'وریدی',
    '4': 'زیرجلدی',
    '5': 'عضلانی',
    '6': 'موضعی',
    '7': 'استنشاقی',
    '8': 'چشمی',
    '9': 'گوشی',
    '10': 'طبق دستور پزشک'
  };
 
  constructor(
    private fb: FormBuilder,
    private patientsStore: PatientsStoreService,
    private formsStore: FormsStoreService,
    private referenceData: ReferenceDataService,
    private selectedFormService: SelectedFormService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {

    this.dialysisForm = this.fb.group({

      admcode: [''],
      formcode:[''],
      startTime: [''],
      endTime: [''],
      shift: [''],

      diagnosis: [''],
      vascularAccess: [''],

      dialysisMachine: [{ value: 'JMS50', disabled: true }],
      bafferType: ['BIC'],
      smoothness: [''],
      beforeWeight: [''],
      beforeSystolicBP: [''],
      beforeDiastolicBP: [''],
      beforeTemprature: [''],
      beforePr: [''],
      beforeRR: [''],

      afterWeight: [''],
      afterSystolicBP: [''],
      afterDiastolicBP: [''],
      afterTemprature: [''],
      afterPR: [''],
      afterRR: [''],

      dryWeight: [''],
      bloodFlow: [''],
      solutionFlow: [''],
      Tmp: [''],
      solutionTemperature: [''],

      viralMarket: [''],
      solubleNa: [''],
      UF: [''],
      arterialPressure: [{ value: '0', disabled: true }],
      venousPressure: [''],

      profile: [''],

      prime: [''],
      bolus: [''],
      continuos: [''],
      total: [''],
      
      nurse1code:[''],
      nurse1name:[''],
      nurse2code:[''],
      nurse2name:[''],
      isSigned:[false],
      signedAt:[''],
      signedBy:[''],


      
      duringDialysis: this.fb.array([
        this.createduringDialysis()
      ]),                                   // بلوک اولیه
      medications: this.fb.array([
        this.createmedications()
      ]),                                     // بلوک دوم
    });

    ;}


  async ngOnInit() {
    this.patient$ = this.patientsStore.selectedPatient$;
    // دریافت بیمار
    let patient = await firstValueFrom(this.patient$);
    let admcode = patient?.admcode;
    const formObj = this.selectedFormService.getForm();
    const formcode = formObj?.code;
     
    if (!admcode || !formcode) {
    // اگر admcode وجود ندارد، کاربر را هدایت کن و اجرای ngOnInit را متوقف کن
    this.router.navigate(['/emr-form']);
    return;
  }

    // پر کردن admcode در فرم
    this.dialysisForm.patchValue({ admcode });
    this.dialysisForm.patchValue({formcode})
    // بررسی وجود فرم قبلی
    const savedForm = this.formsStore.getFormByAdmcodeAndFormcode(admcode,formcode);
    if (savedForm && savedForm.isSigned ===true) {
      // اگر فرم قبلی وجود داشت، فرم را با آن مقدارها پر کن
      this.dialysisForm.patchValue(savedForm);
      this.lockForm();
    }
    else if (savedForm){
      this.dialysisForm.patchValue(savedForm)
    }
    

     // فقط دکترا
    this.nurse = this.referenceData.getAllPerson().filter(p => !p.isDoctor)
 //  پرستار اول تغییر نام → ست شدن کد
    this.dialysisForm.get('nurse1name')!.valueChanges.subscribe(name => {
      const person = this.nurse.find(d => d.name === name)
      if (person) {
        this.dialysisForm.patchValue(
          { nurse1code: person.code },
          { emitEvent: false }
        )
      }
    })

    // تغییر کد → ست شدن نام پرستار اول
 this.dialysisForm.get('nurse1code')!.valueChanges.subscribe(code => {
  const person = this.nurse.find(d => d.code === code?.trim())
  if (person) {
    this.dialysisForm.patchValue(
      { nurse1name: person.name },
      { emitEvent: false }
    )
  } else {
    // اگر کد اشتباه وارد شد، نام پاک شود
    this.dialysisForm.patchValue({ nurse1name: '' }, { emitEvent: false })
  }
})
// پرستار اول تغییر نام → ست شدن کد
    this.dialysisForm.get('nurse2name')!.valueChanges.subscribe(name => {
      const person = this.nurse.find(d => d.name === name)
      if (person) {
        this.dialysisForm.patchValue(
          { nurse2code: person.code },
          { emitEvent: false }
        )
      }
    })

    // تغییر کد → ست شدن نام پرستار اول
 this.dialysisForm.get('nurse2code')!.valueChanges.subscribe(code => {
  const person = this.nurse.find(d => d.code === code?.trim())
  if (person) {
    this.dialysisForm.patchValue(
      { nurse2name: person.name },
      { emitEvent: false }
    )
  } else {
    // اگر کد اشتباه وارد شد، نام پاک شود
    this.dialysisForm.patchValue({ nurse2name: '' }, { emitEvent: false })
  }
}) 

 this.druglist=this.referenceData.getAllDrug()

this.drugUsageKeys = Object.keys(this.drugUsageMap);
    
  }



  
 save() {
  if (this.dialysisForm.get('isSigned')?.value === true) {
    this.snackBar.open('این فرم امضاء شده و قابل تغییر نیست', '', {
      duration: 3000,
      panelClass: ['snackbar-error'],
      horizontalPosition: 'end'
    });
    return;
  }
  const formValue = this.dialysisForm.getRawValue();
  // اگر admcode موجود بود، فرم را ذخیره کن
  this.formsStore.saveForm(formValue);
this.snackBar.open('فرم با موفقیت ذخیره گردید', '', {
        duration: 3000, // ۳ ثانیه
        panelClass: ['snackbar-success'] ,
         horizontalPosition: 'end',
      });
}
signForm() {

  const isSigned = this.dialysisForm.get('isSigned')?.value;

  // اگر امضاء شده → برگردان
  if (isSigned === true) {

    this.dialysisForm.enable();

    this.dialysisForm.patchValue({
      isSigned: false,
      signedAt: null,
      signedBy: null
    });

    this.snackBar.open('امضاء لغو شد', '', {
      duration: 2000,
      panelClass: ['snackbar-warning'],
      horizontalPosition: 'end'
    });

  } else {
    // اگر امضاء نشده → امضاء کن

    if (this.dialysisForm.invalid) {
      this.snackBar.open('فرم ناقص است', '', { duration: 3000,panelClass: ['snackbar-error'] ,horizontalPosition: 'end'});
      return;
    }

    this.dialysisForm.patchValue({
      isSigned: true,
      signedAt: new Date(),
      signedBy: this.dialysisForm.get('nurse1code')?.value
    });

    this.lockForm();

    this.snackBar.open('فرم امضاء شد', '', {
      duration: 2000,
      panelClass: ['snackbar-success'],
      horizontalPosition: 'end'
    });
  }

  // هر بار بعد از تغییر وضعیت ذخیره کن
  this.formsStore.saveForm(this.dialysisForm.getRawValue());
}



  getSavedForms() {
    return this.formsStore.getForms();
  }
  lockForm() {
    this.dialysisForm.disable({ emitEvent: false });
  }
  














  createduringDialysis(): FormGroup {
    return this.fb.group({
      time: [''],
      bp: [''],
      possibleSideEffects: [''],
      therapeuticAction: [''],
    });
  }
  createmedications(): FormGroup {
    return this.fb.group({
      name: [''],
      amount: [''],
      Howtouse: [''],
    });
  }




  get duringDialysis(): FormArray {
    return this.dialysisForm.get('duringDialysis') as FormArray;
  }

  get medications(): FormArray {
    return this.dialysisForm.get('medications') as FormArray;
  }



  addduringDialysis() {
    this.duringDialysis.push(this.createduringDialysis());
  }
  removeduringDialysis(i: number) {
    this.duringDialysis.removeAt(i);
  }

  addmedications() {
    this.medications.push(this.createmedications());
  }


  removemedications(i2: number) {
    this.medications.removeAt(i2);
  }


  search(query: string): void {
    const q = (query ?? '').trim().toLowerCase();

    this.filtereddrug= this.druglist.filter(med =>
      med.engName.toLowerCase().includes(q) ||
      med.FaName.toLowerCase().includes(q) ||
      med.genericCode.toLowerCase().includes(q)
    );
  }


  @ViewChild('printArea', { static: false }) printArea!: ElementRef;

  printForm(): void {
    if (!this.printArea) return;

    // Respect Angular's base-href (e.g. /ShafaEmr/) so assets load correctly on IIS.
    const baseHref = document.querySelector('base')?.getAttribute('href') || '/';
    const printCssUrl = new URL(
      'assets/css/print.css',
      window.location.origin + baseHref,
    ).toString();
  
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="fa" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>گزارش همودیالیز </title>
          <base href="${baseHref}">
      <link rel="stylesheet" href="${printCssUrl}"> <!-- مسیر درست -->
      <style>
      </style>
    </head>
    <body>
      ${this.printArea.nativeElement.outerHTML}
    </body>
    </html>
    `;
  
    const printWin = window.open('', '_blank', 'width=900,height=650');
  
    if (!printWin) {
      console.error('Unable to open print window');
      return;
    }
  
    printWin.document.open();
    printWin.document.write(htmlContent);
    printWin.document.close();
  
  
  // روش پایدار: صبر برای آماده شدن DOM
  const triggerPrint = () => {
      printWin.focus();
      printWin.print();
      printWin.close();
    };

    printWin.onload = () => {
      setTimeout(triggerPrint, 100);
    }; // هر 100 میلی‌ثانیه بررسی می‌کنه
  }
    
}




