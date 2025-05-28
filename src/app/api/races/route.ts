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
    const races = await prisma.race.findMany({
      include: {
        participants: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(races)
  } catch (error) {
    console.error('Failed to fetch races:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession()
  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, description, duration, tasks, creatorId } = body

    const startDate = new Date()
    const endDate = new Date(startDate.getTime() + duration * 60 * 60 * 1000)

    const race = await prisma.race.create({
      data: {
        name,
        description,
        startDate,
        endDate,
        duration,
        status: 'pending',
        creatorId,
        tasks: {
          create: tasks.map((title: string, index: number) => ({
            title,
            order: index + 1,
            userId: creatorId,
          })),
        },
      },
      include: {
        tasks: true,
      },
    })

    return NextResponse.json(race)
  } catch (error) {
    console.error('Failed to create race:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 