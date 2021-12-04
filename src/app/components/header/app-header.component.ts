import { Component, Input, OnInit } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/api/http.service';
import { CookieService } from 'src/app/services/cookie-service';


@Component({
    selector: 'app-header',
    templateUrl: './app-header.component.html',
    styleUrls: ['./app-header.component.scss'],
    providers: [HttpService]
})

export class HeaderComponent implements OnInit {

    isAdmin: boolean = false;

    constructor(private router: Router, private httpService: HttpService) {    }
    
    ngOnInit(): void {
        var token = CookieService.getCookie('JWT_token');
        if (token == null) { return }

        this.httpService.getProfile(token).subscribe(
            (data: any) => {
                data = data['body'];
                this.isAdmin = data['role'] == 'Administrator' ? true: false;
            }
        );
    }

    onEventClick(){
        this.router.navigateByUrl('/event');
    }

    onStatisticsClick(){
        this.router.navigateByUrl('/statistics');
    }

    onProfileClick(){
        this.router.navigateByUrl('/profile');
    }

    onUserClick() {
        this.router.navigateByUrl('/users');
    }
}