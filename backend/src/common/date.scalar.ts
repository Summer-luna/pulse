import { CustomScalar, Scalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function assertDate(value: unknown): string {
  if (typeof value !== 'string' || !DATE_PATTERN.test(value) || Number.isNaN(Date.parse(value))) {
    throw new TypeError('Date must be a valid YYYY-MM-DD string');
  }
  return value;
}

@Scalar('Date')
export class DateScalar implements CustomScalar<string, string> {
  description = 'Calendar date in YYYY-MM-DD format';

  parseValue(value: unknown): string {
    return assertDate(value);
  }

  serialize(value: unknown): string {
    return assertDate(value);
  }

  parseLiteral(ast: ValueNode): string {
    return assertDate(ast.kind === Kind.STRING ? ast.value : undefined);
  }
}
