import {Component, OnInit} from '@angular/core';
import {DataService} from '../../services/data.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';


@Component({
  selector: 'app-queue-details',
  templateUrl: './queue-details.component.html',
  styleUrls: ['./queue-details.component.css']
})
export class QueueDetailsComponent implements OnInit {
  waitTimeDetails;
  totalWaitTime;
  myDate;
  message;
  time;
  totalTickets;

  state = {
    no_tech: false,
    no_tickets: false,
    visible: true
  };

  constructor(
    private data: DataService,
    private spinner: Ng4LoadingSpinnerService,
  ) {
    this.callServices();
    // this.checkForAnnouncements();

    const ws = new WebSocket('ws://ec2-52-202-126-186.compute-1.amazonaws.com:8080/announce/');
    ws.onopen = () => console.warn('Listening to WebSocket...');
    ws.onclose = () =>  console.log('WS closed...');

    ws.onmessage =  (ev) => {
      this.message = JSON.parse(ev.data)['annoucement'];
      this.time = JSON.parse(ev.data)['time'];
    };
  }

  ngOnInit() {
    setInterval(() => {
      this.myDate = new Date();
    }, 1000);
  }


  callServices() {
    this.spinner.show();
     this.data.getWaitTimeForCustomers()
       .subscribe(res => {
      if (res === null ) {
        this.spinner.hide();
        this.totalWaitTime = 1;
        this.state.no_tech = true;
        this.state.no_tickets = true;
        this.state.visible = false;

      } else if (res.length <= 1) {
        this.spinner.hide();
        this.state.no_tickets = true;
        this.state.no_tech = false;
        this.waitTimeDetails = res;
        this.totalWaitTime = Number(this.waitTimeDetails.pop().wait_time);
      } else {
        this.spinner.hide();
        this.waitTimeDetails = res;
        this.totalWaitTime = Number(this.waitTimeDetails.pop().wait_time);
        this.state.no_tickets = false;
        this.state.no_tech = false;
        this.state.visible = true;
      }
     });
  }

  // checkForAnnouncements() {
  //   this.data.getAnnouncement().subscribe(res => {
  //     this.announcements = res.json();
  //     this.message = this.announcements.annoucement;
  //     this.time = this.announcements.time;
  //   });
  // }
}
