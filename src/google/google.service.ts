import { HttpService, Injectable } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { CalendarDto } from './dtos/calendar.dto';
import { AddCalendarEventDto } from './dtos/add-calendar-event.dto';
import { SuccessResponse } from '../common/models/success-response';

@Injectable()
export class GoogleService {

  static GoogleCalendarApi = 'https://www.googleapis.com/calendar/v3';

  constructor(
    private readonly http: HttpService
  ) {
  }

  getCalendars(token: string): Observable<CalendarDto[]> {
    return this.http.get(`${GoogleService.GoogleCalendarApi}/users/me/calendarList`, {headers: {
      'Authorization': `Bearer ${token}`
    }}).pipe(
      map((res: any) => {
        if (res && res.data && res.data.items) {
          const calendars = res.data.items.filter(item => item.accessRole === 'owner');
          return calendars.map(x => new CalendarDto(x.id, x.summary, x.timeZone, x.backgroundColor, x.foregroundColor));
        } else {
          throwError(res);
        }
      })
    );
  }

  addEventToCalendar(token: string, calendarId: string, event: AddCalendarEventDto): Observable<SuccessResponse> {
    const payload = {
      start: {dateTime: event.start},
      end: {dateTime: event.end},
      summary: event.summary,
      description: event.description
    };
    return this.http.post(`${GoogleService.GoogleCalendarApi}/calendars/${calendarId}/events`, payload, {headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      map(() => new SuccessResponse(true))
    );
  }
}
