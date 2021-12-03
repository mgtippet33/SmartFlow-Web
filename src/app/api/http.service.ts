import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ApiConstants } from "./ApiConstants";
import { User } from "../Models/user";
import { MyEvent } from "../Models/event";
import { Location } from "../Models/location";
import { Item } from "../Models/item";


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

    getProfile(token: string) {
        const headers = { 'Authorization': 'Bearer ' + token, 'content-type': 'application/json' }
        var profile_url = ApiConstants.main_url.toString() + ApiConstants.profile_url.toString()
        return this.http.get(profile_url, { 'headers': headers, observe: 'response' });
    }

    updateUserProfile(token: string, user: User) {
        const headers = { 'Authorization': 'Bearer ' + token, 'content-type': 'application/json' }
        var body;
        if (user.password != null) {
            body = {
                email: user.email,
                name: user.username,
                password: user.password
            };
        } else {
            body = {
                email: user.email,
                name: user.username
            };
        }
        var profile_url = ApiConstants.main_url.toString() + ApiConstants.profile_url.toString()
        return this.http.put(profile_url, body, { 'headers': headers, observe: 'response' });
    }

    createEvent(token: string, event: MyEvent) {
        const headers = { 'Authorization': 'Bearer ' + token, 'content-type': 'application/json' }
        const body = {
            name: event.name,
            description: event.description,
            image: event.image,
            coordinates: event.coordinates,
            openTime: event.openTime,
            closeTime: event.closeTime
        };
        var event_url = ApiConstants.main_url.toString() + ApiConstants.event_url.toString()
        return this.http.post(event_url, body, { 'headers': headers, observe: 'response' });
    }

    getEvents(token: string, eventID: number = null) {
        const headers = { 'Authorization': 'Bearer ' + token, 'content-type': 'application/json' }
        var event_url = ApiConstants.main_url.toString() + ApiConstants.event_url.toString();
        if (eventID != null) {
            event_url += eventID.toString() + "/";
        }
        return this.http.get(event_url, { 'headers': headers, observe: 'response' });
    }

    updateEvent(token: string, event: MyEvent) {
        const headers = { 'Authorization': 'Bearer ' + token, 'content-type': 'application/json' }
        const body = {
            name: event.name,
            description: event.description,
            image: event.image,
            coordinates: event.coordinates,
            openTime: event.openTime,
            closeTime: event.closeTime
        };
        var event_url = ApiConstants.main_url.toString() + ApiConstants.event_url.toString() + event.event_id.toString() + "/"
        return this.http.put(event_url, body, { 'headers': headers, observe: 'response' });
    }

    deleteEvent(token: string, eventID: number) {
        const headers = { 'Authorization': 'Bearer ' + token, 'content-type': 'application/json' }
        var event_url = ApiConstants.main_url.toString() + ApiConstants.event_url.toString() + eventID.toString() + "/"
        return this.http.delete(event_url, { 'headers': headers, observe: 'response' });
    }

    createLocation(token: string, location: Location) {
        const headers = { 'Authorization': 'Bearer ' + token, 'content-type': 'application/json' }
        const body = {
            eventID: location.event_id,
            name: location.name,
            description: location.description,
            state: location.state
        };
        var location_url = ApiConstants.main_url.toString() + ApiConstants.location_url.toString()
        return this.http.post(location_url, body, { 'headers': headers, observe: 'response' });
    }

    getLocations(token: string, locationID: number = null) {
        const headers = { 'Authorization': 'Bearer ' + token, 'content-type': 'application/json' }
        var location_url = ApiConstants.main_url.toString() + ApiConstants.location_url.toString()
        if (locationID != null) {
            location_url += locationID.toString() + "/";
        }
        return this.http.get(location_url, { 'headers': headers, observe: 'response' });
    }
    
    getLocationsByEvent(token: string, eventID: number) {
        const headers = { 'Authorization': 'Bearer ' + token, 'content-type': 'application/json' }
        var location_url = ApiConstants.main_url.toString() +
            ApiConstants.locationsByEvent_url.toString() +
            eventID.toString() + "/";
        return this.http.get(location_url, { 'headers': headers, observe: 'response' });
    }

    updateLocation(token: string, location: Location) {
        const headers = { 'Authorization': 'Bearer ' + token, 'content-type': 'application/json' }
        const body = {
            eventID: location.event_id,
            name: location.name,
            description: location.description,
            state: location.state
        };
        var location_url = ApiConstants.main_url.toString() + 
            ApiConstants.location_url.toString() + location.location_id.toString() + "/"
        return this.http.put(location_url, body, { 'headers': headers, observe: 'response' });
    }

    deleteLocation(token: string, locationID: number) {
        const headers = { 'Authorization': 'Bearer ' + token, 'content-type': 'application/json' }
        var location_url = ApiConstants.main_url.toString() + 
            ApiConstants.location_url.toString() + locationID.toString() + "/"
        return this.http.delete(location_url, { 'headers': headers, observe: 'response' });
    }

    createItem(token: string, item: Item) {
        const headers = { 'Authorization': 'Bearer ' + token, 'content-type': 'application/json' }
        const body = {
            locationID: item.location_id,
            name: item.name,
            description: item.description,
            image: item.image,
            link: item.link
        };
        var item_url = ApiConstants.main_url.toString() + ApiConstants.item_url.toString()
        return this.http.post(item_url, body, { 'headers': headers, observe: 'response' });
    }

    getItems(token: string, itemID: number = null) {
        const headers = { 'Authorization': 'Bearer ' + token, 'content-type': 'application/json' }
        var item_url = ApiConstants.main_url.toString() + ApiConstants.item_url.toString()
        if (itemID != null) {
            item_url += itemID.toString() + "/";
        }
        return this.http.get(item_url, { 'headers': headers, observe: 'response' });
    }
    
    getItemsByLocation(token: string, locationID: number) {
        const headers = { 'Authorization': 'Bearer ' + token, 'content-type': 'application/json' }
        var item_url = ApiConstants.main_url.toString() +
            ApiConstants.itemsByLocation_url.toString() +
            locationID.toString() + "/";
        return this.http.get(item_url, { 'headers': headers, observe: 'response' });
    }

    updateItem(token: string, item: Item) {
        const headers = { 'Authorization': 'Bearer ' + token, 'content-type': 'application/json' }
        const body = {
            locationID: item.location_id,
            name: item.name,
            description: item.description,
            image: item.image,
            link: item.link
        };
        var item_url = ApiConstants.main_url.toString() +
            ApiConstants.item_url.toString() + item.item_id.toString() + "/";
        return this.http.put(item_url, body, { 'headers': headers, observe: 'response' });
    }

    deleteItem(token: string, itemID: number) {
        const headers = { 'Authorization': 'Bearer ' + token, 'content-type': 'application/json' }
        var item_url = ApiConstants.main_url.toString() + 
            ApiConstants.item_url.toString() + itemID.toString() + "/"
        return this.http.delete(item_url, { 'headers': headers, observe: 'response' });
    }

    uploadImage(image: string) {
        var body = new FormData();
        body.append('image', image);
        return this.http.post(ApiConstants.img_upload_url, body);
    }
}