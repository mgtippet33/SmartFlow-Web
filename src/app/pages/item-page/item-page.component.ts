import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import * as bootstrap from 'bootstrap';
import { HttpService } from 'src/app/api/http.service';
import { Item } from 'src/app/Models/item';
import { CookieService } from 'src/app/services/cookie-service';

@Component({
    selector: 'app-item-page',
    templateUrl: './item-page.component.html',
    styleUrls: ['./item-page.component.scss'],
    providers: [HttpService]
})
export class ItemPageComponent implements OnInit {

    faTimes = faTimes;
    form: FormGroup;
    token: string;
    isCreateAction: boolean;
    item: Item = new Item();
    notification: string;

    constructor(private router: Router, private httpService: HttpService,
        private route: ActivatedRoute, public translate: TranslateService) { }

    ngOnInit(): void {
        this.form = new FormGroup({
            ItemName: new FormControl('', [Validators.required]),
            Description: new FormControl('', [Validators.required]),
            Link: new FormControl('', [Validators.required]),
        });

        this.token = CookieService.getCookie('JWT_token')
        if (this.token == null) { return }

        this.isCreateAction = this.router.url.indexOf("/item/create") != -1 ? true: false;
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
        var locationID = Number.parseInt(params['locationID']);
        this.item.location_id = locationID;
    }

    private initializeEditingPage(params: any) {
        var itemID = Number.parseInt(params['itemID']);

        this.httpService.getItems(this.token, itemID).subscribe(
            (data: any) => {
                data = data['body'];
                var item = new Item();
                item.item_id = itemID;
                item.location_id = data['locationID'];;
                item.name = data['name'];
                item.description = data['description'];
                item.image = data['image'];
                item.link = data['link'];

                this.item = item;
                this.initializeData();
            }
        );
    }

    private initializeData() {
        this.form = new FormGroup({
            ItemName: new FormControl(this.item.name,
                [Validators.required]),
            Description: new FormControl(this.item.description,
                [Validators.required]),
            Link: new FormControl(this.item.link, [Validators.required]),
        });
    }

    private openNotificationModal() {
        var notificationModal = new bootstrap.Modal(document.getElementById("notificationModal"), {
            keyboard: false
        });
        notificationModal?.show();
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
                this.item.image = image_url;
            }
        );
    }

    onCreateItemClick() {
        if (!this.form?.valid || this.item.image == null) { 
            this.translate.get('ITEM.NOTIFICATION').subscribe(
                (res: string) => this.notification = res
            );
            this.openNotificationModal();
            return; 
        }
        this.item.name = this.form.get("ItemName").value;
        this.item.description = this.form.get("Description").value;
        this.item.link = this.form.get('Link').value;

        this.httpService.createItem(this.token, this.item).subscribe(
            (data: any) => {
                if (data.status == 201) {
                    this.router.navigateByUrl(`/location/edit/${this.item.location_id}`);
                }
            }
        );
    }

    onEditItemClick() {
        if (!this.form?.valid || this.item.image == null) { 
            this.translate.get('ITEM.NOTIFICATION').subscribe(
                (res: string) => this.notification = res
            );
            this.openNotificationModal();
            return; 
        }
        this.item.name = this.form.get("ItemName").value;
        this.item.description = this.form.get("Description").value;
        this.item.link = this.form.get('Link').value;

        this.httpService.updateItem(this.token, this.item).subscribe(
            (data: any) => {
                if (data.status == 200) {
                    this.router.navigateByUrl(`/item/edit/${this.item.item_id}`);
                }
            }
        );
    }

}
