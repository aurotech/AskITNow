import { Component } from '@angular/core';
import {AuthService} from "../../services/auth-service/auth.service";
import {Router} from "@angular/router";
import {Ng4LoadingSpinnerService} from "ng4-loading-spinner";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginFail = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private spinner: Ng4LoadingSpinnerService,
  ) { }

  onSubmit(f) {
    this.spinner.show();
    this.auth.login(f.value)
      .subscribe(res => {
        if (res) {
          this.spinner.hide();
          this.router.navigate(['/admin']);
        } else {
          this.loginFail = true;
          return;
        }
      }, error1 => {
        this.spinner.hide();
        console.log(error1);
      });
  }

  reset(form) {
    form.form.reset();
  }


}
