import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';
// import { SharedDataService } from '../shared-data.service';
import { AjoutannonceService } from '../services/ajoutannonce.service';
import { Annonce } from 'src/app/users/models/annonce';
import { MosqueeService } from 'src/app/users/services/mosquee.service';

import { catchError, map } from 'rxjs/operators';



@Component({
  selector: 'app-ajoutannonces',
  templateUrl: './ajoutannonces.page.html',
  styleUrls: ['./ajoutannonces.page.scss'],
})


export class AjoutannoncesPage implements OnInit {
  mosqueeData: any[] = [];
    addannonceForm = this.formBuilder.group({
    date: [new Date (), Validators.required],
    nomMosquee: ['', Validators.required],
    heurePreche:['',Validators.required],
    heureTabsir: ['', Validators.required],
   

  })

  //lien ajout button////////////////////////////////////////////
  naviguerAnnonces() {
    this.router.navigateByUrl("/listeannonces");
  }

  constructor( private formBuilder: FormBuilder,
               private ajoutannonce: AjoutannonceService, 
               private router : Router,
               private ajoutrService : AjoutannonceService,
               private mosqueeservice : MosqueeService) {}

              naviguerVersliste() {
                this.router.navigateByUrl("/listeannonces");
              }          

              ngOnInit() {
                //recuperation de la liste des mosque dans mon ajout pour la liste///////////////////// 
                this.mosqueeservice.getMosquee().pipe(
                  catchError((error) => {
                    console.error('Erreur lors de la récupération des données :', error);
                    return []; 
                  })
                ).subscribe((data: any[]) => {
                  this.mosqueeData = data;
                });
              }


  async getData(){
    return this.ajoutannonce.getlistannonce()
  }
///////ENREGISTREMENT////////////////////////////
  onSubmit(){
    const mosquee = new Annonce(
      this.addannonceForm.value.date!,
      this.addannonceForm.value.nomMosquee!,
      this.addannonceForm.value.heurePreche!,
      this.addannonceForm.value.heureTabsir!
    );
    //verifier si une annonce existante est a
    console.log(this.addannonceForm.value)
    this.ajoutannonce.addAnnonce(mosquee);
    this.addannonceForm.reset();
    this.router.navigateByUrl("/listeannonces")
    
  };// console.log("Je suis la")// console.log("Je suis la")

}
