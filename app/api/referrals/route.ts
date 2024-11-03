// app/api/referrals/route.ts
import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received submission:', body);

    console.log('Key format check:');
    console.log('Contains BEGIN:', process.env.GOOGLE_PRIVATE_KEY?.includes('BEGIN'));
    console.log('Contains actual newlines:', process.env.GOOGLE_PRIVATE_KEY?.includes('\n'));
    console.log('First line:', process.env.GOOGLE_PRIVATE_KEY?.split('\n')[0]);

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
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
        values: [row],
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Referral submitted successfully'
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      code: error.code,
      stack: error.stack
    });
    
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Failed to submit referral'
    }, { status: 500 });
  }
}