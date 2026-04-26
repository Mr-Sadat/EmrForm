import { Injectable } from '@angular/core';
import { Person } from '../models/Person.model';
import { druglist } from '../models/druglist.model';

@Injectable({
  providedIn: 'root',
})
export class ReferenceDataService {
  private readonly PERSON_KEY = 'Person-list';
  private readonly MEDICINES_KEY = 'Drug-list';

  constructor() {
    this.createPersonlistWithSampleData();
    this.createMedicineListWithGenericCode();
  }

  getAllPerson(): Person[] {
    const raw = localStorage.getItem(this.PERSON_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  getAllDrug(): druglist[] {
    const raw = localStorage.getItem(this.MEDICINES_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  private createPersonlistWithSampleData(): void {
    const existingPerson = localStorage.getItem(this.PERSON_KEY);
    if (existingPerson) return;

    const samplePerson: Person[] = [
      { code: '1', name: 'پرستار 1', isDoctor: false },
      { code: '2', name: 'پرستار 2', isDoctor: false },
      { code: '3', name: 'دکتر 1', isDoctor: true },
      { code: '4', name: 'دکتر 2', isDoctor: true },
    ];

    localStorage.setItem(this.PERSON_KEY, JSON.stringify(samplePerson));
  }

  private createMedicineListWithGenericCode(): void {
    const existingMedicines = localStorage.getItem(this.MEDICINES_KEY);
    if (existingMedicines) return;

    const sampleMedicines: druglist[] = [
      { engName: 'Acetaminophen', FaName: 'استامینوفن', genericCode: 'G001' },
      { engName: 'Ibuprofen', FaName: 'ایبوپروفن', genericCode: 'G002' },
      { engName: 'Amoxicillin', FaName: 'آموکسی‌سیلین', genericCode: 'G003' },
    ];

    localStorage.setItem(this.MEDICINES_KEY, JSON.stringify(sampleMedicines));
  }
}

