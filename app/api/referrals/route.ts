// app/api/referrals/route.ts
import { google } from 'googleapis';
import { NextResponse } from 'next/server';

function formatPrivateKey(key: string) {
  // First, remove any existing line breaks and quotes
  const cleanedKey = key.replace(/\\n/g, '\n').replace(/"/g, '');
  
  // Split into lines and reassemble with proper format
  const lines = cleanedKey.split('\n').filter(line => line.length > 0);
  
  if (!lines[0].includes('BEGIN') || !lines[lines.length - 1].includes('END')) {
    // If the key doesn't have proper BEGIN/END markers, add them
    return `-----BEGIN PRIVATE KEY-----\n${lines.join('\n')}\n-----END PRIVATE KEY-----`;
  }
  
  return lines.join('\n');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received submission:', body);

    const privateKey = formatPrivateKey(process.env.GOOGLE_PRIVATE_KEY || '');
    console.log('Formatted key starts with:', privateKey.substring(0, 27));
    console.log('Formatted key contains proper line breaks:', privateKey.includes('\n'));

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Format data for Google Sheets
    const row = [
      new Date().toISOString(), // Timestamp
      body.productName,
      body.referrer.firstName,
      body.referrer.lastName,
      body.referrer.email,
      body.referee.firstName,
      body.referee.lastName,
      body.referee.email,
      'Pending' // Status
    ];

    console.log('About to make sheets API request');

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Sheet1!A:I',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [row],
      },
    });

    console.log('Google Sheets Response:', response.data);

    return NextResponse.json({ 
      success: true, 
      message: 'Referral submitted successfully'
    }, { status: 201 });

  } catch (error: any) {
    console.error('Full error object:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Failed to submit referral',
      details: error.stack
    }, { status: 500 });
  }
}