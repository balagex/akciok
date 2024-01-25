import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-akcio-main',
    standalone: true,
    imports: [ButtonModule],
    templateUrl: './akcio-main.component.html',
    styleUrl: './akcio-main.component.scss'
})
export class AkcioMainComponent {

    public ful: number = 2;

    balra(): void {
        this.ful = this.ful - 1;
    }

    jobbra(): void {
        this.ful = this.ful + 1;
    }

}
