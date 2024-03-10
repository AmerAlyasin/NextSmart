import PizZip from 'pizzip';
import fs from 'fs';
import path from 'path';
import Docxtemplater from 'docxtemplater';
import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

// Initialize ConvertAPI
const convertapi = require('convertapi')(process.env.CONVERTAPI_SECRET2);

// Function to write buffer to a temporary file
function writeBufferToTempFile(buffer, fileName) {
  return new Promise((resolve, reject) => {
    const tempFilePath = path.join(__dirname, fileName); 
    fs.writeFile(tempFilePath, buffer, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(tempFilePath);
      }
    });
  });
}

// Function to fetch the DOCX template from a URL
async function fetchDocxTemplate(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch DOCX template. Status: ${response.status}`);
  }
  return response.buffer();
}

export async function POST(req) {
  try {
    console.log("Request received:", req);

    const chunks = [];
    for await (const chunk of req.body) {
      chunks.push(chunk);
    }
    const data = JSON.parse(Buffer.concat(chunks).toString());

    console.log("Data received:", data);

    // URL to your DOCX template (adjust as necessary)
    const fileUrl = 'https://docs.google.com/document/d/1bj9mM2em-AhVJQ6ZSJkrJM7QZLA8MjIt/export?format=docx';

    console.log("Fetching DOCX template from:", fileUrl);

    // Fetch the DOCX template from the URL
    const docxBuffer = await fetchDocxTemplate(fileUrl);

    console.log("DOCX template fetched successfully");

    // Read the DOCX template 
    const zip = new PizZip(docxBuffer);
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

    console.log("Rendering DOCX template with data:", data);

    doc.render(data);

    console.log("DOCX template rendered successfully");

    // Generate the rendered DOCX buffer
    const docxBufferRendered = doc.getZip().generate({ type: 'nodebuffer' });

    console.log("Rendered DOCX buffer generated");

    // Write rendered DOCX buffer to a temporary file
    const tempDocxFilePath = await writeBufferToTempFile(docxBufferRendered, 'temp.docx');

    console.log("Rendered DOCX buffer written to temporary file:", tempDocxFilePath);

    // Convert DOCX to PDF using ConvertAPI
    console.log("Converting DOCX to PDF using ConvertAPI");

    const result = await convertapi.convert('pdf', { File: tempDocxFilePath }, 'docx');

    console.log("DOCX converted to PDF successfully");

    // Check if conversion was successful
    if (!result || !result.file || !result.file.url) {
      throw new Error('Failed to convert DOCX to PDF');
    }

    // Fetch the converted PDF buffer
    console.log("Fetching converted PDF from:", result.file.url);

    const pdfResponse = await fetch(result.file.url);
    const pdfBuffer = await pdfResponse.buffer();

    console.log("PDF fetched successfully");

    // Prepare headers for PDF response
    const responseHeaders = {
      'Content-Disposition': 'attachment; filename="output.pdf"',
      'Content-Type': 'application/pdf',
      'Access-Control-Allow-Origin': '*',
    };

    console.log("Sending PDF back to the client");

    // Send the PDF back to the client
    return new NextResponse(pdfBuffer, { status: 200, headers: responseHeaders });

  } catch (error) {
    console.error('Error in document generation:', error);
    // It's better to not expose error details in production environments
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
