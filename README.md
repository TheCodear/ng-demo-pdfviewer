# NgDemo for eonum PSE-2021 PoC

This project is a throw-away prototype used to explore the PoC solution compatibility for the frontend technology.

In order to show the PDF pages, this demo project uses the ng2-pdf-viewer library (for more info see the <a href=link>documentation</a>). Checkout the files `pdf-viewer.component.ts` and `pdf-viewer.component.html` for more details about the concrete implementation.

## Trying out

In order to run it, you need to have a running MedCodeSearch Backend with the PoC code. Then run `ng serve` and navigate to `http://localhost:4200/`. Make sure, that ElasticSearch is also running and that there is data in the database of the backend!

## How the interaction with the BE works

A search term can be entered in the search bar. When clicking on the search button or hitting the enter button, the
app makes a http request to the MCS Backend with the entered search term. Then the backend returns the elasticsearch
results with some context. When clicking on a result, the app issues another request to the backend, in order to get the
base64 encoded page from the database. This base64 string is then directly rendered and the searched term is then also
highlighted on the PDF page.

Some additional buttons allow to navigate from the rendered page to the next / previous pages and also to rotate the page 
if needed.