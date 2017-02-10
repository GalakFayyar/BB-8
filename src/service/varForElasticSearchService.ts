/*
*
* Ce service permet de créer les requêtes élastic Search
*
*/

import {Http, Headers, Response} from '@angular/http';
import {ActivatedRoute, Router} from '@angular/router';
import {RequetePageListService} from './requeteService';
import {RecupFiltresActif} from './recupFiltresActif';
import {Injectable} from '@angular/core';

declare var require: any;

@Injectable()
export class VarForElasticSearchService {

    private sub: any;
    private confFiltres : any;
    private paramRequeteFiltre : any;
    private requeteService: RequetePageListService;
    private recupFiltresActif: RecupFiltresActif;

    constructor(private router: Router, private route: ActivatedRoute, requeteService: RequetePageListService, recupFiltresActif: RecupFiltresActif) {
        this.requeteService = requeteService;
        this.recupFiltresActif = recupFiltresActif;
        this.confFiltres = require('../conf/filtresAladin3.json');
    }

    /**
     * Comment for method 'elastOptionAladin3ET4'.
     * Cette méthode construit le corp de la requête.
     * Pour remplir la partie filtre ell va appeler un autre service : this.recupFiltresActif.recupFiltresAladin3().
     */
    elastOptionAladin3ET4(event, champCible, indexForRequete, nbResult, paramRequeteFiltre){
        var filtreInputContain = [];
        filtreInputContain = this.recupFiltresActif.recupFiltresAladin3(paramRequeteFiltre);

        var test: string = "frequence_mensuelle";
        let elastOptions = {
            "from": indexForRequete,
            "query": {
                "filtered": {
                    "filter":{
                        "and":{
                            "filters":[

                            ]
                        }
                    },
                    "query": { 
                        "bool": {
                            "must": [
                            {
                                "query_string": {
                                    "default_operator": "AND",
                                    "fields": [champCible],
                                    "query": event.replace(/ /g, "\\ ")
                                }
                            }
                            ]
                        }
                    }
                }
            },
            "size" : nbResult,
            "sort": [
            {
                sort_field: {
                    "order": "desc"
                }
            }
            ]
        };
        elastOptions.query.filtered.filter.and.filters = filtreInputContain;

        let sort_elt = JSON.stringify(elastOptions['sort'][0]).replace("sort_field", test);
        elastOptions['sort'][0] = JSON.parse(sort_elt);
        return elastOptions;
    }

    elastOptionInsee(event, champCible, indexForRequete, nbResult, paramRequeteFiltre){
        var filtreInputContain = [];
        filtreInputContain = this.recupFiltresActif.recupFiltresInsee(paramRequeteFiltre);
        let elastOptions = {
            "from": indexForRequete,
            "query": {
                "filtered": {
                    "filter":{

                    },
                    "query": { 
                        "bool": {
                            "must": [
                            {
                                "query_string": {
                                    "default_operator": "AND",
                                    "fields": [champCible],
                                    "query": event.replace(/ /g, "\\ ")
                                }
                            }
                            ]
                        }
                    }
                }
            },
            "size" : nbResult,
            "sort": [
            {
                "IN_RSE_LI_NOMEN": {
                    "order": "asc"
                }
            }
            ]
        };
        elastOptions.query.filtered.filter = filtreInputContain;
        return elastOptions;
    }

    elastOptionRubrique(event, champCible, champCible2, indexForRequete, nbResult, paramRequeteFiltre){
        var filtreInputContain = [];
        filtreInputContain = this.recupFiltresActif.recupFiltresRubrique(paramRequeteFiltre);
        if (champCible2 == "nothing"){
            var elastOptions = {
                "from": indexForRequete,
                "query": {
                    "bool": {
                        "filter":{

                        },
                        "must": [
                        {
                            "query_string": {
                                "default_operator": "AND",
                                "fields": [champCible],
                                "query": event.replace(/ /g, "\\ ")
                            }
                        }
                        ]
                    }
                },
                "size" : nbResult,
                "sort": [
                {
                    "code_an8": {
                        "order": "asc"
                    }
                }
                ]
            };
        }
        else {
            var elastOptions = {
                "from": indexForRequete,
                "query": {
                    "bool": {
                        "filter":{

                        },
                        "must": [
                        {
                            "query_string": {
                                "default_operator": "AND",
                                "fields": [champCible, champCible2],
                                "query": event.replace(/ /g, "\\ ")
                            }
                        }
                        ]
                    }
                },
                "size" : nbResult,
                "sort": [
                {
                    "code_an8": {
                        "order": "asc"
                    }
                }
                ]
            };    
        }
        elastOptions.query.bool.filter = filtreInputContain;
        return elastOptions;
    }

    elastOptionCRIEtMarques(event, champCible, champCible2, indexForRequete, nbResult){
        if (champCible2 == "nothing"){
            var elastOptions = {
                "from": indexForRequete,
                "query": {
                    "bool": {
                        "must": [
                        {
                            "query_string": {
                                "default_operator": "AND",
                                "fields": [champCible],
                                "query": event.replace(/ /g, "\\ ")
                                // "query": event.replace(' ', '\ ')
                            }
                        }
                        ]
                    }
                },
                "size" : nbResult,
                "sort": [
                {
                    "forme_normale": {
                        "order": "asc"
                    }
                }
                ]
            };
        }
        else {
            var elastOptions = {
                "from": indexForRequete,
                "query": {
                    "bool": {
                        "must": [
                        {
                            "query_string": {
                                "default_operator": "AND",
                                "fields": [champCible, champCible2],
                                "query": event.replace(/ /g, "\\ ")
                                // "query": event.replace(' ', '\ ')
                            }
                        }
                        ]
                    }
                },
                "size" : nbResult,
                "sort": [
                {
                    "forme_normale": {
                        "order": "asc"
                    }
                }
                ]
            };    
        }
        return elastOptions;
    }

    elastOptionMotsClefs(event, champCible, champCible2, indexForRequete, nbResult){
        if (champCible2 == "nothing"){
            var elastOptions = {
                "from": indexForRequete,
                "query": {
                    "bool": {
                        "must": [
                        {
                            "query_string": {
                                "default_operator": "AND",
                                "fields": [champCible],
                                "query": event.replace(/ /g, "\\ ")
                                // "query": event.replace(' ', '\ ')
                            }
                        }
                        ]
                    }
                },
                "size" : nbResult,
                "sort": [
                {
                    "libelle.facet": {
                        "order": "asc"
                    }
                }
                ]
            };
        }
        else {
            var elastOptions = {
                "from": indexForRequete,
                "query": {
                    "bool": {
                        "must": [
                        {
                            "query_string": {
                                "default_operator": "AND",
                                "fields": [champCible, champCible2],
                                "query": event.replace(/ /g, "\\ ")
                                // "query": event.replace(' ', '\ ')
                            }
                        }
                        ]
                    }
                },
                "size" : nbResult,
                "sort": [
                {
                    "libelle.facet": {
                        "order": "asc"
                    }
                }
                ]
            };    
        }
        return (elastOptions);
    }
}