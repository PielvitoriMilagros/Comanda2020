export class Producto {

    //producto -> nombre, descripcion, tipo, tiempo, precio, fotoUno, fotoDos, fotoTres
    public nombre: string;
    public descripcion: string;
    public tipo: string;
    public tiempo: number;
    public precio: number;
    public fotoUno: string;
    public fotoDos: string;
    public fotoTres: string;
    public cantidad: number;
    public id: number;

    constructor(nombre: string, descripcion: string, tipo: string, tiempo: number, precio: number, fotoUno: string, fotoDos: string, fotoTres: string, cantidad?: number, id?: number) {

        this.nombre = nombre;
        this.descripcion = descripcion;
        this.tipo = tipo;
        this.tiempo = tiempo;
        this.precio = precio;
        this.fotoUno = fotoUno;
        this.fotoDos = fotoDos;
        this.fotoTres = fotoTres;
        if (cantidad) this.cantidad = cantidad;
        if (id) this.id = id;
    }


    toJson() {
        if (this.cantidad)
            return { "nombre": this.nombre, "descripcion": this.descripcion, "tipo": this.tipo, "tiempo": this.tiempo, "precio": this.precio, "fotoUno": this.fotoUno, "fotoDos": this.fotoDos, "fotoTres": this.fotoTres, "cantidad": this.cantidad, "id": this.id }
        else
            return { "nombre": this.nombre, "descripcion": this.descripcion, "tipo": this.tipo, "tiempo": this.tiempo, "precio": this.precio, "fotoUno": this.fotoUno, "fotoDos": this.fotoDos, "fotoTres": this.fotoTres }
    }





}
