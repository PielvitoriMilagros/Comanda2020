export class Encuesta {

    //encuestas -> perfil, mail, pregunta1, pregunta2, pregunta3, pregunta4, pregunta5, imagen, mailReferencia

    public perfil;
    public mail;
    public pregunta1;
    public pregunta2;
    public pregunta3;
    public pregunta4;
    public pregunta5;
    public imagen;
    public mailReferencia;

    constructor(perfil:string, mail:string, pregunta1:any, pregunta2:any, pregunta3:any, pregunta4:any, pregunta5:any, imagen:string, mailReferencia:string,){

        this.perfil = perfil;
        this.mail = mail;
        this.pregunta1 = pregunta1;
        this.pregunta2 = pregunta2;
        this.pregunta3 = pregunta3;
        this.pregunta4 = pregunta4;
        this.pregunta5 = pregunta5;
        this.imagen = imagen;
        this.mailReferencia = mailReferencia;

    }

    toJson(){
        return{"perfil": this.perfil, "mail": this.mail, "pregunta1": this.pregunta1, "pregunta2": this.pregunta2, "pregunta3": this.pregunta3, "pregunta4": this.pregunta4, "pregunta5": this.pregunta5, "imagen": this.imagen, "mailReferencia": this.mailReferencia }
    }

}
