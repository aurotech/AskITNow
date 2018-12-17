import { Component, OnInit } from '@angular/core';
import {DataService} from "../../services/data.service";
import {Router} from "@angular/router";

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
    public router: Router
  ) { }

  ngOnInit() {
    this.data.checkForPotentialWaitTime()
      .subscribe(res => {
        const result = res.json();
        (result < 0) ? this.noTech = true : null;
      });
  }

  onClick(){
    this.router.navigate(['/createarequest']);
  }

}
