import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { BouteilleDeVinService } from '@services/bouteille-de-vin.service';

@Component({
    selector: 'app-connection',
    templateUrl: './connection.component.html',
    styleUrls: ['./connection.component.scss']
})
export class ConnectionComponent implements OnInit {

    formConnection = new FormGroup({
        email: new FormControl('', [
            Validators.required,
            Validators.email
        ]),
        password: new FormControl('', Validators.required)
    });

<<<<<<< HEAD


=======
>>>>>>> 00ae55b176f89b1b40f87fc8c8575f73cf18eda7

    constructor(
        private servAuth: AuthService,
        private snackbar: MatSnackBar,
        private router: Router,
        private location: Location,
    ) { }

    ngOnInit(): void {

        // Charger l'email aprés la creation de compte pour facilité la connection à l'utilisateur
        this.formConnection.get("email")?.setValue((this.location.getState() as any).email);
    }

    // Affichage d'erreur quand le champ n'est pas rempli
    get erreur() {
        return this.formConnection.controls;
    }

    /**
     *
     * Envoyé l'input de l'usager au service d'authentification
     *
     */
    connection() {

        if (this.formConnection.invalid) {
            this.formConnection.markAllAsTouched();
            return;
        }

        const data = {
            email: this.formConnection.value.email,
            password: this.formConnection.value.password
        }



      this.servAuth.connexion(data).subscribe(
          (data) => {
              this.servAuth.utilisateur = data.utilisateur;
              this.servAuth.token = data.token;
              this.router.navigate(['/']);
              this.snackbar.open(`Salut, ${data.utilisateur.first_name} ! Heureux de vous revoir`, "Fermer", {duration: 3000, panelClass: 'notif'});
          },
          (error) => {
              this.snackbar.open(error.error.message, "Fermer", {duration: 3000, panelClass: 'notif-danger'});
          })
    }

}
