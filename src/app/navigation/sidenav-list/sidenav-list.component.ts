import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MatSidenav} from '@angular/material';
import {Subscription} from 'rxjs';
import {AuthService} from '../../controller/service/auth.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit,OnDestroy{


  @Input() sidenav: MatSidenav;
  isAuth=false;
  authSubscription: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.authChanged.subscribe(authStatus => {
      this.isAuth = authStatus;
    });
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe()
  }

  logout() {
    this.authService.logout();
  }
}
