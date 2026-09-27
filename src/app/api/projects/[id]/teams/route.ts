import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/db';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'TEACHER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { teams } = body;

    for (const team of teams) {
      const dbTeam = await db.teams.create({
        data: {
          name: team.name,
          projectId: id,
        }
      });

      for (const member of team.members) {
        await db.teamMembers.create({
          data: {
            teamId: dbTeam.id,
            userId: member.studentId,
            assignedRole: member.assignedRole,
          }
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Finalize Teams Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
