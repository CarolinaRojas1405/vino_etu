import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MatConfirmDialogComponent } from '@components/mat-confirm-dialog/mat-confirm-dialog.component';



@Injectable({
    providedIn: 'root'
})
export class BouteilleDeVinService {

    // private url:string = "http://127.0.0.1:8000/api";
    private url: string = "http://kalimotxo-vino.akira.dev/api";
    // private url: string = new URL(window.location.href).origin + "/api";


    constructor(private servAuth: AuthService, private http: HttpClient, private dialog: MatDialog) {
        console.log(this.url);
    }

    getBouteillesParCellier(cellierId = 1, filtres = {}) {
        return this.http.get<any>(
            this.url + '/celliers/' + cellierId + '/bouteilles',
            {
                params: filtres
            }
        );
    }

    getListeBouteille(filtres = {}) {
        return this.http.get<any>(this.url + '/catalogue-bouteilles', {
            params: filtres
        });
    }

    getBouteilleParId(id_bouteille: any) {

        return this.http.get<any>(this.url + '/bouteilles/' + id_bouteille);
    }

    getBouteilleAcheteeParId(id_bouteille: any) {

        return this.http.get<any>(this.url + '/bouteilles-achetees/' + id_bouteille);
    }

    ajoutBouteilleCellier(cellierId: number = 1, bouteilleAchetee: any) {

        const entete = {
            'Authorization': `Bearer ${this.servAuth.utilisateurToken}`,
        }

        return this.http.post<any>(this.url + '/celliers/' + cellierId + '/bouteilles', bouteilleAchetee, { headers: entete });

    }

    modifierInventaireCellierBouteille(bouteille_id: any, nouvelInventaire: any) {

        const entete = {
            'Authorization': `Bearer ${this.servAuth.utilisateurToken}`,
        }

        let body = {
            'inventaire': nouvelInventaire,
        }

        return this.http.put<any>(this.url + '/celliers/modifier-inventaire/' + bouteille_id, body, { headers: entete });
    }


    modifierBouteilleCellier(bouteilleAchetee_id: any, data: any) {

        const entete = {
            'Authorization': `Bearer ${this.servAuth.utilisateurToken}`,
        }
        return this.http.put<any>(this.url + '/bouteilles-achetees/' + bouteilleAchetee_id, data, { headers: entete })

    }

    supprimerBouteilleCellier(bouteilleAchetee_id: any) {

        const entete = {
            'Authorization': `Bearer ${this.servAuth.utilisateurToken}`,
        }

        console.log(bouteilleAchetee_id);
        return this.http.delete<any>(
            this.url + '/supprimer/' + bouteilleAchetee_id,
            {
                headers: entete
            })

    }

    /**
     *
     * Charger les celliers appartenant à l'utilisateur donné
     *
     * @param {number} userId Id de l'utilisateur
     * @returns {Observable} Liste des celliers de l'utilisateur
     */
    getListeCelliersParUtilisateur(userId: number): any {
        const options = {
            headers: {
                'Authorization': `Bearer ${this.servAuth.utilisateurToken}`,
            },
            params: {
                userId: userId
            }
        }

        return this.http.get<any>(this.url + "/celliers", options)
    }

    ajouterUtilisateur(data: any) {
        return this.http.post<any>(this.url + '/creerCompte', data)
    }

    confirmDialog(msg: string) {
        return this.dialog.open(MatConfirmDialogComponent, {
            width: '400px',
            panelClass: 'confirm-dialog-container',
            disableClose: true,
            data: {
                message: msg
            }
        });
    }

    ajoutCellier(data:any, id:any) {

        const entete = {
            'Authorization': `Bearer ${this.servAuth.utilisateurToken}`,
        }

        return this.http.post<any>(this.url + '/celliers', data, { headers: entete });


      

    }

}


