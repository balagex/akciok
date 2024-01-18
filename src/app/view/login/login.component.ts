import { Component, OnInit } from '@angular/core';
import { FireAuthService } from '../../fire-auth.service';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, NgClass, FormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

    public password: string = '';
    public loginname: string = '';
    public loading = false;

    constructor(private fireAuthService: FireAuthService, private router: Router) { }

    ngOnInit() {

        // this.fireAuthService.login('csongebalazs@gmail.com', 'kacsafosx2')
        //     .then((userCredential) => {

        //         console.debug('LoginComponent - belépés sikeres', userCredential);
        //         this.fireAuthService.getTokenPromise(userCredential).then(
        //             (token: string) => {
        //                 this.fireAuthService.setCredential(token, userCredential.user.email);
        //                 this.router.navigate(['/akcioLista']);
        //             }
        //         );
        //     })
        //     .catch((error) => {
        //         console.error('LoginComponent - FB SIGN IN ERROR', error);

        //         this.fireAuthService.clearCredital();
        //     });
    }

    keypress(event: KeyboardEvent): void {
        if (event.keyCode === 13 && !this.loading) {
            this.loginHandler();
        }
    }

    loginHandler(): void {

        if (this.loginname && this.loginname.trim().length > 0 && this.password && this.password.trim().length > 0) {
            this.loading = true;
            console.debug('LOGIN INDUL ', this.loginname, this.password);

            // this.loginService.login(this.loginname, this.password).subscribe(
            //     valasz => {
            //         console.debug('LoginComponent - sikeres bejelentkezés.', valasz);
            //         this.tokenStorageService.loginValaszMentese(valasz);

            //         if (valasz && valasz.lathatoMenuElemek && valasz.lathatoMenuElemek.length > 0 && valasz.lathatoMenuElemek.findIndex(m => m.utvonal && m.utvonal === this.returnUrl) > -1) {
            //             console.debug('LoginComponent - látható menühöz tartozik a return url...');
            //         } else {
            //             console.debug('LoginComponent - nem látható menühöz tartozik a return url!');
            //             this.returnUrl = '/prot/welcome';
            //         }
            //         if (this.returnUrl === '/prot/welcome' && valasz && valasz.kezdoMenuElemId && valasz.lathatoMenuElemek && valasz.lathatoMenuElemek.length > 0) {
            //             const kezdoMenuElem = valasz.lathatoMenuElemek.find(m => m.id === valasz.kezdoMenuElemId);
            //             if (kezdoMenuElem && kezdoMenuElem.utvonal) {
            //                 this.returnUrl = kezdoMenuElem.utvonal;
            //                 console.debug('LoginComponent - keudő menüelem látható menühöz tartozik és nincs return url, így ide megyünk: ', kezdoMenuElem.utvonal);
            //             }
            //         }

            //         this.loading = false;
            //     },
            //     lerror => {
            //         console.error('LoginComponent - hiba a bejelentkezés során! ', lerror);
            //         // Ez törli a session storage és a loginValasz infókat is.
            //         this.tokenStorageService.clearStorage();
            //         this.loading = false;
            //     }
            // );
        }
    }

}
