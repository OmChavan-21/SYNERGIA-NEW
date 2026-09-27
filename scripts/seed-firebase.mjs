import bcrypt from 'bcryptjs';
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyC140WtNvZgl0sIvQqd_usB4cQ8e1dNTx8",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "synergia-8055.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || "synergia-8055",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "synergia-8055.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "147700552631",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:147700552631:web:7c08a482ecf1e0ce844e32",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-78CJ91C8H2",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

const collections = {
  users: collection(db, 'users'),
  profiles: collection(db, 'profiles'),
  projects: collection(db, 'projects'),
  teams: collection(db, 'teams'),
  teamMembers: collection(db, 'teamMembers'),
  tasks: collection(db, 'tasks'),
  checkIns: collection(db, 'checkIns'),
};

async function clearCollection(collectionRef) {
  const snapshot = await getDocs(collectionRef);
  for (const document of snapshot.docs) {
    await deleteDoc(document.ref);
  }
}

async function main() {
  console.log('Connecting to Firebase project:', firebaseConfig.projectId);
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
    console.warn('Note on clearing collections:', e.message);
  }

  const passwordHash = await bcrypt.hash('password123', 10);
  const now = new Date().toISOString();

  console.log('Seeding demo data to Firestore...');

  // 1. Create Teacher
  const teacherRef = doc(collections.users);
  const teacher = {
    id: teacherRef.id,
    name: 'Dr. Alan Turing',
    email: 'teacher@college.edu',
    password: passwordHash,
    role: 'TEACHER',
    classDivision: 'CS-101',
    createdAt: now,
    updatedAt: now,
  };
  await setDoc(teacherRef, teacher);

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
    const studentRef = doc(collections.users);
    const user = {
      id: studentRef.id,
      name: s.name,
      email: s.email,
      password: passwordHash,
      role: 'STUDENT',
      classDivision: 'CS-101',
      createdAt: now,
      updatedAt: now,
    };
    await setDoc(studentRef, user);

    const profileRef = doc(collections.profiles);
    const profile = {
      id: profileRef.id,
      userId: user.id,
      skills: JSON.stringify(s.skills),
      interests: JSON.stringify(s.interests),
      preferredRoles: JSON.stringify(s.roles),
      portfolioUrl: null,
      githubUrl: null,
      linkedinUrl: null,
      createdAt: now,
      updatedAt: now,
    };
    await setDoc(profileRef, profile);

    students.push(user);
  }

  // 3. Create Project
  const projectRef = doc(collections.projects);
  const project = {
    id: projectRef.id,
    title: 'Smart Campus Assistant',
    description: 'An AI-driven mobile app to help students navigate campus resources, schedules, and events.',
    classDivision: 'CS-101',
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    teamSize: 4,
    requiredSkills: JSON.stringify(['React', 'Node.js', 'AI/ML', 'UI/UX']),
    requiredRoles: JSON.stringify(['Frontend Developer', 'Backend Developer', 'AI Specialist', 'Designer']),
    teacherId: teacher.id,
    createdAt: now,
    updatedAt: now,
  };
  await setDoc(projectRef, project);

  // 4. Create a Demo Team
  const teamRef = doc(collections.teams);
  const team = {
    id: teamRef.id,
    name: 'Team Alpha',
    projectId: project.id,
    createdAt: now,
    updatedAt: now,
  };
  await setDoc(teamRef, team);

  // Assign members
  const memberRoles = [
    { student: students[0], role: 'Frontend Developer' },
    { student: students[1], role: 'Backend Developer' },
    { student: students[2], role: 'AI Specialist' },
    { student: students[5], role: 'Designer' },
  ];

  for (const mr of memberRoles) {
    const memRef = doc(collections.teamMembers);
    await setDoc(memRef, {
      id: memRef.id,
      teamId: team.id,
      userId: mr.student.id,
      assignedRole: mr.role,
      createdAt: now,
      updatedAt: now,
    });
  }

  // 5. Create some Tasks
  const tasksData = [
    { title: 'Design Database Schema', description: 'Plan the collections for users, events, and schedules.', assigneeId: students[1].id, role: 'Backend Developer', status: 'DONE' },
    { title: 'Create Figma Mockups', description: 'Design the onboarding and dashboard screens.', assigneeId: students[5].id, role: 'Designer', status: 'DOING' },
    { title: 'Train NLP intent model', description: 'Train a basic model to understand campus queries.', assigneeId: students[2].id, role: 'AI Specialist', status: 'TODO' },
    { title: 'Setup React Native project', description: 'Initialize project and navigation.', assigneeId: students[0].id, role: 'Frontend Developer', status: 'DOING' },
  ];

  for (const td of tasksData) {
    const taskRef = doc(collections.tasks);
    await setDoc(taskRef, {
      id: taskRef.id,
      teamId: team.id,
      title: td.title,
      description: td.description,
      assigneeId: td.assigneeId,
      role: td.role,
      status: td.status,
      dueDate: null,
      createdAt: now,
      updatedAt: now,
    });
  }

  // 6. Create Check-ins
  const checkIn1Ref = doc(collections.checkIns);
  await setDoc(checkIn1Ref, {
    id: checkIn1Ref.id,
    teamId: team.id,
    userId: students[0].id,
    week: 1,
    workedOn: 'Initial project setup and repo creation.',
    hoursSpent: 4,
    blockers: 'None',
    needsHelp: false,
    aiFeedback: 'Good start. Ensure all team members have repository access.',
    createdAt: now,
  });

  const checkIn2Ref = doc(collections.checkIns);
  await setDoc(checkIn2Ref, {
    id: checkIn2Ref.id,
    teamId: team.id,
    userId: students[1].id,
    week: 1,
    workedOn: 'Database schema design.',
    hoursSpent: 5,
    blockers: 'Waiting on finalizing entity relationships.',
    needsHelp: true,
    aiFeedback: 'Schedule a sync with the frontend dev to align on data models.',
    createdAt: now,
  });

  console.log('✅ Firebase Firestore Seed completed successfully!');
}

main().catch((e) => {
  console.error('Seed error:', e);
  process.exit(1);
});
