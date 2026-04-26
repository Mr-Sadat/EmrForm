import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FormsStoreService {
  private readonly FORMS_KEY = 'forms';

  getForms(): any[] {
    return JSON.parse(localStorage.getItem(this.FORMS_KEY) || '[]');
  }

  getFormByAdmcode(admcode: string): any | null {
    const forms = this.getForms();
    return forms.find((f) => f.admcode === admcode) || null;
  }

  getFormByAdmcodeAndFormcode(admcode: string, formcode: string): any | null {
    const forms = this.getForms();
    return (
      forms.find((f) => f.admcode === admcode && f.formcode === formcode) ||
      null
    );
  }

  saveForm(formValue: any): void {
    const forms = this.getForms();
    const index = forms.findIndex(
      (f) => f.admcode === formValue.admcode && f.formcode === formValue.formcode,
    );

    if (index !== -1) {
      forms[index] = formValue;
    } else {
      forms.push(formValue);
    }

    localStorage.setItem(this.FORMS_KEY, JSON.stringify(forms));
  }
}

