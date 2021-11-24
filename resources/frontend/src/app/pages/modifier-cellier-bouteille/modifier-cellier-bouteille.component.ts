import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BouteilleDeVinService } from '@services/bouteille-de-vin.service';
import { Location } from '@angular/common'

@Component({
    selector: 'app-modifier-cellier-bouteille',
    templateUrl: './modifier-cellier-bouteille.component.html',
    styleUrls: ['./modifier-cellier-bouteille.component.scss']
})

export class ModifierCellierBouteilleComponent implements OnInit {
    bouteille: any;
    bouteilleId: any;

    // Cellier auquel appartient la bouteille
    cellierId: any;

    // Nom du champ qui est présentement modifiable. Il ne peut donc y en avoir qu'un seul à la fois.
    champEnModification: string = "";


    modifierBouteilleCellier = new FormGroup({
        url_image: new FormControl(''),
        nom: new FormControl(''),
        description: new FormControl(''),
        format: new FormControl(''),
        origine: new FormControl(''),
        millesime: new FormControl(''),
        inventaire: new FormControl(''),
        date_acquisition: new FormControl(''),
        prix_paye: new FormControl('', Validators.pattern("^[0-9\.,]*$")),
        conservation: new FormControl(''),
        notes_personnelles: new FormControl(''),
    });


    constructor(
        private servBouteilleDeVin: BouteilleDeVinService,
        private actRoute: ActivatedRoute,
        private snackBar: MatSnackBar,
        private router: Router,
        private location: Location,
    ) { }

    ngOnInit(): void {
        // Récupérer l'id de la bouteille à modifier
        this.bouteilleId = this.actRoute.snapshot.params.id;

        this.servBouteilleDeVin.getBouteilleAcheteeParId(this.bouteilleId).subscribe(rep => {
            this.bouteille = rep.data;
            this.initChampsModification();
        })

        // Récupérer l'id du cellier où la bouteille est stockée pour la redirection post-modifs
        const state = this.location.getState() as any;

        this.cellierId = state.cellierId;
    }

    
    // Affichage des erreurs quand le champs n'est pas rempli
    get erreur() {
        return this.modifierBouteilleCellier.controls;
    }

    // Pour l'affichage des données actuelles de la bouteille à modifier
    initChampsModification() {
        this.modifierBouteilleCellier.patchValue({
            url_image: this.bouteille.url_image,
            nom: this.bouteille.nom,
            description: this.bouteille.description,
            format: this.bouteille.format,
            origine: this.bouteille.origine,
            millesime: this.bouteille.millesime,
            inventaire: this.bouteille.inventaire,
            date_acquisition: this.bouteille.date_acquisition,
            prix_paye: this.bouteille.prix_paye,
            conservation: this.bouteille.conservation,
            notes_personnelles: this.bouteille.notes_personnelles,
        })
    }

    openSnackBar(message: any, action: any) {
        this.snackBar.open(message, action, {
            panelClass: 'notif-success'
        });
    }

    // Fonction pour modifier les information de la bouteille dans le cellier
    putBouteille(nouvellesDonnes: any) {

        // Si le formulaire est invalide empêcher la requêtte
        if(this.modifierBouteilleCellier.invalid) {
            return
        }

       nouvellesDonnes.prix_paye = nouvellesDonnes.prix_paye.replace(',', '.')
       console.log(nouvellesDonnes);

        this.servBouteilleDeVin.modifierBouteilleCellier(this.bouteilleId, nouvellesDonnes).subscribe(() => {
            this.openSnackBar('Vous avez modifié la bouteille avec succès', 'Fermer');
            this.router.navigate([`/celliers/${this.cellierId}`]);
        });

    }

    // Revenir à la page précédente
    back(): void {
        this.location.back()
    }

    // Fonction pour supprimer la bouteille du cellier
    supprimerBouteille(){

        this.servBouteilleDeVin.supprimerBouteilleCellier(this.bouteilleId).subscribe(()=>{
            console.log("supprimer")
        })

    }
}
