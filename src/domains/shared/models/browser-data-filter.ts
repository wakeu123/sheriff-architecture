import { ColumnFilter } from "./column-filter";

export class BrowserDataFilter {
  private static readonly DEFAULT_PAGE_SIZE: number = 25;
  public static readonly SortBy: string = "SortBy";
  public static readonly SortByAsc: string = "Asc";
  public static readonly SortByDesc: string = "Desc";

  private dataSourceId?: number;
  private subjectId?: number;
  private subjectType?: string;
  private page?: number;
  private pageSize: number;
  private groupId?: number;
  private userId?: number;
  private criteria?: string;
  private orderAsc: boolean;
  private showAll: boolean;
  private allowRowCounting: boolean;
  private clientId?: number;
  private profileId?: number;
  private selectAllRows?: boolean;
  private columnFilters?: ColumnFilter;
  private reportType?: string;
  private published?: boolean;
  private myTasks?: boolean;
  private forModel?: boolean;

  private username?: string;
  private orderById?: boolean;

  constructor() {
    this.orderAsc = true;
    this.showAll = false;
    this.allowRowCounting = true;
    this.pageSize = BrowserDataFilter.DEFAULT_PAGE_SIZE;
  }

  // Getters
  public getDataSourceId(): number | undefined {
    return this.dataSourceId;
  }

  public getSubjectId(): number | undefined {
    return this.subjectId;
  }

  public getSubjectType(): string | undefined {
    return this.subjectType;
  }

  public getPage(): number | undefined {
    return this.page;
  }

  public getPageSize(): number {
    return this.pageSize;
  }

  public getGroupId(): number | undefined {
    return this.groupId;
  }

  public getUserId(): number | undefined {
    return this.userId;
  }

  public getCriteria(): string | undefined {
    return this.criteria;
  }

  public isOrderAsc(): boolean {
    return this.orderAsc;
  }

  public isShowAll(): boolean {
    return this.showAll;
  }

  public isAllowRowCounting(): boolean {
    return this.allowRowCounting;
  }

  public getClientId(): number | undefined {
    return this.clientId;
  }

  public getProfileId(): number | undefined {
    return this.profileId;
  }

  public isSelectAllRows(): boolean | undefined {
    return this.selectAllRows;
  }

  public getColumnFilters(): ColumnFilter | undefined {
    return this.columnFilters;
  }

  public getReportType(): string | undefined {
    return this.reportType;
  }

  public getPublished(): boolean | undefined {
    return this.published;
  }

  public isMyTasks(): boolean | undefined {
    return this.myTasks;
  }

  public getForModel(): boolean | undefined {
    return this.forModel;
  }

  public getUsername(): string | undefined {
    return this.username;
  }

  public isOrderById(): boolean | undefined {
    return this.orderById;
  }

  // Setters
  public setDataSourceId(dataSourceId: number | undefined): void {
    this.dataSourceId = dataSourceId;
  }

  public setSubjectId(subjectId: number | undefined): void {
    this.subjectId = subjectId;
  }

  public setSubjectType(subjectType: string | undefined): void {
    this.subjectType = subjectType;
  }

  public setPage(page: number | undefined): void {
    this.page = page;
  }

  public setPageSize(pageSize: number): void {
    this.pageSize = pageSize;
  }

  public setGroupId(groupId: number | undefined): void {
    this.groupId = groupId;
  }

  public setUserId(userId: number | undefined): void {
    this.userId = userId;
  }

  public setCriteria(criteria: string | undefined): void {
    this.criteria = criteria;
  }

  public setOrderAsc(orderAsc: boolean): void {
    this.orderAsc = orderAsc;
  }

  public setShowAll(showAll: boolean): void {
    this.showAll = showAll;
  }

  public setAllowRowCounting(allowRowCounting: boolean): void {
    this.allowRowCounting = allowRowCounting;
  }

  public setClientId(clientId: number | undefined): void {
    this.clientId = clientId;
  }

  public setProfileId(profileId: number | undefined): void {
    this.profileId = profileId;
  }

  public setSelectAllRows(selectAllRows: boolean | undefined): void {
    this.selectAllRows = selectAllRows;
  }

  public setColumnFilters(columnFilters: ColumnFilter | undefined): void {
    this.columnFilters = columnFilters;
  }

  public setReportType(reportType: string | undefined): void {
    this.reportType = reportType;
  }

  public setPublished(published: boolean | undefined): void {
    this.published = published;
  }

  public setMyTasks(myTasks: boolean | undefined): void {
    this.myTasks = myTasks;
  }

  public setForModel(forModel: boolean | undefined): void {
    this.forModel = forModel;
  }

  public setUsername(username: string | undefined): void {
    this.username = username;
  }

  public setOrderById(orderById: boolean | undefined): void {
    this.orderById = orderById;
  }
}
