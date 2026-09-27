import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/db';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;

    // Find all teams for this project
    const projectTeams = await db.teams.findMany({
      where: { projectId: resolvedParams.id }
    });
    const projectTeamIds = projectTeams.map(t => t.id);

    // Find if user is a member of any team in this project
    const allUserMemberships = await db.teamMembers.findMany({
      where: { userId: session.user.id }
    });
    const userTeamMembership = allUserMemberships.find(m => projectTeamIds.includes(m.teamId));

    if (!userTeamMembership) {
      return NextResponse.json({ error: 'Not part of a team in this project' }, { status: 404 });
    }

    const tasks = await db.tasks.findMany({
      where: { teamId: userTeamMembership.teamId },
      orderBy: { createdAt: 'desc' }
    });

    const populatedTasks = await Promise.all(
      tasks.map(async (task) => {
        let assignee = null;
        if (task.assigneeId) {
          const user = await db.users.findUnique({ where: { id: task.assigneeId } });
          if (user) {
            assignee = { id: user.id, name: user.name, email: user.email };
          }
        }
        return {
          ...task,
          assignee
        };
      })
    );

    return NextResponse.json(populatedTasks);
  } catch (error) {
    console.error('Fetch Tasks Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const body = await req.json();
    const { title, description, assigneeId, status, teamId: requestedTeamId } = body;

    let targetTeamId = requestedTeamId;

    if (session.user.role !== 'TEACHER') {
      const projectTeams = await db.teams.findMany({
        where: { projectId: resolvedParams.id }
      });
      const projectTeamIds = projectTeams.map(t => t.id);

      const allUserMemberships = await db.teamMembers.findMany({
        where: { userId: session.user.id }
      });
      const userTeamMembership = allUserMemberships.find(m => projectTeamIds.includes(m.teamId));

      if (!userTeamMembership) {
        return NextResponse.json({ error: 'Not in team' }, { status: 403 });
      }
      targetTeamId = userTeamMembership.teamId;
    }

    if (!targetTeamId) {
      return NextResponse.json({ error: 'Missing team ID' }, { status: 400 });
    }

    const task = await db.tasks.create({
      data: {
        teamId: targetTeamId,
        title,
        description: description || "",
        assigneeId: assigneeId || session.user.id,
        status: status || 'TODO'
      }
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Create Task Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
