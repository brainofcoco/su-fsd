import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import csv from 'csv-parser';
import { Product } from '@/types/product';

// Define server action to read and sort csv
export async function GET() {
  const filePath = path.join(process.cwd(), 'src', 'data', 'data.csv');

  //   console.log('CSV File Path', filePath);

  const result: Product[] = [];

  return new Promise((resolve, reject) => {
    // check if file exist
    if (!fs.existsSync(filePath)) {
      console.log('Csv File not found:', filePath);

      return reject(new Response('CSV not found', { status: 404 }));
    }
    fs.createReadStream(filePath)
      .pipe(csv({ headers: ['createdAt', 'filename'], separator: ';' }))
      .on('data', (data) => {
        console.log('row', data);
        result.push(data as Product);
      })
      .on('end', () => {
        console.log('Complete', result);
        resolve(NextResponse.json(result));
      })
      .on('error', (error) => {
        console.error('Error while reading', error);
        reject(new Response('Error reading the CSV file', { status: 500 }));
      });
  });
}
