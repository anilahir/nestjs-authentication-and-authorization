import { BcryptService } from '../../../src/auth/bcrypt.service';

describe('BcryptService', () => {
  let bcryptService: BcryptService;

  beforeEach(() => {
    bcryptService = new BcryptService();
  });

  describe('hash', () => {
    it('should return a hashed string', async () => {
      const data = 'password';

      const result = await bcryptService.hash(data);

      expect(result).not.toBe(data);
      expect(result).toBeDefined();
      expect(result).not.toBeNull();
      expect(typeof result).toBe('string');
    });
  });

  describe('compare', () => {
    it('should return true if the data matches the encrypted string', async () => {
      const data = 'password';
      const encrypted =
        '$2b$10$iUp/PtR8IlnyKFD5ZjP0X.DUg4.zFec3jr/XoMm9/rIXC0dzaRUmS';

      const result = await bcryptService.compare(data, encrypted);

      expect(result).toBe(true);
    });

    it('should return false if the data does not match the encrypted string', async () => {
      const data = 'password';
      const encrypted =
        '$2b$10$iUp/PtR8IlnyKFD5ZjP0X.DUg4.zFec3jr/XoMm9/rIXC0dzaRUmS';

      const result = await bcryptService.compare('wrong-password', encrypted);

      expect(result).toBe(false);
    });
  });
});
