import { AfterViewInit, ChangeDetectorRef,
  ContentChildren, Directive, ElementRef,
  OnChanges, OnInit, QueryList, Renderer2, SimpleChanges,
  OnDestroy,
  input,
  output,
  signal,
  inject
} from '@angular/core';
import { ColumnFilter } from '../models/column-filter';

@Directive({
  selector: '[appDynamicTable]',
})
export class DynamicTableDirective<T> implements AfterViewInit, OnChanges, OnInit, OnDestroy {

  items = input.required<T[]>();
  selectable = input<boolean>(false);
  headers = input.required<string[]>();
  headerBackgroundColor = input<string>('');
  columnTypes = input<Record<string, string>>({});

  selectedItemEvent = output<T | null>();
  selectedItemsEvent = output<T[] | []>();
  filtered = output<Record<string, ColumnFilter>>();
  sorted = output<{ column: string, direction: 'asc' | 'desc'}>();

  private readonly renderer2 = inject(Renderer2);
  private readonly elementRef = inject(ElementRef);
  private readonly cdr = inject(ChangeDetectorRef);

  selectedItems: T[] = [];
  selectedItem: T | null = null;
  sortColumn = signal<string>('');
  filters: Record<string, ColumnFilter> = {};
  sortDirection = signal<'asc' | 'desc'>('asc');

  isInit = signal<boolean>(false);
  table = signal<HTMLTableElement | undefined>(undefined);
  thead = signal<HTMLTableSectionElement | undefined>(undefined);
  tbody = signal<HTMLTableSectionElement | undefined>(undefined);
  filterRow = signal<HTMLTableRowElement | undefined>(undefined);
  selectedRow = signal<HTMLTableRowElement | undefined>(undefined);

  ngOnChanges(changes: SimpleChanges): void {
    if(this.isInit() && (changes['items'] || changes['headers'])) {

    }
  }

  ngOnInit(): void {
    const css = `
      width: 100%;
      font-size: 13px;
      border-collapse: collapse;
      border: ${ this.headerBackgroundColor() ? ('1px solid ').concat(this.headerBackgroundColor()) : '1px solid #b3b4b6'}
    `;
    this.renderer2.setAttribute(this.elementRef.nativeElement, 'style', css);
  }

  ngAfterViewInit(): void {
    console.log('OnAfterViewInit');
  }

  private buildTable(): void {

  }

  private buildHeader(): void {
    if(this.table()) {
      this.thead.set(this.table()?.createTHead());
      const headerRow = this.thead()?.insertRow();

      this.headers().forEach(header => {
        const th = this.renderer2.createElement('th');

        // Conteneur pour le titre et les indicateurs de tri
        const headerContainer = this.renderer2.createElement('div');
        this.renderer2.setStyle(headerContainer, 'display', 'flex');
        this.renderer2.setStyle(headerContainer, 'align-items', 'center');
        this.renderer2.setStyle(headerContainer, 'justify-content', 'space-between');

        // Titre de la colonne
        const titleSpan = this.renderer2.createElement('span');
        const titleText = this.renderer2.createElement(header);
        this.renderer2.appendChild(titleSpan, titleText);
        this.renderer2.appendChild(headerContainer, titleSpan);

        // Indicateur de tri
        const sortContainer = this.renderer2.createElement('div');
        this.renderer2.setStyle(sortContainer, 'display', 'flex');
        this.renderer2.setStyle(sortContainer, 'flex-direction', 'column');
        this.renderer2.setStyle(sortContainer, 'margin-left', '8px');

        // Fleche ascendante
        const ascArrow = this.renderer2.createElement('span');
        this.renderer2.setProperty(ascArrow, 'innerHTML', '↑');
        this.renderer2.setStyle(ascArrow, 'font-size', '10px');
        this.renderer2.setStyle(ascArrow, 'color', this.sortColumn() === header && this.sortDirection() === 'asc' ? '#000' : '#ccc');
        this.renderer2.setStyle(ascArrow, 'cursor', 'pointer');

        // Flèche descendante
        const descArrow = this.renderer2.createElement('span');
        this.renderer2.setProperty(descArrow, 'innerHTML', '↓');
        this.renderer2.setStyle(descArrow, 'font-size', '10px');
        this.renderer2.setStyle(descArrow, 'color', this.sortColumn() === header && this.sortDirection() === 'desc' ? '#000' : '#ccc');
        this.renderer2.setStyle(descArrow, 'cursor', 'pointer');

        this.renderer2.appendChild(sortContainer, ascArrow);
        this.renderer2.appendChild(sortContainer, descArrow);
        this.renderer2.appendChild(headerContainer, sortContainer);
        this.renderer2.appendChild(th, headerContainer);

        // Styles pour l'en-tête
        const css = `
          border: 1px solid #a4a4a4;
          background-color: #3a434c;
          color: #ffffff;
          font-weight: 600;
          text-align: left;
          padding: 4px 8px;
          cursor: pointer;
        `;
        this.renderer2.setAttribute(th, 'style', css);

        // Gestionnaire d'événements pour le tri
        this.renderer2.listen(th, 'click', (event) => {
          this.sortColumn.set(header);
          if(this.sortColumn() === header && this.sortDirection() === 'asc') {
            this.sortDirection.set('desc')
          } else { this.sortDirection.set('asc'); }

          // Mettre à jour les couleurs des flèches
          this.renderer2.setStyle(ascArrow, 'color', this.sortColumn() === header && this.sortDirection() === 'asc' ? '#000' : '#ccc');
          this.renderer2.setStyle(descArrow, 'color', this.sortColumn() === header && this.sortDirection() === 'desc' ? '#000' : '#ccc');

          this.sorted.emit({ column: header, direction: this.sortDirection() });
        });

        this.renderer2.appendChild(headerRow, th);
      });
    }
  }

  private buildFilterRow(): void {
    if (this.thead()) {
      this.filterRow.set(this.thead()?.insertRow());

      this.headers().forEach(header => {
        const td = this.renderer2.createElement('td');

        // Déterminer le type de filtre en fonction du type de colonne
        const columnType = this.columnTypes[header] || 'text';
        const filterOptions = columnType === 'number' ? NUMBER_FILTERS : TEXT_FILTERS;

        // Créer le select pour le type de filtre
        const select = this.renderer2.createElement('select');
        filterOptions.forEach(option => {
          const opt = this.renderer2.createElement('option');
          this.renderer2.setProperty(opt, 'value', option.value);
          this.renderer2.setProperty(opt, 'textContent', option.label);
          this.renderer2.appendChild(select, opt);
        });

        // Créer l'input pour la valeur du filtre
        const input = this.renderer2.createElement('input');
        this.renderer2.setAttribute(input, 'type', columnType === 'number' ? 'number' : 'text');
        this.renderer2.setAttribute(input, 'placeholder', 'Filtrer...');

        // Conteneur pour les éléments de filtre
        const filterContainer = this.renderer2.createElement('div');
        this.renderer2.setStyle(filterContainer, 'display', 'flex');
        this.renderer2.setStyle(filterContainer, 'flex-direction', 'column');
        this.renderer2.setStyle(filterContainer, 'gap', '4px');

        this.renderer2.appendChild(filterContainer, select);
        this.renderer2.appendChild(filterContainer, input);
        this.renderer2.appendChild(td, filterContainer);

        // Styles pour la cellule de filtre
        const css = `
          padding: 4px;
          border: 1px solid #a4a4a4;
          background-color: #f0f0f0;
        `;
        this.renderer2.setAttribute(td, 'style', css);

        // Gestionnaire d'événements pour le filtrage
        this.renderer2.listen(select, 'change', () => this.applyFilter(header, select.value, input.value));
        this.renderer2.listen(input, 'input', () => this.applyFilter(header, select.value, input.value));

        this.renderer2.appendChild(this.filterRow, td);
      });
    }
  }

  applyFilter(column: string, filterType: string, filterValue: unknown) {
    if (filterValue) {
      this.filters[column] = { type: filterType, value: filterValue };
    } else {
      delete this.filters[column];
    }
    this.filtered.emit(this.filters);
  }

  buildBody() {
    if (this.table()) {
      this.tbody.set(this.table()?.createTBody());

      this.items().forEach(item => {
        if (this.tbody) {
          const row = this.tbody()?.insertRow();

          if (this.selectable()) {
            this.renderer2.listen(row, 'click', () => {
              if (this.selectedItem === item) {
                this.selectedItem = null;
                this.selectedItemEvent.emit(null);
                this.renderer2.removeClass(row, "active-row");
              } else {
                if (this.selectedRow) {
                  this.renderer2.removeClass(this.selectedRow, "active-row");
                }
                this.selectedItem = item;
                this.selectedItemEvent.emit(item);
                this.renderer2.addClass(row, "active-row");
                this.selectedRow = row;
              }
            });
          }

          this.headers().forEach(header => {
            const cell = row.insertCell();

            this.cellDefs.forEach(cellDef => {
              if (cellDef.columnName === header) {
                cellDef.cellDefTemplate.createElement(item);
                if (cellDef.cellDefTemplateElementRef.nativeElement) {
                  this.renderer2.appendChild(cell, cellDef.cellDefTemplateElementRef.nativeElement);
                }
              }
            });

            // Styles pour les cellules
            const css = `
              padding: 4px 8px;
              border: 1px solid #a4a4a4;
              background-color: #ffffff;
              color: #000000;
              text-align: left;
              font-weight: 500;
            `;
            this.renderer2.setAttribute(cell, 'style', css);
          });
        }
      });
    }
  }

  ngOnDestroy(): void {
    console.log('OnDestroy');
  }
}
