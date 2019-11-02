import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) {}
  
  async requestApi(idParlamentar){
    let jsonResp;
    if(idParlamentar != null){
      const api= `https://dadosabertos.camara.leg.br/api/v2/deputados/${idParlamentar}/despesas?ordem=ASC&ordenarPor=ano`
      const response = await fetch(api)
      const result = await response.json();
      jsonResp= JSON.parse(JSON.stringify(result))
    }
    return jsonResp
  }

}
