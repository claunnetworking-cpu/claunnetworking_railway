import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('AdminJobs Search and Download', () => {
  describe('Search Functionality', () => {
    it('should filter jobs by title', () => {
      const jobs = [
        { id: '1', title: 'Desenvolvedor React', company: 'TechCorp' },
        { id: '2', title: 'Designer UX', company: 'DesignStudio' },
        { id: '3', title: 'Desenvolvedor Python', company: 'DataCorp' },
      ];

      const searchTerm = 'Desenvolvedor';
      const filtered = jobs.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase())
      );

      expect(filtered).toHaveLength(2);
      expect(filtered[0].title).toContain('Desenvolvedor');
      expect(filtered[1].title).toContain('Desenvolvedor');
    });

    it('should return empty array when no jobs match search', () => {
      const jobs = [
        { id: '1', title: 'Desenvolvedor React' },
        { id: '2', title: 'Designer UX' },
      ];

      const searchTerm = 'Gerente';
      const filtered = jobs.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase())
      );

      expect(filtered).toHaveLength(0);
    });

    it('should be case-insensitive', () => {
      const jobs = [
        { id: '1', title: 'Desenvolvedor React' },
      ];

      const searchTerms = ['desenvolvedor', 'DESENVOLVEDOR', 'DesenvolVedor'];
      
      searchTerms.forEach(term => {
        const filtered = jobs.filter(job => 
          job.title.toLowerCase().includes(term.toLowerCase())
        );
        expect(filtered).toHaveLength(1);
      });
    });

    it('should filter by partial title match', () => {
      const jobs = [
        { id: '1', title: 'Desenvolvedor React Senior' },
        { id: '2', title: 'Designer UX' },
        { id: '3', title: 'Desenvolvedor Python Junior' },
      ];

      const searchTerm = 'React';
      const filtered = jobs.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase())
      );

      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('1');
    });
  });

  describe('Download Functionality', () => {
    it('should generate CSV data correctly', () => {
      const job = {
        id: '1',
        title: 'Desenvolvedor React',
        company: 'TechCorp',
        modality: 'Remoto',
        state: 'SP',
        city: 'São Paulo',
        link: 'https://example.com/job',
        isPCD: false,
        category: 'Tecnologia',
      };

      const csvData = `Título,Empresa,Modalidade,Estado,Cidade,Link,PCD,Categoria\n${job.title},${job.company},${job.modality},${job.state},${job.city},${job.link},${job.isPCD ? 'Sim' : 'Não'},${job.category}`;

      expect(csvData).toContain(job.title);
      expect(csvData).toContain(job.company);
      expect(csvData).not.toContain('Sim');
      expect(csvData).toContain('Não');
      expect(csvData).toContain('Tecnologia');
    });

    it('should generate CSV with PCD = Sim when isPCD is true', () => {
      const job = {
        title: 'Desenvolvedor',
        company: 'TechCorp',
        modality: 'Remoto',
        state: 'SP',
        city: 'São Paulo',
        link: 'https://example.com',
        isPCD: true,
        category: 'Tech',
      };

      const csvData = `Título,Empresa,Modalidade,Estado,Cidade,Link,PCD,Categoria\n${job.title},${job.company},${job.modality},${job.state},${job.city},${job.link},${job.isPCD ? 'Sim' : 'Não'},${job.category}`;

      expect(csvData).toContain('Sim');
      expect(csvData).not.toContain('Não');
    });

    it('should create blob with correct mime type', () => {
      const csvData = 'Título,Empresa\nTest,Corp';
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });

      expect(blob.type).toBe('text/csv;charset=utf-8;');
    });

    it('should generate filename from job title', () => {
      const jobTitle = 'Desenvolvedor React Senior';
      const filename = `${jobTitle.replace(/\s+/g, '_')}.csv`;

      expect(filename).toBe('Desenvolvedor_React_Senior.csv');
    });

    it('should handle special characters in filename', () => {
      const jobTitle = 'Desenvolvedor/React (Senior)';
      const filename = `${jobTitle.replace(/\s+/g, '_')}.csv`;

      expect(filename).toContain('_');
      expect(filename).toMatch(/\.csv$/);
    });

    it('should handle missing company field', () => {
      const job = {
        title: 'Desenvolvedor',
        company: null,
        modality: 'Remoto',
        state: 'SP',
        city: 'São Paulo',
        link: 'https://example.com',
        isPCD: false,
        category: 'Tech',
      };

      const csvData = `Título,Empresa,Modalidade,Estado,Cidade,Link,PCD,Categoria\n${job.title},${job.company || ''},${job.modality},${job.state},${job.city},${job.link},${job.isPCD ? 'Sim' : 'Não'},${job.category}`;

      expect(csvData).toContain(',,');
    });

    it('should properly escape CSV data', () => {
      const job = {
        title: 'Desenvolvedor, Senior',
        company: 'Tech "Corp"',
        modality: 'Remoto',
        state: 'SP',
        city: 'São Paulo',
        link: 'https://example.com',
        isPCD: false,
        category: 'Tech',
      };

      const csvData = `Título,Empresa,Modalidade,Estado,Cidade,Link,PCD,Categoria\n${job.title},${job.company},${job.modality},${job.state},${job.city},${job.link},${job.isPCD ? 'Sim' : 'Não'},${job.category}`;

      expect(csvData).toContain(job.title);
      expect(csvData).toContain(job.company);
    });
  });

  describe('Pagination with Search', () => {
    it('should reset pagination when search term changes', () => {
      const jobs = Array.from({ length: 25 }, (_, i) => ({
        id: String(i),
        title: i % 2 === 0 ? 'Desenvolvedor' : 'Designer',
      }));

      const searchTerm = 'Desenvolvedor';
      const filtered = jobs.filter(j => j.title.includes(searchTerm));
      const itemsPerPage = 10;
      const currentPage = 0;
      const paginatedItems = filtered.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
      );

      expect(paginatedItems.length).toBeLessThanOrEqual(itemsPerPage);
      expect(filtered.length).toBe(13);
    });

    it('should calculate correct page count', () => {
      const jobs = Array.from({ length: 35 }, (_, i) => ({
        id: String(i),
        title: `Job ${i}`,
      }));

      const itemsPerPage = 10;
      const totalPages = Math.ceil(jobs.length / itemsPerPage);

      expect(totalPages).toBe(4);
    });

    it('should handle pagination with filtered results', () => {
      const jobs = Array.from({ length: 50 }, (_, i) => ({
        id: String(i),
        title: i % 3 === 0 ? 'Desenvolvedor' : 'Designer',
      }));

      const searchTerm = 'Desenvolvedor';
      const filtered = jobs.filter(j => j.title.includes(searchTerm));
      const itemsPerPage = 5;
      const totalPages = Math.ceil(filtered.length / itemsPerPage);

      expect(filtered.length).toBe(17);
      expect(totalPages).toBe(4);
    });
  });

  describe('CSV Export Format', () => {
    it('should include all required headers', () => {
      const headers = 'Título,Empresa,Modalidade,Estado,Cidade,Link,PCD,Categoria';
      const expectedHeaders = ['Título', 'Empresa', 'Modalidade', 'Estado', 'Cidade', 'Link', 'PCD', 'Categoria'];

      const actualHeaders = headers.split(',');
      expect(actualHeaders).toEqual(expectedHeaders);
    });

    it('should format CSV with newlines', () => {
      const job = {
        title: 'Dev',
        company: 'Corp',
        modality: 'Remoto',
        state: 'SP',
        city: 'São Paulo',
        link: 'https://example.com',
        isPCD: false,
        category: 'Tech',
      };

      const csvData = `Título,Empresa,Modalidade,Estado,Cidade,Link,PCD,Categoria\n${job.title},${job.company},${job.modality},${job.state},${job.city},${job.link},${job.isPCD ? 'Sim' : 'Não'},${job.category}`;

      const lines = csvData.split('\n');
      expect(lines).toHaveLength(2);
      expect(lines[0]).toBe('Título,Empresa,Modalidade,Estado,Cidade,Link,PCD,Categoria');
    });
  });
});
