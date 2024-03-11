import { fetchAllClients } from '@/app/lib/data'; // Adjust the import path as needed
import { NextResponse } from 'next/server';

export async function GET(req, res) {
    try {
        const clients = await fetchAllClients();
        return NextResponse.json(clients);
    } catch (error) {
        console.error('Error fetching clients:', error);

        return res.status(500).json({ message: 'Failed to fetch clients' });
    }
}
