import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AltudoModel } from 'src/shared/models/AltudoModel';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private SERVER_URL = "http://localhost:56888/api/AltudoProject"
  constructor(private httpClient: HttpClient) { }

  public get(url: string){
    return this.httpClient.get<AltudoModel>(this.SERVER_URL + "?url=" + url);
  }
}
