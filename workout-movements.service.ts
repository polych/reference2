import { Injectable } from '@angular/core';
import { first } from 'rxjs/internal/operators/first';
import { tap } from 'rxjs/internal/operators/tap';
import { CalendarStaticStorageService } from '../../../../calendar-static-storage.service';

@Injectable({
  providedIn: 'root',
})
export class WorkoutMovementsService {
  private movementsByTitle = new Map<string, Movement>();
  private allMovements: string[] = [];

  constructor(private storage: CalendarStaticStorageService) {
    this.init();
  }

  public parseRow(row: string): string[] {
    const movements: string[] = [];
    let done = false;
    let textForParse: string = row.toLowerCase();

    while (!done && textForParse.length !== 0) {
      let parsedMovements = this.findAllMovements(textForParse);

      parsedMovements = parsedMovements.filter(movement => {
        const regExp = new RegExp(`^\\s*${movement}`);

        return textForParse.search(regExp) !== -1;
      });

      parsedMovements.sort(this.sortMovementsByLength);

      if (parsedMovements.length) {
        const parsedMovement = parsedMovements[0];
        textForParse = textForParse.replace(parsedMovement.toLowerCase(), '');
        movements.push(parsedMovement);
      } else {
        done = true;
      }
    }

    return movements;
  }

  public parseText(text: string): Movement[] {
    const parsedMovements = new Set();
    const result = [];
    const rows = text.split('\n');

    rows.forEach(row => {
      const foundMovements = this.findAllMovements(row);

      if (foundMovements.length) {
        parsedMovements.add(foundMovements[0]);
      }

      return parsedMovements;
    });

    parsedMovements.forEach((item: any) => {
      const movement = this.movementsByTitle.get(item);

      result.push(movement);
    });

    return result;
  }

  public mergeMovements(movementsOld: Movement[], movementsNew: Movement[]): Movement[] {
    const ids = new Set();

    return movementsOld
      .concat(movementsNew)
      .filter(item => {
        const has = !ids.has(item.m_id);
        ids.add(item.m_id);

        return has;
      });
  }

  private init(): void {
    this.storage.init$.pipe(
      first(),
      tap(() => {
        this.storage.movements.forEach(item => {
          this.movementsByTitle.set(item.movement.toLowerCase(), item);
        });
        this.allMovements = Array.from(this.movementsByTitle.keys());
      }),
    )
      .subscribe();
  }

  private sortMovementsByLength(item1: string, item2: string): number {
    return Math.sign(item2.length - item1.length);
  }

  private findAllMovements(text: string): string[] {
    const foundMovements = [];

    this.allMovements.forEach(movement => {
      if (text.toLowerCase().includes(movement)) {
        foundMovements.push(movement);
      }
    });

    foundMovements.sort(this.sortMovementsByLength);

    return foundMovements;
  }
}
