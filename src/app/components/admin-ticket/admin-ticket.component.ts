import { Component, OnInit } from '@angular/core';
import {DataService} from "../../services/data.service";

@Component({
  selector: 'app-admin-ticket',
  templateUrl: './admin-ticket.component.html',
  styleUrls: ['./admin-ticket.component.css']
})

export class AdminTicketComponent {
  categories;
  userRequestDetails;
  results;
  priority;
  userCategory;
  is_clicked = false;
  is_invalid;

  constructor(private data: DataService) {
    this.data.getCategories().subscribe(results => {
      this.categories = results;
    });
  }

  onChange(e) {

  }

  onSubmit(f) {
    f.value.email = f.value.email.toLowerCase() + '@fda.hhs.gov';
    this.userRequestDetails = f.value;
    console.log(this.userRequestDetails);
    if(f.form.valid){
      this.data.createTicketByAdmin(this.userRequestDetails).subscribe(res => {
        this.results = res;
        window.history.back();
      }, error => {
        this.is_clicked = true;
      });
    } else {
      this.is_invalid = true;
    }
    this.is_clicked = true;
  }

  reset(f) { f.reset(); }
}
