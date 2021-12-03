import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/api/http.service';
import { Item } from 'src/app/Models/item';
import { CookieService } from 'src/app/services/cookie-service';

@Component({
    selector: 'app-item-qrcode-page',
    templateUrl: './item-qrcode-page.component.html',
    styleUrls: ['./item-qrcode-page.component.scss'],
    providers: [HttpService]
})
export class ItemQrcodePageComponent implements OnInit {

    qrInfo:any;
    locationName: string;
    itemName: string;

    constructor(private router: Router, private httpService: HttpService,
        private route: ActivatedRoute) { }

    ngOnInit(): void {
        var token = CookieService.getCookie('JWT_token')
        if (token == null) { return }

        this.route.params.subscribe((params: any) => {
            var itemID = parseInt(params["itemID"]);
            if (itemID == null) {
                return;
            }

            this.httpService.getItems(token, itemID).subscribe(
                (data: any) => {
                    data = data['body'];
                    var item = new Item();
                    item.item_id = data['itemID'];
                    item.location_id = data['locationID'];
                    item.name = data['name'];
                    item.description = data['description'];
                    item.link = data['link'];
                    item.image = data['image'];

                    this.locationName = data.location.name;
                    this.itemName = data.name;
                    this.qrInfo = JSON.stringify(item);
                }
            );
        });
    }

}
