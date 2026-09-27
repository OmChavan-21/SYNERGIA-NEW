import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await db.users.findUnique({
      where: { email: normalizedEmail }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.users.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role
      }
    });

    // If STUDENT, create a default profile so the Matchmaker doesn't break
    if (role === 'STUDENT') {
      await db.profiles.create({
        data: {
          userId: user.id,
          skills: JSON.stringify(["React", "TypeScript", "Node.js"]),
          interests: JSON.stringify(["Web Development", "AI"]),
          preferredRoles: JSON.stringify(["Frontend Developer", "Backend Developer"]),
        }
      });
    }

    return NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
