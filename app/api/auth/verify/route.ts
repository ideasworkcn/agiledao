import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    const cookieStore = cookies();
    const token = cookieStore.get('token');

    if (!token) {
        return NextResponse.json(
            { message: 'Unauthorized' },
            { status: 401 }
        );
    }

    // 这里可以添加额外的token验证逻辑
    // 比如验证token是否过期，是否有效等

    return NextResponse.json(
        { message: 'Authorized' },
        { status: 200 }
    );
}