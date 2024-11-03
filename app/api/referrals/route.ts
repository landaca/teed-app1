// app/api/referrals/route.ts
import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Log the key format (but not the actual key)
    console.log('Private key starts with:', process.env.GOOGLE_PRIVATE_KEY?.substring(0, 20));
    console.log('Private key contains \\n?', process.env.GOOGLE_PRIVATE_KEY?.includes('\\n'));
    console.log('Private key contains actual line breaks?', process.env.GOOGLE_PRIVATE_KEY?.includes('\n'));
    
    const body = await request.json();
    console.log('Received submission:', body);

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY,
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

    // Log before making the request
    console.log('About to make sheets API request');

    // Append to Google Sheet
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
    // Enhanced error logging
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