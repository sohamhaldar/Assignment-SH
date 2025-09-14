import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat') || '28.6139';
    const lng = searchParams.get('lng') || '77.209';
    const type = searchParams.get('types');
    
    try {
        let apiUrl = `https://api.olamaps.io/places/v1/nearbysearch?location=${lat},${lng}&radius=10000&withCentroid=false&rankBy=popular&limit=10&api_key=${process.env.NEXT_PUBLIC_OLA_MAPS_KEY}`;
        
        if (type !== 'all') {
            apiUrl += `&types=${type}`;
        }
        console.log('Fetching from URL:', apiUrl);
        
        const result = await fetch(apiUrl, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        const data = await result.json();
        console.log(data);
        
        return NextResponse.json({
            success: true,
            message: 'Places fetched successfully',
            data: data
        }, {
            status: 200
        });
    } catch (err:unknown) {
        return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
    }
}
