import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/db';

export async function GET(req: Request, { params }: { params: Promise<{ id: string, teamId: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'TEACHER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, teamId } = await params;

    const team = await db.teams.findUnique({
      where: { id: teamId }
    });

    if (!team || team.projectId !== id) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const project = await db.projects.findUnique({
      where: { id: team.projectId }
    });

    const members = await db.teamMembers.findMany({
      where: { teamId }
    });

    const membersWithUser = await Promise.all(
      members.map(async (m) => {
        const user = await db.users.findUnique({ where: { id: m.userId } });
        return {
          ...m,
          user: user ? { id: user.id, name: user.name, email: user.email, role: user.role } : null
        };
      })
    );

    const tasks = await db.tasks.findMany({
      where: { teamId },
      orderBy: { createdAt: 'desc' }
    });

    const tasksWithAssignee = await Promise.all(
      tasks.map(async (t) => {
        let assignee = null;
        if (t.assigneeId) {
          const user = await db.users.findUnique({ where: { id: t.assigneeId } });
          if (user) {
            assignee = { id: user.id, name: user.name, email: user.email };
          }
        }
        return {
          ...t,
          assignee
        };
      })
    );

    const checkIns = await db.checkIns.findMany({
      where: { teamId },
      orderBy: { createdAt: 'desc' }
    });

    const checkInsWithUser = await Promise.all(
      checkIns.map(async (c) => {
        const user = await db.users.findUnique({ where: { id: c.userId } });
        return {
          ...c,
          user: user ? { id: user.id, name: user.name, email: user.email } : null
        };
      })
    );

    return NextResponse.json({
      ...team,
      project,
      members: membersWithUser,
      tasks: tasksWithAssignee,
      checkIns: checkInsWithUser
    });

  } catch (error) {
    console.error('Fetch Team Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
