import { Component, EventEmitter, Output, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { AdatServiceService } from '../../adat-service.service';
import { FormsModule } from '@angular/forms';
import { AkciosLista } from '../../model/akcios-lista.type';
import { FireAuthService } from '../../fire-auth.service';

@Component({
    selector: 'app-akcio-lista-felvetel',
    standalone: true,
    imports: [CalendarModule, ButtonModule, FormsModule],
    templateUrl: './akcio-lista-felvetel.component.html',
    styleUrl: './akcio-lista-felvetel.component.scss'
})
export class AkcioListaFelvetelComponent {

    @Output() kesz = new EventEmitter<boolean>();

    ujListaIntervallumDatumok: Date[] | undefined = [];
    public dateFormat: string = 'yy.mm.dd.';

    public listaFelvetelHiba = signal<string>('');

    constructor(private adatServiceService: AdatServiceService, private fireAuthService: FireAuthService) {
    }

    ujListaFelvetele(): void {
        console.debug('AkcioListaFelvetelComponent - ujListaFelvetele kő', this.ujListaIntervallumDatumok);
        if (this.intervallumMegadott()) {
            const ujLista: AkciosLista = new AkciosLista();
            const start = new Date(this.ujListaIntervallumDatumok[0].getTime() + 3600000);
            const end = new Date(this.ujListaIntervallumDatumok[1].getTime() + 3600000);
            ujLista.kezdoNap = start;
            ujLista.vegeNap = end;
            this.adatServiceService.akciosListaFelvetel(ujLista, this.fireAuthService.getToken()).subscribe({
                next: (listak) => {
                    console.debug('AkcioListaFelvetelComponent - A felvétel után lekért akciós listák: ', listak);
                    this.adatServiceService.akciosListakLista.set(listak);
                    const mentettUjLista = this.adatServiceService.akciosListakLista().find(value => value.azon == ujLista.azon);
                    if (mentettUjLista) {
                        this.adatServiceService.kivalasztottLista.set(mentettUjLista);

                    }
                    this.kesz.emit(true);
                },
                error: (felvetelError) => {
                    console.error('AkcioListaFelvetelComponent - HIBA AZ AKCIOS LISTÁK KIEGÉSZÍTÉSE SORÁN ', felvetelError);
                    // TODO: kitalálni mi legyen
                }
            });
        }
    }

    ujListaMegse(): void {
        console.debug('AkcioListaFelvetelComponent - ujListaFelvetele NEM kő', this.ujListaIntervallumDatumok);
        this.kesz.emit(false);
    }

    intervallumMegadott(): boolean {
        return this.ujListaIntervallumDatumok && this.ujListaIntervallumDatumok.length > 1 && this.ujListaIntervallumDatumok[0] != null && this.ujListaIntervallumDatumok[1] != null;
    }

    hetek(event: any): void {
        console.debug('AkcioListaFelvetelComponent - hetek', event, this.ujListaIntervallumDatumok);
        if (this.ujListaIntervallumDatumok && this.ujListaIntervallumDatumok[0] && this.ujListaIntervallumDatumok[1]) {
            console.debug('AkcioListaFelvetelComponent - mindkét dátum kitöltött...');
            if (this.adatServiceService.akciosListakLista() && this.adatServiceService.akciosListakLista().length > 0) {
                const start = new Date(this.ujListaIntervallumDatumok[0].getTime() + 3600000);
                const end = new Date(this.ujListaIntervallumDatumok[1].getTime() + 3600000);
                let hosszHiba: boolean = false;
                let atfedesHiba: boolean = false;
                if (end.getTime() - start.getTime() > 561600000) {
                    console.error('AkcioListaFelvetelComponent - A megadott intervallum hossza nagyobb mint 7 nap!');
                    hosszHiba = true;
                } else {
                    console.debug('AkcioListaFelvetelComponent - A megadott intervallum hossza nem nagyobb, mint 7 nap.', end.getTime() - start.getTime());
                }
                this.adatServiceService.akciosListakLista().forEach(al => {
                    console.debug('AkcioListaFelvetelComponent - start + end', start, end);
                    if ((start < al.kezdoNap && end > al.kezdoNap) || (start < al.kezdoNap && end > al.vegeNap) || (start < al.vegeNap && end > al.vegeNap)) {
                        console.error('AkcioListaFelvetelComponent - A megadott intervallum átfedésben van egy már rögzített intervallummal !', al);
                        atfedesHiba = true;
                    } else {
                        console.debug('AkcioListaFelvetelComponent - A megadott intervallum nincs átfedésben ezzel a már rögzített intervallummal:', al);
                    }
                    // 6 nap eltérés milisecundumban 518400000, de még fél napot hozzáadunk az évszak váltás miatt tuti ami tuti 561600000
                });
                if (hosszHiba) {
                    if (atfedesHiba) {
                        this.listaFelvetelHiba.set('A megadott intervallum hossza nagyobb mint 7 nap és átfedésben van egy már rögzített intervallummal!');
                    } else {
                        this.listaFelvetelHiba.set('A megadott intervallum hossza nagyobb mint 7 nap!');
                    }
                } else {
                    if (atfedesHiba) {
                        this.listaFelvetelHiba.set('A megadott intervallum átfedésben van egy már rögzített intervallummal!');
                    } else {
                        this.listaFelvetelHiba.set('');
                    }
                }
            }

        }
    }

}
