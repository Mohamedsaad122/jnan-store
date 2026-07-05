import { describe, it, expect } from 'vitest';
import { formatCurrency } from './currency';
import { ApiError, ValidationError } from './errors';
import { storage, secureStorage } from './storage';
import { hasPermission, hasRole } from './permissions';
import { isValidEmail, isValidSaudiPhone } from './validators';
import { UserRole } from '@/constants/roles';

describe('Utility Functions', () => {
  describe('currency formatCurrency', () => {
    it('formats currency correctly in Arabic (ar-SA)', () => {
      const result = formatCurrency(120.5, 'ar');
      // Arabic output might contain non-breaking spaces, or Arabic characters
      expect(result).toContain('ر.س');
    });

    it('formats currency correctly in English (en-US)', () => {
      const result = formatCurrency(120.5, 'en');
      expect(result).toBe('SAR 120.50');
    });
  });

  describe('errors ApiError', () => {
    it('instantiates custom ApiError parameters correctly', () => {
      const error = new ApiError('Not Found', 404);
      expect(error.message).toBe('Not Found');
      expect(error.status).toBe(404);
      expect(error.name).toBe('ApiError');
    });

    it('instantiates ValidationError validation fields', () => {
      const validationFields = { email: ['invalid email'] };
      const error = new ValidationError('Bad Payload', validationFields);
      expect(error.status).toBe(400);
      expect(error.errors).toEqual(validationFields);
    });
  });

  describe('storage LocalStorage helper', () => {
    it('serializes and stores data in storage', () => {
      storage.set('test_key', { a: 1 });
      const retrieved = storage.get<{ a: number }>('test_key');
      expect(retrieved).toEqual({ a: 1 });

      storage.remove('test_key');
      expect(storage.get('test_key')).toBeNull();
    });

    it('encrypts values safely in secureStorage', () => {
      secureStorage.set('token_key', 'mySecretValue');

      // Plain localstorage should show encrypted base64 string
      const rawInLocalStorage = localStorage.getItem('jnan_sec_token_key');
      expect(rawInLocalStorage).not.toBe('mySecretValue');

      const decrypted = secureStorage.get<string>('token_key');
      expect(decrypted).toBe('mySecretValue');
    });
  });

  describe('permissions hasPermission / hasRole', () => {
    it('validates user permissions by role mapping correctly', () => {
      expect(hasPermission('admin' as UserRole, 'access:dashboard')).toBe(true);
      expect(hasPermission('user' as UserRole, 'access:dashboard')).toBe(false);
    });

    it('validates roles matching criteria correctly', () => {
      expect(hasRole('merchant' as UserRole, ['admin', 'merchant'])).toBe(true);
      expect(hasRole('user' as UserRole, ['admin', 'merchant'])).toBe(false);
    });
  });

  describe('validators isValidEmail / isValidSaudiPhone', () => {
    it('validates email pattern correctly', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('invalid-email')).toBe(false);
    });

    it('validates Saudi mobile numbers correctly', () => {
      expect(isValidSaudiPhone('0501234567')).toBe(true);
      expect(isValidSaudiPhone('+966501234567')).toBe(true);
      expect(isValidSaudiPhone('501234567')).toBe(true);
      expect(isValidSaudiPhone('1234567890')).toBe(false);
    });
  });
});
