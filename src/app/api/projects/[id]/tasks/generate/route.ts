import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/db';
import { generateTasksWithAI } from '@/lib/ai';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'TEACHER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const body = await req.json();
    const { teamId } = body;

    const project = await db.projects.findUnique({
      where: { id: resolvedParams.id }
    });

    if (!project || project.teacherId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const team = await db.teams.findUnique({
      where: { id: teamId }
    });

    if (!team || team.projectId !== project.id) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const members = await db.teamMembers.findMany({
      where: { teamId }
    });

    const roles = members.map((m) => m.assignedRole).filter(Boolean) as string[];

    let aiTasks = null;
    try {
      if (process.env.GEMINI_API_KEY) {
        const aiRes = await generateTasksWithAI(project, roles);
        if (aiRes && aiRes.tasks) {
          aiTasks = aiRes.tasks;
        }
      }
    } catch (e) {
      console.error("AI Task Generation failed", e);
    }

    // Deterministic fallback if AI fails or has no key
    if (!aiTasks) {
      aiTasks = roles.map((role: string) => ({
        title: `Initial Setup for ${role}`,
        description: `Review requirements and setup environment for ${role}`,
        role: role
      }));
    }

    return NextResponse.json({ tasks: aiTasks });
  } catch (error) {
    console.error('Task Generation Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
