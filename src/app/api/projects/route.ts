import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'TEACHER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, teamSize, deadline, classDivision, requiredSkills, requiredRoles } = body;

    const project = await db.projects.create({
      data: {
        title,
        description,
        teamSize: Number(teamSize) || 4,
        deadline: new Date(deadline).toISOString(),
        classDivision,
        requiredSkills: typeof requiredSkills === 'string' ? requiredSkills : JSON.stringify(requiredSkills),
        requiredRoles: typeof requiredRoles === 'string' ? requiredRoles : JSON.stringify(requiredRoles),
        teacherId: session.user.id,
      }
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Project Create Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
