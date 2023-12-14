import { Routes } from '@angular/router';
import { KitchenSinkComponent } from './pages/dev/kitchen-sink/kitchen-sink.component';
import { PocComponent } from './pages/dev/poc/poc.component';
import { LandingPageComponent } from './pages/client/landing-page/landing-page.component';
import { NotFoundComponent } from './pages/general/not-found/not-found.component';

export const routes: Routes = [
    // { path: 'dev/kitchen-sink', component: KitchenSinkComponent },
    // { path: 'dev/poc', component: PocComponent },
    // { path: '', component: LandingPageComponent },
    // { path: '**', component: NotFoundComponent }
    { path: '**', component: LandingPageComponent }
];
