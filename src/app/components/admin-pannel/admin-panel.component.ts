import {Component, OnInit} from "@angular/core";
import {DataService} from "../../services/data.service";
import {Ng4LoadingSpinnerService} from "ng4-loading-spinner";
import {Router} from "@angular/router";
import {ConfirmationService} from 'primeng/api';
import {AuthService} from "../../services/auth-service/auth.service";

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
})
export class AdminPanelComponent implements OnInit {
  totalTickets;
  technicianId;
  technicianName;
  selectedAction;
  selectedDuration;
  actions;
  newMessage = '';
  msg = [];
  display = false;
  display2 = false;
  durations;
  ticketsResolved = false;

  constructor(
    private data: DataService,
    private spinner: Ng4LoadingSpinnerService,
    private router: Router,
    private auth: AuthService,
    private confirmationService: ConfirmationService
  ) {

    this.callServices();
    this.technicianId = this.auth.currentUser().technicianId;
    this.technicianName = this.auth.currentUser().technicianName;

      const ws = new WebSocket('ws://ec2-10-192-49-9.compute-1.amazonaws.com:8080/update_admin_view/');
      ws.onopen = () => console.warn('Listening to WebSocket...');
      ws.onclose = () =>  console.log('WS closed...');
        // window.location.reload()
      ws.onmessage = (result) => {
        const res  = JSON.parse(result.data);

        if (!Array.isArray(res)) {
          let newTicketFound = true;
          this.totalTickets.forEach((tik) => {
            if (tik.ticket === res.ticket) {
              this.totalTickets[this.totalTickets.indexOf(tik)] = res;
              newTicketFound = false;
            }
          });
          if (newTicketFound) this.totalTickets.push(res);
        } else {
          this.totalTickets = res;
          console.log(res);
        }
      };
    }

  ngOnInit() {
    this.actions = [
      {label: 'Admin Actions', value: null},
      {label: 'Show Resolved', value: 'Resolved'},
      {label: 'Make Announcement', value: 'Make Announcement'},
      {label: 'Create Ticket', value: 'Create Ticket'},
      {label: 'Temporary Stoppage', value: 'Temporary Stoppage'},
      {label: 'Logout', value: 'Logout'},
    ];

    this.durations = [
      {label: 'Options', value: null},
      {label: '5 Min', value: '5'},
      {label: '10 Min', value: '10'},
      {label: '15 Min', value: '15'},
      {label: '30 Min', value: '30'},
    ];
  }

  callServices() {
    this.spinner.show();
    this.data.getWaitTime().subscribe(res => {
      this.spinner.hide();
      this.totalTickets = res;
    }, error => {
      this.spinner.hide();
      console.error(error);
    });
  }


  showMessages(message, type?) {
    this.msg = [];
    if (message && !type) {
      this.msg.push({severity: 'success', summary: 'Success', detail:  message});
    } else {
      this.msg.push({severity: type, summary: 'Message', detail:  message});
    }
  }

  change(value) {
    if (value === 'Make Announcement') {
      this.display = true;
      this.selectedAction = '';

    } else if (value === 'Create Ticket') {
      this.router.navigate(['/adminticket']);
    } else if (value === 'Temporary Stoppage') {
      this.ticketsResolved = true;
      this.selectedAction = '';

    } else if (value === 'Resolved') {
      this.ticketsResolved = true;
      this.selectedAction = '';

      this.actions.splice(1, 1, {label: 'Show Active', value: 'Active'});
    } else if (value === 'Active') {
      this.ticketsResolved = false;
      this.selectedAction = '';
      this.actions.splice(1, 1, {label: 'Show Resolved', value: 'Resolved'});
    } else if (value === 'Logout') {
      localStorage.clear();
      this.router.navigate(['/login']);
      this.data.logoutCheck({technician_id: this.technicianId})
        .subscribe(res => {
          localStorage.clear();
          this.router.navigate(['/login']);
        });
    }
  }


  stopReloadAndCancel() {
    window.addEventListener('beforeunload', function (e) {
      const confirmationMessage = 'Are you sure to leave?';
      e.returnValue = confirmationMessage;
      return confirmationMessage;
    });
  }
  //
  // checkForTechnician() {
  //
  //   this.technicianId = localStorage.getItem('id');
  //   this.technicianName = localStorage.getItem('name');
  //   if (!this.technicianId) {
  //     this.router.navigate(['/login']);
  //     return;
  //   }
  //   const data = {
  //     technician_id: this.technicianId
  //   };
  //
  //   this.data.adminloginCheck(data).subscribe(res => {
  //     this.online = res['_body'];
  //       if (this.online == 'False') {
  //         this.router.navigate(['/login']);
  //         localStorage.removeItem('id');
  //         localStorage.removeItem('name');
  //       }}, error => {
  //       console.log(error);
  //   });
  // }

  onAccept(event, t) {
    const data = {
      ticket_id: t.ticket,
      technician_id: this.technicianId
    };

   // IF TICKET IS ACCEPTED

    if (!t.is_accepted) {
      this.data.acceptTicket(data)
        .subscribe(res => {
          if (res['_body'] === 'Ticket Accepted.') {
            t.is_accepted = true;
          }
          this.showMessages(res['_body'], 'warn');

        }, error => {
          this.spinner.hide();
          console.error(error);
        });
    }
    // IF TICKET IS UNACCEPTED
    else {
        this.spinner.show();
        this.data.unacceptTicket(data).subscribe(res => {
          this.spinner.hide();
          if (res['_body'] === 'You have released this ticket.') {
            t.is_accepted = false;
          }
          this.showMessages(res['_body'], 'warn');

        }, error => {
          this.spinner.hide();
          console.error(error);
        });
    }
  }

  onResolve(e, t) {
    const data = {
      ticket_id: t.ticket,
      technician_id: this.technicianId
    };
// IF TICKET IS RESOLVED

    if (!t.is_resolved) {
      this.spinner.show();
      this.data.resolveTicket(data).subscribe(res => {
        this.spinner.hide();
        if (res['_body'] === 'Ticket is resolved') {
          t.is_resolved = true;
          t.is_accepted = true;
          return;
        } else if (res['_body'] === 'Ticket is not assigned to you.') {
          this.showMessages(res['_body'], 'warn');
          return;
        }
        this.showMessages(res['_body']);
      }, error => {
        this.spinner.hide();
        console.error(error);
      });
    }
// IF TICKET IS UNRESOLVED
    else if (t.is_accepted) {
      this.spinner.show();
      this.data.unresolveTicket(data).subscribe(res => {
        this.spinner.hide();
        if (res['_body'] === 'Ticket is reopened.') {
          t.is_resolved = false;
          t.is_accepted = true;
          return;
        } else if (res['_body'] === 'Ticket is not assigned to you.') {
          this.showMessages(res['_body'], 'warn');
          return;
        }
        this.showMessages(res['_body']);
      }, error => {
        this.spinner.hide();
        console.error(error);
      });
    }
// IF TICKET IS UNCLEARED
    else {
      this.spinner.show();
      this.data.undoclearTicket(data).subscribe(res => {
        this.spinner.hide();
        this.showMessages(res['_body'], 'warn');
        t.is_resolved = false;
        t.is_accepted = false;
      }, error => {
        this.spinner.hide();
        console.error(error);
      });
    }
  }

  clearTicket(t) {
      const data = {
        ticket_id: t.ticket
      };
    this.confirmationService.confirm({
      message: 'Are you sure you want to clear this ticket ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.msg = [{severity: 'info', summary: 'Confirmed', detail: 'You have accepted'}];
        this.spinner.show();
        this.data.clearTicket(data).subscribe(res => {
          this.spinner.hide();
          this.showMessages(res['_body'], 'error');
          t.is_resolved = true;
          t.is_accepted = true;
        }, error => {
          this.spinner.hide();
          console.error(error);
        });
        },
      reject: () => {
        return;
      }
    });
  }

  Announcement() {
    this.display = false;
    this.data.postAnnouncement({announcement_text: this.newMessage})
      .subscribe(res => res);
  }

  onStop(duration) {
    this.display2 = false;
    const data = {
      technician_id: this.technicianId,
      duration
    };
    this.spinner.show();
    this.data.tempStop(data).subscribe(res => {
      this.spinner.hide();
      this.showMessages(res['_body']);
      this.stopReloadAndCancel();
      this.continueWork(duration);
    }, error => {
      this.spinner.hide();
      console.error(error);
    });

  }

  continueWork(e) {
    this.confirmationService.confirm({
      message: 'Resume to your work?',
      header: 'You are on hold for ' + e + ' Minutes',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.spinner.show();
        this.data.undoStop({technician_id: this.technicianId}).subscribe(res => {
          this.showMessages(res['_body']);
          this.spinner.hide();
          localStorage.removeItem('adminTimeOut');
        }, error => {
          this.spinner.hide();
          console.error(error);
        });
      },
    });
  }

}

