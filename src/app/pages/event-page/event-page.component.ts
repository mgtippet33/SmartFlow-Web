import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/api/http.service';
import { faPlusSquare, faTimes } from '@fortawesome/free-solid-svg-icons';
import { MyEvent } from 'src/app/Models/event';
import { CookieService } from 'src/app/services/cookie-service';
import * as bootstrap from 'bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-event-page',
    templateUrl: './event-page.component.html',
    styleUrls: ['./event-page.component.scss'],
    providers: [HttpService]
})
export class EventPageComponent implements OnInit {

    faPlusSquare = faPlusSquare;
    faTimes = faTimes;
    searchValue = '';
    searchValueControl: FormControl;
    token: string;
    events: Array<MyEvent>;
    searchEvents: Array<MyEvent>;
    currentEventID: number;

    constructor(private router: Router, private httpService: HttpService,
        public translate: TranslateService) { }

    ngOnInit(): void {
        this.searchEvents = this.events;
        this.searchValueControl = new FormControl(this.searchValue);

        this.token = CookieService.getCookie('JWT_token');
        if (this.token == null) { return }
        this.httpService.getEvents(this.token).subscribe({
            next: (data: any) => {
                data = data['body'];
                var events = new Array<MyEvent>();
                for (var i = 0; i < data.length; ++i) {
                    var myEvent = new MyEvent();
                    myEvent.event_id = data[i]['eventID'];
                    myEvent.name = data[i]["name"];
                    myEvent.description = data[i]["description"];
                    myEvent.image = data[i]["image"];
                    myEvent.coordinates = data[i]['coordinates'];
                    myEvent.openTime = data[i]["openTime"];
                    myEvent.closeTime = data[i]["closeTime"];
                    events.push(myEvent);
                }
                this.events = events;
                this.searchEvents = events;
            }
        });
    }

    onSearchFieldChange(value: any) {
        this.searchValue = value.toLowerCase();
        this.searchEvents = this.events.filter(
            x => x.name.toLowerCase().indexOf(this.searchValue) !=- 1 ||
            x.description.toLowerCase().indexOf(this.searchValue) != -1);
    }
    
    onCreateClick() {
        this.router.navigateByUrl("/event/create");
    }

    onEditClick(eventID: number) {
        this.router.navigateByUrl(`/event/edit/${eventID}`);
    }

    onOpenRemoveModal(eventID: number) {
        var removeModal = new bootstrap.Modal(document.getElementById("removeEventModal"), {
            keyboard: false
        });
        removeModal?.show();
        this.currentEventID = eventID;
    }

    onRemoveClick() {
        this.httpService.deleteEvent(this.token, this.currentEventID).subscribe(
            (data: any) => {
                this.ngOnInit();
            }
        );
    }

}
