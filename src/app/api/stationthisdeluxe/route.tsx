import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import { getBotInstance } from '@/deluxebot/app';
import { startup } from '@/deluxebot/utils/bot/bot'

const bot = getBotInstance();

export async function POST(request: Request) {
  try {
    console.log('Webhook received');

    //const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || request.headers.get('client-ip');

    const body = await request.json();
    console.log('Request body:', body);
    console.log('bot',bot);
    console.log('startup',startup);
    // Process the update with the bot instance
    await bot.processUpdate(body);

    const botToken = process.env.TELEGRAM_TOKEN;
    const chatId = '5472638766';
    const text = 'Test message from route.tsx';
    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const response = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text
      })
    });

    const result = await response.json();
    console.log('Telegram API response:', result);

    return NextResponse.json({ status: 'ok' });
  } catch (error:any) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ status: 'error', message: error.message });
  }
}
