import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TestServiceService } from '../../test-service.service';
import { FireAuthService } from '../../fire-auth.service';
import { BOLTOK } from '../../common.constants';


@Component({
    selector: 'app-akcio-lista',
    standalone: true,
    imports: [ButtonModule],
    templateUrl: './akcio-lista.component.html',
    styleUrl: './akcio-lista.component.scss'
})
export class AkcioListaComponent {

    loading: boolean = false;
    // boltok = BoltAzon;
    boltok = BOLTOK;

    constructor(private testServiceService: TestServiceService, private fireAuthService: FireAuthService) { }

    ngOnInit() {

        this.testServiceService.akciosListakLekereseAlap(this.fireAuthService.getToken()).subscribe({
            next: (valasz) => {
                console.debug('AkcioListaComponent - Lekért akciós listák: ', valasz);

            },
            error: (error) => {
                console.error('AkcioListaComponent - AKCIÓS LISTA LEKERES HIBA ', error);
                this.fireAuthService.logout();
            }
        });

        this.testServiceService.akcioTetelekLekereseAlap(this.fireAuthService.getToken()).subscribe({
            next: (valasz) => {
                console.debug('AkcioListaComponent - Lekért akciós tételek: ', valasz);

            },
            error: (error) => {
                console.error('AkcioListaComponent - AKCIÓS TÉTEL LEKERES HIBA ', error);
                this.fireAuthService.logout();
            }
        });
    }

    load() {
        this.loading = true;

        setTimeout(() => {
            this.loading = false;
            this.fireAuthService.logout();
        }, 2000);
    }

    boltSzuroKlikk(bolt: any): void {
        console.debug('AkcioListaComponent - boltSzuroKlikk: ', bolt);
    }

}
