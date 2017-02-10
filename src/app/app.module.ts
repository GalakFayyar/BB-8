import {NgModule} from '@angular/core'
import {RouterModule} from "@angular/router";
import {rootRouterConfig} from "./app.routes";
import {AppComponent} from "./app";
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {HttpModule} from "@angular/http";
import {Login} from './login/login';
import {Dashboard} from './dashboard/dashboard';
import {Interpretation} from './allDashboard/dashboardAladin3/componentDashboardAladin3/interpretation/interpretation';
import {InformationsComplementaire} from './allDashboard/dashboardAladin3/componentDashboardAladin3/informationsComplementaire/informationsComplementaire';
import {GeoRequetes} from './allDashboard/dashboardAladin3/componentDashboardAladin3/geoRequetes/geoRequetes';
import {Evts} from './allDashboard/dashboardAladin3/componentDashboardAladin3/evts/evts';
import {AddTab} from './addTab/addTab';
import {MainDashboard} from './mainDashboard/mainDashboard';
import {DashboardAladin3} from './allDashboard/dashboardAladin3/dashboardAladin3';
import {DashboardInterpretation} from './allDashboard/dashboardInterpretation/dashboardInterpretation';
import {ReponseInterpretationTemplateDelphes} from './allDashboard/dashboardInterpretation/componentDashboardInterpretation/reponseInterpretationTemplate/reponseInterpretationTemplateDelphes/reponseInterpretationTemplateDelphes';
import {ReponseInterpretationTemplateApiInterpretation} from './allDashboard/dashboardInterpretation/componentDashboardInterpretation/reponseInterpretationTemplate/reponseInterpretationTemplateApiInterpretation/reponseInterpretationTemplateApiInterpretation';
import {ReponseInterpretationTemplateWsActivite} from './allDashboard/dashboardInterpretation/componentDashboardInterpretation/reponseInterpretationTemplate/reponseInterpretationTemplateWsActivite/reponseInterpretationTemplateWsActivite';
import {ListRequete} from './allDashboard/dashboardInterpretation/componentDashboardInterpretation/listRequete/listRequete';
import {ApiContexte} from './allDashboard/dashboardInterpretation/componentDashboardInterpretation/apiContexte/apiContexte';

import {DashboardInsee} from './allDashboard/dashboardInsee/dashboardInsee';
import {DashboardEtablissement} from './allDashboard/dashboardEtablissement/dashboardEtablissement';
import {DashboardDataVisualisation} from './allDashboard/dashboardDataVisualisation/dashboardDataVisualisation';
import {DashboardRubrique} from './allDashboard/dashboardRubrique/dashboardRubrique';
import {DashboardEtabRanker} from './allDashboard/dashboardEtabRanker/dashboardEtabRanker';
import {NomEtab} from './allDashboard/dashboardEtabRanker/componentEtabRanker/dashboard/nomEtab/nomEtab';
import {InformationsEtab} from './allDashboard/dashboardEtabRanker/componentEtabRanker/dashboard/informationsEtab/informationsEtab';
import {CarouselPhoto} from './allDashboard/dashboardEtabRanker/componentEtabRanker/dashboard/carouselPhoto/carouselPhoto';
import {MapEtabRanker} from './allDashboard/dashboardEtabRanker/componentEtabRanker/dashboard/map/map';

import {Score} from './allDashboard/dashboardEtabRanker/componentEtabRanker/score/score';
import {Comparaison} from './allDashboard/dashboardEtabRanker/componentEtabRanker/comparaison/comparaison';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {RequetePageListService} from '../service/requeteService';
import {DownloadCsvService} from '../service/downloadCsvService';
import {RequeteEtabRanker} from '../service/requeteServiceEtabRanker';
import {VarForElasticSearchService} from '../service/varForElasticSearchService';
import {FiltresService} from '../service/filtresService';
import {DataVisualisationService} from '../service/dataVisualisationService';
import {ParseurForRecupFiltreService} from '../service/parseurForRecupFiltreService';
import {RecupFiltresActif} from '../service/recupFiltresActif';
import {FiltresASelectionner} from './addTab/filtresASelectionner/filtresASelectionner';
import {FiltresSelectionner} from './addTab/filtresSelectionner/filtresSelectionner';
import {ComponentMainArrayAladin3} from './addTab/componentMainArray/componentMainArrayAladin3/componentMainArrayAladin3';
import {ComponentMainArrayEtablissement} from './addTab/componentMainArray/componentMainArrayEtablissement/componentMainArrayEtablissement';
import {ComponentMainArrayInsee} from './addTab/componentMainArray/componentMainArrayInsee/componentMainArrayInsee';
import {ComponentMainArrayRubrique} from './addTab/componentMainArray/componentMainArrayRubrique/componentMainArrayRubrique';
import {ComponentMainArrayCRIetMarques} from './addTab/componentMainArray/componentMainArrayCRIetMarques/componentMainArrayCRIetMarques';
import {ComponentMainArrayMotsClefs} from './addTab/componentMainArray/componentMainArrayMotsClefs/componentMainArrayMotsClefs';
import {FiltreTemplateAladin3} from './addTab/filtresASelectionner/filtreTemplate/filtreTemplateAladin3/filtreTemplateAladin3';
import {FiltreTemplateEtablissement} from './addTab/filtresASelectionner/filtreTemplate/filtreTemplateEtablissement/filtreTemplateEtablissement';
import {FiltreTemplateInsee} from './addTab/filtresASelectionner/filtreTemplate/filtreTemplateInsee/filtreTemplateInsee';
import {FiltreTemplateRubrique} from './addTab/filtresASelectionner/filtreTemplate/filtreTemplateRubrique/filtreTemplateRubrique';
import {FiltreSelectionnerTemplateAladin3} from './addTab/filtresSelectionner/filtreSelectionnerTemplate/filtreSelectionnerTemplateAladin3/filtreSelectionnerTemplateAladin3';
import {FiltreSelectionnerTemplateEtablissement} from './addTab/filtresSelectionner/filtreSelectionnerTemplate/filtreSelectionnerTemplateEtablissement/filtreSelectionnerTemplateEtablissement';
import {FiltreSelectionnerTemplateInsee} from './addTab/filtresSelectionner/filtreSelectionnerTemplate/filtreSelectionnerTemplateInsee/filtreSelectionnerTemplateInsee';
import {FiltreSelectionnerTemplateRubrique} from './addTab/filtresSelectionner/filtreSelectionnerTemplate/filtreSelectionnerTemplateRubrique/filtreSelectionnerTemplateRubrique';
import {InformationsRubrique} from './allDashboard/dashboardRubrique/componentDashboardRubrique/informationsRubrique/informationsRubrique';
import {TopRequetes} from './allDashboard/dashboardRubrique/componentDashboardRubrique/topRequetes/topRequetes';
import {ProsPopulaire} from './allDashboard/dashboardRubrique/componentDashboardRubrique/prosPopulaire/prosPopulaire';
import {MotsCles} from './allDashboard/dashboardRubrique/componentDashboardRubrique/motsCles/motsCles';
import {CriEtMarques} from './allDashboard/dashboardRubrique/componentDashboardRubrique/criEtMarques/criEtMarques';
import {InformationsInsee} from './allDashboard/dashboardInsee/componentDashboardInsee/informationsInsee/informationsInsee';

import {ArrayquatorzeF} from './allDashboard/dashboardRubrique/componentDashboardRubrique/informationsRubrique/arrayquatorzeF/arrayquatorzeF';
import {ArrayContributif} from './allDashboard/dashboardRubrique/componentDashboardRubrique/informationsRubrique/arrayContributif/arrayContributif';
import {ArrayFiltres} from './allDashboard/dashboardRubrique/componentDashboardRubrique/informationsRubrique/arrayFiltres/arrayFiltres';

import {DashboardMenu} from './allDashboard/dashboardMenu/dashboardMenu';

import {ComparaisonInterpretation} from './allDashboard/dashboardInterpretation/componentDashboardInterpretation/comparaisonInterpretation';

import {MiniEtabRanker} from './allDashboard/dashboardInsee/componentDashboardInsee/miniEtabRanker/miniEtabRanker';


import {NgGridModule} from 'angular2-grid';
import {CheckState} from './dashboard/pipe'
import {PopoverModule} from "ng2-popover";

import {ReactiveFormsModule} from '@angular/forms';
import {SelectModule} from 'angular2-select';

import {DataVisualisationRubriques} from './allDashboard/dashboardDataVisualisation/componentDashboardDataVisualisation/dataVisualisationRubriques/dataVisualisationRubriques';
import {DataVisualisationOntologies} from './allDashboard/dashboardDataVisualisation/componentDashboardDataVisualisation/dataVisualisationOntologies/dataVisualisationOntologies';
import {DataVisualisationCris} from './allDashboard/dashboardDataVisualisation/componentDashboardDataVisualisation/dataVisualisationCris/dataVisualisationCris';
import {DataVisualisationEtabs} from './allDashboard/dashboardDataVisualisation/componentDashboardDataVisualisation/dataVisualisationEtabs/dataVisualisationEtabs';
import {DataVisualisationExpressions} from './allDashboard/dashboardDataVisualisation/componentDashboardDataVisualisation/dataVisualisationExpressions/dataVisualisationExpressions';
import {DataVisualisationRegles} from './allDashboard/dashboardDataVisualisation/componentDashboardDataVisualisation/dataVisualisationRegles/dataVisualisationRegles';
import {DataVisualisationGraph} from './allDashboard/dashboardDataVisualisation/componentDashboardDataVisualisation/dataVisualisationGraph/dataVisualisationGraph';
import {DataVisualisationChart} from './allDashboard/dashboardDataVisualisation/componentDashboardDataVisualisation/dataVisualisationChart/dataVisualisationChart';
import {DataVisualisationConcepts} from './allDashboard/dashboardDataVisualisation/componentDashboardDataVisualisation/dataVisualisationConcepts/dataVisualisationConcepts';
import {DataVisualisationGraphSelected} from './allDashboard/dashboardDataVisualisation/componentDashboardDataVisualisation/dataVisualisationGraphSelected/dataVisualisationGraphSelected';
import {DataVisualisationRequetes} from './allDashboard/dashboardDataVisualisation/componentDashboardDataVisualisation/dataVisualisationRequetes/dataVisualisationRequetes';
import {DataVisualisationCompareRubriques} from './allDashboard/dashboardDataVisualisation/componentDashboardDataVisualisation/dataVisualisationCompareRubriques/dataVisualisationCompareRubriques';
import {DataVisualisationPrintRow} from './allDashboard/dashboardDataVisualisation/componentDashboardDataVisualisation/dataVisualisationPrintRow/dataVisualisationPrintRow';
import {DataVisualisationPrintRubriques} from './allDashboard/dashboardDataVisualisation/componentDashboardDataVisualisation/dataVisualisationCompareRubriques/componentDataVisualisationCompareRubriques/dataVisualisationPrintRubriques/dataVisualisationPrintRubriques';

import {DatepickerModule} from 'ng2-bootstrap/ng2-bootstrap';
import {TypeaheadModule} from 'ng2-bootstrap/components/typeahead';
import {ChartsModule} from 'ng2-charts/ng2-charts';
import {nvD3Module}           from './ng2-nvd3/ng2-nvd3.module';
import {AgGridModule} from "ag-grid-ng2/main";

@NgModule({
  declarations: [
    AppComponent,
    Login,
    Dashboard,
    Interpretation,
    AddTab,
    FiltresASelectionner,
    FiltresSelectionner,
    CheckState,
    MainDashboard,
    InformationsComplementaire,
    GeoRequetes,
    Evts,
    DashboardAladin3,
    DashboardInterpretation,
    DashboardInsee,
    DashboardEtablissement,
    DashboardRubrique,
    DashboardDataVisualisation,
    DashboardEtabRanker,
    NomEtab,
    InformationsEtab,
    CarouselPhoto,
    MapEtabRanker,
    Score,
    Comparaison,
    ComponentMainArrayAladin3,
    ComponentMainArrayEtablissement,
    ComponentMainArrayInsee,
    ComponentMainArrayRubrique,
    ComponentMainArrayCRIetMarques,
    ComponentMainArrayMotsClefs,
    FiltreTemplateAladin3,
    FiltreTemplateEtablissement,
    FiltreTemplateInsee,
    FiltreTemplateRubrique,
    FiltreSelectionnerTemplateAladin3,
    FiltreSelectionnerTemplateInsee,
    FiltreSelectionnerTemplateRubrique,
    FiltreSelectionnerTemplateEtablissement,
    InformationsRubrique,
    TopRequetes,
    ProsPopulaire,
    MotsCles,
    CriEtMarques,
    InformationsInsee,
    ArrayquatorzeF,
    ArrayContributif,
    ArrayFiltres,
    DashboardMenu,
    ComparaisonInterpretation,
    DataVisualisationRegles,
    DataVisualisationEtabs,
    DataVisualisationExpressions,
    DataVisualisationCris,
    DataVisualisationOntologies,
    DataVisualisationRubriques,
    MiniEtabRanker,
    ReponseInterpretationTemplateDelphes,
    ReponseInterpretationTemplateApiInterpretation,
    ReponseInterpretationTemplateWsActivite,
    ListRequete,
    ApiContexte,
    DataVisualisationGraph,
    DataVisualisationGraphSelected,
    DataVisualisationChart,
    DataVisualisationRequetes,
    DataVisualisationCompareRubriques,
    DataVisualisationPrintRubriques,
    DataVisualisationPrintRow,
    DataVisualisationConcepts
  ],
  imports     : [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgGridModule,
    RouterModule.forRoot(rootRouterConfig),
    PopoverModule,
    ReactiveFormsModule,
    SelectModule,
    DatepickerModule,
    TypeaheadModule,
    ChartsModule,
    nvD3Module,
    AgGridModule.withComponents(
        [
            DataVisualisationPrintRow
        ])
  ],
  providers   : [
    RequetePageListService,
    RequeteEtabRanker,
    VarForElasticSearchService,
    FiltresService,
    ParseurForRecupFiltreService,
    RecupFiltresActif,
    DataVisualisationService,
    DownloadCsvService
  ],
  bootstrap   : [
    AppComponent
  ]
})
export class AppModule {

}
