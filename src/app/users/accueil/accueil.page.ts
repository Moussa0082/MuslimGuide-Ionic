import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { LocalNotifications } from '@capacitor/local-notifications';
import { StatusBar, Style } from '@capacitor/status-bar';
import { async } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MosqueeService } from '../services/mosquee.service';
import { Mosquee } from '../models/mosquee';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.page.html',
  styleUrls: ['./accueil.page.scss'],
})
export class AccueilPage implements OnInit, AfterViewInit {

  apiKey = "ee179fc833ed4af9ad062cfabc51004b";
  test:string = "salut";
  mosquee : any;
  horaireMosquee : any;
  audio = new Audio();
  constructor( private route : Router, private http : HttpClient,private mosqueeService : MosqueeService) { }

  ngOnInit() {
    Geolocation.getCurrentPosition().then((result) =>{
      // this.http.get("https://api.opencagedata.com/geocode/v1/json?q="+result.coords.latitude+"+"+result.coords.longitude+"&key="+this.apiKey).subscribe((data : any) =>{
      //   //console.log(data)
      //   this.test = data.results[0].components.suburb;
      //   //console.log(data)
      //   console.log(result.coords.latitude+" "+result.coords.longitude);
      //   //this.watchPosition();
      // })

      this.mosqueeService.getMosquee().subscribe((response)=>{
        let mosqueeTemp : any[]=[];
        response.forEach((mosquee : any) => {
          const temp = {distance : this.calcDist(result.coords.latitude,result.coords.longitude,mosquee.latitude,mosquee.longitude), ...mosquee}
          mosqueeTemp.push(temp);
        });
        mosqueeTemp.sort((a,b)=>{
          return a.distance - b.distance
        })
        this.mosqueeService.getHoraireById(mosqueeTemp[0].horaire.path).subscribe((heure)=>{
          this.mosquee = mosqueeTemp[0];
          this.horaireMosquee = heure;
          //const asri = this.horaireMosquee.zohr.split(":")
          // const date = new Date(new Date().setTime(((+asri[0]*(60*60000))+(+asri[1]*60000)-5*60000)))
          // console.log(date.toLocaleTimeString())
          // console.log(this.diminuerUneHeureDe5Min(this.horaireMosquee.zohr))
          this.createNotification(heure)
        })
        console.log(mosqueeTemp[0])
      });

    })

    // LocalNotifications.registerActionTypes({
    //   types : [
    //     {
    //       id : "coran",
    //       actions : [
    //         {
    //           id : "jouer",
    //           title : "Ouvrir",
    //         },
    //         {
    //           id : "fermer",
    //           title : "Fermer",
    //         }
    //       ]
    //     }
    //   ]
    // })
    // LocalNotifications.createChannel({
    //   id : "Asri",
    //   name : "Asri",
    //   sound : "adhan.wav",
    //   visibility : 1,
    //   vibration : true
    // })
    // LocalNotifications.schedule({
    //   notifications : [
    //     {
    //       id : 1,
    //       title : "Muslim Guide",
    //       body : "<p>er</p>",
    //       // ongoing : true,
    //       actionTypeId : "coran",
    //       channelId : "Asri"
    //     }
    //   ]
    // })
    // // LocalNotifications.addListener("localNotificationReceived",e=>{
    // //   this.audio.src = "../../../assets/audio/abdulbasit.mp3"
    // //   this.audio.load()
    // //   this.audio.play()
    // // })
    // LocalNotifications.addListener("localNotificationActionPerformed",e=>{
    //   this.test = e.actionId;
    //   // this.audio.pause()
    //   // this.audio.src = "";
    //   // this.audio.load()
    // })
    StatusBar.setBackgroundColor({color : "#25A069"})
  }

  // watchPosition() {
  //   const wait = Geolocation.watchPosition({}, (position, err) => {});
  // }
  
  goToMosquee(){
    this.route.navigateByUrl("/mosquee")
    // console.log("hbfezklm")liste-des-mosquees
  }
  
  goToQuran(){
    this.route.navigateByUrl("/sourate-liste")
  }

  goToAudio(){
    this.route.navigateByUrl("/lecteur-corant")
  }

  goToHijri(){
    this.route.navigateByUrl("/hidjri")
  }

  goToChapelet(){
    this.route.navigateByUrl("/chapelet")
  }

  goToAnnonce(){
    this.route.navigateByUrl("/annonce")
  }

  goToRadio(){
    this.route.navigateByUrl("/radio")
  }

  goToKaaba(){
    this.route.navigateByUrl("/kaba")
  }

  calcDist(latUser : number, lngUser : number,latMosq :number,lngMosq : number){
    const rayonDeLaTerre = 6371.07103;
    const radiusLatUser = latUser * (Math.PI/180);
    const radiusLatMosq = latMosq * (Math.PI/180);
    const latitudeDiff = radiusLatMosq - radiusLatUser;
    const longitudeDiff = (lngMosq-lngUser)*(Math.PI/180);
    const distance = 2 * rayonDeLaTerre * Math.sin(Math.sqrt(Math.sin(latitudeDiff/2) * Math.sin(latitudeDiff/2) + Math.cos(radiusLatUser) * Math.cos(radiusLatMosq) * Math.sin(longitudeDiff/2) * Math.sin(longitudeDiff/2)))
    console.log(distance)
    return distance;
  }

  diminuerUneHeureDe5Min(heureMinute : string){
    const heureDecompose = heureMinute.split(":");
    const heureEnMilliSec = +heureDecompose[0]*(60*60000);
    const minuteEnMilliSec = +heureDecompose[1]*60000;
    const heureMinuteEnMilliSec = (heureEnMilliSec+minuteEnMilliSec)-5*60000 //l'heure total en milliseconde -5 minute
    return new Date(new Date().setTime(heureMinuteEnMilliSec)).toLocaleTimeString().split(":");
  }

  async createNotification(heure : any){
    await LocalNotifications.createChannel(
      {
        id : "fadjr",
        name : "Fadjr",
        sound : "adhan.wav",
        visibility : 1
      },
    );

    await LocalNotifications.createChannel(
      {
        id : "zohr",
        name : "Zohr",
        sound : "adhan.wav",
        visibility : 1
      },
    );

    await LocalNotifications.createChannel(
      {
        id : "asri",
        name : "Asri",
        sound : "adhan.wav",
        visibility : 1
      },
    )

    await LocalNotifications.createChannel(
      {
        id : "magreb",
        name : "Magreb",
        sound : "adhan.wav",
        visibility : 1
      },
    )

    await LocalNotifications.createChannel(
      {
        id : "isha",
        name : "Isha",
        sound : "adhan.wav",
        visibility : 1
      },
    )

    await LocalNotifications.createChannel(
      {
        id : "djouma",
        name : "Djouma",
        sound : "adhan.wav",
        visibility : 1
      },
    )
    await LocalNotifications.schedule({
      notifications : [
        {
          id : 1,
          title : "Muslim Guide",
          body : "<p>er</p>",
          channelId : "fadjr",
          schedule : {
            on : {
              hour : +this.diminuerUneHeureDe5Min(heure.fadjr)[0],
              minute : +this.diminuerUneHeureDe5Min(heure.fadjr)[1]
            },
            allowWhileIdle : true
          }
        },
        {
          id : 2,
          title : "Muslim Guide",
          body : "<p>er</p>",
          channelId : "zohr",
          schedule : {
            on : {
              hour : +this.diminuerUneHeureDe5Min(heure.zohr)[0],
              minute : +this.diminuerUneHeureDe5Min(heure.zohr)[1]
            },
            allowWhileIdle : true
          }
        },
        {
          id : 3,
          title : "Muslim Guide",
          body : "<p>er</p>",
          channelId : "asri",
          schedule : {
            on : {
              hour : +this.diminuerUneHeureDe5Min(heure.asri)[0],
              minute : +this.diminuerUneHeureDe5Min(heure.asri)[1]
            },
            allowWhileIdle : true
          }
        },
        {
          id : 4,
          title : "Muslim Guide",
          body : "<p>er</p>",
          channelId : "magreb",
          schedule : {
            on : {
              hour : +this.diminuerUneHeureDe5Min(heure.magreb)[0],
              minute : +this.diminuerUneHeureDe5Min(heure.magreb)[1]
            },
            allowWhileIdle : true
          }
        },
        {
          id : 5,
          title : "Muslim Guide",
          body : "<p>er</p>",
          channelId : "ischa",
          schedule : {
            on : {
              hour : +this.diminuerUneHeureDe5Min(heure.isha)[0],
              minute : +this.diminuerUneHeureDe5Min(heure.isha)[1]
            },
            allowWhileIdle : true
          }
        },
        {
          id : 6,
          title : "Muslim Guide",
          body : "<p>er</p>",
          channelId : "djouma",
          schedule : {
            on : {
              hour : +this.diminuerUneHeureDe5Min(heure.djouma)[0],
              minute : +this.diminuerUneHeureDe5Min(heure.djouma)[1]
            },
            allowWhileIdle : true
          }
        }
      ]
    })
  }

  ngAfterViewInit(): void {
    const carousel = document.querySelector(".igx-carousel__inner");
    const carou = carousel as HTMLDivElement
    console.log(carou)
    carou.style.minHeight="175px";
  }

}
