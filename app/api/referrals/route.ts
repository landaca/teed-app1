// app/api/referrals/route.ts
import { google } from 'googleapis';
import { NextResponse } from 'next/server';

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received submission:', body);

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

    // Append to Google Sheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Sheet1!A:I', // Update if your sheet name is different
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
    console.error('Submission error:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Failed to submit referral'
    }, { status: 500 });
  }
}