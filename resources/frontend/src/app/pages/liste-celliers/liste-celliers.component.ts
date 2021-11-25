import { Component, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AjoutCellierComponent } from '@pages/ajout-cellier/ajout-cellier.component';
import { ModifierCellierComponent } from '@pages/modifier-cellier/modifier-cellier.component';
import { AuthService } from '@services/auth.service';
import { BouteilleDeVinService } from '@services/bouteille-de-vin.service';
import { ElementsActifsService } from '@services/elements-actifs.service';

@Component({
    selector: 'app-liste-celliers',
    templateUrl: './liste-celliers.component.html',
    styleUrls: ['./liste-celliers.component.scss']
})
export class ListeCelliersComponent implements OnInit {

    listeCelliers!: any[];


    // cellierInitiales: any;

    celliers: any = [];

    constructor(
        private servBouteilleDeVin: BouteilleDeVinService,
        private authService: AuthService,
        private elementsActifs: ElementsActifsService,
        public formAjout: MatDialog,
        public formModif: MatDialog,
        private snackbar: MatSnackBar
    ) { }

    ngOnInit(): void {

        // Charger la liste des celliers de l'utilisateur.
        this.servBouteilleDeVin.getListeCelliersParUtilisateur(this.authService.getIdUtilisateurAuthentifie())
            .subscribe((data: any) => {
                this.listeCelliers = data;
            })
    }

    // Appel du formulaire pour l'ajout d'un cellier

    formulaireAjout(data: any): void {
        let refModal = this.formAjout.open(AjoutCellierComponent, {
            data
        });

        const response = refModal.componentInstance.chargerCelliers.subscribe(() => { this.chargerCelliers() });
    }

    // Appel du formulaire pour la modification d'un cellier

    formulaireModification(data: any): void {

        let refModal = this.formModif.open(ModifierCellierComponent, {
            data
        });

        const response = refModal.componentInstance.chargerCelliers.subscribe(() => { this.chargerCelliers() });

    }

    // Affichage de la liste avec le nouveau cellier
    chargerCelliers() {
        this.servBouteilleDeVin.getListeCelliersParUtilisateur(this.authService.getIdUtilisateurAuthentifie()).subscribe((cellier: any) => {
            this.celliers = this.listeCelliers = cellier
            console.log(cellier);
        });
    }


    // Fonction pour supprimer une bouteille dans le cellier et envoyer une notification de confirmation
    supprimerCellier(idCellier: any) {
        this.servBouteilleDeVin.confirmDialog('Voulez vous supprimer le cellier ?')
            .afterClosed().subscribe(res => {
                if (res) {
                    this.servBouteilleDeVin.supprimerUnCellier(idCellier).subscribe(() => {
                        this.chargerCelliers();
                        this.effacerCellierActifSiDetruit(idCellier);
                        this.snackbar.open('Vous avez supprimer votre cellier', 'Fermer');
                    });
                }
            })
    }

    /**
     *
     * Supprime le cellier actif du service si celui-ci est détruit de la base de données.
     *
     * @param id id du cellier récemment supprimé
     */
    effacerCellierActifSiDetruit(id: number) {
        if(this.elementsActifs.getCellierActif() == id) {
            console.log("Cellier actif supprimé");
            this.elementsActifs.setCellierActif(null);
        }
    }

}
