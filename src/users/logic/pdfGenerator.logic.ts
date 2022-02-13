import axios from 'axios';
import * as PDFDocument from 'pdfkit';

import PDFGenerator from '../interfaces/pdfGenerator.interface';

export const generatePDF = async (data: PDFGenerator): Promise<Buffer> =>
  new Promise(async (resolve) => {
    const { firstName, lastName, image } = data;

    const imageResponse = await axios.get(image, {
      responseType: 'arraybuffer',
    });

    const imageBuffer = Buffer.from(imageResponse.data, 'base64');

    const doc = new PDFDocument();

    doc.fontSize(27).text(firstName, 100, 100);
    doc.fontSize(25).text(lastName, 100, 200);

    doc.image(imageBuffer, {
      fit: [300, 300],
      align: 'center',
      valign: 'center',
    });

    doc.end();

    const buffer = [];

    doc.on('data', (chunk) => buffer.push(chunk));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffer);
      resolve(pdfData);
    });
  });
