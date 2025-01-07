import { NextRequest } from 'next/server';

const BOT_URL = process.env.BOT_URL;

// Remove 'use edge' directive
// Replace with this:
export const runtime = 'nodejs';
export const maxDuration = 300;

export async function POST(req: Request) {
  try {
    if (!process.env.BOT_URL) {
      throw new Error('BOT_URL environment variable is not set');
    }

    const body = await req.json();
    
    const botResponse = await fetch(`${process.env.BOT_URL}/v1/images/generations`, {
      method: 'POST',
      headers: {
        'Authorization': req.headers.get('Authorization') || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    const data = await botResponse.json();
    return new Response(JSON.stringify(data), {
      status: botResponse.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });

  } catch (error: any) {
    console.error(`[POST] Error in generations proxy:`, error);
    return new Response(JSON.stringify({ 
      error: {
        message: error.message || 'Server error',
        type: 'proxy_error'
      }
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

// Optional: Handle OPTIONS for CORS
export async function OPTIONS(req: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}