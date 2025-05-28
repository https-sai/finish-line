import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface Participant {
  id: string
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession()
  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const body = await request.json()
    const { email } = body

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    // Check if the race exists and the current user is the creator
    const race = await prisma.race.findUnique({
      where: { id: params.id },
      include: { participants: true },
    })

    if (!race) {
      return new NextResponse('Race not found', { status: 404 })
    }

    if (race.creatorId !== session.user.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Check if user is already a participant
    if (race.participants.some((p: Participant) => p.id === user.id)) {
      return new NextResponse('User is already a participant', { status: 400 })
    }

    // Add user to race participants
    await prisma.race.update({
      where: { id: params.id },
      data: {
        participants: {
          connect: { id: user.id },
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to invite user:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 