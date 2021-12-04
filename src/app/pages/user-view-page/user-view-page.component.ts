import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import * as bootstrap from 'bootstrap';
import { HttpService } from 'src/app/api/http.service';
import { User } from 'src/app/Models/user';
import { CookieService } from 'src/app/services/cookie-service';

@Component({
    selector: 'app-user-view-page',
    templateUrl: './user-view-page.component.html',
    styleUrls: ['./user-view-page.component.scss'],
    providers: [HttpService]
})
export class UserViewPageComponent implements OnInit {

    faTimes = faTimes;
    form: FormGroup;
    token: string;
    user: User = new User();
    notification: string;
    isCreateAction: boolean = true;

    constructor(private router: Router, private httpService: HttpService,
        private route: ActivatedRoute) { }

	ngOnInit(): void {
        this.form = new FormGroup({
            Email: new FormControl('', [Validators.required]),
            Username: new FormControl('', [Validators.required]),
            Password: new FormControl('', [Validators.required]),
            Role: new FormControl('', [Validators.required]),
        });

		this.token = CookieService.getCookie('JWT_token')
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

        this.isCreateAction = this.router.url.indexOf("/user/create") != -1 ? true: false;
        this.route.params.subscribe((params: any) => {
            if(!this.isCreateAction) {
                this.initializeEditingPage(params);
            }
        });
		
	}

    private initializeEditingPage(params: any) {
        var userID = Number.parseInt(params['userID']);

        this.httpService.getUsers(this.token, userID).subscribe(
            (data: any) => {
                data = data['body'];
                var user = new User();
                user.user_id = data['userID'];
                user.username = data["name"];
                user.email = data["email"];
                user.role = data["role"];

                this.user = user;
                this.initializeData();
            }
        );
    }

	private initializeData() {
        this.form = new FormGroup({
            Email: new FormControl(this.user.email, [Validators.required]),
            Username: new FormControl(this.user.username, [Validators.required]),
            Password: new FormControl('', [Validators.required]),
            Role: new FormControl(this.user.role, [Validators.required]),
        });
	}


	private openNotificationModal() {
        var notificationModal = new bootstrap.Modal(document.getElementById("notificationModal"), {
            keyboard: false
        });
        notificationModal?.show();
    }
	
    onCreateUserClick() {
        if (!this.form?.valid) { return; }
        this.user = {
            user_id: null,
            token: null,
            email: this.form.value['Email'],
            username: this.form.value['Username'],
            password: this.form.value['Password'],
            role: this.form.value['Role']
        };
        this.httpService.registerUser(this.user)
            .subscribe(
                (data: any) =>{
                    if (data['status'] == 201) {
                        this.router.navigateByUrl('users');
                    }
                },
                (error: any) => {
                    console.log(error);
                    this.notification = "An account with such data already exists.";
                    this.openNotificationModal();
                }
            );
    }

	onChangeProfileDataClick() {
		if (this.form.get("Username").value.length == 0 ||
                this.form.get("Email").value.length == 0 ||
                this.form.get("Role").value.length == 0) {
			this.notification = "You must fill in all the details of the user profile."
			this.openNotificationModal();
			return;
		}
        this.user.email = this.form.get("Email").value;
		this.user.username = this.form.get("Username").value;
        this.user.role = this.form.get("Role").value;
		if (this.form.get("Password").value.length != 0) {
			this.user.password = this.form.get("Password").value;
		}


		this.httpService.updateUserProfileByAdmin(this.token, this.user).subscribe(
            (data: any) => {
                if (data.status == 200) {
                    this.ngOnInit();
                }
            },
			(error: any) => {
				console.log(error);
				this.notification = "An account with such data already exists.";
				this.openNotificationModal();
			}
        );
	}
}
