import { Injectable } from '@angular/core';
import {Http} from "@angular/http";
import {DataService} from "./data.service";
import {CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Ng4LoadingSpinnerService} from "ng4-loading-spinner";

@Injectable()
export class AuthGaurdService implements CanActivate {
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
    this.data.loginCheck(data)
      .subscribe(res => {
      const id = res.id;
      const name = res.name.replace(/^"(.*)"$/, '$1');
      if (res.is_login) {
        localStorage.setItem('id', JSON.stringify(id));
        localStorage.setItem('name', name);
        this.router.navigate(['/admin']);
        this.spinner.hide();
        return true;
      }
      return false;
    }, error => console.log(error));
  }

  currentUser() {
    if(!this.checkForTechnician()) {
      return {
        technicianName: localStorage.getItem('name'),
        technicianId: localStorage.getItem('id')
      };
    }
  }

  canActivate(route, state: RouterStateSnapshot) {
    if (this.checkForTechnician()) {

      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

  checkForTechnician() {

    this.technicianId = localStorage.getItem('id');
    this.technicianName = localStorage.getItem('name');
    if (!this.technicianId) this.router.navigate(['/login']);

    return this.data.adminloginCheck({technician_id: this.technicianId})
      .subscribe(res => {
        this.online = res['_body'];
        if (this.online == 'False') {
          this.router.navigate(['/login']);
          localStorage.clear();
          return false;
        }
        return true;
      }, error => {
      console.log(error);
    });
  }

}
