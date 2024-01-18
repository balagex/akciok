import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { TestServiceService } from './test-service.service';
import { FireAuthService } from './fire-auth.service';
import { ButtonModule } from 'primeng/button';


@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet, ButtonModule],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'uj-lista';

    constructor(private testServiceService: TestServiceService, private fireAuthService: FireAuthService) { }

    ngOnInit() {
        const fbApp = initializeApp({
            apiKey: "AIzaSyBi6CPNouDxhvUeP0MsUOJna5pCRN6HUV8",
            authDomain: "bevasarlolista-8247e.firebaseapp.com"
        });

        console.debug('FB APP', fbApp);

        this.fireAuthService.login('csongebalazs@gmail.com', 'kacsafosx2')
            .then((userCredential) => {

                console.debug('AppComponent - belépés sikeres', userCredential);
                this.fireAuthService.getTokenPromise(userCredential).then(
                    (token: string) => {
                        this.fireAuthService.setCredential(token, userCredential.user.email);
                        this.testServiceService.akcioTetelekLekereseAlap(token).subscribe({
                            next: (valasz) => {
                                console.debug('AppComponent - Lekért lista: ', valasz);
                                this.fireAuthService.logout();
                            },
                            error: (error) => {
                                console.error('AppComponent - LISTA LEKERES HIBA ', error);
                                this.fireAuthService.logout();
                            }
                        });
                    }
                );
            })
            .catch((error) => {
                console.error('AppComponent - FB SIGN IN ERROR', error);

                this.fireAuthService.clearCredital();
            });
    }

    loading: boolean = false;

    load() {
        this.loading = true;

        setTimeout(() => {
            this.loading = false
        }, 2000);
    }
}
