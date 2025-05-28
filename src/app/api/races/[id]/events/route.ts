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

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      // Send initial race data
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

      if (race) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(race)}\n\n`)
        )
      }

      // Set up polling for updates
      const interval = setInterval(async () => {
        const updatedRace = await prisma.race.findUnique({
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

        if (updatedRace) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(updatedRace)}\n\n`)
          )
        }
      }, 5000) // Poll every 5 seconds

      // Clean up on connection close
      request.signal.addEventListener('abort', () => {
        clearInterval(interval)
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
} 