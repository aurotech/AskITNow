import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import {Router} from '@angular/router';
import 'rxjs/add/operator/map';
import {flatMap} from "rxjs/operators";
import {timer} from "rxjs/observable/timer";


@Injectable()
export class DataService {
  successMessage;

  constructor( private http: Http, private router: Router) { }

  getCategories() {
    return this.http.get('http://ec2-52-202-126-186.compute-1.amazonaws.com:8080/app1/getCategories').
      map(res => res.json());
  }

  getWaitTime() {
    return this.http.get('http://ec2-52-202-126-186.compute-1.amazonaws.com:8080/app1/showTickets').
    map(res => res.json());
  }

  getWaitTimeForCustomers() {
    return timer(0, 5000).pipe(flatMap(() => {
        return this.http.get('http://ec2-52-202-126-186.compute-1.amazonaws.com:8080/app1/notStartTickets').
        map(res => res.json());
      }));
  }

  createTicket(obj) {
    return this.http.post('http://ec2-52-202-126-186.compute-1.amazonaws.com:8080/app1/createTicket', obj).
    map((res) => {
      res.json();
      this.successMessage = res.json();
      this.router.navigate(['/success']);
    });
  }

  createTicketByAdmin(obj) {
    return this.http.post('http://ec2-52-202-126-186.compute-1.amazonaws.com:8080/app1/createTicket', obj).
    map((res) => {
      res.json();
      this.successMessage = res.json();
    });
  }

  loginCheck(obj) {
    return this.http.post('http://ec2-52-202-126-186.compute-1.amazonaws.com:8080/app1/loginIn', obj).
    map(res => res.json());
  }

  logoutCheck(obj) {
    return this.http.post(`http://ec2-52-202-126-186.compute-1.amazonaws.com:8080/app1/logout/`, obj)
  }

  acceptTicket(obj) {
    return this.http.put(`http://ec2-52-202-126-186.compute-1.amazonaws.com:8080/app1/acceptTicket/`, obj);
  }

  unacceptTicket(obj) {
    return this.http.put(`http://ec2-52-202-126-186.compute-1.amazonaws.com:8080/app1/undoAcceptTicket/`, obj);
  }

  resolveTicket(obj) {
    return this.http.put(`http://ec2-52-202-126-186.compute-1.amazonaws.com:8080/app1/resolveTicket/`, obj);
  }

  unresolveTicket(obj) {
    return this.http.put(`http://ec2-52-202-126-186.compute-1.amazonaws.com:8080/app1/undoResolveTicket/`, obj);
  }

  tempStop(obj) {
    return this.http.put(`http://ec2-52-202-126-186.compute-1.amazonaws.com:8080/app1/temporaryStop`, obj);

  }

  undoStop(obj) {
    return this.http.post(`http://ec2-52-202-126-186.compute-1.amazonaws.com:8080/app1/continueWork`, obj);

  }

  clearTicket(obj) {
    return this.http.put(`http://ec2-52-202-126-186.compute-1.amazonaws.com:8080/app1/clearTicket/`, obj);
  }

  undoclearTicket(obj) {
    return this.http.put(`http://ec2-52-202-126-186.compute-1.amazonaws.com:8080/app1/undoClearTicket/`, obj);
  }

  postAnnouncement(obj) {
    return this.http.post(`http://ec2-52-202-126-186.compute-1.amazonaws.com:8080/app1/postAnnouncement/`, obj)
  }

  getAnnouncement() {
    return this.http.get(`http://ec2-52-202-126-186.compute-1.amazonaws.com:8080/app1/getAnnouncement/`);

  }

  adminloginCheck(obj) {
    return this.http.post(`http://ec2-52-202-126-186.compute-1.amazonaws.com:8080/app1/checkLogin`, obj);
  }
  checkForPotentialWaitTime() {
    return this.http.get(`http://ec2-52-202-126-186.compute-1.amazonaws.com:8080/app1/potentialWaitTime`);
  }


}
