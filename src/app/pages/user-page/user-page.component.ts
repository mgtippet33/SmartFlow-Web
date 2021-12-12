import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { faPlusSquare, faTimes } from '@fortawesome/free-solid-svg-icons';
import * as bootstrap from 'bootstrap';
import { HttpService } from 'src/app/api/http.service';
import { User } from 'src/app/Models/user';
import { CookieService } from 'src/app/services/cookie-service';

@Component({
    selector: 'app-user-page',
    templateUrl: './user-page.component.html',
    styleUrls: ['./user-page.component.scss'],
    providers: [HttpService]
})
export class UserPageComponent implements OnInit {

    faPlusSquare = faPlusSquare;
    faTimes = faTimes;
    searchValue = '';
    searchValueControl: FormControl;
    token: string;
    users: Array<User>;
    searchUsers: Array<User>;
    currentUserID: number;

    constructor(private router: Router, private httpService: HttpService) { }

    ngOnInit(): void {
        this.searchValueControl = new FormControl(this.searchValue);

        this.token = CookieService.getCookie('JWT_token');
        if (this.token == null) { return }

        this.httpService.getProfile(this.token).subscribe(
            (data: any) => {
                data = data['body'];
                var isAdmin = data['role'] == 'Administrator' ? true: false;
                if (!isAdmin) {
                    this.router.navigateByUrl('/event');
                }
            }
        );
        
        this.httpService.getUsers(this.token).subscribe({
            next: (data: any) => {
                data = data['body'];
                var users = new Array<User>();
                for (var i = 0; i < data.length; ++i) {
                    var user = new User();
                    user.user_id = data[i]['userID'];
                    user.username = data[i]["name"];
                    user.email = data[i]["email"];
                    user.role = data[i]["role"];
                
                    users.push(user);
                }
                this.users = users;
                this.searchUsers = users;
            }
        });
    }

    onSearchFieldChange(value: any) {
        this.searchValue = value.toLowerCase();
        this.searchUsers = this.users.filter(
            x => x.username.toLowerCase().indexOf(this.searchValue) !=- 1 ||
            x.email.toLowerCase().indexOf(this.searchValue) != -1);
    }
    
    onCreateClick() {
        this.router.navigateByUrl("/user/create");
    }

    onEditClick(userID: number) {
        this.router.navigateByUrl(`/user/edit/${userID}`);
    }

    onOpenRemoveModal(userID: number) {
        var removeModal = new bootstrap.Modal(document.getElementById("removeEventModal"), {
            keyboard: false
        });
        removeModal?.show();
        this.currentUserID = userID;
    }

    onRemoveClick() {
        this.httpService.deleteUser(this.token, this.currentUserID).subscribe(
            (data: any) => {
                this.ngOnInit();
            }
        );
    }

}
