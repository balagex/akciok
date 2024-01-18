import { Routes } from '@angular/router';
import { LoginComponent } from './view/login/login.component';
import { RegisztracioComponent } from './view/regisztracio/regisztracio.component';
import { AkcioListaComponent } from './view/akcio-lista/akcio-lista.component';
import { IsAuthGuardFn } from './auth.guard';

export const routes: Routes = [
    { path: 'akcioLista', component: AkcioListaComponent, canActivate: [IsAuthGuardFn] },
    { path: 'reg', component: RegisztracioComponent },
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: 'akcioLista', pathMatch: 'full' },
    { path: '**', redirectTo: 'akcioLista' }
];
