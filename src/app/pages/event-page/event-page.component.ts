import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/api/http.service';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { MyEvent } from 'src/app/Models/event';
import { CookieService } from 'src/app/services/cookie-service';

@Component({
    selector: 'app-event-page',
    templateUrl: './event-page.component.html',
    styleUrls: ['./event-page.component.scss'],
    providers: [HttpService]
})
export class EventPageComponent implements OnInit {

    faPlusSquare = faPlusSquare;
    searchValue = '';
    searchValueControl: FormControl;
    token: string;
    events: Array<MyEvent> = [
        {  name: "Event 1", description: "Descraption Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tincidunt tristique libero. Maecenas tempus, leo nec lacinia consectetur, nibh tortor.", image: null, coordinates: null, openTime: null, closeTime: null } as MyEvent,
        {  name: "Event 2", description: "Description 2", image: null, coordinates: null, openTime: null, closeTime: null } as MyEvent,
        {  name: "Event 3", description: "Description 3", image: null, coordinates: null, openTime: null, closeTime: null } as MyEvent,
        {  name: "Event 4", description: "Description 4", image: null, coordinates: null, openTime: null, closeTime: null } as MyEvent,
        {  name: "Event 5", description: "Description 5", image: null, coordinates: null, openTime: null, closeTime: null } as MyEvent,
        {  name: "Event 6", description: "Description 6", image: null, coordinates: null, openTime: null, closeTime: null } as MyEvent,
        {  name: "Event 7", description: "Description 7", image: null, coordinates: null, openTime: null, closeTime: null } as MyEvent,
        {  name: "Event 8", description: "Description 8", image: null, coordinates: null, openTime: null, closeTime: null } as MyEvent,
        {  name: "Event 9", description: "Description 9", image: null, coordinates: null, openTime: null, closeTime: null } as MyEvent
    ];
    searchEvents: Array<MyEvent>;

    constructor(private router: Router, private httpService: HttpService) { }

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
        
    }

    onEditClick() {

    }

    onRemoveClick() {
        
    }

}
