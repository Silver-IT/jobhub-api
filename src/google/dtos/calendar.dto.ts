import { ApiProperty } from '@nestjs/swagger';

export class CalendarDto {

  @ApiProperty()
  id: string;

  @ApiProperty()
  summary: string;

  @ApiProperty()
  timeZone: string;

  @ApiProperty()
  backgroundColor: string;

  @ApiProperty()
  foregroundColor: string;

  constructor(
    id: string,
    summary: string,
    timeZone: string,
    backgroundColor: string,
    foregroundColor: string,
  ) {
    this.id = id;
    this.summary = summary;
    this.timeZone = timeZone;
    this.backgroundColor = backgroundColor;
    this.foregroundColor = foregroundColor;
  }
}
