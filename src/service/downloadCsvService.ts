/*
*
* Ce service permet de télécharger la réponse de la requête.
*
*/

import {Injectable} from '@angular/core';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

declare var require: any;

@Injectable()
export class DownloadCsvService {


    constructor() {
    }

    downloadCsvTableauAladin3(response){
      var data = [];

      for (let item of response.hits.hits){
        data.push({
          "name": item._source.quiquoi_plus_frequent,
          "txFragilite": item._source.tx_fragile,
          "type": item._source.typeQuoiSimple,
          "freqMensuelle": item._source.frequence_mensuelle
        });
      }
      new Angular2Csv(data, 'Data');
    }

    downloadCsvRequeteAladin3(response){
      var data = [];

      var options = { 
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true, 
        showTitle: false 
      };

      for (let item of response.hits.hits){
        data.push({
          "Name": item._source.quiquoi_plus_frequent,
          "TxFragilite": item._source.tx_fragile,
          "Type": item._source.typeQuoiSimple,
          "FreqMensuelle": item._source.frequence_mensuelle
        });
      }

      new Angular2Csv(data, "Data", options);
    }
}