import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class HolidayResponseDto {
  @ApiProperty({
    description: 'Holiday identifier.',
    example: 'independence-day-2026',
  })
  id!: string;

  @ApiProperty({
    description: 'Holiday name.',
    example: 'Independence Day',
  })
  name!: string;

  @ApiProperty({
    description: 'Holiday date.',
    type: String,
    format: 'date',
    example: '2026-08-15',
  })
  date!: Date;

  @ApiProperty({
    description: 'Country ISO 3166-1 alpha-2 code.',
    example: 'IN',
  })
  country!: string;

  @ApiProperty({
    description: 'Holiday type.',
    example: 'PUBLIC',
  })
  type!: string;

  @ApiProperty({
    description: 'Whether this is an all-day holiday.',
    example: true,
  })
  allDay!: boolean;

  @ApiPropertyOptional({
    description: 'Localized holiday name.',
    example: 'स्वतंत्रता दिवस',
  })
  localName?: string;

  @ApiPropertyOptional({
    description: 'Holiday description.',
    example: "National holiday celebrating India's independence.",
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Additional provider metadata.',
    example: {
      provider: 'Nager.Date',
      global: true,
      launchYear: 1947,
    },
  })
  metadata?: Record<string, unknown>;
}
