import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/api/http.service';
import { User } from 'src/app/Models/user';
import { CommonValidators } from 'src/app/validators/common-validators';

@Component({
    selector: 'app-register-page',
    templateUrl: './register-page.component.html',
    styleUrls: ['./register-page.component.scss'],
    providers: [HttpService]
})
export class RegisterPageComponent implements OnInit {
    user: User;
    form: FormGroup;
    email: FormControl;
    username: FormControl;
    birthday: FormControl;
    password: FormControl;
    confirmPassword: FormControl;

    constructor(private router: Router, private httpService: HttpService) { }

    ngOnInit(): void {
        this.email = new FormControl('', [Validators.required,
            CommonValidators.noWhiteSpace, CommonValidators.emailPattern]);
        this.username = new FormControl('', [Validators.required,
            CommonValidators.noWhiteSpace, Validators.minLength(3)]);
        this.birthday = new FormControl('', [ Validators.required,
            CommonValidators.datePattern]);
        this.password = new FormControl('', [Validators.required,
            CommonValidators.noWhiteSpace, CommonValidators.passwordPattern]);
        this.confirmPassword = new FormControl('', [Validators.required,
            CommonValidators.noWhiteSpace]);

        this.form = new FormGroup({
            Email: this.email,
            Username: this.username,
            Birthday: this.birthday,
            Password: this.password,
            ConfirmPassword: this.confirmPassword,
        });
    }

    onRegisterClick(): void {
        this.validateForm();
        if (!this.form?.valid) { return; }
        this.user = {
            user_id: null,
            token: null,
            email: this.form.value['Email'],
            username: this.form.value['Username'],
            password: this.form.value['Password'],
            role: "BusinessPartner"
        };
        this.httpService.registerUser(this.user)
            .subscribe((data: any) =>{
                if (data['status'] as number == 201) {
                    this.router.navigateByUrl('/login');
                }
            });
    }

    onBackToLoginClick(): void {
        this.router.navigateByUrl("/login");
    }

    private validateForm(): void {
        const email = this.form.get('Email');
        const username = this.form.get('Username');
        const password = this.form.get('Password');
        const confirmPassword = this.form.get('ConfirmPassword');

        if (email.errors?.required || email.errors?.whitespace) {
            email.setErrors({ ...email.errors, emailRequired: true });
        }

        if (email.errors?.emailPattern){
            email.setErrors({ ...email.errors, emailInvalid: true });
        }

        if (username.errors?.required || username.errors?.whitespace) {
            username.setErrors({ ...username.errors, usernameRequired: true });
        }

        if (username.errors?.minlength){
            username.setErrors({ ...username.errors, usernameInvalid: true });
        }

        if (password.errors?.required || password.errors?.whitespace) {
            password.setErrors({ ...password.errors, passwordRequired: true });
        }

        if (password.errors?.passwordPattern) {
            password.setErrors({ ...password.errors, passwordInvalid: true });
        }
        
        if (confirmPassword.errors?.required || confirmPassword.errors?.whitespace) {
            confirmPassword.setErrors({ ...confirmPassword.errors, confirmPasswordRequired: true });
        }
     
        if (confirmPassword.value !== password.value) {
            confirmPassword.setErrors({ ...confirmPassword.errors, confirmPasswordInvalid: true });
        }
    }

}
