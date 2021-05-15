import { PdfViewerService, SearchResult } from './../pdf-viewer.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css']
})
export class PdfViewerComponent implements OnInit {

  currPage: any;

  results: Observable<[SearchResult]> | undefined;
  searchForm = this.formBuilder.group({
    searchTerm: ''
  });

  constructor(private searchService: PdfViewerService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {

  }

  onSearch(): void {
      this.results = this.searchService.searchMkb(this.searchForm.value.searchTerm);
  }

  showPdf(id: number): void {
    this.searchService.getBase64Page(id).subscribe(res => {
      this.createPageObj(res.page)
    }, err => {
      this.createPageObj()
    });
  }

  createPageObj(base64?: string): any {
    console.log(base64)
    const block = base64 == null ? this.searchService.getDefaultBase64() :  base64;
    this.currPage = {
      data: atob(block)
    }
  }

    
}
