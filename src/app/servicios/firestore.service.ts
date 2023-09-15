import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private collectionUsers="usuarios";
  private collectionListaEspera="listaDeEspera";
  private collectionPendientes="pendientesAprobacion";
  private collectionProductos="productos";
  private collectionEncuestas="encuestas";
  private collectionMesas="mesas";
  private collectionPedidos="pedidos";

  constructor(private firestore: AngularFirestore) { }

  //#region  GET

  public getUsuarios() {
    return this.firestore.collection(this.collectionUsers).snapshotChanges();
  }

  public getListaDeEspera() {
    return this.firestore.collection(this.collectionListaEspera).snapshotChanges();
  }

  // public getPendientesAprobar() {
  //   return this.firestore.collection(this.collectionPendientes).snapshotChanges();
  // }

  public getProductos() {
    return this.firestore.collection(this.collectionProductos).snapshotChanges();
  }

  public getEncuestas() {
    return this.firestore.collection(this.collectionEncuestas).snapshotChanges();
  }

  public getMesas() {
    return this.firestore.collection(this.collectionMesas).snapshotChanges();
  }

  public getPedidos() {
    return this.firestore.collection(this.collectionPedidos).snapshotChanges();
  }

//#endregion





//#region SAVE

  public saveUser(userJson) {
    console.log("save");
    return this.firestore.collection(this.collectionUsers).add(userJson);

  }
  
  public saveListaDeEspera(userJson,id){
    console.log("save listaDeEspera");
    return this.firestore.collection(this.collectionListaEspera).doc(id).set(userJson);
    // return this.firestore.collection(this.collectionListaEspera).add(userJson);
    
  }

  
  public saveProductos(prodJson) {
    console.log("save productos");
    return this.firestore.collection(this.collectionProductos).add(prodJson);

  }
  
  public saveEncuestas(encJson) {
    console.log("save encuestas");
    return this.firestore.collection(this.collectionEncuestas).add(encJson);

  }
  
  public savePedidos(pedidoJson) {
    console.log("save pedidos");
    return this.firestore.collection(this.collectionPedidos).add(pedidoJson);

  }


  //#endregion




//#region UPDATE

  
  updateUser(key: string, user) {
    var userRef = this.firestore.collection(this.collectionUsers).doc(key);

    return userRef.update(user)
      .then(function () {
        console.log("Document successfully updated!");
      })
      .catch(function (error) {
        console.error("Error updating document: ", error);
      });
  }



  updateBD(key: string, datos,collectionBD) {
    console.log(key);
    console.log(datos);
    var varRef = this.firestore.collection(collectionBD).doc(key);

    return varRef.update(datos)
      .then(function () {
        console.log("Document successfully updated!");
      })
      .catch(function (error) {
        console.error("Error updating document: ", error);
      });
  }




  //#endregion




//#region DELETEs

deleteRegFrom(key:string,collectionBD:string){

  this.firestore.collection(collectionBD).doc(key).delete().then(function() {
    console.log("Document successfully deleted!");
}).catch(function(error) {
    console.error("Error removing document: ", error);
});


}

//#endregion














}
