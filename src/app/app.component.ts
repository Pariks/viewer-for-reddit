import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { RedditService } from './services/reddit.service';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig } from '@ionic-native/admob-free';

@Component({
  templateUrl: 'app.html',
  providers: [RedditService]
})
export class MyApp {
  rootPage:any = TabsPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private admobFree: AdMobFree) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

//Banner ad
const bannerConfig: AdMobFreeBannerConfig = {
 // add your config here
 // for the sake of this example we will just use the test config
 id: 'ca-app-pub-6617005593427533/5740895207',
 isTesting: false,
 autoShow: true
};
this.admobFree.banner.config(bannerConfig);

this.admobFree.banner.prepare()
  .then(() => {
    // banner Ad is ready
    // if we set autoShow to false, then we will need to call the show method here
  })
  .catch(e => console.log(e));

//interstitial ad
const interstitialConfig: AdMobFreeInterstitialConfig ={
  // add your config here
  // for the sake of this example we will just use the test config
  id: 'ca-app-pub-6617005593427533/4624088804',
  isTesting: false,
  autoShow: true
}
this.admobFree.interstitial.config(interstitialConfig);
this.admobFree.interstitial.prepare()
  .then(() => {
    // interstitial Ad is ready
    // if we set autoShow to false, then we will need to call the show method here
  })
  .catch(e => console.log(e));

    });
  }
}
