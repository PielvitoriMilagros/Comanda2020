import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  constructor(private router: Router,private navCtrl: NavController) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    setTimeout(() => {
    this.navCtrl.navigateForward('/home');
      // this.router.navigate(["home"]);
    },5000);
}

}
