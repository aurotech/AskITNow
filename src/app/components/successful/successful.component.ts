import { Component, OnInit } from '@angular/core';
import {DataService} from "../../services/data.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-successful',
  templateUrl: './successful.component.html',
  styleUrls: ['./successful.component.css']
})
export class SuccessfulComponent implements OnInit {
  result;

   constructor(private data: DataService, private router: Router) {
  }

  ngOnInit() {
   this.result =  this.data.successMessage;
   if (this.result) {
     setTimeout(() => {
       this.data.successMessage = '';
       this.router.navigate(['']);
     }, 3000);
   } else {
     this.router.navigate(['']);
   }
  }

}
