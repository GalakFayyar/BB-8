/*
*
* Ce service permet de récupérer les filtres qui sont mis dans une variable : filtreInputContain;
*
*/

import {Injectable} from '@angular/core';

declare var require: any;

@Injectable()
export class RecupFiltresActif
 {

    private confFiltresAladin3 : any;
    private confFiltresInsee: any;
    private confFiltresRubrique: any;
    private paramRequeteFiltre : any;

    constructor() {
        this.confFiltresAladin3 = require('../conf/filtresAladin3.json');
        this.confFiltresInsee = require('../conf/filtresInsee.json');
        this.confFiltresRubrique = require('../conf/filtresRubrique.json');
    }

    normalise(name){
        name = name.toLowerCase();
        name = name.replace(/ - /g, "_");
        name = name.replace(/ /g, "_");
        name = name.replace(/-/g, "_");
        name = name.replace(/[èéêë]/g, "e");
        name = name.replace(/[àâä]/g, "a");
        name = name.replace(/[ôö]/g, "o");
        name = name.replace(/[ùûü]/g, "u");
        name = name.replace(/[îï]/g, "i");
        return (name);
    }

    /**
     * Comment for method 'recupFiltresAladin3'.
     * Cette méthode va récuperer tous les filtres lier à aladin3 et les retourner dans une variable en JSON.
     */
    recupFiltresAladin3(filtre){
        var filtreInputContain : any = [];
        var paramRequeteFiltre : any = [];
        if (filtre == ""){
            return 1;
        }
        paramRequeteFiltre = JSON.parse(filtre);
        var passed : boolean = false;
        var passed2 : boolean = false;
        var passed3 : boolean = false;
        var passed4 : boolean = false;
        var passed5 : boolean = false;
        var passed6 : boolean = false;
        var passed7 : boolean = false;
        for (let item of paramRequeteFiltre){
            if (item.champ == "filtresAvanceAvecInput"){
                filtreInputContain.push({
                    "range":{
                        "name": {
                            "from": item.min,
                            "to": item.max
                        }
                    }
                });
                filtreInputContain = JSON.stringify(filtreInputContain);
                for (let filtreNorma of this.confFiltresAladin3.filtreAvanceWithInput){
                    if (filtreNorma.name == item.name){
                        filtreInputContain = filtreInputContain.replace("name", filtreNorma.variable);
                    }
                }
                if (filtreInputContain.indexOf('name') != -1){
                    return [];
                }
                filtreInputContain = JSON.parse(filtreInputContain);
            }

            if (item.champ == "filtresAvanceAvecInput2"){
                filtreInputContain.push({
                    "range":{
                        "name": {
                            "from": item.min / 100, /// filtre percent 2
                            "to": item.max / 100
                        }
                    }
                });
                filtreInputContain = JSON.stringify(filtreInputContain);
                for (let filtreNorma of this.confFiltresAladin3.filtreAvanceWithInput){
                    if (filtreNorma.name == item.name){
                        filtreInputContain = filtreInputContain.replace("name", filtreNorma.variable);
                    }
                }
                if (filtreInputContain.indexOf('name') != -1){
                    return [];
                }
                filtreInputContain = JSON.parse(filtreInputContain);
            }

            if (item.champ == "date"){
                filtreInputContain.push({
                    "range":{
                        "name": {
                            "from": item.valueMin,
                            "to": item.valueMax
                        }
                    }
                });
                filtreInputContain = JSON.stringify(filtreInputContain);
                for (let filtreNorma of this.confFiltresAladin3.filtreAvanceWithInput){
                    if (filtreNorma.name == item.name){
                        filtreInputContain = filtreInputContain.replace("name", filtreNorma.variable);
                    }
                }
                if (filtreInputContain.indexOf('name') != -1){
                    return [];
                }
                filtreInputContain = JSON.parse(filtreInputContain);
            }

            if (item.champ == "filtresAvanceTypeDernierEvenement"){
                let checkWay: boolean = false;
                for (let itemfiltreContain of filtreInputContain){
                    if (itemfiltreContain.terms && passed == true){
                        if (itemfiltreContain.terms['dernier_evt_type.facet']){
                            let i : number = 0;
                            for (let tab of itemfiltreContain.terms['dernier_evt_type.facet']){
                                if (tab == this.normalise(item.name)){
                                    i = 1;
                                }
                            }
                            (i == 0) ? (itemfiltreContain.terms['dernier_evt_type.facet'].push(this.normalise(item.name))) : (0);   
                        }
                    }
                    if (passed == false) {
                        filtreInputContain.push({
                            "terms":{
                                "dernier_evt_type.facet": [
                                    this.normalise(item.name)
                                ]
                            }
                        });
                        passed = true;
                    }
                    checkWay = true;
                }
                if (checkWay == false){
                    filtreInputContain.push({
                        "terms":{
                            "dernier_evt_type.facet": [
                                this.normalise(item.name)
                            ]
                        }
                    });
                    passed = true;
                }
            }

            if (item.champ == "filtresAvanceDernierUtilisateurEvenement"){
                let checkWay: boolean = false;
                for (let itemfiltreContain of filtreInputContain){
                    if (itemfiltreContain.terms && passed2 == true){
                        if (itemfiltreContain.terms['dernier_evt_user.facet']){
                            let i : number = 0;
                            for (let tab of itemfiltreContain.terms['dernier_evt_user.facet']){
                                if (tab == this.normalise(item.name)){
                                    i = 1;
                                }
                            }
                            (i == 0) ? (itemfiltreContain.terms['dernier_evt_user.facet'].push(this.normalise(item.name))) : (0);   
                        }
                    }
                    if (passed2 == false) {
                        filtreInputContain.push({
                            "terms":{
                                "dernier_evt_user.facet": [
                                    this.normalise(item.name)
                                ]
                            }
                        });
                        passed2 = true;
                    }
                    checkWay = true;
                }
                if (checkWay == false){
                    filtreInputContain.push({
                        "terms":{
                            "dernier_evt_user.facet": [
                                this.normalise(item.name)
                            ]
                        }
                    });
                    passed2 = true;
                }
            }

            if (item.champ == "filtresBasicTypeDernierEvenement"){
                let checkWay: boolean = false;
                for (let itemfiltreContain of filtreInputContain){
                    if (itemfiltreContain.terms && passed3 == true){
                        if (itemfiltreContain.terms['evt.type.facet']){
                            let i : number = 0;
                            for (let tab of itemfiltreContain.terms['evt.type.facet']){
                                if (tab == this.normalise(item.name)){
                                    i = 1;
                                }
                            }
                            (i == 0) ? (itemfiltreContain.terms['evt.type.facet'].push(this.normalise(item.name))) : (0);   
                        }
                    }
                    if (passed3 == false) {
                        filtreInputContain.push({
                            "terms":{
                                "evt.type.facet": [
                                    this.normalise(item.name)
                                ]
                            }
                        });
                        passed3 = true;
                    }
                    checkWay = true;
                }
                if (checkWay == false){
                    filtreInputContain.push({
                        "terms":{
                            "evt.type.facet": [
                                this.normalise(item.name)
                            ]
                        }
                    });
                    passed3 = true;
                }
            }

            if (item.champ == "filtresBasicDernierUtilisateurEvenement"){
                let checkWay: boolean = false;
                for (let itemfiltreContain of filtreInputContain){
                    if (itemfiltreContain.terms && passed4 == true){
                        if (itemfiltreContain.terms['evt.user.facet']){
                            let i : number = 0;
                            for (let tab of itemfiltreContain.terms['evt.user.facet']){
                                if (tab == this.normalise(item.name)){
                                    i = 1;
                                }
                            }
                            (i == 0) ? (itemfiltreContain.terms['evt.user.facet'].push(this.normalise(item.name))) : (0);   
                        }
                    }
                    if (passed4 == false) {
                        filtreInputContain.push({
                            "terms":{
                                "evt.user.facet": [
                                    this.normalise(item.name)
                                ]
                            }
                        });
                        passed4 = true;
                    }
                    checkWay = true;
                }
                if (checkWay == false){
                    filtreInputContain.push({
                        "terms":{
                            "evt.user.facet": [
                                this.normalise(item.name)
                            ]
                        }
                    });
                    passed4 = true;
                }
            }

            if (item.champ == "filtresBasicDernierUtilisateurAffectations"){
                let checkWay: boolean = false;
                for (let itemfiltreContain of filtreInputContain){
                    if (itemfiltreContain.terms && passed5 == true){
                        if (itemfiltreContain.terms['affectation.affectation_utilisateur.facet']){
                            let i : number = 0;
                            for (let tab of itemfiltreContain.terms['affectation.affectation_utilisateur.facet']){
                                if (tab == this.normalise(item.name)){
                                    i = 1;
                                }
                            }
                            (i == 0) ? (itemfiltreContain.terms['affectation.affectation_utilisateur.facet'].push(this.normalise(item.name))) : (0);   
                        }
                    }
                    if (passed5 == false) {
                        filtreInputContain.push({
                            "terms":{
                                "affectation.affectation_utilisateur.facet": [
                                    this.normalise(item.name)
                                ]
                            }
                        });
                        passed5 = true;
                    }
                    checkWay = true;
                }
                if (checkWay == false){
                    filtreInputContain.push({
                        "terms":{
                            "affectation.affectation_utilisateur.facet": [
                                this.normalise(item.name)
                            ]
                        }
                    });
                    passed5 = true;
                }
            }
            if (item.champ == "filtresBasicStatuts"){
                let checkWay: boolean = false;
                for (let itemfiltreContain of filtreInputContain){
                    if (itemfiltreContain.terms && passed6 == true){
                        if (itemfiltreContain.terms['affectation.statut.facet']){
                            let i : number = 0;
                            for (let tab of itemfiltreContain.terms['affectation.statut.facet']){
                                if (tab == this.normalise(item.name)){
                                    i = 1;
                                }
                            }
                            (i == 0) ? (itemfiltreContain.terms['affectation.statut.facet'].push(this.normalise(item.name))) : (0);   
                        }
                    }
                    if (passed6 == false) {
                        filtreInputContain.push({
                            "terms":{
                                "affectation.statut.facet": [
                                    this.normalise(item.name)
                                ]
                            }
                        });
                        passed6 = true;
                    }
                    checkWay = true;
                }
                if (checkWay == false){
                    filtreInputContain.push({
                        "terms":{
                            "affectation.statut.facet": [
                                this.normalise(item.name)
                            ]
                        }
                    });
                    passed6 = true;
                }
            }

            if (item.champ == "typologie"){
                let checkWay: boolean = false;
                for (let itemfiltreContain of filtreInputContain){
                    if (itemfiltreContain.terms && passed7 == true){
                        if (itemfiltreContain.terms['typeQuoiSimple.facet']){
                            let i : number = 0;
                            for (let tab of itemfiltreContain.terms['typeQuoiSimple.facet']){
                                if (tab == this.normalise(item.name)){
                                    i = 1;
                                }
                            }
                            (i == 0) ? (itemfiltreContain.terms['typeQuoiSimple.facet'].push(this.normalise(item.name))) : (0);   
                        }
                    }
                    if (passed7 == false) {
                        filtreInputContain.push({
                            "terms":{
                                "typeQuoiSimple.facet": [
                                    this.normalise(item.name)
                                ]
                            }
                        });
                        passed7 = true;
                    }
                    checkWay = true;
                }
                if (checkWay == false){
                    filtreInputContain.push({
                        "terms":{
                            "typeQuoiSimple.facet": [
                                this.normalise(item.name)
                            ]
                        }
                    });
                    passed7 = true;
                }
            }
        }
        return filtreInputContain;
    }

    recupFiltresRubrique(filtre){
        var filtreInputContain : any = [];
        var paramRequeteFiltre : any = [];
        if (filtre == ""){
            return 1;
        }
        paramRequeteFiltre = JSON.parse(filtre);
        var passed : boolean = false;
        var passed2 : boolean = false;
        for (let item of paramRequeteFiltre){
            if (item.champ == "filtresAvanceAvecInput"){
                filtreInputContain.push({
                    "range":{
                        "name": {
                            "from": item.min,
                            "to": item.max
                        }
                    }
                });
                filtreInputContain = JSON.stringify(filtreInputContain);
                for (let filtreNorma of this.confFiltresRubrique.filtreAvanceWithInput){
                    if (filtreNorma.name == item.name){
                        filtreInputContain = filtreInputContain.replace("name", filtreNorma.variable);
                    }
                }
                if (filtreInputContain.indexOf('name') != -1){
                    return [];
                }
                filtreInputContain = JSON.parse(filtreInputContain);
            }
            if (item.champ == "filtresBasicListeCategorieDeRubriquage"){
                let checkWay: boolean = false;
                for (let itemfiltreContain of filtreInputContain){
                    if (itemfiltreContain.terms && passed == true){
                        if (itemfiltreContain.terms['categorie_rubriquage.facet']){
                            let i : number = 0;
                            for (let tab of itemfiltreContain.terms['categorie_rubriquage.facet']){
                                if (tab == this.normalise(item.name)){
                                    i = 1;
                                }
                            }
                            (i == 0) ? (itemfiltreContain.terms['categorie_rubriquage.facet'].push(this.normalise(item.name))) : (0);   
                        }
                    }
                    if (passed == false) {
                        filtreInputContain.push({
                            "terms":{
                                "categorie_rubriquage.facet": [
                                    this.normalise(item.name)
                                ]
                            }
                        });
                        passed = true;
                    }
                    checkWay = true;
                }
                if (checkWay == false){
                    filtreInputContain.push({
                        "terms":{
                            "categorie_rubriquage.facet": [
                                this.normalise(item.name)
                            ]
                        }
                    });
                    passed = true;
                }
            }

            if (item.champ == "filtresBasicListeNature"){
                let checkWay: boolean = false;
                for (let itemfiltreContain of filtreInputContain){
                    if (itemfiltreContain.terms && passed2 == true){
                        if (itemfiltreContain.terms['nature.facet']){
                            let i : number = 0;
                            for (let tab of itemfiltreContain.terms['nature.facet']){
                                if (tab == this.normalise(item.name)){
                                    i = 1;
                                }
                            }
                            (i == 0) ? (itemfiltreContain.terms['nature.facet'].push(this.normalise(item.name))) : (0);   
                        }
                    }
                    if (passed2 == false) {
                        filtreInputContain.push({
                            "terms":{
                                "nature.facet": [
                                    this.normalise(item.name)
                                ]
                            }
                        });
                        passed2 = true;
                    }
                    checkWay = true;
                }
                if (checkWay == false){
                    filtreInputContain.push({
                        "terms":{
                            "nature.facet": [
                                this.normalise(item.name)
                            ]
                        }
                    });
                    passed2 = true;
                }
            }
        }
        return filtreInputContain;
    }

    recupFiltresInsee(filtre){
        var filtreInputContain : any = [];
        var paramRequeteFiltre : any = [];
        if (filtre == ""){
            return 1;
        }

        paramRequeteFiltre = JSON.parse(filtre);

        for (let item of paramRequeteFiltre){
            if (item.champ == "filtresAvanceAvecInput"){
                filtreInputContain.push({
                    "range":{
                        "name": {
                            "from": item.min,
                            "to": item.max
                        }
                    }
                });
                filtreInputContain = JSON.stringify(filtreInputContain);

                for (let filtreNorma of this.confFiltresInsee.filtreAvanceWithInput){
                    if (filtreNorma.name == item.name){
                        filtreInputContain = filtreInputContain.replace("name", filtreNorma.variable);
                    }
                }
                if (filtreInputContain.indexOf('name') != -1){
                    return [];
                }
                filtreInputContain = JSON.parse(filtreInputContain);
            }
        }
        filtreInputContain = filtreInputContain.reduce(function(result, item) { //// permet de transformer un objet contenant un objet en un simple objet.
            var key = Object.keys(item)[0];
            result[key] = item[key];
            return result;
        }, {});
        return filtreInputContain;
    }
}