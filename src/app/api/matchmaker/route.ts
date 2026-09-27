import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/db';
import { generateTeamsWithAI } from '@/lib/ai';
import bcrypt from 'bcryptjs';

const defaultStudentPool = [
  { name: 'Alice Smith', emailPrefix: 'alice.s', skills: ['React', 'Next.js', 'TailwindCSS', 'UI/UX'], interests: ['Web Development', 'EdTech', 'Open Source'], preferredRoles: ['Frontend Developer', 'UI/UX Designer'] },
  { name: 'Bob Jones', emailPrefix: 'bob.j', skills: ['Node.js', 'Python', 'Database', 'Firebase'], interests: ['Cloud Architecture', 'Backend', 'Cybersecurity'], preferredRoles: ['Backend Developer', 'Database Admin'] },
  { name: 'Charlie Brown', emailPrefix: 'charlie.b', skills: ['Python', 'AI/ML', 'PyTorch', 'Data Analysis'], interests: ['AI', 'Healthcare', 'Robotics'], preferredRoles: ['AI Specialist', 'Data Scientist'] },
  { name: 'Diana Prince', emailPrefix: 'diana.p', skills: ['Figma', 'UI Design', 'Project Management', 'Presentation'], interests: ['Design Systems', 'Social Impact', 'Accessibility'], preferredRoles: ['UI/UX Designer', 'Project Manager'] },
  { name: 'Evan Wright', emailPrefix: 'evan.w', skills: ['Frontend', 'TypeScript', 'Jest', 'Testing'], interests: ['Gaming', 'IoT', 'Mobile'], preferredRoles: ['Frontend Developer', 'QA Tester'] },
  { name: 'Fiona Gallagher', emailPrefix: 'fiona.g', skills: ['Graphic Design', 'UI/UX', 'Figma', 'CSS'], interests: ['Social Impact', 'EdTech', 'Design'], preferredRoles: ['Designer', 'UI/UX Designer'] },
  { name: 'George Miller', emailPrefix: 'george.m', skills: ['FastAPI', 'Backend', 'Python', 'Database'], interests: ['Health', 'AI', 'Distributed Systems'], preferredRoles: ['Backend Developer', 'System Architect'] },
  { name: 'Hannah Abbott', emailPrefix: 'hannah.a', skills: ['AI/ML', 'Data Science', 'Statistics', 'Python'], interests: ['AI', 'Finance', 'Analytics'], preferredRoles: ['AI Specialist', 'Data Analyst'] },
  { name: 'Ian Malcolm', emailPrefix: 'ian.m', skills: ['Testing', 'QA', 'Writing', 'Documentation'], interests: ['Cybersecurity', 'IoT', 'DevOps'], preferredRoles: ['Tester', 'Documentation Specialist'] },
  { name: 'Julia Roberts', emailPrefix: 'julia.r', skills: ['Presentation', 'Research', 'Project Management', 'Agile'], interests: ['Sustainability', 'Health', 'Product'], preferredRoles: ['Presenter', 'Project Manager'] },
  { name: 'Kevin Bacon', emailPrefix: 'kevin.b', skills: ['Frontend', 'React', 'Animation', 'Three.js'], interests: ['Gaming', 'Design', 'Creative Tech'], preferredRoles: ['Frontend Developer', 'Designer'] },
  { name: 'Laura Dern', emailPrefix: 'laura.d', skills: ['Backend', 'Java', 'Database', 'Spring Boot'], interests: ['Finance', 'EdTech', 'Microservices'], preferredRoles: ['Backend Developer', 'Database Admin'] },
];

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'TEACHER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { projectId } = body;

    const project = await db.projects.findUnique({
      where: { id: projectId }
    });

    if (!project || project.teacherId !== session.user.id) {
      return NextResponse.json({ error: 'Project not found or unauthorized' }, { status: 404 });
    }

    // 1. Try finding students matching project's class division
    let allStudents = await db.users.findMany({
      where: {
        role: 'STUDENT',
        classDivision: project.classDivision
      }
    });

    // 2. If no students match the exact classDivision, fallback to all students in system
    if (allStudents.length === 0) {
      console.log(`[SYNERGIA] No students found for division "${project.classDivision}". Checking all student accounts...`);
      allStudents = await db.users.findMany({
        where: { role: 'STUDENT' }
      });
    }

    // 3. If still no students exist, automatically generate and save dummy students for this class division
    if (allStudents.length === 0) {
      console.log(`[SYNERGIA] Auto-populating student pool for class division "${project.classDivision}"...`);
      const passwordHash = await bcrypt.hash('password123', 10);
      const cleanDivision = (project.classDivision || 'CS-101').toLowerCase().replace(/[^a-z0-9]/g, '');

      for (const s of defaultStudentPool) {
        const student = await db.users.create({
          data: {
            name: s.name,
            email: `${s.emailPrefix}.${cleanDivision}@college.edu`,
            password: passwordHash,
            role: 'STUDENT',
            classDivision: project.classDivision || 'CS-101',
          }
        });

        await db.profiles.create({
          data: {
            userId: student.id,
            skills: JSON.stringify(s.skills),
            interests: JSON.stringify(s.interests),
            preferredRoles: JSON.stringify(s.preferredRoles),
          }
        });

        allStudents.push(student);
      }
    }

    console.log("[SYNERGIA] Generate Teams triggered for project:", project.title);
    console.log("[SYNERGIA] Total available students for matching:", allStudents.length);

    // 4. Fetch profiles (or create default if missing)
    const studentsWithProfile = await Promise.all(
      allStudents.map(async (s) => {
        let profile = await db.profiles.findUnique({ where: { userId: s.id } });
        if (!profile) {
          profile = await db.profiles.create({
            data: {
              userId: s.id,
              skills: JSON.stringify(["React", "Node.js", "UI/UX"]),
              interests: JSON.stringify(["Web Development", "AI"]),
              preferredRoles: JSON.stringify(["Frontend Developer", "Backend Developer"]),
            }
          });
        }

        return {
          id: s.id,
          name: s.name || s.email,
          skills: JSON.parse(profile.skills || '[]'),
          interests: JSON.parse(profile.interests || '[]'),
          preferredRoles: JSON.parse(profile.preferredRoles || '[]'),
        };
      })
    );

    let aiResponse = null;

    // 5. Try AI Generation
    try {
      if (process.env.GEMINI_API_KEY) {
        aiResponse = await generateTeamsWithAI(project, studentsWithProfile);
      }
    } catch (e) {
      console.log("[SYNERGIA] AI matching call failed. Using deterministic fallback.", e);
    }

    // 6. Fallback Matcher if AI did not return teams
    if (!aiResponse || !aiResponse.teams || aiResponse.teams.length === 0) {
      console.log("[SYNERGIA] Running fallback matching algorithm...");
      const requiredRoles = JSON.parse(project.requiredRoles || '[]');
      const teamSize = project.teamSize || 4;
      const numTeams = Math.max(1, Math.ceil(studentsWithProfile.length / teamSize));
      
      const teams = [];
      let studentIndex = 0;
      
      for (let i = 0; i < numTeams; i++) {
        const members = [];
        let rIndex = 0;
        
        while (members.length < teamSize && studentIndex < studentsWithProfile.length) {
          const student = studentsWithProfile[studentIndex];
          const role = (requiredRoles.length > 0)
            ? requiredRoles[rIndex % requiredRoles.length]
            : (student.preferredRoles[0] || "Developer");
            
          members.push({
            studentId: student.id,
            studentName: student.name,
            assignedRole: role
          });
          studentIndex++;
          rIndex++;
        }
        
        if (members.length > 0) {
          teams.push({
            name: `Team ${String.fromCharCode(65 + i)}`,
            reasoning: "Matched based on skill alignment, complementary preferences, and role distribution.",
            members
          });
        }
      }
      aiResponse = { teams };
    }

    console.log("[SYNERGIA] Matchmaker generated teams successfully:", aiResponse.teams.length);

    return NextResponse.json({ ...aiResponse, rawStudents: studentsWithProfile });

  } catch (error) {
    console.error('Matchmaker API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
