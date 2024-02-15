import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { AkcioTetelIF } from './model/akcio-tetel.interface';
import { AkciosListaIF } from './model/akcios-lista.interface';
import { Observable, map } from 'rxjs';
import { AkciosLista } from './model/akcios-lista.type';
import { AkcioTetel } from './model/akcio-tetel.type';

@Injectable({
    providedIn: 'root'
})
export class AdatServiceService {

    public akciosListakLista = signal<AkciosLista[]>([]);
    public kivalasztottLista = signal<AkciosLista>(null);
    public akciosTetelLista = signal<AkcioTetel[]>([]);
    public kivalasztottTetel = signal<AkcioTetel>(null);

    constructor(protected httpClient: HttpClient) { }

    akciosListakLekereseAlap(token: string): Observable<AkciosLista[]> {
        this.kivalasztottTetel.set(null);
        return this.httpClient.get<AkciosListaIF[]>('https://bevasarlolista-8247e.firebaseio.com/akciosListak.json?auth=' + token, {
            observe: 'body',
            responseType: 'json'
        }).pipe(map(response => AkciosLista.convertFromIfList(response)));
    }

    akciosListakMentese(listak: AkciosLista[], token: string): Observable<AkciosLista[]> {
        this.kivalasztottTetel.set(null);
        const mentendoListak: AkciosListaIF[] = [];
        if (listak?.length > 0) {
            listak.forEach(lista => {
                mentendoListak.push(lista.convertForSave());
            });
        }
        return this.httpClient.put<AkciosListaIF[]>('https://bevasarlolista-8247e.firebaseio.com/akciosListak.json?auth=' + token,
            mentendoListak,
            {
                observe: 'body',
                responseType: 'json'
            }).pipe(map(response => AkciosLista.convertFromIfList(response)));
    }

    akciosListaFelvetel(ujLista: AkciosLista, token: string): Observable<AkciosLista[]> {
        const listak = this.akciosListakLista();
        if (ujLista) {
            listak.push(ujLista);
        }
        return this.akciosListakMentese(listak, token);
    }

    akcioTetelekLekereseAlap(token: string) {
        this.kivalasztottTetel.set(null);
        return this.httpClient.get<AkcioTetelIF[]>('https://bevasarlolista-8247e.firebaseio.com/akciosTelelek.json?auth=' + token, {
            observe: 'body',
            responseType: 'json'
        }).pipe(map(response => AkcioTetel.convertFromIfList(response)));
    }

    aktulaisHetKivalasztasa(): void {
        const most = new Date();
        const ezAHet = this.akciosListakLista().find(value => value.kezdoNap <= most && value.vegeNap >= most);
        if (ezAHet) {
            this.kivalasztottLista.set(ezAHet);

        }
        console.debug('AdatServiceService - aktulaisHetKivalasztasa: ', this.kivalasztottLista());
    }
}
