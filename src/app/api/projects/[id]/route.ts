import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/db';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const project = await db.projects.findUnique({
      where: { id }
    });

    if (!project) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const teams = await db.teams.findMany({
      where: { projectId: id }
    });

    const populatedTeams = await Promise.all(
      teams.map(async (team) => {
        const members = await db.teamMembers.findMany({
          where: { teamId: team.id }
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
          where: { teamId: team.id },
          orderBy: { createdAt: 'desc' }
        });

        const checkIns = await db.checkIns.findMany({
          where: { teamId: team.id },
          orderBy: { createdAt: 'desc' }
        });

        return {
          ...team,
          members: membersWithUser,
          tasks,
          checkIns
        };
      })
    );

    return NextResponse.json({
      ...project,
      teams: populatedTeams
    });
  } catch (error) {
    console.error('Project Get Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
