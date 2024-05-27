import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import { getBotInstance } from '@/deluxebot/utils/bot/bot.js';

const bot = getBotInstance();

export async function POST(request: Request) {
  try {
    console.log('Webhook received');
    
    const body = await request.json();
    console.log('Request body:', body);

    // Process the update with the bot instance
    await bot.processUpdate(body);

    return NextResponse.json({ status: 'ok' });
  } catch (error:any) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ status: 'error', message: error.message });
  }
}
