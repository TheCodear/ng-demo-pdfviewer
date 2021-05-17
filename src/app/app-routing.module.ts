import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PdfComponent } from './pdf-viewer/pdf-viewer.component';

const routes: Routes = [
  { path: 'pdf', component: PdfComponent},
  { path: '',   redirectTo: '/pdf', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
