import { Component, OnInit } from '@angular/core';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/api/http.service';
import { CookieService } from 'src/app/services/cookie-service';
import { Location } from 'src/app/Models/location';
import { faEdit, faPlusSquare, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Item } from 'src/app/Models/item';
import * as bootstrap from 'bootstrap';

@Component({
    selector: 'app-location-page',
    templateUrl: './location-page.component.html',
    styleUrls: ['./location-page.component.scss'],
    providers: [HttpService]
})
export class LocationPageComponent implements OnInit {

    faTimes = faTimes;
    faPlusSquare = faPlusSquare;
    faEdit = faEdit;
    faTrash = faTrash;
    form: FormGroup;
    token: string;
    isCreateAction: boolean;
    location: Location = new Location();
    items: Array<Item>;
    notification: string;
    currentItemID: number;

    constructor(private router: Router, private httpService: HttpService,
        private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.form = new FormGroup({
            LocationName: new FormControl('', [Validators.required]),
            Description: new FormControl('', [Validators.required]),
            State: new FormControl('', [Validators.required]),
        });

        this.token = CookieService.getCookie('JWT_token')
        if (this.token == null) { return }

        this.isCreateAction = this.router.url.indexOf("/location/create") != -1 ? true: false;
        this.route.params.subscribe((params: any) => {
            if (this.isCreateAction) {
                this.initializeCreationPage(params);
            }
            else {
                this.initializeEditingPage(params);
            }
        });

    }

    private initializeCreationPage(params: any) {
        var eventID = Number.parseInt(params['eventID']);
        this.location.event_id = eventID;
    }

    private initializeEditingPage(params: any) {
        var locationID = Number.parseInt(params['locationID']);

        this.httpService.getLocations(this.token, locationID).subscribe(
            (data: any) => {
                data = data['body'];
                var location = new Location();
                location.location_id = locationID;
                location.event_id = data['eventID'];
                location.name = data['name']; 
                location.description = data['description'];
                location.state = data['state'];

                this.location = location;
                this.initializeData();
            }
        );

        this.httpService.getItemsByLocation(this.token, locationID).subscribe(
            (data: any) => {
                data = data['body'];
                var items = new Array<Item>();
                for (var i = 0; i < data.length; ++i) {
                    var item = new Item();
                    item.item_id = data[i]['itemID'];
                    item.location_id = data[i]['locationID'];
                    item.name = data[i]['name'];
                    item.description = data[i]['description'];
                    item.image = data[i]['image'];
                    item.link = data[i]['link'];

                    items.push(item);
                }
                this.items = items;
            }
        );
    }

    private initializeData() {
        this.form = new FormGroup({
            LocationName: new FormControl(this.location.name,
                [Validators.required]),
            Description: new FormControl(this.location.description,
                [Validators.required]),
            State: new FormControl(this.location.state,
                [Validators.required]),
        });
    }

    private openNotificationModal() {
        var notificationModal = new bootstrap.Modal(document.getElementById("notificationModal"), {
            keyboard: false
        });
        notificationModal?.show();
    }
    
    onCreateLocationClick() {
        if (!this.form?.valid) { 
            this.notification = 'You must fill in all the details of the location.';
            this.openNotificationModal();
            return; 
        }
        this.location.name = this.form.get("LocationName").value;
        this.location.description = this.form.get("Description").value;
        this.location.state = this.form.get('State').value;

        this.httpService.createLocation(this.token, this.location).subscribe(
            (data: any) => {
                if (data.status == 201) {
                    this.router.navigateByUrl(`/event/edit/${this.location.event_id}`);
                }
            }
        );
    }

    onEditLocationClick() {
        if (!this.form?.valid) { 
            this.notification = 'You must fill in all the details of the location.';
            this.openNotificationModal();
            return; 
        }
        this.location.name = this.form.get("LocationName").value;
        this.location.description = this.form.get("Description").value;
        this.location.state = this.form.get('State').value;

        this.httpService.updateLocation(this.token, this.location).subscribe(
            (data: any) => {
                if (data.status == 200) {
                    this.ngOnInit();
                }
            }
        );
    }

    onCreateItemClick() {
        this.router.navigateByUrl(`location/${this.location.location_id}/item/create`);
    }

    onEditItemClick(itemID: number) {
        this.router.navigateByUrl(`item/edit/${itemID}`);
    }

    onOpenRemoveModal(itemID: number) {
        var removeModal = new bootstrap.Modal(document.getElementById('removeModal'), {
            keyboard: false
        });
        removeModal?.show();
        this.currentItemID = itemID;
    }

    onRemoveItemClick() {
        this.httpService.deleteItem(this.token, this.currentItemID).subscribe(
            (data: any) => {
                this.ngOnInit();
            }
        );
    }


}
