import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AkcioListaComponent } from '../akcio-lista/akcio-lista.component';
import { AkciosLista } from '../../model/akcios-lista.type';
import { AdatServiceService } from '../../adat-service.service';
import { FireAuthService } from '../../fire-auth.service';

@Component({
    selector: 'app-akcio-main',
    standalone: true,
    imports: [ButtonModule, AkcioListaComponent],
    templateUrl: './akcio-main.component.html',
    styleUrl: './akcio-main.component.scss'
})
export class AkcioMainComponent implements OnInit {

    public ful: number = 2;

    balra(): void {
        this.ful = this.ful - 1;
    }

    jobbra(): void {
        this.ful = this.ful + 1;
    }

    constructor(private adatServiceService: AdatServiceService, private fireAuthService: FireAuthService) { }

    ngOnInit() {

        this.adatServiceService.akciosListakLekereseAlap(this.fireAuthService.getToken()).subscribe({
            next: (listak) => {
                console.debug('AkcioMainComponent - Lekért akciós listák: ', listak);
                if (listak && listak.length > 0) {
                    this.adatServiceService.akciosListakLista.set(listak);
                    this.adatServiceService.aktulaisHetKivalasztasa();

                    this.adatServiceService.akcioTetelekLekereseAlap(this.fireAuthService.getToken()).subscribe({
                        next: (tetelek) => {
                            console.debug('AkcioListaComponent - Lekért akciós tételek: ', tetelek);
                            if (tetelek && tetelek.length > 0) {
                                this.adatServiceService.akciosTetelLista.set(tetelek);
                            } else {
                                this.adatServiceService.akciosTetelLista.set([]);
                            }
                        },
                        error: (tetelekError) => {
                            console.error('AkcioListaComponent - AKCIÓS TÉTEL LEKERES HIBA ', tetelekError);
                            this.fireAuthService.logout();
                        }
                    });

                } else {
                    this.adatServiceService.akciosListakLista.set([]);
                }
            },
            error: (listaError) => {
                console.error('AkcioMainComponent - AKCIÓS LISTA LEKERES HIBA ', listaError);
                this.fireAuthService.logout();
            }
        });

    }

}
