import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {HttpModule} from "@angular/http";
import {FormsModule} from "@angular/forms";
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import {HashLocationStrategy, LocationStrategy} from "@angular/common";
import { FlashMessagesModule } from 'ngx-flash-messages';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { RequestCreatorComponent } from './components/request-creator/request-creator.component';
import { BannerComponent } from './components/banner/banner.component';
import { QueueDetailsComponent } from './components/queue-details/queue-details.component';
import { DataService } from './services/data.service';
import { AdminPanelComponent } from './components/admin-pannel/admin-panel.component';
import { LoginComponent } from './components/login/login.component';
import { MinutesPipePipe } from './minutes-pipe.pipe';
import { SuccessfulComponent } from './components/successful/successful.component';
import { AdminTicketComponent } from './components/admin-ticket/admin-ticket.component';


import {ToastModule} from 'primeng/toast';
import {GrowlModule} from 'primeng/growl';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';
import {ButtonModule} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';
import {DialogModule} from 'primeng/dialog';
import { AuthGaurdService } from './services/auth-gaurd.service';
import { AuthService } from './services/auth-service/auth.service';
import { WebSocketService } from './services/web-socket-service/web-socket.service';
import { ReslovedPipe } from './pipes/resloved.pipe';
import {OverlayPanelModule} from 'primeng/overlaypanel';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RequestCreatorComponent,
    BannerComponent,
    QueueDetailsComponent,
    AdminPanelComponent,
    LoginComponent,
    MinutesPipePipe,
    SuccessfulComponent,
    AdminTicketComponent,
    ReslovedPipe,
  ],
  imports: [
    ButtonModule,
    BrowserAnimationsModule,
    BrowserModule,
    ConfirmDialogModule,
    GrowlModule,
    ToastModule,
    InputTextModule,
    FlashMessagesModule,
    [ Ng4LoadingSpinnerModule.forRoot() ],
    HttpModule,
    DialogModule,
    FormsModule,
    DropdownModule,
    OverlayPanelModule,
    RouterModule.forRoot([
      {path: '', component: HomeComponent},
      {path: 'login', component: LoginComponent},
      {path: 'success', component: SuccessfulComponent},
      {path: 'admin', component: AdminPanelComponent, canActivate: [AuthGaurdService]},
      {path: 'adminticket', component: AdminTicketComponent, canActivate: [AuthGaurdService]},
      {path: 'createarequest', component: RequestCreatorComponent},
      {path: 'queue', component: QueueDetailsComponent},
    ])
  ],
  providers: [DataService, {provide: LocationStrategy, useClass: HashLocationStrategy}, ConfirmationService, AuthGaurdService, AuthService, WebSocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
