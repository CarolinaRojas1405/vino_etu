import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {FormControl,FormGroup,Validators} from '@angular/forms';
import { DatePipe, Location } from '@angular/common'
import { BouteilleDeVinService } from '@services/bouteille-de-vin.service';
import { AuthService } from '@services/auth.service';
import { ElementsActifsService } from '@services/elements-actifs.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-creation-bouteille',
  templateUrl: './creation-bouteille.component.html',
  styleUrls: ['./creation-bouteille.component.scss']
})
export class CreationBouteilleComponent implements OnInit {

  bouteilleCatalogue: any;
  bouteilleData: any;
  listeCelliers!: any[];
  listePays!: any[];
  listeCategories!: any[];


  ajoutBouteille = new FormGroup({
    nom: new FormControl('', Validators.required),
    pays_id: new FormControl('', Validators.required),
    categories_id: new FormControl('', Validators.required),
    prix: new FormControl(''),
  });

  @ViewChild('fileInput') fileInput!: ElementRef;
  fileAttr = 'Fichier';

  constructor(
    private location: Location,
    private servBouteilleDeVin: BouteilleDeVinService,
    private authService: AuthService,
    private elementsActifs: ElementsActifsService,
    private datePipe: DatePipe,
    private router: Router,
    private snackbar: MatSnackBar
    ) { }

  ngOnInit(): void {

    // Récupérer la date du jour valeur par défaut du formulaire
     this.ajoutBouteille.get("date_acquisition")?.setValue(
      this.datePipe.transform(new Date(), "yyyy-MM-dd")
    );

    // Charger la liste des celliers de l'utilisateur.
    this.servBouteilleDeVin.getListeCelliersParUtilisateur(this.authService.getIdUtilisateurAuthentifie())
    .subscribe((data: any) => {
        this.listeCelliers = data;

        // Si un cellier actif existe dans le service, le sélectionner comme option initiale du select
        const cellierActif = this.elementsActifs.getCellierActif();

        if (cellierActif) {
            this.ajoutBouteille.controls.cellierId.setValue(cellierActif);
        }
    })

        // Charger la liste des pays de la BD.
        this.servBouteilleDeVin.getListePays()
        .subscribe((data: any) => {
            this.listePays = data.data;  // tableau dans un tableau
        })

        // Charger la liste des catégories de la BD.
        this.servBouteilleDeVin.getToutesCategories()
        .subscribe((data: any) => {
            this.listeCategories = data;
        })
  }

  // Affichage des erreurs quand le champs n'est pas rempli
    get erreur() {
      return this.ajoutBouteille.controls;
  }

  // Revenir à la page précédente
    back(): void {
      this.location.back()
  }

    // Function pour ajouter une bouteille au catalogue
    postBouteilleCellier(bouteille: any) {

      if (this.ajoutBouteille.invalid) {
          this.ajoutBouteille.markAllAsTouched();
          return;
      }

      console.log(bouteille);

      this.bouteilleCatalogue = bouteille;
      this.bouteilleCatalogue.users_id = this.authService.getIdUtilisateurAuthentifie();

      this.servBouteilleDeVin.ajoutBouteilleCatalogue(this.bouteilleCatalogue)
          .subscribe(() => {
              this.snackbar.open('Vous avez ajouté une bouteille personnalisé au catalogue', 'Fermer')

              this.router.navigate(['/bouteilles']);
          }); 
  }

  /**
   *
   * Comparer les valeurs des options d'id de celliers afin de sélectionner celle qui correspond à la valeur donnée au formControl.
   *
   * @param {number} id1
   * @param {number|string} id2
   * @returns {boolean}
   */
      comparerCellierId(id1: number, id2: string|number): boolean {
      return id1 == id2;
  }

 /* uploadFileEvt(imgFile: any) {
    if (imgFile.target.files && imgFile.target.files[0]) {
      this.fileAttr = '';
      Array.from(imgFile.target.files).forEach((file: any) => {
        this.fileAttr += file.name + ' - ';
      });

      // HTML5 FileReader API
      let reader = new FileReader();
      reader.onload = (e: any) => {
        let image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          let imgBase64Path = e.target.result;
        };
      };
      reader.readAsDataURL(imgFile.target.files[0]);
      
      // Reset if duplicate image uploaded again
      this.fileInput.nativeElement.value = "";
    } else {
      this.fileAttr = 'Fichier';
    }
  } */


}
