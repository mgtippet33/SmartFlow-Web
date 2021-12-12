import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import * as bootstrap from 'bootstrap';
import { HttpService } from 'src/app/api/http.service';
import { User } from 'src/app/Models/user';
import { CookieService } from 'src/app/services/cookie-service';
import { CommonValidators } from 'src/app/validators/common-validators';

@Component({
	selector: 'app-profile-page',
	templateUrl: './profile-page.component.html',
	styleUrls: ['./profile-page.component.scss'],
	providers: [HttpService]
})
export class ProfilePageComponent implements OnInit {

	faTimes = faTimes;
	form: FormGroup;
	user: User = new User();
	notification: string;

	constructor(private router: Router, private httpService: HttpService,
		public translate: TranslateService) { }

	ngOnInit(): void {
        this.form = new FormGroup({
            Email: new FormControl('', [Validators.required]),
            Username: new FormControl('', [Validators.required]),
            Password: new FormControl('', [Validators.required]),
            ConfirmPassword: new FormControl('', [Validators.required]),
        });

		this.user.token = CookieService.getCookie('JWT_token')
		if (this.user.token == null) { return }

		this.httpService.getProfile(this.user.token).subscribe(
			(data: any) => {
				data = data['body'];
				this.user.email = data['email'];
				this.user.username = data['name'];

				this.initializeData();
			}
		);
	}

	private initializeData() {
        this.form = new FormGroup({
            Email: new FormControl(this.user.email, [Validators.required]),
            Username: new FormControl(this.user.username, [Validators.required]),
            Password: new FormControl('', [Validators.required]),
        });
	}


	private openNotificationModal() {
        var notificationModal = new bootstrap.Modal(document.getElementById("notificationModal"), {
            keyboard: false
        });
        notificationModal?.show();
    }
	
	onChangeProfileDataClick() {
		if (this.form.get("Email").value.length == 0 ||
				this.form.get("Username").value.length == 0) {
					this.translate.get('ACCOUNT.NOTIFICATION').subscribe(
						(res: string) => this.notification = res
					);
			this.openNotificationModal();
			return;
		}
        this.user.email = this.form.get("Email").value;
		this.user.username = this.form.get("Username").value;
		if (this.form.get("Password").value.length != 0) {
			this.user.password = this.form.get("Password").value;
		}


		this.httpService.updateUserProfile(this.user.token, this.user).subscribe(
            (data: any) => {
                if (data.status == 200) {
                    this.ngOnInit();
                }
            },
			(error: any) => {
				console.log(error);
				this.translate.get('ACCOUNT.EXSIST').subscribe(
					(res: string) => this.notification = res
				);
				this.openNotificationModal();
			}
        );
	}

	onLogOut() {
		CookieService.removeCookie();
		this.router.navigateByUrl('/');
	}

}
