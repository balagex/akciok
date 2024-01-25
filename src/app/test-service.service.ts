import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AkcioTetelIF } from './model/akcio-tetel.interface';
import { AkciosListaIF } from './model/akcios-lista.interface';
import { map } from 'rxjs';
import { AkciosLista } from './model/akcios-lista.type';
import { AkcioTetel } from './model/akcio-tetel.type';

@Injectable({
    providedIn: 'root'
})
export class TestServiceService {

    constructor(protected httpClient: HttpClient) { }

    akciosListakLekereseAlap(token: string) {
        return this.httpClient.get<AkciosListaIF[]>('https://bevasarlolista-8247e.firebaseio.com/akciosListak.json?auth=' + token, {
            observe: 'body',
            responseType: 'json'
        }).pipe(map(response => AkciosLista.convertFromIfList(response)));
    }

    akcioTetelekLekereseAlap(token: string) {
        return this.httpClient.get<AkcioTetelIF[]>('https://bevasarlolista-8247e.firebaseio.com/akciosTelelek.json?auth=' + token, {
            observe: 'body',
            responseType: 'json'
        }).pipe(map(response => AkcioTetel.convertFromIfList(response)));
    }
}
