/*
*
* Ce service permet d'affecter les filtres et donc de changer le fichier de conf ('state: true or false');
* En récupérant les valeurs dans les inputs pour savoir s'il sont rempli et savoir leurs valeurs.
* Pour les case à cocher on sait s'il sont cocher ou pas car quand on clique on a déjà renseigner le fichier de conf. 
*
*/

import {Injectable} from '@angular/core';

declare var require: any;

@Injectable()
export class FiltresService {
    private confFiltresAladin3: any;
    private confFiltresInsee: any;
    private confFiltresRubrique: any;

    constructor() {
        this.confFiltresAladin3 = require('../conf/filtresAladin3.json');
        this.confFiltresInsee = require('../conf/filtresInsee.json');
        this.confFiltresRubrique = require('../conf/filtresRubrique.json');
    }

    /**
     * Comment for method 'affecterFiltreAladin3'.
     * Methode qui permet de mettre dans une variable JSON tous les filtres qui sont activé.
     * Pour connaitre les filtres actif il faut voir dans leurs fichier de conf respéctif.
     */
    affecterFiltreAladin3(paramRequeteFiltre){
        var val : any;
        var val2 : any;
        var paramRequeteFiltreTmp : any = [];
        paramRequeteFiltre = "";
        for (let item of this.confFiltresAladin3.filtresAvanceAvecInput){
            item.state = false; /// réinitialisé
            if ((<HTMLInputElement>document.getElementById("filtre_numerique_min" + item.name)) && (<HTMLInputElement>document.getElementById("filtre_numerique_max" + item.name))){
                    item.min = (<HTMLInputElement>document.getElementById("filtre_numerique_min" + item.name)).value;
                    item.max = (<HTMLInputElement>document.getElementById("filtre_numerique_max" + item.name)).value;
                    item.state = true;
            }
            if (item.state == true){
                paramRequeteFiltreTmp.push({'champ': "filtresAvanceAvecInput", 'name': item.name, 'min': item.min, 'max': item.max});
            }
        }

        for (let item of this.confFiltresAladin3.filtresAvanceAvecInput2){
            item.state = false; /// réinitialisé
            if ((<HTMLInputElement>document.getElementById("filtre_numerique_min" + item.name)) && (<HTMLInputElement>document.getElementById("filtre_numerique_max" + item.name))){
                    item.min = (<HTMLInputElement>document.getElementById("filtre_numerique_min" + item.name)).value;
                    item.max = (<HTMLInputElement>document.getElementById("filtre_numerique_max" + item.name)).value;
                    item.state = true;
            }
            if (item.state == true){
                paramRequeteFiltreTmp.push({'champ': "filtresAvanceAvecInput2", 'name': item.name, 'min': item.min, 'max': item.max});
            }
        }
        for (let item of this.confFiltresAladin3.filtresAvanceTypeDernierEvenement){
            (item.state == true) ? (paramRequeteFiltreTmp.push({'champ': "filtresAvanceTypeDernierEvenement", 'name': item.name})) : (0);
        }
        for (let item of this.confFiltresAladin3.filtresAvanceDernierUtilisateurEvenement){
            (item.state == true) ? (paramRequeteFiltreTmp.push({'champ': "filtresAvanceDernierUtilisateurEvenement", 'name': item.name})) : (0);
        }
        for (let item of this.confFiltresAladin3.filtresBasicTypeDernierEvenement){
            (item.state == true) ? (paramRequeteFiltreTmp.push({'champ': "filtresBasicTypeDernierEvenement", 'name': item.name})) : (0);
        }
        for (let item of this.confFiltresAladin3.filtresBasicDernierUtilisateurEvenement){
            (item.state == true) ? (paramRequeteFiltreTmp.push({'champ': "filtresBasicDernierUtilisateurEvenement", 'name': item.name})) : (0);
        }
        for (let item of this.confFiltresAladin3.filtresBasicDernierUtilisateurAffectations){
            (item.state == true) ? (paramRequeteFiltreTmp.push({'champ': "filtresBasicDernierUtilisateurAffectations", 'name': item.name})) : (0);
        }
        for (let item of this.confFiltresAladin3.filtresBasicStatuts){
            (item.state == true) ? (paramRequeteFiltreTmp.push({'champ': "filtresBasicStatuts", 'name': item.name})) : (0);
        }
        for (let item of this.confFiltresAladin3.typologie){
            (item.state == true) ? (paramRequeteFiltreTmp.push({'champ': "typologie", 'name': item.name})) : (0);
        }
        for (let item of this.confFiltresAladin3.date){
            (item.state == true) ? (paramRequeteFiltreTmp.push({'champ': "date", "name": item.name, 'valueMin': item.valueMin, 'valueMax': item.valueMax})) : (0);
        }
        paramRequeteFiltre = JSON.stringify(paramRequeteFiltreTmp);
        return paramRequeteFiltre;
    }

    affecterFiltreInsee(paramRequeteFiltre){
        var val : any;
        var paramRequeteFiltreTmp : any = [];
        paramRequeteFiltre = "";
        for (let item of this.confFiltresInsee.filtresAvanceAvecInput){
            item.state = false; /// réinitialisé
            if ((<HTMLInputElement>document.getElementById("filtre_numerique_min" + item.name)) && (<HTMLInputElement>document.getElementById("filtre_numerique_max" + item.name))){
                    item.min = (<HTMLInputElement>document.getElementById("filtre_numerique_min" + item.name)).value;
                    item.max = (<HTMLInputElement>document.getElementById("filtre_numerique_max" + item.name)).value;
                    item.state = true;
            }
            if (item.state == true){
                paramRequeteFiltreTmp.push({'champ': "filtresAvanceAvecInput", 'name': item.name, 'min': item.min, 'max': item.max});
            }
        }
        paramRequeteFiltre = JSON.stringify(paramRequeteFiltreTmp);
        return paramRequeteFiltre;
    }

    affecterFiltreRubrique(paramRequeteFiltre){
        var val : any;
        var paramRequeteFiltreTmp : any = [];
        paramRequeteFiltre = "";
        for (let item of this.confFiltresRubrique.filtresAvanceAvecInput){
            item.state = false; /// réinitialisé
             if ((<HTMLInputElement>document.getElementById("filtre_numerique_min" + item.name)) && (<HTMLInputElement>document.getElementById("filtre_numerique_max" + item.name))){
                    item.min = (<HTMLInputElement>document.getElementById("filtre_numerique_min" + item.name)).value;
                    item.max = (<HTMLInputElement>document.getElementById("filtre_numerique_max" + item.name)).value;
                    item.state = true;
            }
            if (item.state == true){
                paramRequeteFiltreTmp.push({'champ': "filtresAvanceAvecInput", 'name': item.name, 'min': item.min, 'max': item.max});
            }
        }
        for (let item of this.confFiltresRubrique.filtresBasicListeCategorieDeRubriquage){
            (item.state == true) ? (paramRequeteFiltreTmp.push({'champ': "filtresBasicListeCategorieDeRubriquage", 'name': item.name})) : (0);
        }
        for (let item of this.confFiltresRubrique.filtresBasicListeNature){
            (item.state == true) ? (paramRequeteFiltreTmp.push({'champ': "filtresBasicListeNature", 'name': item.name})) : (0);
        }
        paramRequeteFiltre = JSON.stringify(paramRequeteFiltreTmp);
        return paramRequeteFiltre;
    }

    verfiFormat(val){
        if (val.indexOf("-") != -1 && val.indexOf(" ") == -1){
            return -1;
        }
        else {
            return 0;
        }
    }

    parserInputForValueMin(val){
        /// Fonction qui permet de copier tous les chiffres qui sont avant le '-'.
        var limit: number = 0;
        var min : string = '';
        for (let i of val){
            if (i == '-'){
                limit = 1;
            }
            if (limit == 0){
                min += i;
            }
        }
        return min;
    }

    parserInputForValueMax(val){
        /// Fonction qui permet de copier tous les chiffres qui sont après le '-'.
        var max : string = '';
        var limit: number = 0;
        for (let i of val){
            (limit == 1) ? (limit = 2) : (limit = limit);
            if (i == '-'){
                limit = 1;
            }
            if (limit == 2){
                max += i;
            }
        }
        return max;
    }
}