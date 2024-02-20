import { Component, computed } from '@angular/core';
import { AkcioListaFelvetelComponent } from '../akcio-lista-felvetel/akcio-lista-felvetel.component';
import { AkciosLista } from '../../model/akcios-lista.type';
import { AdatServiceService } from '../../adat-service.service';
import { FireAuthService } from '../../fire-auth.service';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-akcio-lista-lista',
    standalone: true,
    imports: [AkcioListaFelvetelComponent, ButtonModule],
    templateUrl: './akcio-lista-lista.component.html',
    styleUrl: './akcio-lista-lista.component.scss'
})
export class AkcioListaListaComponent {

    ujListaModalLathato: boolean = false;
    listaModositasModalLathato: boolean = false;

    listaLista = computed<AkciosLista[]>(() => {
        return this.adatServiceService.akciosListakLista();
    });

    constructor(private adatServiceService: AdatServiceService, private fireAuthService: FireAuthService) {
    }

    ujFelvetelKesz(eredmeny: boolean): void {
        console.debug('AkcioListaListaComponent - ujFelvetelKesz', eredmeny);
        this.ujListaModalLathato = false;
    }

    kivalasztottListaE(listaAzon: string): boolean {
        return this.adatServiceService.kivalasztottLista()?.azon == listaAzon;
    }

    listaModositas(lista: AkciosLista): void {
        console.debug('AkcioListaListaComponent - lista módosítás kell', lista);
    }

    listaTorles(lista: AkciosLista): void {
        console.debug('AkcioListaListaComponent - lista törlés kell', lista);
    }

    ujListaFelvetelInditas(): void {
        console.debug('AkcioListaListaComponent - új lista kell');
        this.ujListaModalLathato = true;
    }

    listaKivalasztas(lista: AkciosLista): void {
        console.debug('AkcioListaListaComponent - lista kiválasztása');
        this.adatServiceService.kivalasztottTetel.set(null);
        this.adatServiceService.kivalasztottLista.set(lista);
    }

    listabanVanMentendotetel(lista: AkciosLista): boolean {
        const listaTetelei = this.adatServiceService.akciosTetelLista()?.filter(t => t.listaAzon == lista.azon);
        return listaTetelei && listaTetelei.length > 0 && listaTetelei.findIndex(x => x.mentendo) > -1;
    }

}
