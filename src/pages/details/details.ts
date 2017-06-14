//import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {DomSanitizer } from '@angular/platform-browser';
import { Platform, ActionSheetController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { RedditService } from '../../app/services/reddit.service';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { AdMobFree, AdMobFreeInterstitialConfig } from '@ionic-native/admob-free';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Toast } from '@ionic-native/toast';

@Component({
  templateUrl: 'details.html'
})

export class DetailsPage {

  item: any;
  commentObjs: any;
  comments: any;
  showComments: any;
  replies: any;
  commentScoreColor: any;
  scoreColor: string;
  totalMainComments: any;
  totalRepliesComments: any;
  y: any;
  t: any;
  b: any;

  c: any;

  concate: any;
  display: any;

  @ViewChild('commentsContainer') commentsContainer: ElementRef;

  constructor(public navCtrl: NavController, public params: NavParams, private redditService: RedditService, private sanitizer: DomSanitizer,
              public platform: Platform, public actionsheetCtrl: ActionSheetController, public toastCtrl: ToastController, private admobFree: AdMobFree,
              private socialSharing: SocialSharing, private toast: Toast) {
    this.item = params.get('item');
    this.y = "you";
    this.t = "tu";
    this.b = "be";
    this.c = ".com";
    this.concate = this.y + this.t;
    console.log(this.item );
    if(this.item.url.includes(this.concate)){
      this.concate = "https://www." + this.y + this.t + this.b + this.c + "/embed/";
      if(this.item.url.includes(this.c)) {
        this.concate +=  this.item.url.split("=").pop();
      }else if(this.item.url.includes("."+this.b)) {
        this.concate +=  this.item.url.split("/").pop();
      }
      this.display = true;
    }

    this.setScoreColor();
    this.loadAd();

  }
  setScoreColor(){
    if(!this.scoreColor && localStorage.getItem(this.item.id) == null){
      this.scoreColor = "dark";
      localStorage.setItem(this.item.id, "dark");
    }else if (this.scoreColor === "primary") {
        this.item.score -= 1;
        this.scoreColor = "dark";
        localStorage.setItem(this.item.id, "dark");
      } else if(this.scoreColor === "dark"){
        this.item.score += 1;
        this.scoreColor = "primary";
        localStorage.setItem(this.item.id, "primary");
      }else if(localStorage.getItem(this.item.id) != null){
        this.scoreColor =  localStorage.getItem(this.item.id);
        if(this.scoreColor === "primary"){
          this.item.score += 1;
        }else{
          this.item.score -= 1;
        }
    }
  }

  setCommentScoreColor(comment){
    console.log(comment.id);
    if(!this.commentScoreColor && localStorage.getItem(comment.id) == null){
      this.commentScoreColor = "dark";
      localStorage.setItem(comment.id, "dark");
    }else if (this.commentScoreColor === "primary") {
      this.commentScoreColor = "dark";
      localStorage.setItem(comment.id, "dark");
    } else if(this.commentScoreColor === "dark"){
      this.commentScoreColor = "primary";
      localStorage.setItem(comment.id, "primary");
    }else if(localStorage.getItem(comment.id) != null){
      this.commentScoreColor =  localStorage.getItem(comment.id);
    }
  }
  sanitizeUrl(url){
  	return this.sanitizer.bypassSecurityTrustResourceUrl(url);
   }

  share(appName){
    let message = null, image = null,
        url = null;

    if(this.item.url.includes('imgur') && this.item.url.indexOf('gifv') > -1){
      url = "https://i.imgur.com/"+this.item.url.split("/").pop().replace("gifv", "gif").replace("mp4", "gif");
    }

    if(this.display){
      url = this.concate.replace("embed/", "");
    }

    if(url === null){
      if( this.item.hasOwnProperty('preview') ) {
        image = this.item.preview.images[0].source.url;
      }
    }

    if(url === null && image === null){
      message = this.item.url;
    }else{
      message = this.item.title;
    }

    switch (appName){
      case "facebook": {
        this.socialSharing.shareViaFacebook(message, image, url).then(() => {
          // Sharing via whatsapp is possible

        }).catch(() => {
          // Sharing via whatsapp is not possible

        });
        break;
      }
      case "twitter": {
        this.socialSharing.shareViaTwitter(message, image, url).then(() => {
          // Sharing via whatsapp is possible

        }).catch(() => {
          // Sharing via whatsapp is not possible

        });
        break;
      }
      case "whatsapp": {
        this.socialSharing.shareViaWhatsApp(message, image, url).then(() => {
          // Sharing via whatsapp is possible

        }).catch(() => {
          // Sharing via whatsapp is not possible

        });
        break;
      }
      case "instagram": {
        this.socialSharing.shareViaInstagram(message, image).then(() => {
          // Sharing via whatsapp is possible
        }).catch(() => {
          // Sharing via whatsapp is not possible
          this.toast.show("Can't share.Image not Found.", '2000', 'center').subscribe();
        });
        break;
      }

    }

  }

  getComments(){
    this.redditService.getComments(this.item.permalink.substring(0, this.item.permalink.length - 1)).subscribe( res => {
      if(!this.showComments){
        this.showComments = true;
      }else{
        this.showComments = this.showComments === true ? false : true;
      }
      this.commentObjs = res[1].data.children;
      let arr = {};
      let i=0;
      res[1].data.children.forEach(function(commentObj) {
        arr[i]=commentObj.data;
        i++;
      });
      this.totalMainComments = res[1].data.children.length;
      this.comments = arr;

    });
  }

  loadReplies(){
    if(!this.replies){
      this.replies = true;
    }else{
      this.replies = this.replies === true ? false : true;
    }

  }


  createRange(number){
    var items: number[] = [];
    for(var i = 1; i <= number; i++){
      items.push(i);
    }
    return items;
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


}
