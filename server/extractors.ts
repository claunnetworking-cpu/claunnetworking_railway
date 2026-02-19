import axios from 'axios';
import * as cheerio from 'cheerio';
import { invokeLLM } from './_core/llm';

export interface ExtractedJob {
  title: string;
  company: string;
  description?: string;
  link: string;
  city?: string;
  state?: string;
  modality?: 'Presencial' | 'Remoto' | 'Híbrido';
  isPCD?: boolean;
  category?: string;
}

export interface ExtractedCourse {
  title: string;
  institution: string;
  description?: string;
  link: string;
  duration?: string;
  modality?: 'Online' | 'Presencial' | 'Híbrido';
  isFree?: boolean;
}

/**
 * Extract job data from Gupy job board
 */
async function extractFromGupy(url: string): Promise<ExtractedJob> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);
    
    // Get all text content from the page
    const pageText = $.text();
    const htmlContent = response.data.substring(0, 8000); // Limit to first 8KB for LLM

    // Use LLM to extract structured data
    const extractionPrompt = `
    Você é um assistente especializado em extrair informações de páginas de vagas de emprego.
    
    Analise o seguinte conteúdo HTML/texto de uma página de vaga e extraia:
    1. Título da vaga (job title)
    2. Nome da empresa
    3. Descrição breve (primeiros 200 caracteres)
    4. Cidade
    5. Estado (sigla de 2 letras, ex: SP, RJ)
    6. Modalidade (Presencial, Remoto ou Híbrido)
    7. Se é vaga PCD (sim/não)
    8. Categoria (ex: Tecnologia, Vendas, Administrativo, etc)
    
    Retorne APENAS um JSON válido, sem markdown, sem explicações:
    {
      "title": "...",
      "company": "...",
      "description": "...",
      "city": "...",
      "state": "...",
      "modality": "Presencial|Remoto|Híbrido",
      "isPCD": true|false,
      "category": "..."
    }
    
    Conteúdo da página:
    ${htmlContent}
    `;

    try {
      const response = await invokeLLM({
        messages: [
          {
            role: 'system',
            content: 'Você é um assistente especializado em extrair dados estruturados de páginas de vagas. Sempre retorne JSON válido.'
          },
          {
            role: 'user',
            content: extractionPrompt
          }
        ]
      });

      const content = response.choices[0]?.message?.content || '';
      const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
      const jsonMatch = contentStr.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        try {
          const extracted = JSON.parse(jsonMatch[0]);
          return {
            title: extracted.title || 'Vaga sem título',
            company: extracted.company || 'Empresa não identificada',
            description: extracted.description || '',
            link: url,
            city: extracted.city || '',
            state: extracted.state || '',
            modality: extracted.modality || 'Presencial',
            isPCD: !!extracted.isPCD,
            category: extracted.category || 'operacional',
          };
        } catch (parseError) {
          console.warn('Failed to parse LLM JSON response:', parseError);
        }
      }
    } catch (llmError) {
      console.warn('LLM extraction failed, falling back to regex:', llmError);
    }

    // Fallback: Regex-based extraction
    const titleMatch = pageText.match(/(?:Vaga|Posição|Cargo)[\s:]*([^\n]+)/i);
    const companyMatch = pageText.match(/(?:Empresa|Contratante)[\s:]*([^\n]+)/i);
    const locationMatch = pageText.match(/(?:Local|Localização|Cidade)[\s:]*([^,\n]+),?\s*([A-Z]{2})?/i);

    return {
      title: titleMatch?.[1]?.trim() || 'Vaga sem título',
      company: companyMatch?.[1]?.trim() || 'Empresa não identificada',
      description: pageText.substring(0, 300),
      link: url,
      city: locationMatch?.[1]?.trim() || '',
      state: locationMatch?.[2]?.trim() || '',
      modality: pageText.toLowerCase().includes('remoto') ? 'Remoto' : 
                pageText.toLowerCase().includes('híbrido') ? 'Híbrido' : 'Presencial',
      isPCD: pageText.toLowerCase().includes('pcd'),
      category: 'operacional',
    };
  } catch (error) {
    console.error('Error extracting from Gupy:', error);
    throw new Error('Não foi possível extrair dados do link fornecido');
  }
}

/**
 * Extract course data from EV.org.br
 */
async function extractFromEV(url: string): Promise<ExtractedCourse> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);
    
    // Get all text content from the page
    const pageText = $.text();
    const htmlContent = response.data.substring(0, 8000); // Limit to first 8KB for LLM

    // Use LLM to extract structured data
    const extractionPrompt = `
    Você é um assistente especializado em extrair informações de páginas de cursos online.
    
    Analise o seguinte conteúdo HTML/texto de uma página de curso e extraia:
    1. Título do curso
    2. Instituição/Plataforma (ex: EV.org.br, Udemy, etc)
    3. Descrição breve (primeiros 200 caracteres)
    4. Duração (ex: "4 horas", "2 semanas", etc)
    5. Modalidade (Online, Presencial ou Híbrido)
    6. Se é grátis (sim/não)
    7. Categoria (ex: Tecnologia, Negócios, Idiomas, etc)
    
    Retorne APENAS um JSON válido, sem markdown, sem explicações:
    {
      "title": "...",
      "institution": "...",
      "description": "...",
      "duration": "...",
      "modality": "Online|Presencial|Híbrido",
      "isFree": true|false,
      "category": "..."
    }
    
    Conteúdo da página:
    ${htmlContent}
    `;

    try {
      const response = await invokeLLM({
        messages: [
          {
            role: 'system',
            content: 'Você é um assistente especializado em extrair dados estruturados de páginas de cursos. Sempre retorne JSON válido.'
          },
          {
            role: 'user',
            content: extractionPrompt
          }
        ]
      });

      const content = response.choices[0]?.message?.content || '';
      const contentStr = typeof content === 'string' ? content : '';
      const jsonMatch = contentStr.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const extracted = JSON.parse(jsonMatch[0]);
        return {
          title: extracted.title || 'Curso sem título',
          institution: extracted.institution || 'EV.org.br',
          description: extracted.description || '',
          link: url,
          duration: extracted.duration || '',
          modality: extracted.modality || 'Online',
          isFree: extracted.isFree !== false,
        };
      }
    } catch (llmError) {
      console.warn('LLM extraction failed, falling back to regex:', llmError);
    }

    // Fallback: Regex-based extraction
    const titleMatch = pageText.match(/(?:Curso|Treinamento)[\s:]*([^\n]+)/i);
    const durationMatch = pageText.match(/(\d+\s*(?:horas?|semanas?|dias?|meses?))/i);
    const isFree = pageText.toLowerCase().includes('grátis') || 
                   pageText.toLowerCase().includes('gratuito');

    return {
      title: titleMatch?.[1]?.trim() || 'Curso sem título',
      institution: 'EV.org.br',
      description: pageText.substring(0, 300),
      link: url,
      duration: durationMatch?.[1]?.trim() || '',
      modality: pageText.toLowerCase().includes('presencial') ? 'Presencial' : 
                pageText.toLowerCase().includes('híbrido') ? 'Híbrido' : 'Online',
      isFree,
    };
  } catch (error) {
    console.error('Error extracting from EV:', error);
    throw new Error('Não foi possível extrair dados do link fornecido');
  }
}

/**
 * Main extractor function - detects source and extracts accordingly
 */
export async function extractJobData(url: string): Promise<ExtractedJob> {
  if (url.includes('gupy.io') || url.includes('gupy')) {
    return extractFromGupy(url);
  }
  
  // Fallback to Gupy extraction for unknown job boards
  return extractFromGupy(url);
}

export async function extractCourseData(url: string): Promise<ExtractedCourse> {
  if (url.includes('ev.org.br') || url.includes('ev.org')) {
    return extractFromEV(url);
  }
  
  // Fallback to EV extraction for unknown course platforms
  return extractFromEV(url);
}
