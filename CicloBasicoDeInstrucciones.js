const fs = require('fs');

class CicloBasicoInstrucciones{

    constructor(){
        this.filepath = "text.txt";
        this.instructions = [];

        //variables del ciclo basico de instrucciones 
        this.memoria = [];
        this.icr = null;
        this.pc = null;
        this.mar = null;
        this.mdr = null;
        this.unidadControl = null;
        this.acumulador = 0;
        this.alu = null;


    }

   async ReadFile(){
        
        try {
            this.instructions.push(1)
            const data = await fs.promises.readFile(this.filepath, 'utf8');
            const lineas = data.split('\n').map(linea => linea.trim()).filter(linea => linea.trim() !== '');; //Separa el text en un array y elimina los espacion
            this.instructions = lineas // Eliminar líneas en blanco
        } catch (error) {
            console.error('Error al leer el archivo:', error);
        }     
    }

    StartInstructions(){

        this.instructions.map((i)=>{
            //separa la instrucciones 
            const valores = i.split(" ");
            
            if (typeof this[valores[0]] === 'function') {
                // Ejecutar la función si existe
                this[valores[0]](valores[1],valores[2],valores[3],valores[4]);
            } else {
                // Mostrar un mensaje si la función no existe
                console.log(`La función ${valores[0]} no está definida.`);
            }
        })
    }

    //Realiza casi todo el proceso del procesador
    Procesador(typeInstructions, memory){
        this.pc = memory;
        
        //le pasamos la instruccion a MAR
        this.mar = this.pc; //El MAR que deberia hacer es buscar el tipo de instrccion que es
        
        //pasamos el tipo de instrccion al MDR 
        this.mdr = typeInstructions + this.mar;
        //pasamos el valor al ICR Y despues a la unidad de control
        this.icr = this.mdr;
        this.unidadControl = this.icr;

        //le pasamos el espacio de memoria de la instruccio al MAR 
        this.mar = memory;
        if(typeInstructions == "STORE"){
            this.mdr = this.acumulador;

            this.memoria.forEach(element => {
                if(this.mar in element){
                    element[this.mar] = this.mdr;
                }
            });
        }else{

        }
        //ahora buscamos en la memoria el valor que esta en el mar y lo guardamos en el MDR
        this.mdr = this.memoria.map(objeto => objeto[this.mar]).find(valor => valor !== undefined);
    }

    SET(memory,value) {

        const existe = this.memoria.some(item => Object.keys(item)[0] === memory);

        if (!existe) {
            this.memoria.push({[memory]:value})
        }else{
            console.log("El espacio de memoria ya existe");
        }
    }

    LDR(memory) {
        this.Procesador("LOAD",memory)
        //por ultimo se lo pasamos al acumulador 
        this.acumulador = this.mdr; 
        console.log("Este es el acumulador "+this.acumulador);    
    }

    ADD(memoryOne,memoryTwo, memoryTree ) {
        if(memoryTwo == "NULL" && memoryTree =="NULL"){

            this.Procesador("ADD",memoryOne)
            this.alu = this.acumulador;
            this.acumulador = this.mdr;

            this.acumulador =  parseInt(this.alu) + parseInt(this.acumulador);
            
            console.log("Este es el acumulador "+this.acumulador);
        }else if(memoryTree =="NULL"){


        }else{

        }
    }

    INC() {
        console.log("Inc ejecutado");
    }

    DEC() {
        console.log("Dec ejecutado");
    }

    STR(memory) {

        this.Procesador("STORE",memory);
    }

    SHW() {
        console.log("Shw ejecutado");
    }

    PAUSE() {
        console.log("Pause ejecutado");
    }

    END() {
        console.log("End ejecutado");
    }

    obtenerAtributos() {
        return Object.entries(this);
    }

}

const cicloBasicoInstrucciones = new CicloBasicoInstrucciones();
cicloBasicoInstrucciones.ReadFile()
.then(()=>cicloBasicoInstrucciones.StartInstructions())
.then(()=>console.log(cicloBasicoInstrucciones.obtenerAtributos()));

