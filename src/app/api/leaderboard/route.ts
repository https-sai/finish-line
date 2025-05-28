import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const session = await getServerSession()
  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        wins: true,
      },
      orderBy: {
        wins: 'desc',
      },
      take: 100,
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 