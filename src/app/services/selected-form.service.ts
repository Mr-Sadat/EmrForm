import { Injectable } from '@angular/core';

export interface SelectedForm {
  code: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class SelectedFormService {
  private selectedForm: SelectedForm | null = null;

  setForm(form: SelectedForm): void {
    this.selectedForm = form;
  }

  getForm(): SelectedForm | null {
    return this.selectedForm;
  }
}




