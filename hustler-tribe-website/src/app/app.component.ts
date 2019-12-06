import { Renderer2, Inject, Component, OnInit,ViewChild, TemplateRef } from '@angular/core';
import { SignupService } from './signup.service';
import { VisitorsService } from './visitors.service';
import {NgForm} from '@angular/forms';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})

export class AppComponent {
  title = 'hustler-tribe';
  ipaddress: any
  city: any
  country: any
  refcode: string
  submitted: boolean = false;
  formCompleted: boolean = true;
  isMobile: boolean = false;

  constructor(private renderer2: Renderer2, @Inject(DOCUMENT) private _document, private _signupService: SignupService, private visitorsService: VisitorsService) {}

  ngOnInit(){
    this.visitorsService.getIpAddress().subscribe(res => {

      this.ipaddress = res['ip'];
      this.visitorsService.getGEOLocation(this.ipaddress).subscribe(res => {
        this.city = res['city'];
        this.country = res['country_code3'];
      });
    });
  
    if (window.innerWidth < 768) {
      this.isMobile = true;
    }
 }

 scroll(className: string):void {
  const elementList = document.querySelectorAll('#' + className);
  const element = elementList[0] as HTMLElement;
  element.scrollIntoView({ behavior: 'smooth' });
}

  signup(values) {
    if(values.email != "" && values.privacypolicy != "") {
      this.submitted = true;
      this._signupService.signup(values.email, values.refcode, values.newsletter, values.privacypolicy, this.country)
          .subscribe (
            data => console.log("Success!"),
            error => console.log("Error")
          )
    } else {
      this.formCompleted = false;
    }
  }
}
