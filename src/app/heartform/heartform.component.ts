import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { firstValueFrom, Observable, Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { FormsStoreService } from '../services/forms-store.service';
import { PatientsStoreService } from '../services/patients-store.service';
import { ReferenceDataService } from '../services/reference-data.service';
import { SelectedFormService } from '../services/selected-form.service';
import { Patient } from '../models/patient.interface';
import { Person } from '../models/Person.model';
import {
  HeartPart,
  HeartFormSchema,
  HEART_FORM_SCHEMAS,
} from '../heartform/heart-form.schema';

interface HeartTemplate {
  id: string;
  name: string;
  createdAt: string;
  formValue: any;
}

@Component({
  selector: 'app-heartform',
  templateUrl: './heartform.component.html',
  styleUrls: ['./heartform.component.css'],
})
export class HeartformComponent implements OnInit, OnDestroy {
  panelOpenState = false;
  patient$!: Observable<Patient | null>;

  echoForm!: FormGroup; // فرم اصلی شامل admcode و metadata
  heartForm!: FormGroup; // فرم part فعلی
  selectedPart!: HeartPart | null;
  currentSchema!: HeartFormSchema;
  DrName: Person[] = [];

  allFindings: Partial<Record<HeartPart, any>> = {}; // ذخیره همه part‌ها
  private readonly TEMPLATE_STORAGE_KEY = 'heart-templates';
  isTemplatePanelOpen = false;
  templateName = '';
  templateSearch = '';
  templates: HeartTemplate[] = [];
  selectedTemplateId: string | null = null;
  selectedTemplateName = '';
  templatePanelMode: 'save' | 'restore' = 'save';
  private restoreSnapshot: {
    echo: any;
    findings: any;
    selectedPart: HeartPart | null;
  } | null = null;
  private restoreApplied = false;
  private isTemplatePreview = false;
  private autosaveSub?: Subscription;

  // Never copy patient/form identity fields into templates.
  // This prevents saving a restored template into the previous patient's record.
  private readonly templateExcludedFields = new Set([
    'admcode',
    'formcode',
    'isSigned',
    'signedAt',
    'signedBy',
  ]);

  constructor(
    private fb: FormBuilder,
    private patientsStore: PatientsStoreService,
    private formsStore: FormsStoreService,
    private referenceData: ReferenceDataService,
    private selectedFormService: SelectedFormService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  async ngOnInit() {
    this.patient$ = this.patientsStore.selectedPatient$;
    const patient = await firstValueFrom(this.patient$);

    const admcode = patient?.admcode;
    const formObj = this.selectedFormService.getForm();
    const formcode = formObj?.code;

    if (!admcode || !formcode) {
      this.router.navigate(['/emr-form']);
      return;
    }

    // فرم اصلی
    this.echoForm = this.fb.group({
      admcode: [admcode],
      formcode: [formcode],
      indication: [''],
      type: [''],
      sedation: [''],
      quality: [''],
      Complications: [''],
      description: [''],
      findings: this.fb.group({}), // dynamic parts
      date: [''],
      drCode: [''],
      drname: [''],
      conclusion: [''],
      isSigned: [false],
      signedAt: [''],
      signedBy: [''],
    });

    //دریافت فرم قبلی ازا localStorage
    const savedForm =
      this.formsStore.getFormByAdmcodeAndFormcode(admcode, formcode) ||
      JSON.parse(
        localStorage.getItem(`heart-form-${admcode}-${formcode}`) || '{}',
      );

    if (savedForm) {
      // پر کردن فرم اصلی
      const { findings, ...rest } = savedForm;
      this.echoForm.patchValue(rest);
      if (findings) {
        this.allFindings = findings;
      }
      // اگر فرم قبلاً امضاء شده، قفل کن
      if (savedForm.isSigned) {
        this.lockForm();
      }
    }

    this.DrName = this.referenceData.getAllPerson().filter((p) => p.isDoctor);
    this.loadTemplates();
    this.setupDoctorSubscriptions();
  }

  ngOnDestroy() {
    this.autosaveSub?.unsubscribe();
  }

  // -------------------------------
  // doctor name/code auto update
  setupDoctorSubscriptions() {
    this.echoForm.get('drname')!.valueChanges.subscribe((name) => {
      const person = this.DrName.find((d) => d.name === name);
      if (person) {
        this.echoForm.patchValue({ drCode: person.code }, { emitEvent: false });
      }
    });

    this.echoForm.get('drCode')!.valueChanges.subscribe((code) => {
      const person = this.DrName.find((d) => d.code === code?.trim());
      if (person) {
        this.echoForm.patchValue({ drname: person.name }, { emitEvent: false });
      } else {
        this.echoForm.patchValue({ drname: '' }, { emitEvent: false });
      }
    });
  }

  // -------------------------------
  // switch part
  onSelectPart(part: HeartPart) {
    if (this.selectedPart === part) return;

    // save part فعلی
    this.presave();

    this.selectedPart = part;
    this.loadPart(part);
  }

  // load part data to heartForm
  private loadPart(part: HeartPart) {
    this.heartForm = this.buildForm(part);

    // پر کردن مقادیر قبلی اگر موجود بود
    if (this.allFindings[part]) {
      this.heartForm.patchValue(this.allFindings[part], { emitEvent: false });
    }

    this.echoForm.setControl('findings', this.heartForm);

    // setup autosave
    this.setupAutosave();
    // اگر فرم امضاء شده، فوراً قفل کن
    if (this.echoForm.get('isSigned')?.value === true) {
      this.heartForm.disable({ emitEvent: false });
    }
  }

  // -------------------------------
  // autosave current part
  private setupAutosave() {
    this.autosaveSub?.unsubscribe();
    this.autosaveSub = this.heartForm.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe(() => {
        if (this.isTemplatePreview) return;
        this.presave();
      });
  }

  // -------------------------------
  // save part data to allFindings + full form
  private presave() {
    if (this.isTemplatePreview) return;
    if (this.selectedPart && this.heartForm) {
      this.allFindings[this.selectedPart] = this.heartForm.value;
    }

    const payload = {
      ...this.echoForm.getRawValue(), // includes admcode, formcode, etc.
      findings: this.allFindings,
    };

    this.formsStore.saveForm(payload);

    // localStorage
    const { admcode, formcode } = payload;
    if (admcode && formcode) {
      localStorage.setItem(
        `heart-form-${admcode}-${formcode}`,
        JSON.stringify(payload),
      );
    }
  }

  // -------------------------------
  save() {
    if (this.echoForm.get('isSigned')?.value === true) {
      this.snackBar.open('این فرم امضاء شده و قابل تغییر نیست', '', {
        duration: 3000,
        panelClass: ['snackbar-error'],
        horizontalPosition: 'end',
      });
      return;
    }
    this.presave();
    this.snackBar.open('فرم با موفقیت ذخیره گردید', '', {
      duration: 3000,
      panelClass: ['snackbar-success'],
      horizontalPosition: 'end',
    });
  }
  signForm() {
    const isSigned = this.echoForm.get('isSigned')?.value;

    // اگر امضاء شده → برگردان
    if (isSigned) {
      this.echoForm.enable({ emitEvent: false });
      if (this.heartForm) {
        this.heartForm.enable({ emitEvent: false });
      }

      this.echoForm.patchValue({
        isSigned: false,
        signedAt: null,
        signedBy: null,
      });

      this.snackBar.open('امضاء لغو شد', '', {
        duration: 2000,
        panelClass: ['snackbar-warning'],
        horizontalPosition: 'end',
      });
    } else {
      // اگر امضاء نشده → امضاء کن

      if (this.echoForm.invalid) {
        this.snackBar.open('فرم ناقص است', '', {
          duration: 3000,
          panelClass: ['snackbar-error'],
          horizontalPosition: 'end',
        });
        return;
      }

      this.echoForm.patchValue({
        isSigned: true,
        signedAt: new Date(),
        signedBy: this.echoForm.get('nurse1code')?.value,
      });

      this.lockForm();

      this.snackBar.open('فرم امضاء شد', '', {
        duration: 2000,
        panelClass: ['snackbar-success'],
        horizontalPosition: 'end',
      });
    }

    // هر بار بعد از تغییر وضعیت ذخیره کن
    this.presave();
  }
  lockForm() {
    this.echoForm.disable({ emitEvent: false });
    if (this.heartForm) {
      this.heartForm.disable({ emitEvent: false });
    }
  }
  openTemplatePanel(mode: 'save' | 'restore' = 'save'): void {
    this.templatePanelMode = mode;
    this.isTemplatePanelOpen = true;
    this.restoreApplied = false;
    if (mode === 'restore') {
      this.restoreSnapshot = {
        echo: this.echoForm.getRawValue(),
        findings: JSON.parse(JSON.stringify(this.allFindings || {})),
        selectedPart: this.selectedPart ?? null,
      };
    }
    this.loadTemplates();
  }

  closeTemplatePanel(): void {
    this.isTemplatePanelOpen = false;
    if (
      this.templatePanelMode === 'restore' &&
      !this.restoreApplied &&
      this.restoreSnapshot
    ) {
      this.isTemplatePreview = true;
      this.echoForm.patchValue(this.restoreSnapshot.echo || {});
      this.allFindings = this.restoreSnapshot.findings || {};
      if (this.restoreSnapshot.selectedPart) {
        this.loadPart(this.restoreSnapshot.selectedPart);
      }
      this.isTemplatePreview = false;
    }
  }

  saveTemplate(): void {
    const name = this.templateName.trim();
    if (!name) {
      this.snackBar.open('لطفا یک نام برای الگو وارد کنید', '', {
        duration: 2500,
        panelClass: ['snackbar-warning'],
        horizontalPosition: 'end',
      });
      return;
    }

    const formValue = this.getTemplateFormValue();
    const existingIndex = this.templates.findIndex(
      (t) => t.id === this.selectedTemplateId,
    );

    if (existingIndex !== -1) {
      this.templates[existingIndex] = {
        ...this.templates[existingIndex],
        name,
        createdAt: new Date().toISOString(),
        formValue,
      };
      localStorage.setItem(
        this.TEMPLATE_STORAGE_KEY,
        JSON.stringify(this.templates),
      );
      this.snackBar.open('الگو با موفقیت بروزرسانی شد', '', {
        duration: 2500,
        panelClass: ['snackbar-success'],
        horizontalPosition: 'end',
      });
      return;
    }

    const template: HeartTemplate = {
      id: String(Date.now()),
      name,
      createdAt: new Date().toISOString(),
      formValue,
    };

    this.templates = [template, ...this.templates];
    localStorage.setItem(
      this.TEMPLATE_STORAGE_KEY,
      JSON.stringify(this.templates),
    );
    this.templateName = '';
    this.selectedTemplateId = null;
    this.selectedTemplateName = '';

    this.snackBar.open('الگو با موفقیت ذخیره شد', '', {
      duration: 2500,
      panelClass: ['snackbar-success'],
      horizontalPosition: 'end',
    });
  }

  loadTemplates(): void {
    const saved = localStorage.getItem(this.TEMPLATE_STORAGE_KEY);
    this.templates = saved ? JSON.parse(saved) : [];
  }

  getFilteredTemplates(): HeartTemplate[] {
    const term = this.templateSearch.trim().toLowerCase();
    if (!term) return this.templates;
    return this.templates.filter((t) => t.name.toLowerCase().includes(term));
  }

  onTemplateClick(template: HeartTemplate): void {
    if (this.templatePanelMode === 'restore') {
      this.applyTemplate(template, true);
      return;
    }
    this.applyTemplate(template, false);
  }

  selectTemplateForRestore(template: HeartTemplate): void {
    this.selectedTemplateId = template.id;
    this.selectedTemplateName = template.name;
  }

  restoreSelectedTemplate(): void {
    const template = this.templates.find(
      (t) => t.id === this.selectedTemplateId,
    );
    if (!template) {
      this.snackBar.open('الگوی معتبری انتخاب نشده است', '', {
        duration: 2500,
        panelClass: ['snackbar-warning'],
        horizontalPosition: 'end',
      });
      return;
    }
    this.restoreApplied = true;
    this.isTemplatePreview = false;
    this.applyTemplate(template, false);
    this.snackBar.open('الگو روی فرم اعمال شد', '', {
      duration: 2500,
      panelClass: ['snackbar-success'],
      horizontalPosition: 'end',
    });
  }

  deleteTemplate(template: HeartTemplate, event?: MouseEvent): void {
    if (event) event.stopPropagation();
    this.templates = this.templates.filter((t) => t.id !== template.id);
    localStorage.setItem(
      this.TEMPLATE_STORAGE_KEY,
      JSON.stringify(this.templates),
    );

    if (this.selectedTemplateId === template.id) {
      this.templateName = '';
      this.selectedTemplateId = null;
      this.selectedTemplateName = '';
    }
  }

  applyTemplate(template: HeartTemplate, preview = false): void {
    this.selectedTemplateId = template.id;
    this.templateName = template.name;
    this.selectedTemplateName = template.name;

    this.isTemplatePreview = preview;
    const { findings, ...rawRest } = template.formValue || {};
    const rest = this.filterTemplateFields(rawRest);
    this.echoForm.patchValue(rest);
    this.allFindings = findings || {};

    if (this.selectedPart) {
      this.loadPart(this.selectedPart);
    }
  }

  // -------------------------------
  buildForm(part: HeartPart): FormGroup {
    const schema = HEART_FORM_SCHEMAS[part];
    this.currentSchema = schema;

    const group: { [key: string]: any } = {};
    schema.fields.forEach((f) => (group[f.name] = [f.default ?? '']));
    return this.fb.group(group);
  }

  private getTemplateFormValue(): any {
    const raw = this.echoForm.getRawValue() || {};
    const { findings, ...rest } = raw;
    return {
      ...this.filterTemplateFields(rest),
      findings: JSON.parse(JSON.stringify(this.allFindings || {})),
    };
  }

  private filterTemplateFields(value: Record<string, any>): Record<string, any> {
    const result: Record<string, any> = {};
    Object.keys(value || {}).forEach((key) => {
      if (!this.templateExcludedFields.has(key)) {
        result[key] = value[key];
      }
    });
    return result;
  }
}

