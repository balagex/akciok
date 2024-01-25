import { AkcioTetelIF } from "./akcio-tetel.interface";
import { BoltAzon, getBoltAzonViaString } from "./bolt-azon.enum";

export class AkcioTetel implements AkcioTetelIF {

    azon: string;
    listaAzon: string;
    boltAzon: BoltAzon;
    kezdoNap: string;
    vegeNap: string;
    nev: string;
    kiemeltE: boolean;
    megjegyzes?: string;

    static convertFromIfList(list: AkcioTetelIF[]): AkcioTetel[] {
        const result: AkcioTetel[] = [];
        if (list && list.length > 0) {
            list.forEach(li => {
                result.push(new AkcioTetel(li));
            });
        }
        return result;
    }

    constructor(tetel?: AkcioTetelIF) {

        if (tetel) {
            this.azon = tetel.azon;
            this.listaAzon = tetel.listaAzon;
            this.boltAzon = getBoltAzonViaString(tetel.boltAzon);
            this.kezdoNap = tetel.kezdoNap;
            this.vegeNap = tetel.vegeNap;
            this.nev = tetel.nev;
            this.kiemeltE = tetel.kiemeltE !== null && tetel.kiemeltE !== undefined ? tetel.kiemeltE : false;
            this.megjegyzes = tetel.megjegyzes;
        } else {
            this.azon = 'AT' + (new Date()).getTime();
            this.listaAzon = null;
            this.boltAzon = BoltAzon.LIDL;
            this.kezdoNap = '';
            this.vegeNap = '';
            this.nev = '';
            this.kiemeltE = false;
            this.megjegyzes = '';
        }
    }
}