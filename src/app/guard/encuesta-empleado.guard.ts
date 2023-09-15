import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../servicios/authentication.service';
import { FirestoreService } from '../servicios/firestore.service';

@Injectable({
  providedIn: 'root'
})
export class EncuestaEmpleadoGuard implements CanActivate {
  constructor(private router:Router,private authService:AuthenticationService, private firestore:FirestoreService){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {


    return this.authService.logueado().then(log=>{
      this.authService.currentUser().then(resp=>{
        //resp.email
        this.firestore.getUsuarios().subscribe((res:any)=>{
          for (let index = 0; index < res.length; index++) {
            const element = res[index];
            if(element.payload.doc.data().correo == resp.email){
              if(element.payload.doc.data().perfil == 'empleado'){
                this.router.navigate(['/surveys']);
                return false;
              }
              
            }
          }
          return true;
        })
        return true;
      })
      return true;
    });
  }
  
}
