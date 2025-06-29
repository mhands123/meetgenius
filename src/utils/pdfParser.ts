import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';

export interface RawResumeData {
  filename: string;
  text: string;
  pages: number;
}

export class PDFParser {
  private resumesPath: string;

  constructor(resumesPath: string = '../../..') {
    this.resumesPath = resumesPath;
  }

  async parseAllResumes(): Promise<RawResumeData[]> {
    const resumeFiles = this.getResumeFiles();
    const parsedResumes: RawResumeData[] = [];

    for (const filename of resumeFiles) {
      try {
        const resumeData = await this.parseSingleResume(filename);
        parsedResumes.push(resumeData);
        console.log(`✅ Parsed: ${filename}`);
      } catch (error) {
        console.error(`❌ Failed to parse ${filename}:`, error);
      }
    }

    return parsedResumes;
  }

  private getResumeFiles(): string[] {
    const fullPath = path.resolve(this.resumesPath);
    const files = fs.readdirSync(fullPath);
    const pdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf') && file.startsWith('Profile'));

    // Sort files numerically (Profile (2).pdf, Profile (3).pdf, etc.)
    return pdfFiles.sort((a, b) => {
      const numA = parseInt(a.match(/\((\d+)\)/)?.[1] || '0');
      const numB = parseInt(b.match(/\((\d+)\)/)?.[1] || '0');
      return numA - numB;
    });
  }

  private async parseSingleResume(filename: string): Promise<RawResumeData> {
    const filePath = path.join(this.resumesPath, filename);
    const dataBuffer = fs.readFileSync(filePath);
    
    const pdfData = await pdfParse(dataBuffer);
    
    return {
      filename,
      text: pdfData.text,
      pages: pdfData.numpages
    };
  }

  // Clean and normalize text for better AI processing
  static cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n+/g, '\n') // Replace multiple newlines with single newline
      .replace(/[^\w\s\n.,@()-]/g, '') // Remove special characters except basic punctuation
      .trim();
  }

  // Extract potential contact information
  static extractContactInfo(text: string): { email?: string; phone?: string; linkedin?: string } {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const phoneRegex = /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g;
    const linkedinRegex = /linkedin\.com\/in\/([a-zA-Z0-9-]+)/g;

    const emails = text.match(emailRegex);
    const phones = text.match(phoneRegex);
    const linkedins = text.match(linkedinRegex);

    return {
      email: emails?.[0],
      phone: phones?.[0],
      linkedin: linkedins?.[0]
    };
  }
}
