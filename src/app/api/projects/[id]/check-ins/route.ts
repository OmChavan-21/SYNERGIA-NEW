import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/db';
import { generateFeedbackWithAI } from '@/lib/ai';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { week, workedOn, hoursSpent, blockers, needsHelp } = await req.json();

    const projectTeams = await db.teams.findMany({
      where: { projectId: id }
    });
    const projectTeamIds = projectTeams.map(t => t.id);

    const userMemberships = await db.teamMembers.findMany({
      where: { userId: session.user.id }
    });
    const userTeamMembership = userMemberships.find(m => projectTeamIds.includes(m.teamId));

    if (!userTeamMembership) {
      return NextResponse.json({ error: 'Not in team' }, { status: 403 });
    }

    let aiFeedback = null;
    
    try {
      if (process.env.GEMINI_API_KEY) {
        const feedbackRes = await generateFeedbackWithAI({ week, workedOn, hoursSpent, blockers, needsHelp });
        if (feedbackRes && feedbackRes.feedback) {
          aiFeedback = feedbackRes.feedback;
        }
      } else {
        aiFeedback = blockers && blockers.length > 5 
          ? "I noticed you're facing blockers. Consider bringing this up immediately with your team." 
          : "Great job maintaining momentum. Keep up the good work!";
      }
    } catch (e) {
      console.log("AI Feedback failed", e);
      aiFeedback = "Keep up the good work!";
    }

    const checkIn = await db.checkIns.create({
      data: {
        teamId: userTeamMembership.teamId,
        userId: session.user.id,
        week: parseInt(week) || 1,
        workedOn,
        hoursSpent: parseInt(hoursSpent) || 0,
        blockers,
        needsHelp: Boolean(needsHelp),
        aiFeedback
      }
    });

    return NextResponse.json(checkIn);
  } catch (error) {
    console.error('Create CheckIn Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
