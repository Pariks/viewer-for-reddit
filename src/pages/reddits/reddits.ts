import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RedditService } from '../../app/services/reddit.service';
import { DetailsPage } from '../details/details';
import { AdMobFree, AdMobFreeInterstitialConfig } from '@ionic-native/admob-free';

@Component({
  selector: 'page-reddits',
  templateUrl: 'reddits.html'
})
export class RedditsPage {

  items: any;
  category: any;
  limit: any;

  constructor(public navCtrl: NavController, private redditService: RedditService, private admobFree: AdMobFree) {
  	this.getDefaults();
  }

  ngOnInit(){
  	 this.getPosts(this.category, this.limit);
  }

  getDefaults(){
  	if(localStorage.getItem('category') != null){
  		this.category = localStorage.getItem('category');
  	}else{
  		this.category = 'sports';
  	}
  	if(localStorage.getItem('limit') != null){
  		this.limit = localStorage.getItem('limit');
  	}else{
  		this.limit = 30;
  	}

  }

  getPosts(category, limit){
    localStorage.setItem('category', this.category);
    localStorage.setItem('limit', this.limit);
  	this.redditService.getPosts(category, limit).subscribe( res => {
  		//console.log(res.data.children);
  		this.items = res.data.children;

  	});
  }

  viewItem(item){
  //console.log(item);
  	this.navCtrl.push(DetailsPage, {
  		item:item
  	});
  }

  loadAd(){
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
  }

  changeCategory(){
 	this.getPosts(this.category, this.limit);
  }

}
