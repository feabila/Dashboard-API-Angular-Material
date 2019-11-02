import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { DashboardService } from './dashboard.service';
import { Chart } from 'chart.js';
import io from 'socket.io-client';

// const socket = io('localhost:8080');

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  constructor(private breakpointObserver: BreakpointObserver,
              private service: DashboardService) {}

  idParlamentar: number;
  chart;
  chart2 = [];
  showCharts= false;
  doughnut: any;
  labelsDespesas= [];
  liquidValues= [];
  documentValues= [];

  async consultApi(id: number){
    this.labelsDespesas= [];
    this.liquidValues= [];
    this.documentValues= [];
    try {
      let resp= await this.service.requestApi(id);
      Array(resp['dados']).forEach((n) => {
        n.forEach((value: any) => {
          this.labelsDespesas.push(value.tipoDespesa)
          this.documentValues.push(value.valorDocumento)
          this.liquidValues.push(value.valorLiquido)
        })
      })
      this.getCharts()
      return resp;
    } catch(e){
      return 
    }    
  }

  getCharts(){
    this.chart = new Chart('bar', {
      type: 'bar',
      options: {
        responsive: true,
        title: {
          display: true,
          text: 'Gastos por Tipos de Despesa'
        },
      },
      data: {
        labels: this.labelsDespesas,
        datasets: [
          {
            type: 'bar',
            label: 'Valor Líquido',
            data: this.liquidValues,
            backgroundColor: 'rgba(255,0,255,0.4)',
            borderColor: 'rgba(255,0,255,0.4)',
            fill: false,
          },
          {
            type: 'line',
            label: 'Linha Valor do Documento',
            backgroundColor: 'rgba(0,0,255,0.4)',
            borderColor: 'rgba(0,0,255,0.4)',
            data: this.liquidValues,
            fill: false,
          },
          {
            type: 'bar',
            label: 'Valor do Documento',
            data: this.documentValues,
            backgroundColor: 'rgba(0,0,255,0.4)',
            borderColor: 'rgba(0,0,255,0.4)',
            fill: false,
          }
        ]
      }
    });

    let options = {
      tooltips: false,
      elements: {
        point: {
          borderWidth: function (context) {
            return Math.min(Math.max(1, context.datasetIndex + 1), 8);
          },
          hoverBackgroundColor: '#cccccc',
          hoverBorderColor: function (context) {
            return "red";
          },
          hoverBorderWidth: function (context) {
            var value = context.dataset.data[context.dataIndex];
            return Math.round(8 * value.v / 1000);
          },
          radius: function (context) {
            var value = context.dataset.data[context.dataIndex];
            var size = context.chart.width;
            var base = Math.abs(value.v) / 1000;
            return (size / 24) * base;
          }
        }
      }
    };

    this.doughnut =  new Chart('doughnut',{
      type: 'doughnut',
      options: {
        responsive: true,
        title: {
          display: true,
          text: 'Gastos por Tipos de Despesa'
        },legend: {
          position: 'top',
        },animation: {
          animateScale: true,
          animateRotate: true
        }
      },
      data: {
        datasets: [{
          data: this.liquidValues,
          backgroundColor: ["#1f77b4","#2ca02c","#ff7f0e","#17becf","ocean", "purple", "lightblue"],
          label: 'Dataset 1'
        }],
        labels: this.labelsDespesas
      }
    })

  }
}
