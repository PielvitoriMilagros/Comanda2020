import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/servicios/authentication.service';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import Swal from 'sweetalert2';
import { Producto } from 'src/app/models/producto';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-alta',
  templateUrl: './alta.component.html',
  styleUrls: ['./alta.component.scss'],
})
export class AltaComponent implements OnInit {


  public nombre;
  public descripcion;
  public tiempo;
  public tipo;
  public precio;
  public imagenUno;
  public imagenDos;
  public imagenTres;

  public mensaje;

  @Input() tipoProducto: string;





  optionsCamera: CameraOptions = {
    quality: 15,
    sourceType: this.camera.PictureSourceType.CAMERA,
    destinationType: this.camera.DestinationType.DATA_URL,
    correctOrientation: true
  }

  constructor(private firestore: FirestoreService,
    private camera: Camera,
    private navCtrl: NavController) { }

  ngOnInit() {

    if (this.tipoProducto == 'bebida') {
      this.tipo = this.tipoProducto;
      this.imagenUno = "../../../assets/imagenes/cualBebida.png";
      this.imagenDos = "../../../assets/imagenes/cualBebida.png";
      this.imagenTres = "../../../assets/imagenes/cualBebida.png";
    } else {
      this.tipo = this.tipoProducto;
      this.imagenUno = "../../../assets/imagenes/cualComida.png";
      this.imagenDos = "../../../assets/imagenes/cualComida.png";
      this.imagenTres = "../../../assets/imagenes/cualComida.png";
    }

  }





  validarAlta() {
    if(this.camposValidados()){

      console.log("FOTO UNO");
      console.log(this.imagenUno);
      console.log("FOTO DOS");
      console.log(this.imagenDos);
      console.log("FOTO TRES");
      console.log(this.imagenTres);
      let producto = new Producto(this.nombre,this.descripcion,this.tipo,this.tiempo,this.precio,this.imagenUno,this.imagenDos,this.imagenTres);
      this.firestore.saveProductos(producto.toJson()).then(resp =>{

        Swal.fire({
          title: 'Éxito',
          text: 'El producto fue creado correctamente',
          icon: 'success'
        }
        ).then(result => {
          this.navCtrl.navigateForward('/home');
            // this.router.navigate(['/home']);
        });
      }).catch(err => {
        console.log("FALLO la BD");
        console.log(err);
      });







    }else {
      Swal.fire({
        title: 'Error',
        text: this.mensaje,
        icon: 'error'
      }
      ).then(result => {
        console.log(this.mensaje);
      });
    }


  }



  tomarFoto(numero) {
    let foto;
    this.camera.getPicture(this.optionsCamera).then((imageData) => {
      foto = 'data:image/jpeg;base64,' + imageData;
      if(numero == 1) this.imagenUno = foto;
      if(numero == 2) this.imagenDos = foto;
      if(numero == 3) this.imagenTres = foto;

    }).catch((err) => {
      console.log(err);

    });

  }



  camposValidados(){
    if(this.nombre == (null || '' || undefined)){
      this.mensaje = 'Falta ingresar el nombre';
      return false;
    }
    if(this.descripcion == (null || '' || undefined)){
      this.mensaje = 'Falta ingresar la descripción';
      return false;
    }
    if(this.tiempo == (null || '' || undefined)){
      this.mensaje = 'Falta ingresar el tiempo de preparación';
      return false;
    }
    if(this.precio == (null || '' || undefined)){
      this.mensaje = 'Falta ingresar el precio del producto';
      return false;
    }
    if(this.imagenUno == "../../../assets/imagenes/cualComida.png" || this.imagenDos == "../../../assets/imagenes/cualBebida.png" || this.imagenTres == "../../../assets/imagenes/cualComida.png" || this.imagenUno == "../../../assets/imagenes/cualBebida.png" || this.imagenDos == "../../../assets/imagenes/cualComida.png" || this.imagenTres == "../../../assets/imagenes/cualBebida.png" ){
      this.mensaje = 'Debe cargar las tres imagenes';
      return false;
    }
    return true;
  }



}
