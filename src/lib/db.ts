import { db as firestoreDb } from './firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  limit as firestoreLimit,
  CollectionReference,
  DocumentData,
  QueryConstraint,
} from 'firebase/firestore';

export interface User {
  id: string;
  name?: string | null;
  email: string;
  password?: string | null;
  role: 'STUDENT' | 'TEACHER';
  classDivision?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  skills: string;
  interests: string;
  preferredRoles: string;
  portfolioUrl?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  classDivision: string;
  deadline: string;
  teamSize: number;
  requiredSkills: string;
  requiredRoles: string;
  teacherId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  id: string;
  projectId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  assignedRole?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  teamId: string;
  title: string;
  description: string;
  assigneeId?: string | null;
  role?: string | null;
  dueDate?: string | null;
  status: 'TODO' | 'DOING' | 'DONE';
  createdAt: string;
  updatedAt: string;
}

export interface CheckIn {
  id: string;
  teamId: string;
  userId: string;
  week: number;
  workedOn: string;
  hoursSpent: number;
  blockers: string;
  needsHelp: boolean;
  aiFeedback?: string | null;
  createdAt: string;
}

// Collection References
export const collections = {
  users: collection(firestoreDb, 'users') as CollectionReference<DocumentData>,
  profiles: collection(firestoreDb, 'profiles') as CollectionReference<DocumentData>,
  projects: collection(firestoreDb, 'projects') as CollectionReference<DocumentData>,
  teams: collection(firestoreDb, 'teams') as CollectionReference<DocumentData>,
  teamMembers: collection(firestoreDb, 'teamMembers') as CollectionReference<DocumentData>,
  tasks: collection(firestoreDb, 'tasks') as CollectionReference<DocumentData>,
  checkIns: collection(firestoreDb, 'checkIns') as CollectionReference<DocumentData>,
};

// Helper methods for Firebase Firestore operations
export const db = {
  users: {
    async findUnique({ where: filter }: { where: { id?: string; email?: string } }) {
      if (filter.id) {
        const docRef = doc(firestoreDb, 'users', filter.id);
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists()) return null;
        return { id: snapshot.id, ...snapshot.data() } as User;
      }
      if (filter.email) {
        const q = query(collections.users, where('email', '==', filter.email), firestoreLimit(1));
        const snapshot = await getDocs(q);
        if (snapshot.empty) return null;
        const first = snapshot.docs[0];
        return { id: first.id, ...first.data() } as User;
      }
      return null;
    },
    async findMany({ where: filter }: { where?: { role?: string; classDivision?: string } } = {}) {
      const constraints: QueryConstraint[] = [];
      if (filter?.role) constraints.push(where('role', '==', filter.role));
      if (filter?.classDivision) constraints.push(where('classDivision', '==', filter.classDivision));
      const q = constraints.length > 0 ? query(collections.users, ...constraints) : query(collections.users);
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as User));
    },
    async create({ data }: { data: Omit<User, 'id' | 'createdAt' | 'updatedAt'> & { id?: string } }) {
      const now = new Date().toISOString();
      const docRef = data.id ? doc(firestoreDb, 'users', data.id) : doc(collections.users);
      const userData: User = {
        id: docRef.id,
        name: data.name ?? null,
        email: data.email,
        password: data.password ?? null,
        role: data.role,
        classDivision: data.classDivision ?? null,
        createdAt: now,
        updatedAt: now,
      };
      await setDoc(docRef, userData);
      return userData;
    },
  },

  profiles: {
    async findUnique({ where: filter }: { where: { userId?: string; id?: string } }) {
      if (filter.id) {
        const docRef = doc(firestoreDb, 'profiles', filter.id);
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists()) return null;
        return { id: snapshot.id, ...snapshot.data() } as Profile;
      }
      if (filter.userId) {
        const q = query(collections.profiles, where('userId', '==', filter.userId), firestoreLimit(1));
        const snapshot = await getDocs(q);
        if (snapshot.empty) return null;
        const first = snapshot.docs[0];
        return { id: first.id, ...first.data() } as Profile;
      }
      return null;
    },
    async create({ data }: { data: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'> & { id?: string } }) {
      const now = new Date().toISOString();
      const docRef = data.id ? doc(firestoreDb, 'profiles', data.id) : doc(collections.profiles);
      const profileData: Profile = {
        id: docRef.id,
        userId: data.userId,
        skills: data.skills,
        interests: data.interests,
        preferredRoles: data.preferredRoles,
        portfolioUrl: data.portfolioUrl ?? null,
        githubUrl: data.githubUrl ?? null,
        linkedinUrl: data.linkedinUrl ?? null,
        createdAt: now,
        updatedAt: now,
      };
      await setDoc(docRef, profileData);
      return profileData;
    },
  },

  projects: {
    async findUnique({ where: filter }: { where: { id: string } }) {
      const docRef = doc(firestoreDb, 'projects', filter.id);
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) return null;
      return { id: snapshot.id, ...snapshot.data() } as Project;
    },
    async findMany({ where: filter, orderBy: order }: { where?: { teacherId?: string }; orderBy?: { createdAt?: 'desc' | 'asc' } } = {}) {
      const constraints: QueryConstraint[] = [];
      if (filter?.teacherId) constraints.push(where('teacherId', '==', filter.teacherId));
      const q = constraints.length > 0 ? query(collections.projects, ...constraints) : query(collections.projects);
      const snapshot = await getDocs(q);
      const results = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Project));
      if (order?.createdAt) {
        results.sort((a, b) => {
          const tA = new Date(a.createdAt).getTime();
          const tB = new Date(b.createdAt).getTime();
          return order.createdAt === 'desc' ? tB - tA : tA - tB;
        });
      }
      return results;
    },
    async create({ data }: { data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> & { id?: string } }) {
      const now = new Date().toISOString();
      const docRef = data.id ? doc(firestoreDb, 'projects', data.id) : doc(collections.projects);
      const projectData: Project = {
        id: docRef.id,
        title: data.title,
        description: data.description,
        classDivision: data.classDivision,
        deadline: typeof data.deadline === 'string' ? data.deadline : new Date(data.deadline).toISOString(),
        teamSize: data.teamSize,
        requiredSkills: data.requiredSkills,
        requiredRoles: data.requiredRoles,
        teacherId: data.teacherId,
        createdAt: now,
        updatedAt: now,
      };
      await setDoc(docRef, projectData);
      return projectData;
    },
  },

  teams: {
    async findUnique({ where: filter }: { where: { id: string } }) {
      const docRef = doc(firestoreDb, 'teams', filter.id);
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) return null;
      return { id: snapshot.id, ...snapshot.data() } as Team;
    },
    async findMany({ where: filter }: { where?: { projectId?: string } } = {}) {
      const constraints: QueryConstraint[] = [];
      if (filter?.projectId) constraints.push(where('projectId', '==', filter.projectId));
      const q = constraints.length > 0 ? query(collections.teams, ...constraints) : query(collections.teams);
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Team));
    },
    async create({ data }: { data: Omit<Team, 'id' | 'createdAt' | 'updatedAt'> & { id?: string } }) {
      const now = new Date().toISOString();
      const docRef = data.id ? doc(firestoreDb, 'teams', data.id) : doc(collections.teams);
      const teamData: Team = {
        id: docRef.id,
        projectId: data.projectId,
        name: data.name,
        createdAt: now,
        updatedAt: now,
      };
      await setDoc(docRef, teamData);
      return teamData;
    },
  },

  teamMembers: {
    async findMany({ where: filter }: { where?: { teamId?: string; userId?: string } } = {}) {
      const constraints: QueryConstraint[] = [];
      if (filter?.teamId) constraints.push(where('teamId', '==', filter.teamId));
      if (filter?.userId) constraints.push(where('userId', '==', filter.userId));
      const q = constraints.length > 0 ? query(collections.teamMembers, ...constraints) : query(collections.teamMembers);
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as TeamMember));
    },
    async findFirst({ where: filter }: { where: { userId: string; teamId?: string } }) {
      const constraints: QueryConstraint[] = [where('userId', '==', filter.userId)];
      if (filter.teamId) constraints.push(where('teamId', '==', filter.teamId));
      constraints.push(firestoreLimit(1));
      const q = query(collections.teamMembers, ...constraints);
      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;
      const first = snapshot.docs[0];
      return { id: first.id, ...first.data() } as TeamMember;
    },
    async create({ data }: { data: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'> & { id?: string } }) {
      const now = new Date().toISOString();
      const docRef = data.id ? doc(firestoreDb, 'teamMembers', data.id) : doc(collections.teamMembers);
      const memberData: TeamMember = {
        id: docRef.id,
        teamId: data.teamId,
        userId: data.userId,
        assignedRole: data.assignedRole ?? null,
        createdAt: now,
        updatedAt: now,
      };
      await setDoc(docRef, memberData);
      return memberData;
    },
  },

  tasks: {
    async findUnique({ where: filter }: { where: { id: string } }) {
      const docRef = doc(firestoreDb, 'tasks', filter.id);
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) return null;
      return { id: snapshot.id, ...snapshot.data() } as Task;
    },
    async findMany({ where: filter, orderBy: order }: { where?: { teamId?: string; assigneeId?: string }; orderBy?: { createdAt?: 'desc' | 'asc' } } = {}) {
      const constraints: QueryConstraint[] = [];
      if (filter?.teamId) constraints.push(where('teamId', '==', filter.teamId));
      if (filter?.assigneeId) constraints.push(where('assigneeId', '==', filter.assigneeId));
      const q = constraints.length > 0 ? query(collections.tasks, ...constraints) : query(collections.tasks);
      const snapshot = await getDocs(q);
      const results = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Task));
      if (order?.createdAt) {
        results.sort((a, b) => {
          const tA = new Date(a.createdAt).getTime();
          const tB = new Date(b.createdAt).getTime();
          return order.createdAt === 'desc' ? tB - tA : tA - tB;
        });
      }
      return results;
    },
    async create({ data }: { data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> & { id?: string } }) {
      const now = new Date().toISOString();
      const docRef = data.id ? doc(firestoreDb, 'tasks', data.id) : doc(collections.tasks);
      const taskData: Task = {
        id: docRef.id,
        teamId: data.teamId,
        title: data.title,
        description: data.description || '',
        assigneeId: data.assigneeId ?? null,
        role: data.role ?? null,
        dueDate: data.dueDate ?? null,
        status: data.status || 'TODO',
        createdAt: now,
        updatedAt: now,
      };
      await setDoc(docRef, taskData);
      return taskData;
    },
    async update({ where: filter, data }: { where: { id: string }; data: Partial<Omit<Task, 'id' | 'createdAt'>> }) {
      const docRef = doc(firestoreDb, 'tasks', filter.id);
      const now = new Date().toISOString();
      const updatePayload = { ...data, updatedAt: now };
      await updateDoc(docRef, updatePayload);
      const updated = await getDoc(docRef);
      return { id: updated.id, ...updated.data() } as Task;
    },
  },

  checkIns: {
    async findMany({ where: filter, orderBy: order, take }: { where?: { teamId?: string; userId?: string }; orderBy?: { createdAt?: 'desc' | 'asc' }; take?: number } = {}) {
      const constraints: QueryConstraint[] = [];
      if (filter?.teamId) constraints.push(where('teamId', '==', filter.teamId));
      if (filter?.userId) constraints.push(where('userId', '==', filter.userId));
      const q = constraints.length > 0 ? query(collections.checkIns, ...constraints) : query(collections.checkIns);
      const snapshot = await getDocs(q);
      let results = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as CheckIn));
      if (order?.createdAt) {
        results.sort((a, b) => {
          const tA = new Date(a.createdAt).getTime();
          const tB = new Date(b.createdAt).getTime();
          return order.createdAt === 'desc' ? tB - tA : tA - tB;
        });
      }
      if (take) {
        results = results.slice(0, take);
      }
      return results;
    },
    async create({ data }: { data: Omit<CheckIn, 'id' | 'createdAt'> & { id?: string } }) {
      const now = new Date().toISOString();
      const docRef = data.id ? doc(firestoreDb, 'checkIns', data.id) : doc(collections.checkIns);
      const checkInData: CheckIn = {
        id: docRef.id,
        teamId: data.teamId,
        userId: data.userId,
        week: data.week,
        workedOn: data.workedOn,
        hoursSpent: data.hoursSpent,
        blockers: data.blockers,
        needsHelp: data.needsHelp,
        aiFeedback: data.aiFeedback ?? null,
        createdAt: now,
      };
      await setDoc(docRef, checkInData);
      return checkInData;
    },
  },
};
