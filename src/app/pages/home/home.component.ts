import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { RouterLink } from '@angular/router';


export interface Tile {
  imageURL: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-home',
  imports: [MatGridListModule, CommonModule, MatCardModule, MatButtonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  tiles: Tile [] = [
    {text: 'Idegenvezetés', cols: 1, rows: 1, imageURL: 'images/honlap_hermanotto.jpg'},
    {text: 'Őslényes szakkör', cols: 1, rows: 2, imageURL: '/images/oslenyes_szakkor.jpg'},
    {text: 'Növénytár', cols: 2, rows: 3, imageURL: 'images/novenytar.jpg'},
    {text: 'Természetbúvár terem', cols: 3, rows: 1, imageURL: 'images/termeszetbuvar-terem.jpg'}
  ]

}
