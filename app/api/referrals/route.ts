// app/api/referrals/route.ts
import { google } from 'googleapis';
import { NextResponse } from 'next/server';

function preparePrivateKey(key: string) {
  // Remove any existing quotes and spaces
  const cleanKey = key.replace(/"/g, '').trim();
  
  // Check if the key needs to be split into lines
  if (!cleanKey.includes('\n')) {
    const keyParts = cleanKey.match(/.{1,64}/g) || [];
    return [
      '-----BEGIN PRIVATE KEY-----',
      ...keyParts,
      '-----END PRIVATE KEY-----'
    ].join('\n');
  }
  
  return cleanKey;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received submission:', body);

    // Get and prepare the private key
    const rawKey = process.env.GOOGLE_PRIVATE_KEY || '';
    const privateKey = preparePrivateKey(rawKey);
    
    // Log key format for debugging (don't log the actual key content)
    console.log('Key format check:');
    console.log('Has BEGIN marker:', privateKey.includes('BEGIN PRIVATE KEY'));
    console.log('Has END marker:', privateKey.includes('END PRIVATE KEY'));
    console.log('Contains newlines:', privateKey.includes('\n'));
    console.log('Number of lines:', privateKey.split('\n').length);

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: privateKey
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const row = [
      new Date().toISOString(),
      body.productName,
      body.referrer.firstName,
      body.referrer.lastName,
      body.referrer.email,
      body.referee.firstName,
      body.referee.lastName,
      body.referee.email,
      'Pending'
    ];

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Sheet1!A:I',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [row]
      }
    });

    console.log('Sheets API response:', response.status);

    return NextResponse.json({ 
      success: true, 
      message: 'Referral submitted successfully'
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      code: error.code
    });
    
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Failed to submit referral'
    }, { status: 500 });
  }
}