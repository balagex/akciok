import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { AkcioTetelIF } from './model/akcio-tetel.interface';
import { AkciosListaIF } from './model/akcios-lista.interface';
import { Observable, map } from 'rxjs';
import { AkciosLista } from './model/akcios-lista.type';
import { AkcioTetel } from './model/akcio-tetel.type';
import { dateToYYYYMMDD } from './utils';

@Injectable({
    providedIn: 'root'
})
export class AdatServiceService {

    public akciosListakLista = signal<AkciosLista[]>([]);
    public kivalasztottLista = signal<AkciosLista>(null);
    public akciosTetelLista = signal<AkcioTetel[]>([]);
    public kivalasztottTetel = signal<AkcioTetel>(null);
    public nagyiMod = signal<boolean>(false);

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

    akciosTetelekMentese(tetelek: AkcioTetel[], token: string): Observable<AkcioTetel[]> {
        const mentendoTetelek: AkcioTetelIF[] = [];
        if (tetelek?.length > 0) {
            tetelek.forEach(tetel => {
                mentendoTetelek.push(tetel.convertForSave());
            });
        }
        return this.httpClient.put<AkcioTetelIF[]>('https://bevasarlolista-8247e.firebaseio.com/akciosTelelek.json?auth=' + token,
            mentendoTetelek,
            {
                observe: 'body',
                responseType: 'json'
            }).pipe(map(response => AkcioTetel.convertFromIfList(response)));
    }

    aktulaisHetKivalasztasa(): void {
        const maStr = dateToYYYYMMDD(new Date());
        const ezAHet = this.akciosListakLista().find(value => value.kezdonapForras <= maStr && value.vegeNapForras >= maStr);
        if (ezAHet) {
            this.kivalasztottLista.set(ezAHet);

        }
        console.debug('AdatServiceService - aktulaisHetKivalasztasa: ', this.kivalasztottLista());
    }

    mentendoAdatokMentese(token: string): Observable<AkcioTetel[]> {
        const result = new Observable<AkcioTetel[]>(
            observer => {
                this.akciosTetelekMentese(this.akciosTetelLista(), token).subscribe({
                    next: (mentettTetelek) => {
                        console.debug('AdatServiceService - A mentendő tételek mentése után lekért akciós tételek: ', mentettTetelek);
                        this.akciosTetelLista.set(mentettTetelek);
                        observer.next(mentettTetelek);
                        observer.complete();
                    },
                    error: (modositasError) => {
                        console.error('AdatServiceService - HIBA AZ AKCIOS TÉTELEK MÓDOSÍTÁSA SORÁN ', modositasError);
                        observer.error(modositasError);
                        observer.complete();
                    }
                });
            });
        return result;
    }

}
