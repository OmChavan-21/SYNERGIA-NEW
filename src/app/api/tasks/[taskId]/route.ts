import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/db';

export async function PUT(req: Request, { params }: { params: Promise<{ taskId: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { taskId } = await params;
    const { status } = await req.json();

    // Verify task exists
    const task = await db.tasks.findUnique({
      where: { id: taskId }
    });

    if (!task) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Verify auth (student must be in the team, or user is teacher)
    if (session.user.role !== 'TEACHER') {
      const teamMembers = await db.teamMembers.findMany({
        where: { teamId: task.teamId }
      });
      const isInTeam = teamMembers.some(m => m.userId === session.user.id);
      if (!isInTeam) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    const updatedTask = await db.tasks.update({
      where: { id: taskId },
      data: { status }
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Update Task Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
