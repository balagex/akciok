import { Component, OnInit } from '@angular/core';
import { TestServiceService } from '../../test-service.service';
import { FireAuthService } from '../../fire-auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

    constructor(private fireAuthService: FireAuthService, private router: Router) { }

    ngOnInit() {

        this.fireAuthService.login('csongebalazs@gmail.com', 'kacsafosx2')
            .then((userCredential) => {

                console.debug('LoginComponent - belépés sikeres', userCredential);
                this.fireAuthService.getTokenPromise(userCredential).then(
                    (token: string) => {
                        this.fireAuthService.setCredential(token, userCredential.user.email);
                        this.router.navigate(['/akcioLista']);
                    }
                );
            })
            .catch((error) => {
                console.error('LoginComponent - FB SIGN IN ERROR', error);

                this.fireAuthService.clearCredital();
            });
    }


}
