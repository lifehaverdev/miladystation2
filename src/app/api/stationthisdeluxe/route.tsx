import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    console.log('Webhook received');

    const body = await request.json();
    console.log('Request body:', body);

    // Forward the update to your bot running on a separate server
    const botServerUrl = `http://${process.env.BOT_IP}:3000/receive-update`;
    const response = await fetch(botServerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`Error forwarding update to bot server: ${response.statusText}`);
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ status: 'error', message: error.message });
  }
}
