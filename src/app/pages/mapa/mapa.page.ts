import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
declare var mapboxgl:any;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit , AfterViewInit{
  lat:number;
  lng:number;
  constructor(private router:ActivatedRoute) { }

  ngOnInit() {
    let geo = this.router.snapshot.paramMap.get('geo') || ''
    geo=geo.substring(4);
    let coordenadas=geo.split(',');
    this.lat=Number(coordenadas[0]);
    this.lng=Number(coordenadas[1]);
    console.log(this.lat,this.lng)
  }
  ngAfterViewInit(){
      mapboxgl.accessToken='pk.eyJ1Ijoia2xlcml0aCIsImEiOiJja3hramV20WIwbjEwMzFwYzJlZWl6N2g5In0.iKXPpYvo7UPRiiZ-x_lCrw'
      const map= new mapboxgl.Map({
        container:'map',
        style:'mapbox://styles/mapbox/streets-v11'
      })
  }

}
