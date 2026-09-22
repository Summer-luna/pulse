import { DefaultNamingStrategy } from 'typeorm';

function toSnakeCase(value: string): string {
  return value.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
}

export class SnakeNamingStrategy extends DefaultNamingStrategy {
  override columnName(propertyName: string, customName: string, embeddedPrefixes: string[]): string {
    return toSnakeCase(super.columnName(propertyName, customName, embeddedPrefixes));
  }
}
