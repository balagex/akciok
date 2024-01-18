import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TestServiceService } from '../../test-service.service';
import { FireAuthService } from '../../fire-auth.service';


@Component({
    selector: 'app-akcio-lista',
    standalone: true,
    imports: [ButtonModule],
    templateUrl: './akcio-lista.component.html',
    styleUrl: './akcio-lista.component.scss'
})
export class AkcioListaComponent {

    loading: boolean = false;

    constructor(private testServiceService: TestServiceService, private fireAuthService: FireAuthService) { }

    ngOnInit() {

        this.testServiceService.akcioTetelekLekereseAlap(this.fireAuthService.getToken()).subscribe({
            next: (valasz) => {
                console.debug('AkcioListaComponent - Lekért lista: ', valasz);

            },
            error: (error) => {
                console.error('AkcioListaComponent - LISTA LEKERES HIBA ', error);
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

}