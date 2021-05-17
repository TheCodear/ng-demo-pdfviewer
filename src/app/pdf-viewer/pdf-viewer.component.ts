import { PdfViewerService, SearchResult } from './../pdf-viewer.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { PdfViewerComponent } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css']
})
export class PdfComponent implements OnInit {

  currPage: any;
  @ViewChild('pdfViewer') private pdfViewer!: PdfViewerComponent;

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

  search(stringToSearch: string): any {
    this.pdfViewer.pdfFindController.executeCommand('find', {
      caseSensitive: false, findPrevious: undefined, highlightAll: true, phraseSearch: true, query: stringToSearch
    });
  }

  pageRendered(e: CustomEvent) {
    this.search(this.searchForm.value.searchTerm);
  }

    
}
