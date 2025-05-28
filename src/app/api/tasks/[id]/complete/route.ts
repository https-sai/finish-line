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
    const task = await prisma.task.findUnique({
      where: { id: params.id },
      include: { race: true },
    })

    if (!task) {
      return new NextResponse('Task not found', { status: 404 })
    }

    if (task.userId !== session.user.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const updatedTask = await prisma.task.update({
      where: { id: params.id },
      data: {
        completed: true,
        completedAt: new Date(),
      },
    })

    // Check if this was the last task for the user in this race
    const remainingTasks = await prisma.task.count({
      where: {
        raceId: task.raceId,
        userId: session.user.id,
        completed: false,
      },
    })

    if (remainingTasks === 0) {
      // Update user's win count
      await prisma.user.update({
        where: { id: session.user.id },
        data: { wins: { increment: 1 } },
      })

      // Update race status if all participants have completed their tasks
      const allParticipants = await prisma.race.findUnique({
        where: { id: task.raceId },
        include: { participants: true },
      })

      if (allParticipants) {
        const allCompleted = await Promise.all(
          allParticipants.participants.map(async (participant: Participant) => {
            const incompleteTasks = await prisma.task.count({
              where: {
                raceId: task.raceId,
                userId: participant.id,
                completed: false,
              },
            })
            return incompleteTasks === 0
          })
        )

        if (allCompleted.every(Boolean)) {
          await prisma.race.update({
            where: { id: task.raceId },
            data: { status: 'completed' },
          })
        }
      }
    }

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error('Failed to complete task:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 