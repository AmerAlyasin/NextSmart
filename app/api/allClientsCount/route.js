import { fetchClientCount } from '@/app/lib/data';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const clientCount = await fetchClientCount(); // Get the user count
    console.log(clientCount);
    // Return the count as a JSON object
    return new NextResponse(JSON.stringify({ count: clientCount }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Set to specific domain in production

      },
    });
  } catch (error) {
    console.error(error);
    // Return an error response
    return new NextResponse(JSON.stringify({ message: 'Failed to fetch user count' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Set to specific domain in production

      },
    });
  }
}
