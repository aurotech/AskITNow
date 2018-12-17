import { Injectable } from '@angular/core';
import {Http} from "@angular/http";
import {DataService} from "../data.service";
import {Router} from '@angular/router';
import {Ng4LoadingSpinnerService} from "ng4-loading-spinner";

@Injectable()
export class AuthService {
  technicianId;
  technicianName;
  online;

  constructor(

    private http: Http,
    private data: DataService,
    private router: Router,
    private spinner: Ng4LoadingSpinnerService,
  ) { }

  login(data) {
    this.spinner.show();
    return this.http.post('http://ec2-52-202-126-186.compute-1.amazonaws.com:8080/app1/loginIn', data)
      .map(res => {
        const result = res.json();
        const name = result.name.replace(/^"(.*)"$/, '$1');
        if (result.is_login) {
          localStorage.setItem('id', JSON.stringify(result.id));
          localStorage.setItem('name', name);
          this.spinner.hide();
          return true;
        } else {
          return false;
        }
      });
  }

  currentUser() {
    if (!this.checkForTechnician()) {
      return {
        technicianName: localStorage.getItem('name'),
        technicianId: localStorage.getItem('id')
      };
    }
  }

  checkForTechnician() {
    this.technicianId = localStorage.getItem('id');
    this.technicianName = localStorage.getItem('name');
    if (!this.technicianId) this.router.navigate(['/login']);

    this.data.adminloginCheck({technician_id: this.technicianId})
      .subscribe(res => {
        this.online = res['_body'];
        if (this.online == 'False') {
          this.router.navigate(['/login']);
          localStorage.clear();
          return this.online;
        }
        return true;
      }, error => {
        console.log(error);
      });
  }

}
