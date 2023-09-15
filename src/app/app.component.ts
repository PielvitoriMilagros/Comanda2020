import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private nativeAudio: NativeAudio
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.statusBar.overlaysWebView(false);
      this.setAndroidBackButtonBehavior();

      this.nativeAudio.preloadSimple('inicio','assets/sonidos/inicio.mp3').then(onSuccess=>{

        this.nativeAudio.play('inicio').then(onSuccess=>{
          console.log( 'reproduciendo: inicio');
        }, onError=>{
          console.log('Fallo al reproducir inicio error: ' + onError);
        });
      }, onError=>{
        console.log(onError);
      });

    });
  }



  private setAndroidBackButtonBehavior(): void {
    this.platform.backButton.subscribe(() => {
      if (window.location.pathname == "/login")
    {
        navigator['app'].exitApp();
      }
    });
  }

  





}






// FUNCIONA BIEN SIN EL NATIVE AUDIO


// import { Component } from '@angular/core';

// import { Platform } from '@ionic/angular';
// import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { StatusBar } from '@ionic-native/status-bar/ngx';

// @Component({
//   selector: 'app-root',
//   templateUrl: 'app.component.html',
//   styleUrls: ['app.component.scss']
// })
// export class AppComponent {
//   constructor(
//     private platform: Platform,
//     private splashScreen: SplashScreen,
//     private statusBar: StatusBar
//   ) {
//     this.initializeApp();
//   }

//   initializeApp() {
//     this.platform.ready().then(() => {
//       this.statusBar.styleDefault();
//       this.splashScreen.hide();
//       this.statusBar.overlaysWebView(false);
//       this.setAndroidBackButtonBehavior();
//     });
//   }



//   private setAndroidBackButtonBehavior(): void {
//     this.platform.backButton.subscribe(() => {
//       if (window.location.pathname == "/login")
//     {
//         navigator['app'].exitApp();
//       }
//     });
//   }


// }
