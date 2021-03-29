export class SteppingStoneMapping {

    /**
     * Hilfsklasse für Mengenverteilung
     * @author Franziska Friese
     */

    x: number;
    y: number;
    value: number;

    constructor(x: number, y: number, value: number) {
        this.x = x;
        this.y = y;
        this.value = value;
    }

    get X(): number {
        return this.x;
    }

    get Y(): number {
        return this.y;
    }

    get Value(): number {
        return this.value;
    }

}