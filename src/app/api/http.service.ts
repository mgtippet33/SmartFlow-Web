import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ApiConstants } from "./ApiConstants";
import { User } from "../Models/user";

@Injectable()
export class HttpService {

    constructor(private http: HttpClient) { }

    registerUser(user: User) {
        const headers = { 'content-type': 'application/json' }
        const body = {
            email: user.email,
            name: user.username,
            password: user.password,
            role: user.role
        };
        var register_url = ApiConstants.main_url.toString() + ApiConstants.register_url.toString()
        return this.http.post(register_url, body, { 'headers': headers, observe: 'response' });
    }

    loginUser(email: string, password: string) {
        const headers = { 'content-type': 'application/json' }
        const body = {
            email: email,
            password: password
        };
        var login_url = ApiConstants.main_url.toString() + ApiConstants.login_url.toString()
        return this.http.post(login_url, body, { 'headers': headers, observe: 'response' });
    }
}