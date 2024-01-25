import { Routes } from '@angular/router';
import { LoginComponent } from './view/login/login.component';
import { RegisztracioComponent } from './view/regisztracio/regisztracio.component';
import { IsAuthGuardFn } from './auth.guard';
import { AkcioMainComponent } from './view/akcio-main/akcio-main.component';

export const routes: Routes = [
    { path: 'akcioLista', component: AkcioMainComponent, canActivate: [IsAuthGuardFn] },
    { path: 'reg', component: RegisztracioComponent },
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: 'akcioLista', pathMatch: 'full' },
    { path: '**', redirectTo: 'akcioLista' }
];
