import {Component} from "@angular/core";
import {DataService} from "../../services/data.service";
import {Ng4LoadingSpinnerService} from "ng4-loading-spinner";

@Component({
  selector: 'app-request-creator',
  templateUrl: './request-creator.component.html',
  styleUrls: ['./request-creator.component.css']
})

export class RequestCreatorComponent {
  categories = [];
  userRequestDetails;
  results;
  userCategory;
  is_disabled = true;

  constructor(
    private data: DataService,
    private spinner: Ng4LoadingSpinnerService,
  ) {
    this.spinner.show();
    this.data.getCategories()
      .subscribe(results => {
        this.spinner.hide();
        results.forEach((c) => {
          this.categories.push({label: c['category'], value: c['order']});
        });
      });
  }

  onSubmit(f) {
    f.value.email = f.value.email.toLowerCase() + '@fda.hhs.gov';
    this.userRequestDetails = f.value;
    if (f.form.valid && this.is_disabled) {
      this.is_disabled = false;
      this.spinner.show();
      this.data.createTicket(this.userRequestDetails)
        .subscribe(res => {
        this.results = res;
        this.spinner.hide();
          this.is_disabled = false;
      }, error => {
        console.log(JSON.stringify(error));
      });
    } else {
       this.is_disabled = false;
    }
  }

  reset(form) {form.reset(); }
}
