import { Component, OnInit } from '@angular/core';
import { collection, collectionData } from '@angular/fire/firestore';
import { doc } from 'firebase/firestore';
import { Firestore } from 'firebase/firestore';
import { MosqueeService } from '../services/mosquee.service';





@Component({
  selector: 'app-liste-des-mosquees',
  templateUrl: './liste-des-mosquees.page.html',
  styleUrls: ['./liste-des-mosquees.page.scss'],
})
export class ListeDesMosqueesPage implements OnInit {
  mosquee:any=[];
  constructor(private mosqueeService: MosqueeService) { }
 
  ngOnInit() {
    console.log("Starting")
    this.mosqueeService.getMosquee().subscribe((result : any[])=>{
      //const docc = doc(this.firestore,result.horaire)
      let mosquee : any[] = [];
      console.log(result)
      result.forEach(mosque =>{
        //const documentRef = doc(this.firestore, mosque.horaire.path)
        mosque.horaire = mosque.horaire.path
        mosquee.push(mosque);
        console.log(mosque+" added")
      })
      //console.log(mosquee)
      this.mosquee = mosquee;
    })
  }
  

}
