  import { Injectable } from '@angular/core';
  import { Firestore, collectionData,query,where } from '@angular/fire/firestore';
  import { DocumentReference, QuerySnapshot, addDoc, collection, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
  import { deleteDoc } from 'firebase/firestore';
  import { Annonce } from 'src/app/users/models/annonce';
  import { AlertController } from '@ionic/angular';
import { map } from '@mobiscroll/angular/dist/js/core/util/misc';
  
  @Injectable({
    providedIn: 'any'
  })
  export class AjoutannonceService {
    annonces : any[]=[];

    constructor(private readonly firestore: Firestore, private alertController : AlertController) {}

///////////////////////////ajouter une annonce depuis le sevice///////////////////////////////////
    async addannonce(annonce: Annonce): Promise<DocumentReference> {
      // Vérifiez si tous les champs sont remplis
       if (!annonce.date || !annonce.nomMosquee || !annonce.heurePreche || !annonce.heureTabsir) {
         // Affichez un message d'erreur modal à l'utilisateur
         const alert = await this.alertController.create({
           header: 'Erreur',
           message: 'Attention champs vide non enregistrable ',
           buttons: ['OK']
         });
    
         await alert.present();
    
         // Rejetez la promesse pour éviter d'ajouter le document incorrect
         return Promise.reject('Les champs obligatoires ne sont pas définis.');
       }
      const document= collection(this.firestore, "Annonce");
      console.log(annonce);
      return addDoc(document,{
        
        date : annonce.date,
        nomMosquee : annonce.nomMosquee,
        heurePreche : annonce.heurePreche,
        heureTabsir : annonce.heureTabsir,
       
      });
    
    }
    //recuperer les ajout d'annonce dans la liste annonces
    getlistannonce(){
      const document = collection(this.firestore, "Annonce");
      // this.annonces = [];
      return collectionData(document, {idField : 'id'})//.subscribe((result : any[]) => { 
    }

////////////////////////methode de modification de la liste des annonces/////////////////////////////////
    async updateannonce(index : string, annonce:any){
      const modal = await this.alertController.create({
        header: 'Modification',
        inputs :[{
          name: 'date',
          type : 'date',
          value : annonce.date //prends les valeur de la date 
        },
        {
          name : 'nomMosquee',
          type: 'text',
          placeholder : '....',
          value: annonce.nomMosquee // prends les valeurs du champs de la mosquée
        },
        {
          name : 'heurePreche',
          type : 'time',
          placeholder :'hh:mm',
          value : annonce.heurePreche // prends les valeurs d'heure de preche 
        },

        {
          name : 'heureTabsir',
          type : 'time',
          placeholder : 'hh:mm',
          value : annonce.heureTabsir // prens les valeurs d'heure de tabsir
        }
      ],
      buttons : [
        {
          text : 'Annuler', 
          role : 'cancel'
        },{
          text : 'Modifier',
          handler : async(data) =>{

            //validez les données des champs avant modification
            try{
            console.log(this.firestore)
            const annonceDoc = doc(this.firestore, 'Annonce', index); //utilisez l'id de annonce dans la base 
            await updateDoc(annonceDoc,{
              date : data.date, 
              nomMosquee : data.nomMosquee,
              heurePreche : data.heurePreche,
              heureTabsir : data.heureTabsir });

              // Affichez un message de confirmation à l'utilisateur
              const confirmation = await this.alertController.create({
                header: 'Confirmation',
                message: 'L\'annonce a été modifiée avec succès.',
                buttons: ['OK'],
              });

                
              await confirmation.present();
            } catch (error) {
              console.error('Erreur lors de la mise à jour : ', error);

            ///// Affichez un message d'erreur à l'utilisateur/////////
              const erreur = await this.alertController.create({
                header: 'Erreur',
                message: 'Une erreur s\'est produite lors de la mise à jour de l\'annonce.',
                buttons: ['OK'],
              });

              await erreur.present();

              }
              },
            }
              ],
              });
          await modal.present();
              }

 /////////////////////////// Méthode pour supprimer une annonce par ID////////////////////////////////////////
    async deleteAnnonceById(annonceId: string): Promise<void> {
      try {
        const documentRef = doc(this.firestore, 'Annonce', annonceId);
        const supp = await this.alertController.create({
          header: 'Suppression',
          message: 'Attention, voulez-vous vraiment supprimer ?',
          buttons: [
            {
              text: 'Non',
              role: 'cancel',
            },
            {
              text: 'Oui',
              handler: async () => {
                await deleteDoc(documentRef);
                
              },
            },
          ],
        });
        await supp.present();
      } catch (error) {
        console.error('Erreur lors de la suppression : ', error);
      }
    }

///////////////////METHODES POUR RECUPERER UNIQUEMENTS LES NOM DES MOSQUES///////////////////
   
    async getNomsMosquees(): Promise<string[]> {
      const querySnapshot = await getDocs(query(collection(this.firestore, 'Annonce')));
  
      const nomsMosquees: string[] = [];
  
      for (const doc of querySnapshot.docs) {
        const data = doc.data();
        if (data['nomMosquee']) {
           nomsMosquees.push(data['nomMosquee']);
        }
      }
  
      return nomsMosquees;
    }
    //////////////////METHODES POUR RECUPERER LES AUTRES DONNEES POUR DETAILS MOSQUEES///////////////////
    async getDetailleMosquees(): Promise<any[]> {
      
      const querySnapshot = await getDocs(query(collection(this.firestore, 'Annonce')));    // Récupération de la collection 'Annonce' depuis Firestore
    
      const tableaudetailMosque: any[] = [];             // Tableau qui contiendra les détails des mosquées
    
      for (const doc of querySnapshot.docs) {             // Parcours de chaque document de la collection
        
        const data = doc.data();                   // Extraction des données du document
        console.log(data);
        
        if (data['date'] ,data['heureTabsir']) {        // Vérification si les données 'date', 'heurePreche' et 'heureTabsir' existent
          
          const detailaimporter = data;             // Création d'une chaîne de caractères avec les détails
               
          tableaudetailMosque.push(detailaimporter); // Ajout de la chaîne de caractères au tableau des détails
        }
      }
      return tableaudetailMosque;// Retourne le tableau des détails des mosquées
    }
     
} 















// `${data['date']}, ${data['heurePreche']}, ${data['heureTabsir']}`;
// && data['heurePreche'] 