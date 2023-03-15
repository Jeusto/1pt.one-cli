import { shortIdentifierIsValid } from './utils';
import { expect, describe, it } from '@jest/globals';

describe('shortIdentifierIsValid', () => {
  it('should return false if the id is less than 3 characters', () => {
    expect(shortIdentifierIsValid('ab')).toBe(false);
  });
  it('should return true if the id is more than 3 characters', () => {
    expect(shortIdentifierIsValid('abc')).toBe(true);
  });
});
