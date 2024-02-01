import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TestServiceService } from '../../test-service.service';
import { FireAuthService } from '../../fire-auth.service';
import { BOLTOK } from '../../common.constants';
import { Component, signal } from '@angular/core';
import { debounceTime } from 'rxjs';
import { toSignal, toObservable } from '@angular/core/rxjs-interop'
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-akcio-lista',
    standalone: true,
    imports: [ButtonModule, InputTextModule, FormsModule],
    templateUrl: './akcio-lista.component.html',
    styleUrl: './akcio-lista.component.scss'
})
export class AkcioListaComponent {

    loading: boolean = false;
    // boltok = BoltAzon;
    boltok = BOLTOK;
    searchTerm = signal('');
    searchFor = toSignal(toObservable(this.searchTerm).pipe(debounceTime(1000)), {
        initialValue: '',
    });
    public _keresoSzoveg: any = null;
    public get keresoSzoveg(): any {
        return this._keresoSzoveg;
    }
    public set keresoSzoveg(newValue: any) {
        this._keresoSzoveg = newValue;
        console.debug('AkcioListaComponent - kereső szöveg változott ', newValue);
    }

    kereses(event: any): void {
        console.debug('AkcioListaComponent - kereses ', event);
        this.searchTerm.set(event);

    }

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
