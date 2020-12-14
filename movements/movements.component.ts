import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from './movements';

@Component({
  selector: 'movements',
  templateUrl: './movements.component.html',
  styleUrls: ['./movements.component.scss']
})
export class MovementsComponent {
  public movements: Movement[] = [];
  public selectedMovementsIds: number[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.movements = data.movements;
    this.selectedMovementsIds = (data.selectedMovements || []).map(item => item.m_id);
  }
}
