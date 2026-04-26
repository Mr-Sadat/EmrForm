import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/Auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
    dialogopen = false;
constructor(  public auth:AuthService,private router:Router){}
 @Output() sideropen=new EventEmitter<boolean>()
  openmenu(){
this.sideropen.emit()
 this.dialogopen = false;
  }


  openUserDialog() {
 this.dialogopen = !this.dialogopen;
  
  }

   logout() {
    this.auth.logout();
        
    this.router.navigate(['/login']);
  }

}
