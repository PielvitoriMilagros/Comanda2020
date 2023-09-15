export class Mesa {

    //mesa -> cliente, comensales, estado, numero, pedido, tipo,


    public cliente;
    public comensales;
    public estado;
    public numero;
    public consulta;
    public tipo;
    public id;

    constructor(comensales: number, estado: string, numero: number, tipo: string,id?:string,cliente?: string, consulta?: string) {

        this.comensales = comensales;
        this.estado = estado;
        this.numero = numero;
        if(tipo) this.tipo = tipo; else this.tipo = null;
        if(consulta) this.consulta = consulta; else this.consulta = null;
        if(cliente) this.cliente = cliente; else this.cliente = null;
        if(id) this.id = id; else this.id = null;

    }

    toJson(){
        return{"cliente": this.cliente, "comensales": this.comensales, "estado": this.estado, "numero": this.numero, "consulta": this.consulta, "tipo": this.tipo, "id":this.id}
    }


}
