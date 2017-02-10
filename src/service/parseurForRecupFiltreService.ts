/*
*
* Ce service permet de parser la configuration pour récupérer les noms des filtres qui sont les mêmes que les colonnes R2D2 et briques BB-8.
*
*/

import {Injectable} from '@angular/core';

declare var require: any;

@Injectable()
export class ParseurForRecupFiltreService {
    private nameVarTab: any = [];
    private confFiltresAladin3: any;
    private confFiltresInsee: any;
    private confFiltresRubrique: any;

    constructor() {
        this.confFiltresAladin3 = require('../conf/filtresAladin3.json');
        this.confFiltresInsee = require('../conf/filtresInsee.json');
        this.confFiltresRubrique = require('../conf/filtresRubrique.json');
    }

    parseConfigForNameColonnes(responseConfig){
        this.nameVarTab = [];
        var nameVar: string = "";
        var i : number = 0;
        var cpt : number = 0;
        var len: number = 0;
        for (let res of responseConfig.hits.hits){
            for (let resView of res._source.ColonnesAladin3){
                let str: any = resView.view;
                len = str.length;
                i = 0;
                while (i < len){
                    if (str[i] == 'e' && str[i + 1] == '.'){
                        i = i + 2;
                        cpt = 0;
                        while (str[i] != ',' && str[i] != ' ' && str[i] != '|' && i < len){
                            nameVar += str[i];
                            cpt += 1;
                            i += 1;
                        }
                    }
                    i += 1;
                }
                if (resView.label[0] != 'L' && resView.label[1] != 'i'){  /// attention ne prend pas liste
                    this.nameVarTab.push({"name": resView.label, "variable": nameVar});
                }
                nameVar = "";
            }
        }
        this.confFiltresAladin3.filtreAvanceWithInput = this.nameVarTab;
    }

    parseConfigForNameColonnesInsee(responseConfig){
        this.nameVarTab = [];
        var nameVar: string = "";
        var i : number = 0;
        var cpt : number = 0;
        var len: number = 0;
        for (let res of responseConfig.hits.hits){
            for (let resView of res._source.ColonnesInsee){
                let str: any = resView.view;
                len = str.length;
                i = 0;
                while (i < len){
                    if (str[i] == 'e' && str[i + 1] == '.'){
                        i = i + 2;
                        cpt = 0;
                        while (str[i] != ',' && str[i] != ' ' && str[i] != '|' && i < len){
                            nameVar += str[i];
                            cpt += 1;
                            i += 1;
                        }
                    }
                    i += 1;
                }
                this.nameVarTab.push({"name": resView.label, "variable": nameVar});
                nameVar = "";
            }
        }
        this.confFiltresInsee.filtreAvanceWithInput = this.nameVarTab;
    }

    parseConfigForNameColonnesRubrique(responseConfig){
        this.nameVarTab = [];
        var nameVar: string = "";
        var i : number = 0;
        var cpt : number = 0;
        var len: number = 0;
        for (let res of responseConfig.hits.hits){
            for (let resView of res._source.ColonnesRubrique){
                let str: any = resView.view;
                len = str.length;
                i = 0;
                while (i < len){
                    if (str[i] == 'e' && str[i + 1] == '.'){
                        i = i + 2;
                        cpt = 0;
                        while (str[i] != ',' && str[i] != ' ' && str[i] != '|' && i < len){
                            nameVar += str[i];
                            cpt += 1;
                            i += 1;
                        }
                    }
                    i += 1;
                }
                this.nameVarTab.push({"name": resView.label, "variable": nameVar});
                nameVar = "";
            }
        }
        this.confFiltresRubrique.filtreAvanceWithInput = this.nameVarTab;
    }
}