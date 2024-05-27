import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import { getBotInstance } from '@/deluxebot/app';
import TelegramBot from 'node-telegram-bot-api';

async function checkBot(bot: TelegramBot): Promise<boolean> {
  const botToken = process.env.TELEGRAM_TOKEN;
  const telegramApiUrl = `https://api.telegram.org/bot${botToken}/getMe`;

  const response = await fetch(telegramApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const result = await response.json();
  console.log('Telegram API getMe response:', result);

  return result.ok;
}

export async function POST(request: Request) {
  try {
    console.log('Webhook received');

    const body = await request.json();
    console.log('Request body:', body);

    // Instantiate the bot
    const bot = getBotInstance();

    // Perform a quick check to ensure the bot is ready
    const isBotReady = await checkBot(bot);
    if (!isBotReady) {
      throw new Error('Bot is not ready');
    }

    // Wait for 1.5 seconds to allow the bot to "warm up"
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Process the update with the bot instance
    await bot.processUpdate(body);

    return NextResponse.json({ status: 'ok' });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ status: 'error', message: error.message });
  }
}
