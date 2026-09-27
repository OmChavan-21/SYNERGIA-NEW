import bcrypt from 'bcryptjs';
import { db, collections } from '../src/lib/db';
import { getDocs, deleteDoc } from 'firebase/firestore';

async function clearCollection(collectionRef: any) {
  const snapshot = await getDocs(collectionRef);
  for (const doc of snapshot.docs) {
    await deleteDoc(doc.ref);
  }
}

async function main() {
  console.log('Clearing existing Firestore collections...');
  try {
    await clearCollection(collections.checkIns);
    await clearCollection(collections.tasks);
    await clearCollection(collections.teamMembers);
    await clearCollection(collections.teams);
    await clearCollection(collections.projects);
    await clearCollection(collections.profiles);
    await clearCollection(collections.users);
  } catch (e) {
    console.warn('Note: Could not clear collections prior to seeding:', e);
  }

  const passwordHash = await bcrypt.hash('password123', 10);

  console.log('Seeding demo data to Firestore...');

  // 1. Create Teacher
  const teacher = await db.users.create({
    data: {
      name: 'Dr. Alan Turing',
      email: 'teacher@college.edu',
      password: passwordHash,
      role: 'TEACHER',
      classDivision: 'CS-101',
    },
  });

  // 2. Create Students (Demo Data)
  const studentsData = [
    { name: 'Alice Smith', email: 'alice@college.edu', skills: ['Frontend', 'React', 'UI/UX'], interests: ['EdTech', 'Design'], roles: ['Developer', 'Designer'] },
    { name: 'Bob Jones', email: 'bob@college.edu', skills: ['Backend', 'Node.js', 'Database'], interests: ['Finance', 'Cybersecurity'], roles: ['Developer'] },
    { name: 'Charlie Brown', email: 'charlie@college.edu', skills: ['AI/ML', 'Python', 'Research'], interests: ['AI', 'Health'], roles: ['Researcher', 'Developer'] },
    { name: 'Diana Prince', email: 'diana@college.edu', skills: ['Project Management', 'Presentation', 'Writing'], interests: ['Social Impact', 'Sustainability'], roles: ['Project Manager', 'Presenter'] },
    { name: 'Evan Wright', email: 'evan@college.edu', skills: ['Frontend', 'Vue', 'Testing'], interests: ['Gaming', 'IoT'], roles: ['Developer', 'Tester'] },
    { name: 'Fiona Gallagher', email: 'fiona@college.edu', skills: ['UI/UX', 'Graphic Design'], interests: ['Social Impact', 'EdTech'], roles: ['Designer'] },
    { name: 'George Miller', email: 'george@college.edu', skills: ['Backend', 'Python', 'Database'], interests: ['Health', 'AI'], roles: ['Developer', 'Database Admin'] },
    { name: 'Hannah Abbott', email: 'hannah@college.edu', skills: ['AI/ML', 'Data Science'], interests: ['AI', 'Finance'], roles: ['Researcher', 'Data Analyst'] },
    { name: 'Ian Malcolm', email: 'ian@college.edu', skills: ['Testing', 'QA', 'Writing'], interests: ['Cybersecurity', 'IoT'], roles: ['Tester', 'Documentation'] },
    { name: 'Julia Roberts', email: 'julia@college.edu', skills: ['Presentation', 'Research', 'Project Management'], interests: ['Sustainability', 'Health'], roles: ['Presenter', 'Project Manager'] },
    { name: 'Kevin Bacon', email: 'kevin@college.edu', skills: ['Frontend', 'React', 'Animation'], interests: ['Gaming', 'Design'], roles: ['Developer', 'Designer'] },
    { name: 'Laura Dern', email: 'laura@college.edu', skills: ['Backend', 'Java', 'Database'], interests: ['Finance', 'EdTech'], roles: ['Developer'] },
  ];

  const students = [];
  for (const s of studentsData) {
    const user = await db.users.create({
      data: {
        name: s.name,
        email: s.email,
        password: passwordHash,
        role: 'STUDENT',
        classDivision: 'CS-101',
      }
    });

    await db.profiles.create({
      data: {
        userId: user.id,
        skills: JSON.stringify(s.skills),
        interests: JSON.stringify(s.interests),
        preferredRoles: JSON.stringify(s.roles),
      }
    });

    students.push(user);
  }

  // 3. Create Project
  const project = await db.projects.create({
    data: {
      title: 'Smart Campus Assistant',
      description: 'An AI-driven mobile app to help students navigate campus resources, schedules, and events.',
      classDivision: 'CS-101',
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      teamSize: 4,
      requiredSkills: JSON.stringify(['React', 'Node.js', 'AI/ML', 'UI/UX']),
      requiredRoles: JSON.stringify(['Frontend Developer', 'Backend Developer', 'AI Specialist', 'Designer']),
      teacherId: teacher.id,
    }
  });

  // 4. Create a Demo Team
  const team = await db.teams.create({
    data: {
      name: 'Team Alpha',
      projectId: project.id,
    }
  });

  // Assign members
  await db.teamMembers.create({ data: { teamId: team.id, userId: students[0].id, assignedRole: 'Frontend Developer' } });
  await db.teamMembers.create({ data: { teamId: team.id, userId: students[1].id, assignedRole: 'Backend Developer' } });
  await db.teamMembers.create({ data: { teamId: team.id, userId: students[2].id, assignedRole: 'AI Specialist' } });
  await db.teamMembers.create({ data: { teamId: team.id, userId: students[5].id, assignedRole: 'Designer' } });

  // 5. Create some Tasks
  await db.tasks.create({ data: { teamId: team.id, title: 'Design Database Schema', description: 'Plan the collections for users, events, and schedules.', assigneeId: students[1].id, role: 'Backend Developer', status: 'DONE' } });
  await db.tasks.create({ data: { teamId: team.id, title: 'Create Figma Mockups', description: 'Design the onboarding and dashboard screens.', assigneeId: students[5].id, role: 'Designer', status: 'DOING' } });
  await db.tasks.create({ data: { teamId: team.id, title: 'Train NLP intent model', description: 'Train a basic model to understand campus queries.', assigneeId: students[2].id, role: 'AI Specialist', status: 'TODO' } });
  await db.tasks.create({ data: { teamId: team.id, title: 'Setup React Native project', description: 'Initialize project and navigation.', assigneeId: students[0].id, role: 'Frontend Developer', status: 'DOING' } });

  // 6. Create Check-ins
  await db.checkIns.create({
    data: {
      teamId: team.id,
      userId: students[0].id,
      week: 1,
      workedOn: 'Initial project setup and repo creation.',
      hoursSpent: 4,
      blockers: 'None',
      needsHelp: false,
      aiFeedback: 'Good start. Ensure all team members have repository access.'
    }
  });
  await db.checkIns.create({
    data: {
      teamId: team.id,
      userId: students[1].id,
      week: 1,
      workedOn: 'Database schema design.',
      hoursSpent: 5,
      blockers: 'Waiting on finalizing entity relationships.',
      needsHelp: true,
      aiFeedback: 'Schedule a sync with the frontend dev to align on data models.'
    }
  });

  console.log('Firebase Firestore Seed completed successfully!');
}

main().catch((e) => {
  console.error('Seed error:', e);
  process.exit(1);
});
