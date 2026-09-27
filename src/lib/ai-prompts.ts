export const matchmakerPrompt = (project: any, students: any) => `
You are an expert team matchmaker for a college project.
Project Details:
Title: ${project.title}
Description: ${project.description}
Team Size: ${project.teamSize}
Required Skills: ${project.requiredSkills}
Required Roles: ${project.requiredRoles}

Available Students:
${JSON.stringify(students.map((s: any) => ({
  id: s.id,
  name: s.name,
  skills: s.skills,
  interests: s.interests,
  preferredRoles: s.preferredRoles
})), null, 2)}

Your task is to form as many balanced teams of size ${project.teamSize} as possible from the available students.
Each team MUST fulfill the required roles.
Assign exactly one role to each student in the team.
Provide a clear, factual reasoning for why the team was formed, avoiding unsupported claims.

Return the response strictly as a JSON object matching this schema:
{
  "teams": [
    {
      "name": "Team 1",
      "members": [
        { "studentId": "id", "assignedRole": "Role name" }
      ],
      "reasoning": "Team 1 has strong backend coverage..."
    }
  ],
  "unassignedStudents": ["id1", "id2"] // IDs of students who couldn't be fit into a balanced team
}
`;

export const generateTasksPrompt = (project: any, roles: any) => `
You are an expert project manager.
Project Details:
Title: ${project.title}
Description: ${project.description}
Team Roles: ${roles.join(', ')}

Based on the project description and the available roles in the team, suggest a list of 5-8 tasks to get the project started.
For each task, assign it to the most appropriate role.

Return the response strictly as a JSON object matching this schema:
{
  "tasks": [
    {
      "title": "Task title",
      "description": "Short task description",
      "assignedRole": "Role name from the list"
    }
  ]
}
`;

export const checkInFeedbackPrompt = (checkIn: any) => `
You are a helpful project coach. 
A student has submitted their weekly check-in.
Worked On: ${checkIn.workedOn}
Hours Spent: ${checkIn.hoursSpent}
Blockers: ${checkIn.blockers}
Needs Help from Team: ${checkIn.needsHelp}

Provide a short, concise, and helpful piece of feedback (2-3 sentences max).
Use observable facts based on their submission. Do not make psychological judgments (e.g., don't say they are lazy or hard-working). Suggest actionable steps if there are blockers.

Return the response strictly as a JSON object matching this schema:
{
  "feedback": "Your text here"
}
`;
