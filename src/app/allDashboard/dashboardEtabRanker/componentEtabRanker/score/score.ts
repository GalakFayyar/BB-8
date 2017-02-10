import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {RequeteEtabRanker} from '../../../../../service/requeteServiceEtabRanker';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

declare var require: any;

// import { ChartsModule } from 'ng2-charts/ng2-charts';

@Component({
	selector: 'score',
	styles: [require('./score.css')],
	template: require('./score.html')
})
export class Score {
	@Input()
	responseRequeteEtabRanker: any;
  
  private GlobalsEtab: string = "nothing";

  private searchEtabElasticSearch: string = null;
  private responseElasticSearch: any;
  private responseElasticSearchAVG: any;
  private responseElasticSearchAVG20KM: any;
  private requeteEtabRanker: RequeteEtabRanker;

  private tabScore: any;        // variable correspondant au tableau
  private tabScoreAVG: any;     // variable correspondant au graphique
  private tabScoreAVG20KM: any; // variable correspondant au graphique

///autocompletion
  private client: any;
  private index: any;
  private reponseAutocompletion: any;
  private bool : boolean = true;
  private affAutocompl: boolean = true;
//////

  data:any;

////tab

  private nbCurrentScore: number = 0;
  private nbScoreModifie: number = 0;
  private scoreModifie: boolean = false;

////

///img

  private imgTrue: any;
  private imgFalse: any;
  private imgPlus: any;
  private imgMoins: any;
  private imgInterdit: any;
  private imgPicto: any;
  private imgPodium: any;
  private imgGraphic: any;
  private loaderGif : any;
///

/// value max
  private maxPhoto : number = 3;
  private maxAvis : number = 50;
///
  
  private positionEtab: number = 0;
  private valeurMaxScore: number = 0;
  private positionEtab20KM: number = 0;
  private valeurMaxScore20KM: number = 0;

  private affPodium: boolean = true;
  private affGraph: boolean = false;

/// typehead
  public states: any = [];
  private data2: Observable<any>;
  private values: any = [];

// graph radar
  public radarChartLabels:string[] = [];
  private tabEtab: any = [];
  private tabMoyNat;
  private tabMoy20KM;
  public radarChartData:any = [];
  public radarChartType:string = 'radar';

  private wait : boolean = false;
  private done : boolean = false;

  private confPoint : any;

  constructor(requeteEtabRanker: RequeteEtabRanker) {
    this.requeteEtabRanker = requeteEtabRanker;
    this.confPoint = require('../../../../../conf/nbPoint.json');
  }
  ngOnInit(){
    this.imgTrue = require("../../../../../imagesEtabRanker/check.png");
    this.imgFalse = require("../../../../../imagesEtabRanker/croix.png");    
    this.imgPlus = require("../../../../../imagesEtabRanker/plus.png");    
    this.imgMoins = require("../../../../../imagesEtabRanker/moins.png");    
    this.imgInterdit = require("../../../../../imagesEtabRanker/interdit.png");    
    this.imgPicto = require("../../../../../imagesEtabRanker/picto-information.png");    
    this.imgGraphic = require("../../../../../imagesEtabRanker/graphic.png");    
    this.imgPodium = require("../../../../../imagesEtabRanker/podium.png");    
    this.loaderGif = require("../../../../../imagesEtabRanker/loader.gif");
   	
    for (let item of this.responseRequeteEtabRanker.hits.hits){
	   	this.search(item._source.code_etab, item._source.denom_principale);
	  }
    
    // if (this.GlobalsEtab != ""){
    //   this.search(0, this.GlobalsEtab);
    //   this.wait = true;
    // }
    // this.data = [];
  }

////

  

  getResponsive(padding, offset) {
    // return this._chartistJsService.getResponsive(padding, offset);
  }

  search(id, libelle) {
    this.GlobalsEtab = libelle;
    this.searchElasticSearchById(id);
  }

  searchElasticSearchById(event){
    this.wait = true;
    this.done = false;
    /// recherche établissement par ID.
    this.searchEtabElasticSearch = event;
    if (!this.searchEtabElasticSearch) {return;}
    let elastOptions = {
      "query": {
      "filtered": {
         "query": {
            "match": {
               "code_etab": this.searchEtabElasticSearch
            }
          }
        }
      }
    };
    this.requeteEtabRanker.searchElasticSearch(this.searchEtabElasticSearch, elastOptions)
      .then(response => {
        this.responseElasticSearch = response;
        for (let item of this.responseElasticSearch.hits.hits){
          this.searchElasticSearchAVG(item._source.metier, item._source.score);
        }
      }, error => console.error(error));
  }

  searchElasticSearchAVG(metier, score){
    //// recherche elastic Search pour avoir la moyenne sur différents critéres des établissements
    /// de même bu que celui recherché mais dans toutes la france.
    this.searchEtabElasticSearch = metier;
    if (!this.searchEtabElasticSearch) {return;}
    let elastOptions = {
      "query": {
        "filtered": {
           "query": {
              "bool": {
                 "must": {
                    "query_string": {
                       "query": "metier:\"" + metier + "\""
                       }
                    
                 }
              }
           }
        }
     },
      "aggs": {
        "presence_photo": {
          "avg": {
            "script": "doc['presence_photo'].value == 'T'? 1:0 "
          }
        },
        "presence_rubrique": {
          "avg": {
            "script": "doc['est_rubrique'].value == 'T'? 1:0 "
          }
        },
        "presence_geocode": {
          "avg": {
            "script": "doc['est_geocode'].value == 'T'? 1:0 "
          }
        },
        "presence_email": {
          "avg": {
            "script": "doc['presence_email'].value == 'T'? 1:0 "
          }
        },
        "presence_telephone": {
          "avg": {
            "script": "doc['presence_telephone'].value == 'T'? 1:0 "
          }
        },
        "presence_voie": {
          "avg": {
            "script": "doc['presence_voie'].value == 'T'? 1:0 "
          }
        },
        "presence_moyen_de_paiement": {
          "avg": {
            "script": "doc['presence_moyen_de_paiement'].value == 'T'? 1:0 "
          }
        },
        "presence_cri": {
          "avg": {
            "script": "doc['presence_cri'].value == 'T'? 1:0 "
          }
        },
        "presence_logo_cviv": {
          "avg": {
            "script": "doc['presence_logo_cviv'].value == 'T'? 1:0 "
          }
        },
        "presence_horaire": {
          "avg": {
            "script": "doc['presence_horaire'].value == 'T'? 1:0 "
          }
        },
        "nb_de_photos": {
           "avg": {
              "field": "nombre_photos_cviv"
           }
        },
        "nbEtab": {
          "terms": {
            "field": "bu.facet"
          }
        },
        "scoreAvg": {
          "avg": {
            "field": "score"
          }
        },
        "max_score": {
          "max": {
            "field": "score"
          }
        },
        "rang_score": {
         "range": {
            "field": "score",
            "ranges": [
               {
                  "to": score
               },
               {
                  "from": score
               }
            ]
          }
        },
        "histogram": {
          "histogram": {
            "field": "score",
            "interval": 25
          }
        }
      }
    };
    this.requeteEtabRanker.searchElasticSearchAVG(this.searchEtabElasticSearch, elastOptions)
      .then(response => {
        this.responseElasticSearchAVG = response;
        this.nbCurrentScore = 0;
        this.nbScoreModifie = 0;
        this.makeTabScore(this.responseElasticSearch);
        this.makeAvgEtab(this.responseElasticSearchAVG);
        // this.makeChart(this.responseElasticSearch);
        for (let item of this.responseElasticSearch.hits.hits){
          this.searchElasticSearchAVG20KM(item._source.metier, item._source.adresse.geoloc.long, item._source.adresse.geoloc.lat, item._source.score);
        }
      }, error => console.error(error));
  }

  searchElasticSearchAVG20KM(metier, lon, lat, score){
    ////recherche elastic Search pour avoir la moyenne sur différents critéres des établissements
    /// de même types que celui recherché mais dans les 20Km de rayon.
    this.searchEtabElasticSearch = metier;
    if (!this.searchEtabElasticSearch) { return;}
    let elastOptions = {
      "query": {
        "filtered": {
           "query": {
              "bool": {
                 "must": {
                    "query_string": {
                       "query": "metier:\"" + metier + "\""
                       }
                    
                 }
              }
           },
           "filter": {
              "geo_distance": {
                 "distance": "20km",
                 "pin_geo": {
                    "lat": lat,
                    "lon": lon
                 }
              }
           }
        }
     },
      "aggs": {
        "presence_photo": {
          "avg": {
            "script": "doc['presence_photo'].value == 'T'? 1:0 "
          }
        },
        "presence_rubrique": {
          "avg": {
            "script": "doc['est_rubrique'].value == 'T'? 1:0 "
          }
        },
        "presence_geocode": {
          "avg": {
            "script": "doc['est_geocode'].value == 'T'? 1:0 "
          }
        },
        "presence_email": {
          "avg": {
            "script": "doc['presence_email'].value == 'T'? 1:0 "
          }
        },
        "presence_telephone": {
          "avg": {
            "script": "doc['presence_telephone'].value == 'T'? 1:0 "
          }
        },
        "presence_voie": {
          "avg": {
            "script": "doc['presence_voie'].value == 'T'? 1:0 "
          }
        },
        "presence_cri": {
          "avg": {
            "script": "doc['presence_cri'].value == 'T'? 1:0 "
          }
        },
        "presence_moyen_de_paiement": {
          "avg": {
            "script": "doc['presence_moyen_de_paiement'].value == 'T'? 1:0 "
          }
        },
        "presence_horaire": {
          "avg": {
            "script": "doc['presence_horaire'].value == 'T'? 1:0 "
          }
        },
        "presence_logo_cviv": {
          "avg": {
            "script": "doc['presence_logo_cviv'].value == 'T'? 1:0 "
          }
        },
        "nb_de_photos": {
           "avg": {
              "field": "nombre_photos_cviv"
           }
        },
        "nbEtab": {
           "terms": {
              "field": "bu.facet"
           }
        },
        "scoreAvg": {
          "avg": {
            "field": "score"
          }
        },
        "max_score": {
          "max": {
            "field": "score"
          }
        },
        "rang_score": {
         "range": {
            "field": "score",
            "ranges": [
               {
                  "to": score
               },
               {
                  "from": score
               }
            ]
          }
        },
        "histogram": {
          "histogram": {
            "field": "score",
            "interval": 25
          }
        }
      }
    };
    this.requeteEtabRanker.searchElasticSearchAVG(this.searchEtabElasticSearch, elastOptions)
      .then(response => {
        this.responseElasticSearchAVG20KM = response;
        this.makeAvgEtab20KM(this.responseElasticSearchAVG20KM);
        this.makeChart(this.responseElasticSearch);
        this.calculPositionEtabNational();
        this.calculPositionEtab20KM();
        this.makeTabhistogram();
        this.done = true;
        this.bool = false;
      }, error => console.error(error));
  }

  makeTabScore(responseElasticSearch){
    /// Fabtrication du tableau de score.
    /// Chaque "If" correspond à une ligne dans le tableau de score HTML.
    this.tabScore = [];
    this.tabEtab = [];
    this.radarChartLabels = [];
    for (let item of responseElasticSearch.hits.hits){
      if (item._source.presence_photo){
        (item._source.nb_photo > 0 || item._source.presence_photo_expedia > 0 || item._source.presence_photo_pvi > 0 || item._source.presence_photo_lafourchette > 0 || item._source.presence_photo_leadformance > 0 || item._source.presence_photo_cviv > 0 || item._source.presence_photo_osd > 0 || item._source.presence_photo_pjdoc > 0 || item._source.presence_photo_wiki > 0) ? (this.tabScore.push({'critere1': "Présence photo", 'critere': "Présence photo",'check': 1,'Point': this.confPoint.point.presence_photo.point_positif, 'PointConst': this.confPoint.point.presence_photo.point_positif, 'PointOppose': this.confPoint.point.presence_photo.point_negatif, 'modulablePoint': false, "Commentaire": this.confPoint.point.presence_photo.commentaire})) : (this.tabScore.push({'critere1': "Présence photo", 'critere': "Présence photo", 'check': 0,'Point': this.confPoint.point.presence_photo.point_negatif, 'PointConst': this.confPoint.point.presence_photo.point_negatif, 'PointOppose': this.confPoint.point.presence_photo.point_positif, 'customScore': 0, 'modulablePoint': false, "Commentaire": this.confPoint.point.presence_photo.commentaire}));
      }
      if (item._source.nombre_photos_cviv){
        (item._source.nombre_photos_cviv > 0 && item._source.nombre_photos_cviv <= this.maxPhoto) ? (this.tabScore.push({'nbConst': +item._source.nombre_photos_cviv, 'nb': +item._source.nombre_photos_cviv, 'critere1': 'photos', 'critere': item._source.nombre_photos_cviv + " : photos",'check': 1,'Point': 2 * item._source.nombre_photos_cviv, 'PointConst': 2 * item._source.nombre_photos_cviv, 'modulablePoint': true, 'customScore': 0, "Commentaire": 'Description de nombre de Photo'})) : (0);
        (item._source.nombre_photos_cviv > this.maxPhoto) ? (this.tabScore.push({'nbConst': +item._source.nombre_photos_cviv, 'nb': +item._source.nombre_photos_cviv, 'critere1': 'photos', 'critere': item._source.nombre_photos_cviv + " : photos",'check': 1,'Point': 6, 'PointConst': 6, 'modulablePoint': true, 'customScore': 0})) : (0);
        (item._source.nombre_photos_cviv == 0) ? (this.tabScore.push({'nbConst': +item._source.nombre_photos_cviv, 'nb': +item._source.nombre_photos_cviv, 'critere1': 'photos', 'critere': item._source.nombre_photos_cviv + " : photo",'check': 0,'Point': 0, 'PointConst': 0, 'customScore': 0, 'modulablePoint': true})) : (0);
      }
      if (item._source.est_rubrique){
        (item._source.est_rubrique == '1') ? (this.tabScore.push({'critere1': "Présence rubrique", 'critere': "Présence rubrique",'check': 1,'Point': this.confPoint.point.est_rubrique.point_positif, 'PointOppose': this.confPoint.point.est_rubrique.point_negatif, 'PointConst': this.confPoint.point.est_rubrique.point_positif, 'modulablePoint': false, "Commentaire": this.confPoint.point.est_rubrique.commentaire})) : (this.tabScore.push({'critere1': "Présence rubrique", 'critere': "Présence rubrique",'check': 0,'Point': this.confPoint.point.est_rubrique.point_negatif, 'PointConst': this.confPoint.point.est_rubrique.point_negatif, 'PointOppose': this.confPoint.point.est_rubrique.point_positif, 'customScore': 0, 'modulablePoint': false, "Commentaire": this.confPoint.point.est_rubrique.commentaire}));
      }
      if (item._source.est_geocode){
        (item._source.est_geocode == '1') ? (this.tabScore.push({'critere1': "Présence geocode", 'critere': "Présence geocode",'check': 1, 'Point': this.confPoint.point.est_geocode.point_positif, 'PointConst': this.confPoint.point.est_geocode.point_positif, 'PointOppose': this.confPoint.point.est_geocode.point_negatif, 'modulablePoint': false, "Commentaire": this.confPoint.point.est_geocode.commentaire})) : (this.tabScore.push({'critere1': "Présence geocode", 'critere': "Présence geocode",'check': 0,'Point': this.confPoint.point.est_geocode.point_negatif, 'PointConst': this.confPoint.point.est_geocode.point_negatif, 'PointOppose': this.confPoint.point.est_geocode.point_positif, 'customScore': 0, 'modulablePoint': false, "Commentaire": this.confPoint.point.est_geocode.commentaire}));
      }
      if (item._source.presence_horaire){
        (item._source.presence_horaire == 1) ? (this.tabScore.push({'critere1': "Présence horaire", 'critere': "Présence horaire",'check': 1, 'Point': this.confPoint.point.presence_horaire.point_positif, 'PointConst': this.confPoint.point.presence_horaire.point_positif, 'PointOppose': this.confPoint.point.presence_horaire.point_negatif, 'modulablePoint': false, "Commentaire": this.confPoint.point.presence_horaire.commentaire})) : (this.tabScore.push({'critere1': "Présence horaire", 'critere': "Présence horaire",'check': 0,'Point': this.confPoint.point.presence_horaire.point_negatif, 'PointConst': this.confPoint.point.presence_horaire.point_negatif, 'PointOppose': this.confPoint.point.presence_horaire.point_positif, 'customScore': 0, 'modulablePoint': false, "Commentaire": this.confPoint.point.presence_horaire.commentaire}));
      }
      if(item._source.presence_email){
        (item._source.presence_email == '1') ? (this.tabScore.push({'critere1': "Présence email", 'critere': "Présence email",'check': 1, 'Point': this.confPoint.point.presence_email.point_positif, 'PointConst': this.confPoint.point.presence_email.point_positif, 'PointOppose': this.confPoint.point.presence_email.point_negatif, 'modulablePoint': false, "Commentaire": this.confPoint.point.presence_email.commentaire})) : (this.tabScore.push({'critere1': "Présence email", 'critere': "Présence email",'check': 0, 'Point': this.confPoint.point.presence_email.point_negatif, 'PointConst': this.confPoint.point.presence_email.point_negatif, 'PointOppose': this.confPoint.point.presence_email.point_positif, 'customScore': 0, 'modulablePoint': false, "Commentaire": this.confPoint.point.presence_email.commentaire}));
      }
      if(item._source.presence_telephone){
        (item._source.presence_telephone == '1') ? (this.tabScore.push({'critere1': "Présence téléphone", 'critere': "Présence téléphone",'check': 1, 'Point': this.confPoint.point.presence_telephone.point_positif, 'PointConst': this.confPoint.point.presence_telephone.point_positif, 'PointOppose': this.confPoint.point.presence_telephone.point_negatif, 'modulablePoint': false, "Commentaire": this.confPoint.point.presence_telephone.commentaire})) : (this.tabScore.push({'critere1': "Présence téléphone", 'critere': "Présence téléphone",'check': 0, 'Point': this.confPoint.point.presence_telephone.point_negatif, 'PointConst': this.confPoint.point.presence_telephone.point_negatif, 'PointOppose': this.confPoint.point.presence_telephone.point_positif, 'customScore': 0, 'modulablePoint': false, "Commentaire": this.confPoint.point.presence_telephone.commentaire}));
      }
      if(item._source.presence_voie){
        (item._source.presence_voie == '1') ? (this.tabScore.push({'critere1': "Présence voie", 'critere': "Présence voie",'check': 1, 'Point': this.confPoint.point.presence_voie.point_positif, 'PointConst': this.confPoint.point.presence_voie.point_positif, 'PointOppose': this.confPoint.point.presence_voie.point_negatif, 'modulablePoint': false, "Commentaire": this.confPoint.point.presence_voie.commentaire})) : (this.tabScore.push({'critere1': "Présence voie", 'critere': "Présence voie",'check': 0, 'Point': this.confPoint.point.presence_voie.point_negatif, 'PointConst': this.confPoint.point.presence_voie.point_negatif, 'PointOppose': this.confPoint.point.presence_voie.point_positif, 'customScore': 0, 'modulablePoint': false, "Commentaire": this.confPoint.point.presence_voie.commentaire}));
      }
      if(item._source.presence_moyen_de_paiement){
        (item._source.presence_moyen_de_paiement == '1') ? (this.tabScore.push({'critere1': "Présence moyen de paiement", 'critere': "Présence moyen de paiement", 'check': 1, 'Point': this.confPoint.point.presence_moyen_de_paiement.point_positif, 'PointConst': this.confPoint.point.presence_moyen_de_paiement.point_positif, 'PointOppose': this.confPoint.point.presence_moyen_de_paiement.point_negatif, 'modulablePoint': false, "Commentaire": this.confPoint.point.presence_moyen_de_paiement.commentaire})) : (this.tabScore.push({'critere1': "Présence moyen de paiement", 'critere': "Présence moyen de paiement",'check': 0, 'Point': this.confPoint.point.presence_moyen_de_paiement.point_negatif, 'PointConst': this.confPoint.point.presence_moyen_de_paiement.point_negatif, 'PointOppose': this.confPoint.point.presence_moyen_de_paiement.point_positif, 'customScore': 0, 'modulablePoint': false, "Commentaire": this.confPoint.point.presence_moyen_de_paiement.commentaire}));
      }
      if(item._source.presence_donnees_enrichies){
        (item._source.presence_donnees_enrichies == '1') ? (this.tabScore.push({'critere1': "Présence données enrichies", 'critere': "Présence données enrichies",'check': 1, 'Point': this.confPoint.point.presence_donnees_enrichies.point_positif, 'PointConst': this.confPoint.point.presence_donnees_enrichies.point_positif, 'PointOppose': this.confPoint.point.presence_donnees_enrichies.point_negatif, 'modulablePoint': false, "Commentaire": this.confPoint.point.presence_donnees_enrichies.commentaire})) : (this.tabScore.push({'critere1': "Présence données enrichies", 'critere': "Présence données enrichies",'check': 0, 'Point': this.confPoint.point.presence_donnees_enrichies.point_negatif, 'PointConst': this.confPoint.point.presence_donnees_enrichies.point_negatif, 'PointOppose': this.confPoint.point.presence_donnees_enrichies.point_positif, 'customScore': 0, 'modulablePoint': false, "Commentaire": this.confPoint.point.presence_donnees_enrichies.commentaire}));
      }
      if(item._source.presence_menu){
        (item._source.presence_menu == '1') ? (this.tabScore.push({'critere1': "Présence menu", 'critere': "Présence menu",'check': 1, 'Point': this.confPoint.point.presence_menu.point_positif, 'PointConst': this.confPoint.point.presence_menu.point_positif, 'PointOppose': this.confPoint.point.presence_menu.point_negatif, 'modulablePoint': false, "Commentaire": this.confPoint.point.presence_menu.commentaire})) : (this.tabScore.push({'critere1': "Présence menu", 'critere': "Présence menu",'check': 0, 'Point': this.confPoint.point.presence_menu.point_negatif, 'PointConst': this.confPoint.point.presence_menu.point_negatif, 'PointOppose': this.confPoint.point.presence_menu.point_positif, 'customScore': 0, 'modulablePoint': false,  "Commentaire": this.confPoint.point.presence_menu.commentaire}));
      }
      if(item._source.presence_cri){
        (item._source.presence_cri == '1') ? (this.tabScore.push({'critere1': "Présence cri", 'critere': "Présence cri",'check': 1, 'Point': this.confPoint.point.presence_cri.point_positif, 'PointConst': this.confPoint.point.presence_cri.point_positif, 'PointOppose': this.confPoint.point.presence_cri.point_negatif, 'modulablePoint': false, "Commentaire": this.confPoint.point.presence_cri.commentaire})) : (this.tabScore.push({'critere1': "Présence cri", 'critere': "Présence cri",'check': 0, 'Point': this.confPoint.point.presence_cri.point_negatif, 'PointConst': this.confPoint.point.presence_cri.point_negatif, 'PointOppose': this.confPoint.point.presence_cri.point_positif, 'customScore': 0, 'modulablePoint': false, "Commentaire": this.confPoint.point.presence_cri.commentaire}));
      }
      if(item._source.presence_logo_cviv){
        (item._source.presence_logo_cviv == '1') ? (this.tabScore.push({'critere1': "Présence logo", 'critere': "Présence logo", 'check': 1, 'Point': this.confPoint.point.presence_logo_cviv.point_positif, 'PointConst': this.confPoint.point.presence_logo_cviv.point_positif, 'PointOppose': this.confPoint.point.presence_logo_cviv.point_negatif, 'modulablePoint': false, "Commentaire": this.confPoint.point.presence_logo_cviv.commentaire})) : (this.tabScore.push({'critere1': "Présence logo", 'critere': "Présence logo",'check': 0, 'Point': this.confPoint.point.presence_logo_cviv.point_negatif, 'PointConst': this.confPoint.point.presence_logo_cviv.point_negatif, 'PointOppose': this.confPoint.point.presence_logo_cviv.point_positif, 'customScore': 0, 'modulablePoint': false, "Commentaire": this.confPoint.point.presence_logo_cviv.commentaire}));
      }
      if(item._source.presence_site){
        (item._source.presence_site == '1') ? (this.tabScore.push({'critere1': "Présence site", 'critere': "Présence site",'check': 1, 'Point': this.confPoint.point.presence_site.point_positif, 'PointConst': this.confPoint.point.presence_site.point_positif, 'PointOppose': this.confPoint.point.presence_site.point_negatif, 'modulablePoint': false, "Commentaire": this.confPoint.point.presence_site.commentaire})) : (this.tabScore.push({'critere1': "Présence site", 'critere': "Présence site",'check': 0, 'Point': this.confPoint.point.presence_site.point_negatif, 'PointConst': this.confPoint.point.presence_site.point_negatif, 'PointOppose': this.confPoint.point.presence_site.point_positif, 'customScore': 0, 'modulablePoint': false, "Commentaire": this.confPoint.point.presence_site.commentaire}));
      }
    }
    for (let item of this.tabScore){
      this.nbCurrentScore += item.Point;
    }
  }

  makeAvgEtab(avg){
    //// Fabrtication du tableau de score pour les établissements concurrent dans toutes la france.
    //// Charque "If" correspond à une critére dans le graphe HTML.
    this.tabScoreAVG = [];
    this.tabEtab = [];
    for (let item of this.responseElasticSearch.hits.hits){
      if (avg.aggregations.presence_photo && item._source.presence_photo){
          this.tabScoreAVG.push({'critere': "Présence photo", 'Point': avg.aggregations.presence_photo.value * 100});
      }
      if (avg.aggregations.nb_de_photos && item._source.nombre_photos_cviv){
        (Math.round(avg.aggregations.nb_de_photos.value) > 0 && avg.aggregations.nb_de_photos.value <= this.maxPhoto) ? (this.tabScoreAVG.push({'critere': "nb Photos" ,'Point': 2 * Math.round(avg.aggregations.nb_de_photos.value)})) : (0);
        (Math.round(avg.aggregations.nb_de_photos.value) > this.maxPhoto) ? (this.tabScoreAVG.push({'critere': "nb Photos" ,'Point': 6})) : (0);
        (Math.round(avg.aggregations.nb_de_photos.value) == 0) ? (this.tabScoreAVG.push({'critere': "nb Photos", 'Point': 0})) : (0);
      }
      if (avg.aggregations.presence_rubrique && item._source.est_rubrique){
          this.tabScoreAVG.push({'critere': "Présence rubrique", 'Point': avg.aggregations.presence_rubrique.value * 100});
      }
      if (avg.aggregations.presence_geocode && item._source.est_geocode){
          this.tabScoreAVG.push({'critere': "Présence geocode", 'Point': avg.aggregations.presence_geocode.value * 100});
      }
      if (avg.aggregations.presence_email && item._source.presence_email){
          this.tabScoreAVG.push({'critere': "Présence email", 'Point': avg.aggregations.presence_email.value * 100});
      }
      if (avg.aggregations.presence_telephone && item._source.presence_telephone){
          this.tabScoreAVG.push({'critere': "Présence téléphone", 'Point': avg.aggregations.presence_telephone.value * 100});
      }
      if (avg.aggregations.presence_voie && item._source.presence_voie){
          this.tabScoreAVG.push({'critere': "Présence voie", 'Point': avg.aggregations.presence_voie.value * 100});
      }
      if (avg.aggregations.presence_moyen_de_paiement && item._source.presence_moyen_de_paiement){
          this.tabScoreAVG.push({'critere': "Présence moyen de paiement", 'Point': avg.aggregations.presence_moyen_de_paiement.value * 100});
      }
      if (avg.aggregations.presence_cri && item._source.presence_cri){
          this.tabScoreAVG.push({'critere': "Présence cri", 'Point': avg.aggregations.presence_cri.value * 100});
      }
      if (avg.aggregations.presence_logo_cviv && item._source.presence_logo_cviv){
          this.tabScoreAVG.push({'critere': "Présence logo", 'Point': avg.aggregations.presence_logo_cviv.value * 100});
      }
      if (avg.aggregations.presence_horaire && item._source.presence_horaire){
          this.tabScoreAVG.push({'critere': "Présence horaire", 'Point': avg.aggregations.presence_horaire.value * 100});
      }
    }
  }

  makeAvgEtab20KM(avg){
    //// Fabrtication du tableau de score pour les établissements concurrent dans toutes la france.
    //// Charque "If" correspond à une critére dans le graphe HTML.
    this.tabScoreAVG20KM = [];
    this.tabEtab = [];
    for (let item of this.responseElasticSearch.hits.hits){
      if (avg.aggregations.presence_photo && item._source.presence_photo){
          this.tabScoreAVG20KM.push({'critere': "Présence photo", 'Point': avg.aggregations.presence_photo.value * 100});
      }
      if (avg.aggregations.nb_de_photos && item._source.nombre_photos_cviv){
        (Math.round(avg.aggregations.nb_de_photos.value) > 0 && avg.aggregations.nb_de_photos.value <= this.maxPhoto) ? (this.tabScoreAVG20KM.push({'critere': "nb Photos" ,'Point': 2 * Math.round(avg.aggregations.nb_de_photos.value)})) : (0);
        (Math.round(avg.aggregations.nb_de_photos.value) > this.maxPhoto) ? (this.tabScoreAVG20KM.push({'critere': "nb Photos" ,'Point': 6})) : (0);
        (Math.round(avg.aggregations.nb_de_photos.value) == 0) ? (this.tabScoreAVG20KM.push({'critere': "nb Photos", 'Point': 0})) : (0);
      }
      if (avg.aggregations.presence_rubrique && item._source.est_rubrique){
          this.tabScoreAVG20KM.push({'critere': "Présence rubrique", 'Point': avg.aggregations.presence_rubrique.value * 100});
      }
      if (avg.aggregations.presence_geocode && item._source.est_geocode){
          this.tabScoreAVG20KM.push({'critere': "Présence geocode", 'Point': avg.aggregations.presence_geocode.value * 100});
      }
      if (avg.aggregations.presence_email && item._source.presence_email){
          this.tabScoreAVG20KM.push({'critere': "Présence email", 'Point': avg.aggregations.presence_email.value * 100});
      }
      if (avg.aggregations.presence_telephone && item._source.presence_telephone){
          this.tabScoreAVG20KM.push({'critere': "Présence téléphone", 'Point': avg.aggregations.presence_telephone.value * 100});
      }
      if (avg.aggregations.presence_voie && item._source.presence_voie){
          this.tabScoreAVG20KM.push({'critere': "Présence voie", 'Point': avg.aggregations.presence_voie.value * 100});
      }
      if (avg.aggregations.presence_moyen_de_paiement && item._source.presence_moyen_de_paiement){
          this.tabScoreAVG20KM.push({'critere': "Présence moyen de paiement", 'Point': avg.aggregations.presence_moyen_de_paiement.value * 100});
      }
      if (avg.aggregations.presence_cri && item._source.presence_cri){
          this.tabScoreAVG20KM.push({'critere': "Présence cri", 'Point': avg.aggregations.presence_cri.value * 100});
      }
      if (avg.aggregations.presence_logo_cviv && item._source.presence_logo_cviv){
          this.tabScoreAVG20KM.push({'critere': "Présence logo", 'Point': avg.aggregations.presence_logo_cviv.value * 100});
      }
      if (avg.aggregations.presence_horaire && item._source.presence_horaire){
          this.tabScoreAVG20KM.push({'critere': "Présence horaire", 'Point': avg.aggregations.presence_horaire.value * 100});
      }
    }
  }

  makeChart(responseElasticSearch){
    var tabEtab1 = [];
    var tabEtab2 = [];
    var tabEtab3 = [];
    this.radarChartData = [
      {data: [], label: 'Pro en question.'},
      {data: [], label: 'Pro niveau national. (' + this.responseElasticSearchAVG.hits.total + ')'},
      {data: [], label: 'Pro dans un rayon de 20 km. (' + this.responseElasticSearchAVG20KM.hits.total + ')'}
    ];
    ///// Modification du tableau pour afficher chaque critéres (correspond à chaque "If"), dans le graphe HMTL.
    this.radarChartLabels = [];
    for (let item of this.tabScore){
      // 1er critére
      if (item.critere == "Présence photo"){
        this.radarChartLabels.push("Présence photo");
        (item.check == 1) ? (tabEtab1.push(100)) : (tabEtab1.push(0));
        for (let itemAVG20KM of this.tabScoreAVG20KM){
          (itemAVG20KM.critere == "Présence photo") ? (tabEtab2.push(itemAVG20KM.Point)) : (0);
        }
       for (let itemAVG of this.tabScoreAVG){
          (itemAVG.critere == "Présence photo") ? (tabEtab3.push(itemAVG.Point)) : (0);
        }
      }
      // 2e critére
      if (item.critere1 == "photos"){
        this.radarChartLabels.push("Nb Photos");
        (item.check == 1) ? (tabEtab1.push(100)) : (tabEtab1.push(0));
        // tabEtab1.push(item.Point);
        for (let itemAVG20KM of this.tabScoreAVG20KM){
          (itemAVG20KM.critere == "nb Photos") ? (tabEtab2.push(itemAVG20KM.Point)) : (0);
        }
        for (let itemAVG of this.tabScoreAVG){
          (itemAVG.critere == "nb Photos") ? (tabEtab3.push(itemAVG.Point)) : (0);
        }
      }
      // 3e critére
      if (item.critere == "Présence rubrique"){
        this.radarChartLabels.push("Présence Rubrique");
        (item.check == 1) ? (tabEtab1.push(100)) : (tabEtab1.push(0));
        // tabEtab1.push(item.Point);
        for (let itemAVG20KM of this.tabScoreAVG20KM){
          (itemAVG20KM.critere == "Présence rubrique") ? (tabEtab2.push(itemAVG20KM.Point)) : (0);
        }
        for (let itemAVG of this.tabScoreAVG){
          (itemAVG.critere == "Présence rubrique") ? (tabEtab3.push(itemAVG.Point)) : (0);
        }      
      }
      // 4e critére
      if (item.critere == "Présence geocode"){
        this.radarChartLabels.push("Présence geocode");
        (item.check == 1) ? (tabEtab1.push(100)) : (tabEtab1.push(0));
        // tabEtab1.push(item.Point);
        for (let itemAVG20KM of this.tabScoreAVG20KM){
          (itemAVG20KM.critere == "Présence geocode") ? (tabEtab2.push(itemAVG20KM.Point)) : (0);
        }
        for (let itemAVG of this.tabScoreAVG){
          (itemAVG.critere == "Présence geocode") ? (tabEtab3.push(itemAVG.Point)) : (0);
        }      
      }
      // 5e critére
      if (item.critere == "Présence email"){
        this.radarChartLabels.push("Présence email");
        (item.check == 1) ? (tabEtab1.push(100)) : (tabEtab1.push(0));
        // tabEtab1.push(item.Point);
        for (let itemAVG20KM of this.tabScoreAVG20KM){
          (itemAVG20KM.critere == "Présence email") ? (tabEtab2.push(itemAVG20KM.Point)) : (0);
        }
        for (let itemAVG of this.tabScoreAVG){
          (itemAVG.critere == "Présence email") ? (tabEtab3.push(itemAVG.Point)) : (0);
        }      
      }
      // 6e critére
      if (item.critere == "Présence téléphone"){
        this.radarChartLabels.push("Présence téléphone");
        (item.check == 1) ? (tabEtab1.push(100)) : (tabEtab1.push(0));
        // tabEtab1.push(item.Point);
        for (let itemAVG20KM of this.tabScoreAVG20KM){
          (itemAVG20KM.critere == "Présence téléphone") ? (tabEtab2.push(itemAVG20KM.Point)) : (0);
        }
        for (let itemAVG of this.tabScoreAVG){
          (itemAVG.critere == "Présence téléphone") ? (tabEtab3.push(itemAVG.Point)) : (0);
        }      
      }
      // 7e critére
      if (item.critere == "Présence horaire"){
        this.radarChartLabels.push("Présence horaire");
        (item.check == 1) ? (tabEtab1.push(100)) : (tabEtab1.push(0));
        // tabEtab1.push(item.Point);
        for (let itemAVG20KM of this.tabScoreAVG20KM){
          (itemAVG20KM.critere == "Présence horaire") ? (tabEtab2.push(itemAVG20KM.Point)) : (0);
        }
        for (let itemAVG of this.tabScoreAVG){
          (itemAVG.critere == "Présence horaire") ? (tabEtab3.push(itemAVG.Point)) : (0);
        }  
      }
      // 8e critére
      if (item.critere == "Présence voie"){
        this.radarChartLabels.push("Présence voie");
        (item.check == 1) ? (tabEtab1.push(100)) : (tabEtab1.push(0));
        // tabEtab1.push(item.Point);
        for (let itemAVG20KM of this.tabScoreAVG20KM){
          (itemAVG20KM.critere == "Présence voie") ? (tabEtab2.push(itemAVG20KM.Point)) : (0);
        }
        for (let itemAVG of this.tabScoreAVG){
          (itemAVG.critere == "Présence voie") ? (tabEtab3.push(itemAVG.Point)) : (0);
        }  
      }
      // 9e critére
      if (item.critere == "Présence moyen de paiement"){
        this.radarChartLabels.push("Présence moyen de paiement");
        (item.check == 1) ? (tabEtab1.push(100)) : (tabEtab1.push(0));
        // tabEtab1.push(item.Point);
        for (let itemAVG20KM of this.tabScoreAVG20KM){
          (itemAVG20KM.critere == "Présence moyen de paiement") ? (tabEtab2.push(itemAVG20KM.Point)) : (0);
        }
       for (let itemAVG of this.tabScoreAVG){
          (itemAVG.critere == "Présence moyen de paiement") ? (tabEtab3.push(itemAVG.Point)) : (0);
        } 
      }
      // 10e critére
      if (item.critere == "Présence cri"){
        this.radarChartLabels.push("Présence cri");
        (item.check == 1) ? (tabEtab1.push(100)) : (tabEtab1.push(0));
        // tabEtab1.push(item.Point);
        for (let itemAVG20KM of this.tabScoreAVG20KM){
          (itemAVG20KM.critere == "Présence cri") ? (tabEtab2.push(itemAVG20KM.Point)) : (0);
        }
       for (let itemAVG of this.tabScoreAVG){
          (itemAVG.critere == "Présence cri") ? (tabEtab3.push(itemAVG.Point)) : (0);
        } 
      }
      // 11e critére
      if (item.critere == "Présence logo"){
        this.radarChartLabels.push("Présence logo");
        (item.check == 1) ? (tabEtab1.push(100)) : (tabEtab1.push(0));
        // tabEtab1.push(item.Point);
        for (let itemAVG20KM of this.tabScoreAVG20KM){
          (itemAVG20KM.critere == "Présence logo") ? (tabEtab2.push(itemAVG20KM.Point)) : (0);
        }
       for (let itemAVG of this.tabScoreAVG){
          (itemAVG.critere == "Présence logo") ? (tabEtab3.push(itemAVG.Point)) : (0);
        } 
      }
    }
    var i : number = 0;
    for (let item of this.radarChartData){
      if (i == 0){
        item.data = tabEtab1;
      }
      if (i == 2){
        item.data = tabEtab2;
      }
      if (i == 1){
        item.data = tabEtab3;
      }
      i += 1;
    }
  }

  modifScore(index, obj){
    /// Lorsque l'on clique sur un des boutons du tableau.
    var i : number = 0;
    for (let item of this.tabScore){
      if (i == index && item.modulablePoint == false){
        if (item.Point != item.PointOppose){
          item.Point = item.PointOppose;   /// inversion du score puisque c'est comme si le critére n'éxiste plus ou existe.
        }
        else{
          item.Point = item.PointConst;
        }
        (item.customScore == 1) ? (item.customScore = 0) : (item.customScore = 1);  // On renseigne le champs que l'on à customisé le score.
      }
      if (i == index && item.modulablePoint == true){
        /// Pour les critére ou que l'on peut choisir le nombre (nombre photos, nombre d'avis).
        (item.customScore == 1) ? (item.customScore = 0) : (item.customScore = 1);
        (item.customScore == 0) ? (item.Point = item.PointConst, item.nb = item.nbConst) : (0); // si on clique sur le bouton pour revenir à l'état original, le score (Point), reprend sa valeur original.
        item.critere = item.nb + " : " + obj;
      }
      i += 1;
    }
    this.nbScoreModifie = 0;
    this.scoreModifie = false;
    for (let item of this.tabScore){
      this.nbScoreModifie += item.Point; // On compte les points points du score modifié
      (item.customScore == 1) ? (this.scoreModifie = true) : 0; /// On met une valeur à true pour savoir si le score à été modifé pour afficher le score modifié ou pas.
    }
  }

  addObj(obj){
    /// Si on appuie sur incrémenter le nb de photos, avis, ...
    var max : number = 0;
    for (let item of this.tabScore){
      (obj == "avis") ? (max = this.maxAvis) : (max = this.maxPhoto);  // on définit la valeur max en fonction du critére. (soit avis ou photo).
      if (item.critere1 == obj && item.nb >= max){
        item.Point = 2 * max; // on ne peut pas monté le score à plus de 2* max, si le nombre de photos ou avis, ... est >= à le max.
        item.nb += 1; // incrémente le nb de photos, avis, ...
        item.critere = item.nb + " : " + obj; // pour afficher dans tableau
        item.customScore = 1;
      }
      else if (item.critere1 == obj){
        /// Si le nb est inférieur au max.
        item.Point += 2;
        item.nb += 1;
        item.critere = item.nb + " : " + obj;
        item.customScore = 1;
      }
    }
    this.nbScoreModifie = 0;
    this.scoreModifie = false;
    for (let item of this.tabScore){
      this.nbScoreModifie += item.Point; // on compte le score modifié
      (item.customScore == 1) ? (this.scoreModifie = true) : 0;
    }
  }
  rmObj(obj){
    /// Si on appuie sur supprimé une photo, avis, ...
    /// Fonctionne comme la fonction addObj mais en sens inverse.
    var max : number = 0;
    for (let item of this.tabScore){
      (obj == "avis") ? (max = this.maxAvis) : (max = this.maxPhoto);
      if (item.critere1 == obj && item.nb > 0  && item.nb <= max){
        item.nb -= 1;
        item.Point = 2 * item.nb;
        item.critere = item.nb + " : " + obj;
        item.customScore = 1;
      }
      else if (item.critere1 == obj && item.nb > 0 && item.nb > max){
        item.nb -= 1;
        item.critere = item.nb + " : " + obj;
        item.customScore = 1;
      }
    }
    this.nbScoreModifie = 0;
    this.scoreModifie = false;
    for (let item of this.tabScore){
      this.nbScoreModifie += item.Point;
      (item.customScore == 1) ? (this.scoreModifie = true) : 0;
    }
  }

  calculPositionEtabNational(){
    this.valeurMaxScore = this.responseElasticSearchAVG.aggregations.max_score.value;
    for (let item of this.responseElasticSearchAVG.aggregations.rang_score.buckets){
      this.positionEtab = item.doc_count + 1; // Il y 2 chiffre (ici il prend les deux en écrasant le premier), il prend donc le deuxième.
    }
  }

  calculPositionEtab20KM(){
    this.valeurMaxScore20KM = this.responseElasticSearchAVG20KM.aggregations.max_score.value;
    for (let item of this.responseElasticSearchAVG20KM.aggregations.rang_score.buckets){
      this.positionEtab20KM = item.doc_count + 1; // Il y 2 chiffre (ici il prend les deux en écrasant le premier), il prend donc le deuxième.
    }
  }

////

// lineChart
  public lineChartData:Array<any> = [
    {data: [], label: 'Nb pro concurrent (national)'},
    {data: [], label: 'Nb pro concurrent (20Km)'}
  ];
  public lineChartLabels:Array<any> = [];
  public lineChartOptions:any = {
    animation: false,
    responsive: true
  };
  public lineChartColors:Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';
////


  makeTabhistogram(){
    var i : number = 0;
    this.lineChartLabels = [];
    for (let item2 of this.lineChartData){
      item2.data = [];
    }
    for (let item of this.responseElasticSearchAVG.aggregations.histogram.buckets){
      this.lineChartLabels.push(item.key);
      for (let item2 of this.lineChartData){
        (i == 0) ? (item2.data.push(item.doc_count)) : (0);
        i += 1;
      }
      i = 0;
    }
    i = 0;
    for (let item of this.responseElasticSearchAVG20KM.aggregations.histogram.buckets){
      for (let item2 of this.lineChartData){
        (i == 1) ? (item2.data.push(item.doc_count)) : (0);
        i += 1;
      }
      i = 0;
    }
  }

  displayGraphic(){
    if (this.affPodium == true){
      this.affPodium = false;
      this.affGraph = true;
      this.makeTabhistogram();
    }
    else if (this.affPodium == false){
      this.affPodium = true;
      this.affGraph = false;
    }
  }

  displayPodium(){
    this.affPodium = true;
    this.affGraph = false;
  }

  chartClicked(event){}
  chartHovered(event){}
}
