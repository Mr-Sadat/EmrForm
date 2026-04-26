import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Patient } from '../models/patient.interface';
import { Person } from '../models/Person.model';
import { druglist } from '../models/druglist.model';

@Injectable({
  providedIn: 'root'
})
export class EmrFormService {
private readonly STORAGE_KEY = 'patients';
private readonly STORAGEs_KEY='forms';
private readonly PERSON_NAME='Person-list'
private readonly MEDICINE_LIST='Drug-list'
selectedForm!: { code: string; name: string };


 private selectedPatientSubject = new BehaviorSubject<Patient | null>(null);
  selectedPatient$ = this.selectedPatientSubject.asObservable();

private printFormSubject = new BehaviorSubject<any | null>(null);
printForm$ = this.printFormSubject.asObservable();



constructor() {
  // فقط یک بار جدول را ایجاد می‌کند
    
  
    this.createTableWithSampleData();
    this.createPersonlistWithSampleData();
    this.createMedicineListWithGenericCode()
}

  // ایجاد جدول با داده‌های نمونه
  createTableWithSampleData(): void {
    const existingData = localStorage.getItem(this.STORAGE_KEY);
    
    if (!existingData) {
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
          family: 'رضایی'
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
          family: 'کاظمی'
        },
        {
          admcode: '3',
          partname: 'داخلی',
          nationalcode: '3456789012',
          admpcode: 'C103',
          date: '1404/11/06',
          drname: 'دکتر محمدی',
          fathername: 'علی',
          age: 50,
          bimehname: 'تامین اجتماعی',
          bimehname2: 'بیمه تکمیلی البرز',
          name: 'مهدی',
          family: 'ابراهیمی'
        },
        {
          admcode: '4',
          partname: 'اطفال',
          nationalcode: '4567890123',
          admpcode: 'D104',
          date: '1404/11/07',
          drname: 'دکتر فتحی',
          fathername: 'سعید',
          age: 12,
          bimehname: 'تامین اجتماعی',
          bimehname2: 'بیمه تکمیلی پارسیان',
          name: 'امیر',
          family: 'موسوی'
        },
        {
          admcode: '5',
          partname: 'زنان و زایمان',
          nationalcode: '5678901234',
          admpcode: 'E105',
          date: '1404/11/08',
          drname: 'دکتر کریمی',
          fathername: 'حسن',
          age: 28,
          bimehname: 'تامین اجتماعی',
          bimehname2: 'بیمه تکمیلی ایران',
          name: 'سارا',
          family: 'رضایی'
        },
        {
          admcode: '6',
          partname: 'داخلی',
          nationalcode: '6789012345',
          admpcode: 'F106',
          date: '1404/11/09',
          drname: 'دکتر علوی',
          fathername: 'محمود',
          age: 60,
          bimehname: 'تامین اجتماعی',
          bimehname2: 'بیمه تکمیلی ملت',
          name: 'حسن',
          family: 'نوری'
        },
        {
          admcode: '7',
          partname: 'جراحی',
          nationalcode: '7890123456',
          admpcode: 'G107',
          date: '1404/11/10',
          drname: 'دکتر رضایی',
          fathername: 'علی',
          age: 45,
          bimehname: 'تامین اجتماعی',
          bimehname2: 'بیمه تکمیلی سامان',
          name: 'مینا',
          family: 'سادات'
        },
        {
          admcode: '8',
          partname: 'داخلی',
          nationalcode: '8901234567',
          admpcode: 'H108',
          date: '1404/11/11',
          drname: 'دکتر موسوی',
          fathername: 'حسن',
          age: 38,
          bimehname: 'تامین اجتماعی',
          bimehname2: 'بیمه تکمیلی البرز',
          name: 'حسین',
          family: 'حیدری'
        },
        {
          admcode: '9',
          partname: 'اطفال',
          nationalcode: '9012345678',
          admpcode: 'I109',
          date: '1404/11/12',
          drname: 'دکتر نیکو',
          fathername: 'محمد',
          age: 10,
          bimehname: 'تامین اجتماعی',
          bimehname2: 'بیمه تکمیلی آسیا',
          name: 'علی رضا',
          family: 'محمدی'
        },
        {
          admcode: '10',
          partname: 'داخلی',
          nationalcode: '0123456789',
          admpcode: 'J110',
          date: '1404/11/13',
          drname: 'دکتر قاسمی',
          fathername: 'علی',
          age: 55,
          bimehname: 'تامین اجتماعی',
          bimehname2: 'بیمه تکمیلی پارسیان',
          name: 'فاطمه',
          family: 'کریمی'
        }

      ];

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(samplePatients));
      
    }
  }

  createPersonlistWithSampleData():void{
    const existingPerson = localStorage.getItem(this.PERSON_NAME);
    
    if (!existingPerson) {
      const samplePerson: Person[] = [
{ code: "1", name: "علی رضایی", isDoctor: true },
  { code: "2", name: "مریم محمدی", isDoctor: true },
  { code: "3", name: "حسین کریمی", isDoctor: true },
  { code: "4", name: "سارا احمدی", isDoctor: true },
  { code: "5", name: "رضا حسینی", isDoctor: true },
  { code: "6", name: "نازنین موسوی", isDoctor: true },
  { code: "7", name: "امیر جعفری", isDoctor: true },
  { code: "8", name: "الهام قاسمی", isDoctor: true },
  { code: "9", name: "محمد صالحی", isDoctor: true },
  { code: "10", name: "لیلا عباسی", isDoctor: true },

  { code: "11", name: "علی نادری", isDoctor: false },
  { code: "12", name: "مینا شریفی", isDoctor: false },
  { code: "13", name: "حسین قربانی", isDoctor: false },
  { code: "14", name: "سارا رستمی", isDoctor: false },
  { code: "15", name: "رضا اکبری", isDoctor: false },
  { code: "16", name: "نرگس کاظمی", isDoctor: false },
  { code: "17", name: "امیر پارسا", isDoctor: false },
  { code: "18", name: "الهه زمانی", isDoctor: false },
  { code: "19", name: "محمد توکلی", isDoctor: false },
  { code: "20", name: "لیلا فراهانی", isDoctor: false }
      ];
      localStorage.setItem(this.PERSON_NAME, JSON.stringify(samplePerson));
  }}

  createMedicineListWithGenericCode(): void {
    const existingMedicines = localStorage.getItem(this.MEDICINE_LIST);
  
    if (!existingMedicines) {
      const sampleMedicines: druglist[] = [
        { engName: "Paracetamol", FaName: "پاراستامول", genericCode: "G001" },
        { engName: "Ibuprofen", FaName: "ایبوپروفن", genericCode: "G002" },
        { engName: "Amoxicillin", FaName: "آموکسی سیلین", genericCode: "G003" },
        { engName: "Cetirizine", FaName: "سیتریزین", genericCode: "G004" },
        { engName: "Aspirin", FaName: "آسپرین", genericCode: "G005" },
        { engName: "Metformin", FaName: "متفورمین", genericCode: "G006" },
        { engName: "Atorvastatin", FaName: "آتورواستاتین", genericCode: "G007" },
        { engName: "Omeprazole", FaName: "امپرازول", genericCode: "G008" },
        { engName: "Losartan", FaName: "لوزارتان", genericCode: "G009" },
        { engName: "Salbutamol", FaName: "سالبوتامول", genericCode: "G010" },
        { engName: "Levothyroxine", FaName: "لووتیروکسین", genericCode: "G011" },
        { engName: "Ciprofloxacin", FaName: "سیپروفلوکساسین", genericCode: "G012" },
        { engName: "Hydrochlorothiazide", FaName: "هیدروکلروتیازید", genericCode: "G013" },
        { engName: "Simvastatin", FaName: "سیمواستاتین", genericCode: "G014" },
        { engName: "Prednisone", FaName: "پردنیزون", genericCode: "G015" },
        { engName: "Clopidogrel", FaName: "کلوپیدوگرل", genericCode: "G016" },
        { engName: "Warfarin", FaName: "وارفارین", genericCode: "G017" },
        { engName: "Furosemide", FaName: "فوروزماید", genericCode: "G018" },
        { engName: "Citalopram", FaName: "سیتالوپرام", genericCode: "G019" },
        { engName: "Gabapentin", FaName: "گاباپنتین", genericCode: "G020" },
        { engName: "Amlodipine", FaName: "آملودیپین", genericCode: "G021" },
        { engName: "Metoprolol", FaName: "متوپرولول", genericCode: "G022" },
        { engName: "Sertraline", FaName: "سرترالین", genericCode: "G023" },
        { engName: "Lisinopril", FaName: "لیزینوپریل", genericCode: "G024" },
        { engName: "Montelukast", FaName: "مونتلوکاست", genericCode: "G025" },
        { engName: "Pantoprazole", FaName: "پانتوپرازول", genericCode: "G026" },
        { engName: "Fluoxetine", FaName: "فلوکستین", genericCode: "G027" },
        { engName: "Doxycycline", FaName: "دوکسی‌سایکلین", genericCode: "G028" },
        { engName: "Lorazepam", FaName: "لرازپام", genericCode: "G029" },
        { engName: "Clindamycin", FaName: "کلیندامایسین", genericCode: "G030" },
        { engName: "Tramadol", FaName: "ترامادول", genericCode: "G031" },
        { engName: "Hydrocortisone", FaName: "هیدروکورتیزون", genericCode: "G032" },
        { engName: "Dexamethasone", FaName: "دگزامتازون", genericCode: "G033" },
        { engName: "Diazepam", FaName: "دیازپام", genericCode: "G034" },
        { engName: "Ranitidine", FaName: "رانیتیدین", genericCode: "G035" },
        { engName: "Levocetirizine", FaName: "لِووسیتریزین", genericCode: "G036" },
        { engName: "Oxycodone", FaName: "اکسی‌کودون", genericCode: "G037" },
        { engName: "Paroxetine", FaName: "پاراکستین", genericCode: "G038" },
        { engName: "Tamsulosin", FaName: "تامسولوسین", genericCode: "G039" },
        { engName: "Clarithromycin", FaName: "کلاریترومایسین", genericCode: "G040" },
        { engName: "Nitrofurantoin", FaName: "نیتروفورانتوئین", genericCode: "G041" },
        { engName: "Allopurinol", FaName: "آلوپورینول", genericCode: "G042" },
        { engName: "Famotidine", FaName: "فاموتیدین", genericCode: "G043" },
        { engName: "Meloxicam", FaName: "ملوکسی‌کام", genericCode: "G044" },
        { engName: "Pregabalin", FaName: "پرگابالین", genericCode: "G045" },
        { engName: "Atenolol", FaName: "آتِنولول", genericCode: "G046" },
        { engName: "Risperidone", FaName: "ریسپریدون", genericCode: "G047" },
        { engName: "Levofloxacin", FaName: "لِووفلوکساسین", genericCode: "G048" },
        { engName: "Azithromycin", FaName: "آزیترومایسین", genericCode: "G049" },
        { engName: "Diclofenac", FaName: "دیکلوفناک", genericCode: "G050" }
      ];
  
      localStorage.setItem(this.MEDICINE_LIST, JSON.stringify(sampleMedicines));
      console.log('Sample medicines with genericCode saved to localStorage!');
    }
  }
  

// READ - خواندن همه رکوردها
  getAllPerson(): Person[] {
  const Person = localStorage.getItem('Person-list');
  
  return Person ? JSON.parse(Person) : [];
}



getAllDrug(): druglist[] {
  const druglist = localStorage.getItem('Drug-list');
  
  return druglist ? JSON.parse(druglist) : [];
}

  // READ - خواندن همه رکوردها
  getAll(): Patient[] {
  const data = localStorage.getItem('patients');
  
  return data ? JSON.parse(data) : [];
}


    // READ - خواندن یک رکورد بر اساس admcode
getAdmissionByAdmCode(admcode: string): boolean {
  const patients = this.getAll();
  const patient = patients.find(p => p.admcode === admcode);

  if (!patient) {
    this.selectedPatientSubject.next(null);
    return false;
  }

  this.selectedPatientSubject.next(patient);
  return true;
}





// گرفتن همه فرم‌ها
  getForms(): any[] {
    return JSON.parse(localStorage.getItem(this.STORAGEs_KEY) || '[]');
  }

  // گرفتن فرم براساس admcode
  getFormByAdmcode(admcode: string): any | null {
    const forms = this.getForms();
    return forms.find(f => f.admcode === admcode) || null;
  }

  // ذخیره یا بروزرسانی فرم
  saveForm(formValue: any): void {
    let forms = this.getForms();
    const index = forms.findIndex(f => f.admcode === formValue.admcode && f.formcode===formValue.formcode);
      
    if (index !== -1) {
      // بروزرسانی فرم موجود
      forms[index] = formValue;
    } else {
      // اضافه کردن فرم جدید
      forms.push(formValue);
    }
    localStorage.setItem(this.STORAGEs_KEY, JSON.stringify(forms));
    
  }

  setFormCode(form: { code: string; name: string }) {
    this.selectedForm = form;
  }
  getFormCode() {
    return this.selectedForm;
  }
  getFormByAdmcodeAndFormcode(admcode: string ,formcode:string): any | null {
    const forms = this.getForms();
    return forms.find(f => f.admcode === admcode && f.formcode===formcode) || null;
  }












}
