import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Patient } from '../models/patient.interface';

@Injectable({
  providedIn: 'root',
})
export class PatientsStoreService {
  private readonly PATIENTS_KEY = 'patients';

  private selectedPatientSubject = new BehaviorSubject<Patient | null>(null);
  selectedPatient$ = this.selectedPatientSubject.asObservable();

  constructor() {
    this.createPatientsWithSampleData();
  }

  getAll(): Patient[] {
    const raw = localStorage.getItem(this.PATIENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  getAdmissionByAdmCode(admcode: string): boolean {
    const patients = this.getAll();
    const patient = patients.find((p) => p.admcode === admcode);

    if (!patient) {
      this.selectedPatientSubject.next(null);
      return false;
    }

    this.selectedPatientSubject.next(patient);
    return true;
  }

  private createPatientsWithSampleData(): void {
    const existingData = localStorage.getItem(this.PATIENTS_KEY);
    if (existingData) return;

    const samplePatients: Patient[] = [
      {
        admcode: '1',
        partname: 'داخلی',
        nationalcode: '1234567890',
        admpcode: 'A101',
        date: '1404/11/04',
        drname: 'دکتر احمدی',
        fathername: 'محمد',
        age: 35,
        bimehname: 'تامین اجتماعی',
        bimehname2: 'بیمه مکمل آسیا',
        name: 'علی',
        family: 'رضایی',
      },
      {
        admcode: '2',
        partname: 'جراحی',
        nationalcode: '2345678901',
        admpcode: 'B102',
        date: '1404/11/05',
        drname: 'دکتر حسینی',
        fathername: 'حسن',
        age: 42,
        bimehname: 'تامین اجتماعی',
        bimehname2: 'بیمه تکمیلی سامان',
        name: 'رضا',
        family: 'کاظمی',
      },
    ];

    localStorage.setItem(this.PATIENTS_KEY, JSON.stringify(samplePatients));
  }
}

