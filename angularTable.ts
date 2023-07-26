import { Component, HostListener, ElementRef, AfterViewInit, ViewChildren, QueryList } from '@angular/core';

@Component({
  selector: 'app-my-component',
  templateUrl: './my-component.component.html',
  styleUrls: ['./my-component.component.css']
})
export class MyComponent implements AfterViewInit {
  @ViewChildren('myTable') rows: QueryList<ElementRef>;

  groupCount = 0;

  ngAfterViewInit() {
    this.rows.changes.subscribe((comps: QueryList<ElementRef>) => {
      comps.toArray().forEach((comp: ElementRef) => {
        const td = comp.nativeElement.children[0];
        if (td.hasAttribute('rowspan')) {
          const rowspan = parseInt(td.getAttribute('rowspan'), 10);
          comp.nativeElement.setAttribute('data-group', this.groupCount);
          let nextRow = comp.nativeElement.nextElementSibling;
          for (let i = 1; i < rowspan; i++) {
            nextRow.setAttribute('data-group', this.groupCount);
            nextRow = nextRow.nextElementSibling;
          }
          this.groupCount++;
        }
      });
    });
  }

  @HostListener('mouseover', ['$event'])
  onMouseOver(event) {
    if (event.target.tagName === 'TD') {
      const group = event.target.parentElement.getAttribute('data-group');
      const groupedRows = this.el.nativeElement.querySelectorAll(`tr[data-group="${group}"]`);
      groupedRows.forEach(row => {
        row.classList.add('hovered');
      });
    }
  }

  @HostListener('mouseout', ['$event'])
  onMouseOut(event) {
    if (event.target.tagName === 'TD') {
      const group = event.target.parentElement.getAttribute('data-group');
      const groupedRows = this.el.nativeElement.querySelectorAll(`tr[data-group="${group}"]`);
      groupedRows.forEach(row => {
        row.classList.remove('hovered');
      });
    }
  }
}
