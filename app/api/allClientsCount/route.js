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
        // Set to specific domain in production
        'Access-Control-Allow-Origin': 'https://smart-vision-next-js-pied.vercel.app/', 
        'Access-Control-Allow-Methods': 'GET, OPTIONS', // Specify allowed methods
        'Access-Control-Allow-Headers': 'Content-Type', // Specify allowed headers
      },
    });
  } catch (error) {
    console.error(error);
    // Return an error response
    return new NextResponse(JSON.stringify({ message: 'Failed to fetch user count' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        // Set to specific domain in production
        'Access-Control-Allow-Origin': 'https://smart-vision-next-js-pied.vercel.app/',
      },
    });
  }
}
