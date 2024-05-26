import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import { getBotInstance } from '@/deluxebot/utils/bot/bot.js';
const watch = require('@/deluxebot/utils/bot/handlers/watch.js');
const wait = require('@/deluxebot/utils/bot/handlers/menu.js');

const bot = getBotInstance();

export async function POST(request: Request) {
  const body = await request.json();
  bot.processUpdate(body);
  return NextResponse.json({ status: 'ok' });
}
