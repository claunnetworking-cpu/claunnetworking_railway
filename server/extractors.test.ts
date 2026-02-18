import { describe, it, expect, vi } from 'vitest';
import { extractJobData, extractCourseData } from './extractors';
import axios from 'axios';

// Mock axios
vi.mock('axios');

describe('HTML Extractors', () => {
  describe('extractJobData', () => {
    it('should extract job data from Gupy URL', async () => {
      const mockHtml = `
        <html>
          <h1>Auxiliar de RH</h1>
          <span data-testid="company-name">Coco Bambu</span>
          <span data-testid="job-location">Uberlândia, MG</span>
          <span>Remoto</span>
        </html>
      `;

      vi.mocked(axios.get).mockResolvedValue({ data: mockHtml });

      const result = await extractJobData('https://cocobambu.gupy.io/job/test');

      expect(result).toBeDefined();
      expect(result.link).toBe('https://cocobambu.gupy.io/job/test');
      expect(result.modality).toBeDefined();
    });

    it('should handle extraction errors gracefully', async () => {
      vi.mocked(axios.get).mockRejectedValue(new Error('Network error'));

      await expect(extractJobData('https://invalid-url.com')).rejects.toThrow(
        'Não foi possível extrair dados do link fornecido'
      );
    });
  });

  describe('extractCourseData', () => {
    it('should extract course data from EV.org.br URL', async () => {
      const mockHtml = `
        <html>
          <h1>Microsoft Office 365</h1>
          <span>40h</span>
          <span>Online</span>
          <span>Grátis</span>
        </html>
      `;

      vi.mocked(axios.get).mockResolvedValue({ data: mockHtml });

      const result = await extractCourseData('https://www.ev.org.br/cursos/test');

      expect(result).toBeDefined();
      expect(result.link).toBe('https://www.ev.org.br/cursos/test');
      expect(result.institution).toBe('EV.org.br');
    });

    it('should handle extraction errors gracefully', async () => {
      vi.mocked(axios.get).mockRejectedValue(new Error('Network error'));

      await expect(extractCourseData('https://invalid-url.com')).rejects.toThrow(
        'Não foi possível extrair dados do link fornecido'
      );
    });
  });
});
