import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Patient } from '../models/patient.interface';

@Component({
  selector: 'app-dialysis-print',
  templateUrl: './dialysis-print.component.html',
  styleUrls: ['./dialysis-print.component.css']
})
export class DialysisPrintComponent  {
  @Input() form!: FormGroup;
  @Input() drugUsageMap!: Record<string, string>;
  @Input() patient$!:Observable<Patient | null>;
  
  amountMap: Record<string, string> = {
    '' : '',
    '1': 'هر6 ساعت',
    '2': 'هر8 ساعت',
    '3': 'هر12 ساعت',
    '4': 'هرروز',
    '5': 'یک روز در میان',
    '6': 'طبق دستور',
    '7': 'در صورت نیاز',
    '8': 'هر1 هفته',
    '9': 'هر28 روز',
    '10': 'هر4 ساعت'
  };


}
