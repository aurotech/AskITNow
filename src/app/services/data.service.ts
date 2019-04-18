import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import {Router} from '@angular/router';
import 'rxjs/add/operator/map';
import {flatMap} from "rxjs/operators";
import {timer} from "rxjs/observable/timer";
import {environment} from "../../environments/environment";


@Injectable()
export class DataService {
  successMessage;
  url = environment.ip;

  constructor( private http: Http, private router: Router) { }

  getCategories() {
    return this.http.get(`${this.url}/getCategories`).
      map(res => res.json());
  }

  getWaitTime() {
    return this.http.get(`${this.url}/showTickets`).
    map(res => res.json());
  }

  getWaitTimeForCustomers() {
    return timer(0, 5000).pipe(flatMap(() => {
        return this.http.get(`${this.url}/notStartTickets`).
        map(res => res.json());
      }));
  }

  createTicket(obj) {
    return this.http.post(`${this.url}/createTicket`, obj).
    map((res) => {
      res.json();
      this.successMessage = res.json();
      this.router.navigate(['/success']);
    });
  }

  createTicketByAdmin(obj) {
    return this.http.post(`${this.url}/createTicket`, obj).
    map((res) => {
      res.json();
      this.successMessage = res.json();
    });
  }

  loginCheck(obj) {
    return this.http.post(`${this.url}/loginIn`, obj).
    map(res => res.json());
  }

  logoutCheck(obj) {
    return this.http.post(`${this.url}/logout/`, obj);
  }

  acceptTicket(obj) {
    return this.http.put(`${this.url}/acceptTicket/`, obj);
  }

  unacceptTicket(obj) {
    return this.http.put(`${this.url}/undoAcceptTicket/`, obj);
  }

  resolveTicket(obj) {
    return this.http.put(`${this.url}/resolveTicket/`, obj);
  }

  unresolveTicket(obj) {
    return this.http.put(`${this.url}/undoResolveTicket/`, obj);
  }

  tempStop(obj) {
    return this.http.put(`${this.url}/temporaryStop`, obj);
  }

  undoStop(obj) {
    return this.http.post(`${this.url}/continueWork`, obj);
  }

  clearTicket(obj) {
    return this.http.put(`${this.url}/clearTicket/`, obj);
  }

  undoclearTicket(obj) {
    return this.http.put(`${this.url}/undoClearTicket/`, obj);
  }

  postAnnouncement(obj) {
    return this.http.post(`${this.url}/postAnnouncement/`, obj);
  }

  getAnnouncement() {
    return this.http.get(`${this.url}/getAnnouncement/`);
  }

  adminloginCheck(obj) {
    return this.http.post(`${this.url}/checkLogin`, obj);
  }
  checkForPotentialWaitTime() {
    return this.http.get(`${this.url}/potentialWaitTime`);
  }


}
