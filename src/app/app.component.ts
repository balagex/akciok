import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { initializeApp } from 'firebase/app';


@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'uj-lista';

    constructor() { }

    ngOnInit() {
        const fbApp = initializeApp({
            apiKey: "AIzaSyBi6CPNouDxhvUeP0MsUOJna5pCRN6HUV8",
            authDomain: "bevasarlolista-8247e.firebaseapp.com"
        });

        console.debug('FB APP', fbApp);

        const szkod1 = '#0000ff';
        const szkod2 = '#ffe214';

        const sz1r = szkod1.substring(1, 3);
        const sz1g = szkod1.substring(3, 5);
        const sz1b = szkod1.substring(5, 7);

        const luminance1 = (0.299 * parseInt(sz1r, 16) + 0.587 * parseInt(sz1g, 16) + 0.114 * parseInt(sz1b, 16)) / 255;

        const c1 = luminance1 > 0.5 ? 'black' : 'white';

        const sz2r = szkod2.substring(1, 3);
        const sz2g = szkod2.substring(3, 5);
        const sz2b = szkod2.substring(5, 7);

        const luminance2 = (0.299 * parseInt(sz2r, 16) + 0.587 * parseInt(sz2g, 16) + 0.114 * parseInt(sz2b, 16)) / 255;

        const c2 = luminance2 > 0.5 ? 'black' : 'white';

        console.debug('AppComponent - színek', szkod1, sz1r, sz1g, sz1b, luminance1, c1, szkod2, sz2r, sz2g, sz2b, luminance2, c2);
    }
}
