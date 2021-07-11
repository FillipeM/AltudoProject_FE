import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { AltudoModel } from 'src/shared/models/AltudoModel';
import { ApiService } from '../api.service';
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.css']
})
export class ImageListComponent implements OnInit {

  waiting = false;
  apiService: ApiService;
  urlFormControl = new FormControl('', [Validators.required])
  images = [];
  public pieChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };

  public chartColors: any[] = [
    {
      backgroundColor: ["#003366", "#006666", "#669999", "#00ccff", "#99ff99", "#ffff66", "#ffb3b3", "#cc99ff", "#e0e0d1", "#b3b3ff"]
    }];

  public pieChartLabels: Label[] = [];
  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];


  constructor(apiService: ApiService) {
    this.apiService = apiService;
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  ngOnInit(): void {
  }

  processaUrl() {
    this.waiting = true;
    this.clear();
    this.apiService.get(this.urlFormControl.value).subscribe((data) => {
      console.log(data);
      this.images = data.imageList;
      this.waiting = false;
      data.wordsRanking.forEach(f=>{
        this.pieChartLabels.push(f.word);
        this.pieChartData.push(f.timesAppears);
      })
    }, errors => {
      console.log(errors);
      this.waiting = false;
    })
  }

  clear(){
    this.images =[];
    this.pieChartData = [];
    this.pieChartLabels = [];
  }

  matcher = new MyErrorStateMatcher();

}
