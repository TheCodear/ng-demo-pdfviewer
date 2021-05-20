import { PdfViewerService, SearchResult } from './../pdf-viewer.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { PdfViewerComponent } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css']
})
export class PdfComponent implements OnInit {

  // holds the data block for pdf-viewer src attribute
  currPage: any;

  // current page rotation in degrees
  rotation = 0;

  // current page id
  id: any;

  // current highlighted word / term
  highlight = '';

  @ViewChild('pdfViewer') private pdfViewer!: PdfViewerComponent;

  // observable holding the search results from the MCS - BE
  results: Observable<[SearchResult]> | undefined;
  searchForm = this.formBuilder.group({
    searchTerm: ''
  });
  language = new FormControl('de');

  constructor(private searchService: PdfViewerService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
  }

  /*
  * Send Search Request to MCS - Backend.
  */
  onSearch(): void {
      this.results = this.searchService.searchMkb(this.searchForm.value.searchTerm, this.language.value);
  }

  /*
  * Called when clicking on a search results.
  * Gets the page to be rendered as base64 from the
  * MCS-BE and caches some relevant propberties.
  */
  showPdf(id: number, highlight: string): void {
    this.searchService.getBase64Page(id, this.language.value).subscribe(res => {
      this.createPageObj(res.page);
    }, err => {
      this.createPageObj()
    });
    this.id = id;
    this.rotation = 0;
    this.highlight = highlight;
  }

  /*
  * Creates the data object, which is used by the pdf-viewer as src.
  * If no base64 string is given, will render the default page 16 of MKB 2021
  */
  createPageObj(base64?: string): any {
    const block = base64 == null ? this.searchService.getDefaultBase64() :  base64;
    this.currPage = {
      data: atob(block)
    }
  }

  /*
  * Searches the given string in the rendered PDF page. Highlights every occurance of the given string.
  */
  search(stringToSearch: string): any {
    this.pdfViewer.pdfFindController.executeCommand('find', {
      caseSensitive: false, findPrevious: undefined, highlightAll: true, phraseSearch: true, query: stringToSearch
    });
  }

  /*
  * Callback function for pdf-viewer, used to call the search method in order to highlight the searched
  * term in the pdf.
  * Is called, when pdf-viewer has fully rendered the text-layer of the pdf.
  */
  pageRendered(e: CustomEvent) {
    this.search(this.highlight);
  }

  /*
  * Rotates the shown page by 90 degrees.
  */
 rotatePage() {
    if(this.currPage) {
      this.rotation += 90;
    }
  }

  /*
  * Shows the next sequential page, i.e. if page 15 is shown, after nextPage() page 16 is shown.
  * Based on the index used also for the request to the MCS-Backend. Assumption is, that sequential 
  * pages have also sequential ids in the database.
  */
  nextPage(){
    if(this.currPage) {
      this.id = this.id + 1;
      this.showPdf(this.id, this.highlight);
    }
  }

  /*
  * Gets the previous page, similar to nextPage().
  */ 
  lastPage(){
    if(this.currPage) {
      this.id = this.id - 1;
      this.showPdf(this.id, this.highlight);
    }
  }
    
}
