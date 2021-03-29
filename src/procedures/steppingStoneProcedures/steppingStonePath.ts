export class SteppingStonePath {

    x: number;
    y: number;
    fieldNumber: string; 
    path: Array<string[]>; 
    costPath: Array<number>; 
    result: number; 

    constructor(x:number, y:number, path:Array<string[]>, costPath:Array<number>, result:number) {
        this.x = x; 
        this.y = y;
        this.fieldNumber = (x+1).toString() + (y+1).toString();  
        this.path = path; 
        this.costPath = costPath;
        this.result = result;
    }

    get FieldNumber(): string{
        return this.fieldNumber; 
    }

    get Path(): Array<string[]> {
        return this.path;
    }

    get CostsPath() : Array<number> {
        return this.costPath;
    }

    get Result() : number {
        return this.result;
    }
    
    public createDeterminant() : string {
       
        let determinante = 'D' + this.fieldNumber + ' = '; 
        
        let lengthPath = this.path.length;
        let counterPath = 0; 
        this.path.forEach(function(element){
            
            // +1, weil im Array mit 0 0 gearbeitet wird --> Ausgabe: c13 nicht c02
            determinante += 'c' + (parseInt(element[0]) + 1) + (parseInt(element[1]) + 1);

            counterPath++;
            if(counterPath < lengthPath)
                if((counterPath % 2) > 0) { determinante += ' - '} 
                else { determinante += ' + '};
        }) 

        determinante += ' = ';

        let lengthCostPath = this.costPath.length;
        let counterCostPath = 0; 
        this.costPath.forEach(function(element){
            let string = element.toString().split(",");            
            determinante += string[0];

            counterCostPath++;
            if(counterCostPath < lengthCostPath) 
                if((counterCostPath % 2) > 0) { determinante += ' - '} 
                else { determinante += ' + '};
        }); 

        determinante += ' = ' + this.result;

        return determinante;

    }
}