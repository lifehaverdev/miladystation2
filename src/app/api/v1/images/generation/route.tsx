import { NextRequest } from 'next/server';

const BOT_URL = process.env.BOT_URL;

export async function POST(req: NextRequest) {
  try {
    // Get the original request headers
    const headers = new Headers(req.headers);
    
    // Forward the request to the bot
    const botResponse = await fetch(`${BOT_URL}/v1/images/generations`, {
      method: 'POST',
      headers: {
        'Authorization': headers.get('Authorization') || '',
        'Content-Type': 'application/json',
      },
      body: req.body // Forward the original request body
    });

    // Get the response data
    const data = await botResponse.json();

    // Forward the bot's response status and data
    return new Response(JSON.stringify(data), {
      status: botResponse.status,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error: any) {
    console.error(`[POST] Error in generations proxy: ${error.message}`);
    return new Response(JSON.stringify({ 
      error: {
        message: 'Server error',
        type: 'proxy_error'
      }
    }), {
      status: 500,
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