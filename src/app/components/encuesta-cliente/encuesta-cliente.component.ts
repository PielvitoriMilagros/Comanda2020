import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/servicios/authentication.service';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import Swal from 'sweetalert2';
import { Encuesta } from 'src/app/models/encuesta';


@Component({
  selector: 'app-encuesta-cliente',
  templateUrl: './encuesta-cliente.component.html',
  styleUrls: ['./encuesta-cliente.component.scss'],
})
export class EncuestaClienteComponent implements OnInit {
  public perfil;
  public mail;
  public pregunta1;
  public pregunta2=[];
  public pregunta3;
  public pregunta4;
  public pregunta5;
  public imagen;
  public mailReferencia=null;

  public mensaje;
  public areas=['ninguna','ambiente','atencion','comida'];
  public areasBool=[false,false,false,false];

  @Input() perfilResponde:string;



  
  optionsCamera: CameraOptions = {
    sourceType: this.camera.PictureSourceType.CAMERA,
    destinationType: this.camera.DestinationType.DATA_URL,
    correctOrientation: true
  }

  constructor(private firestore: FirestoreService,
    private camera: Camera,
    private navCtrl: NavController,
    private auth: AuthenticationService) {

      auth.currentUser().then(resp=>{
        this.mail = resp.email;
      });

     }


  ngOnInit() {
    this.imagen = '../../../assets/imagenes/encCliente.png';
    this.perfil = this.perfilResponde;
    this.pregunta1='si';
    this.pregunta4='si';
    this.pregunta5=7;

  }



  updateCheckbox(e,numero){
    this.areasBool[numero] = e.detail.checked;
  }



  validarAlta(){

    for (let index = 0; index < this.areasBool.length; index++) {
      const element = this.areasBool[index];
      if(element) this.pregunta2.push(this.areas[index]);      
    }

    if(this.camposValidados()){

      let encuesta = new Encuesta(this.perfil,this.mail,this.pregunta1,this.pregunta2,this.pregunta3,this.pregunta4,this.pregunta5,this.imagen,null);
      this.firestore.saveEncuestas(encuesta.toJson()).then(resp=>{
        Swal.fire({
          title: 'Muchas gracias',
          text: 'Las respuestas fueron guardadas correctamente',
          icon: 'success'
        }).then(()=>{
          this.navCtrl.navigateForward('/home');
        });
      }).catch(err=>{
        Swal.fire({
          title: 'Error',
          text: 'No se pudo guardar la info de la encuesta',
          icon: 'error'
        })
      });


    } else{
      Swal.fire({
        title: 'Error',
        text: this.mensaje,
        icon: 'error'
      })
    }


  }












  tomarFoto() {
    this.camera.getPicture(this.optionsCamera).then((imageData) => {
      this.imagen = 'data:image/jpeg;base64,' + imageData;

    }).catch((err) => {
      Swal.fire({
        title: 'Error',
        text: "No se pudo tomar la foto",
        icon: 'error'
      })

    });

  }



  camposValidados(){
    if(this.pregunta1 == (null || '' || undefined) || this.pregunta2 == (null || '' || undefined) || this.pregunta3 == (null || '' || undefined) || this.pregunta4 == (null || '' || undefined) || this.pregunta5 == (null || '' || undefined)){
      this.mensaje = 'Debe completar todas las preguntas';
      return false;
    }

    if(this.imagen == "../../../assets/imagenes/encCliente.png"){
      this.mensaje = 'Debe cargar una imagen';
      return false;
    }

    return true;
  }


  
}
