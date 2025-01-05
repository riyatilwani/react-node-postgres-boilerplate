import csvParser from 'csv-parser';
import { Readable } from 'stream';

export const parseCSV = (csvData: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const results: any[] = [];
    const stream = Readable.from(csvData);

    stream.pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(new Error(`CSV Parsing Error: ${error.message}`)));
  });
};
