import { Component, OnInit } from '@angular/core';
import {DataService} from "../../services/data.service";
import {Router} from "@angular/router";
import {Ng4LoadingSpinnerService} from "ng4-loading-spinner";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  noTech = false;
  message = 'No technicians available at this moment.';

  constructor(
    public data: DataService,
    public router: Router,
    public spinner: Ng4LoadingSpinnerService
  ) { }

  ngOnInit() {
    this.checkTechAvailability();
  }

checkTechAvailability() {
    this.spinner.show();
    this.data.checkForPotentialWaitTime()
      .subscribe(res => {
        this.spinner.hide();
        const result = res.json();
        (result < 0) ? this.noTech = true : null;
      });
}

  onClick() {
    this.router.navigate(['/createarequest']);
  }

}
