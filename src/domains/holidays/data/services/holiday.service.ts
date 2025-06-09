import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Holiday } from "../models/holiday.model";

@Injectable()
export class HolidayService {

  private readonly http = inject(HttpClient);

  protected load(): Observable<Holiday[]> {
    return this.http.get<Holiday[]>('holidays');
  }
}
