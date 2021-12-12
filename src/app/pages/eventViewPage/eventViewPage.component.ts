import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/api/http.service';
import { faEdit, faPlusSquare, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { MyEvent } from 'src/app/Models/event';
import { Location } from 'src/app/Models/location';
import { CookieService } from 'src/app/services/cookie-service';
import { CommonValidators } from 'src/app/validators/common-validators';
import * as bootstrap from 'bootstrap';
import { Loader } from '@googlemaps/js-api-loader';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-event-view-page',
    templateUrl: './eventViewPage.component.html',
    styleUrls: ['./eventViewPage.component.scss'],
    providers: [HttpService]
})

export class EventViewPageComponent implements OnInit {

    faPlusSquare = faPlusSquare;
    faTimes = faTimes;
    faTrash = faTrash;
    faEdit = faEdit;
    searchValue = '';
    searchValueControl: FormControl;
    token: string;
    notification: string;
    event: MyEvent = new MyEvent();
    isCreateAction: boolean = true;
    form: FormGroup;
    map: any;
    markers: google.maps.Marker[] = [];
    locations: Array<Location>;
    currentLocationID: number;


    constructor(private router: Router, private httpService: HttpService,
        private route: ActivatedRoute, public translate: TranslateService) { }

    ngOnInit(): void {
        this.form = new FormGroup({
            EventName: new FormControl('', [Validators.required]),
            Description: new FormControl('', [Validators.required]),
            OpenTime: new FormControl('', [Validators.required]),
            CloseTime: new FormControl('', [Validators.required])
        });

        this.token = CookieService.getCookie('JWT_token')
        if (this.token == null) { return }

        this.route.params.subscribe((params: any) => {
            var eventID = null;
            if (params['eventID'] != null) {
                eventID = Number.parseInt(params['eventID']);
                this.isCreateAction = false;
            }

            if (!this.isCreateAction) {
                this.httpService.getEvents(this.token, eventID).subscribe(
                    (data: any) => {
                        data = data['body'];
                        var event = new MyEvent();
                        event.event_id = data["eventID"];
                        event.name = data["name"];
                        event.description = data["description"];
                        event.image = data["image"];
                        event.coordinates = data["coordinates"];
                        event.openTime = data["openTime"];
                        event.closeTime = data["closeTime"];

                        this.event = event;
                        this.initializeData();
                    }
                );

                this.httpService.getLocationsByEvent(this.token, eventID).subscribe(
                    (data: any) => {
                        data = data['body'];
                        var locations = new Array<Location>();
                        for (var i = 0; i < data.length; ++i) {
                            var location = new Location();
                            location.location_id = data[i]['locationID'];
                            location.event_id = data[i]['eventID'];
                            location.name = data[i]['name'];
                            location.description = data[i]['description'];
                            location.state = data[i]['state'];

                            locations.push(location);
                        }

                        this.locations = locations;
                    }
                )
            }
        });

        this.googleMapLoader();
    }

    private openNotificationModal() {
        var notificationModal = new bootstrap.Modal(document.getElementById("notificationModal"), {
            keyboard: false
        });
        notificationModal?.show();
    }
    
    onCreateEventClick() {
        if (!this.form?.valid || this.event.coordinates == null ||
            this.event.image == null) { 
            this.translate.get('EVENT.NOTIFICATION').subscribe(
                (res: string) => this.notification = res
            );
            this.openNotificationModal();
            return; 
        }
        this.event.name = this.form.get("EventName").value;
        this.event.description = this.form.get("Description").value;
        this.event.openTime = this.form.get('OpenTime').value.toString();
        this.event.closeTime = this.form.get('CloseTime').value.toString();

        this.httpService.createEvent(this.token, this.event).subscribe(
            (data: any) => {
                if (data.status == 201) {
                    this.router.navigateByUrl(`/event`)
                }
            }
        );
    }

    onEditEventClick() {
        if (!this.form?.valid || this.event.coordinates == null ||
            this.event.image == null) { 
                this.translate.get('EVENT.NOTIFICATION').subscribe(
                    (res: string) => this.notification = res
                );
            this.openNotificationModal();
            return; 
        }
        this.event.name = this.form.get("EventName").value;
        this.event.description = this.form.get("Description").value;
        this.event.openTime = this.form.get('OpenTime').value.toString();
        this.event.closeTime = this.form.get('CloseTime').value.toString();

        this.httpService.updateEvent(this.token, this.event).subscribe(
            (data: any) => {
                if (data.status == 200) {
                    this.ngOnInit();
                }
            }
        );
    }

    onOpenMapModal() {
        var mapsModal = new bootstrap.Modal(document.getElementById("mapsModal"), {
            keyboard: false
        });
        mapsModal?.show();
    }
   
    onFileChanged(event: any) {
        var image = event.target.files[0]
        if(image.type.indexOf("image/") == -1) {
            this.translate.get('NOTIFICATION.IMAGE').subscribe(
                (res: string) => this.notification = res
            );
            this.openNotificationModal();
            return;
        }
        this.httpService.uploadImage(image).subscribe(
            (data: any) => {
                var image_url = data['data']['display_url'];
                this.event.image = image_url;
            }
        );
    }

    private googleMapLoader() {
        var loader = new Loader({
            apiKey: "AIzaSyBo3mEVvXXn0ZedvU1evVBzMqauF7nVac4"
        });
        loader.load().then(() => {
            this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
                center: { lat: 50.0001899, lng: 36.2198268 },
                zoom: 13.08,
                styles: [
                    {
                      "featureType": "administrative",
                      "elementType": "geometry",
                      "stylers": [
                        {
                          "visibility": "off"
                        }
                      ]
                    },
                    {
                      "featureType": "poi",
                      "stylers": [
                        {
                          "visibility": "off"
                        }
                      ]
                    },
                    {
                      "featureType": "road",
                      "elementType": "labels.icon",
                      "stylers": [
                        {
                          "visibility": "off"
                        }
                      ]
                    },
                    {
                      "featureType": "transit",
                      "stylers": [
                        {
                          "visibility": "off"
                        }
                      ]
                    }
                  ]
            });
        });
    }

    onGetCoordinates(event: any) {
        this.map.addListener("click", (mapsMouseEvent: { latLng: { toJSON: () => any; }; }) => {
            var coord = mapsMouseEvent.latLng.toJSON();
            this.clearOverlays();
            this.setMarker(coord);
            this.event.coordinates = coord['lat'] + "," + coord["lng"];
        });
    }

    private setMarker(latLng: google.maps.LatLng) {
        var marker = new google.maps.Marker({
            position: latLng,
            map: this.map
        });
        this.markers.push(marker);
    }

    private clearOverlays() {
        for (var i = 0; i < this.markers.length; i++ ) {
            this.markers[i].setMap(null);
          }
          this.markers.length = 0;
    }

    private initializeData() {
        this.form = new FormGroup({
            EventName: new FormControl(this.event.name, [Validators.required]),
            Description: new FormControl(this.event.description,
                [Validators.required]),
            OpenTime: new FormControl(this.event.openTime,
                [Validators.required]),
            CloseTime: new FormControl(this.event.closeTime, [Validators.required])
        });

        var coord = this.event.coordinates.split(",")
        
        var latLng = new google.maps.LatLng(parseFloat(coord[0]),
            parseFloat(coord[1]));
        this.setMarker(latLng);
    }

    onCreateLocationClick() {
        this.router.navigateByUrl(`event/${this.event.event_id}/location/create`);
    }

    onEditClick(locationID: number) {
        this.router.navigateByUrl(`location/edit/${locationID}`);
    }

    onOpenRemoveModal(locationID: number) {
        var removeModal = new bootstrap.Modal(document.getElementById('removeModal'), {
            keyboard: false
        });
        removeModal?.show();
        this.currentLocationID = locationID;
    }

    onRemoveClick() {
        this.httpService.deleteLocation(this.token, this.currentLocationID)
            .subscribe((data: any) => {
                this.ngOnInit();
            });
    }
    
}
