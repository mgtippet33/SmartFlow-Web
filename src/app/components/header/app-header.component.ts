import { Component, Input, OnInit } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
    selector: 'app-header',
    templateUrl: './app-header.component.html',
    styleUrls: ['./app-header.component.scss']
})

export class HeaderComponent implements OnInit {

    constructor(private router: Router) {    }
    
    ngOnInit(): void {
        
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
}