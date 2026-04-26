import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SelectedFormService } from 'src/app/services/selected-form.service';



@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent {
   panelOpenState = false;
  constructor(private selectedFormService: SelectedFormService,private router: Router) {}
 @Output() siderclose = new EventEmitter<void>();



  siderclosemenu() {
    this.siderclose.emit();
 }


 selectForm(formCode: string,formname:string) {
    console.log('Selected FormCode:', formCode);
     this.selectedFormService.setForm({
    code: formCode,
    name: formname
  });
  this.router.navigate(['/emr-form']);
  this.panelOpenState=false;
}
}
