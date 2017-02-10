/*
*
* Configuration des routes.
*
*/

import {Routes} from '@angular/router';
import {Login} from './login/login';
import {Dashboard} from './dashboard/dashboard';
import {DashboardDataVisualisation} from './allDashboard/dashboardDataVisualisation/dashboardDataVisualisation';
import {DataVisualisationCompareRubriques} from './allDashboard/dashboardDataVisualisation/componentDashboardDataVisualisation/dataVisualisationCompareRubriques/dataVisualisationCompareRubriques';

import {AddTab} from './addTab/addTab';
import {MainDashboard} from './mainDashboard/mainDashboard';

export const rootRouterConfig: Routes = [
    {
      path: '',
      redirectTo: 'mainDashboard',
      pathMatch: 'full'
    },
    {
      path: 'login/:connect',
      component: Login
    },
    {
      path: 'mainDashboard', component: MainDashboard,
      children: [
        {path: '', component: Dashboard},
        {path: 'dashboard/dashboardDataVisualisation', component: DashboardDataVisualisation},
        {path: 'dashboard/dashboardDataVisualisation/:toFind', component: DashboardDataVisualisation},
        {path: 'dashboard/dashboardDataVisualisation/compareRubrique/:rid', component: DataVisualisationCompareRubriques},
        {path: 'dashboard/dashboardDataVisualisation/:type/:rid', component: DashboardDataVisualisation},


        {path: 'dashboard/:QuiQuoi/:id/:nameDashboard/:lockScreen/:filtres', component: Dashboard,
            /* Attention si on est dans le composant parent (par exemple Dashboard) */
            /* pour aller dans le composant enfant (par exemple AddTab) il faut mettre */
            /* la route du composant parent puis à la suite la routes du composant enfant. */
          children: [
            {path: '', component: AddTab},
            {path: 'addTab/:query/:champCible/:nbPage/:indexElastic/:idSousRubrique/:nameSousRubrique/:nameRubriquesElasticSearch/:nbResult', component: AddTab}
          ]
        }
      ]
  }
];