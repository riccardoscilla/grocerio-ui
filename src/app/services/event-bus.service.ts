import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { AppEvent } from './app-event';

@Injectable({ 
  providedIn: 'root' 
})
export class EventBusService {
  private subject = new Subject<AppEvent>();

  emit<E extends AppEvent>(event: E): void {
    this.subject.next(event);
  }

  on<T extends AppEvent['type']>(
    type: T
  ): Observable<Extract<AppEvent, { type: T }>['payload']> {
    return this.subject.asObservable().pipe(
      filter((event): event is Extract<AppEvent, { type: T }> => event.type === type),
      map(event => 'payload' in event ? event.payload : undefined as any)
    );
  }
}
