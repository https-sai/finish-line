import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession()
  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const race = await prisma.race.findUnique({
      where: { id: params.id },
      include: {
        participants: {
          include: {
            tasks: {
              where: { raceId: params.id },
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    })

    if (!race) {
      return new NextResponse('Race not found', { status: 404 })
    }

    return NextResponse.json(race)
  } catch (error) {
    console.error('Failed to fetch race:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 