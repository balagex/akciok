import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TestServiceService {

    constructor(protected httpClient: HttpClient) { }

    akcioTetelekLekereseAlap(token: string) {
        return this.httpClient.get<any[]>('https://bevasarlolista-8247e.firebaseio.com/akciosTelelek.json?auth=' + token, {
            observe: 'body',
            responseType: 'json'
        });
    }
}
