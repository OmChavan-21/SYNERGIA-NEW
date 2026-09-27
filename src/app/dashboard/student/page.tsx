import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle2, AlertCircle, Sparkles, LayoutList, MessageSquarePlus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'STUDENT') {
    redirect('/login');
  }

  const user = await db.users.findUnique({
    where: { id: session.user.id }
  });

  if (!user) return null;

  const teamMembers = await db.teamMembers.findMany({
    where: { userId: session.user.id }
  });

  const populatedTeamMembers = (await Promise.all(
    teamMembers.map(async (tm) => {
      const team = await db.teams.findUnique({ where: { id: tm.teamId } });
      if (!team) return null;

      const project = await db.projects.findUnique({ where: { id: team.projectId } });
      if (!project) return null;

      const tasks = await db.tasks.findMany({
        where: { teamId: tm.teamId, assigneeId: session.user.id }
      });

      const checkIns = await db.checkIns.findMany({
        where: { teamId: tm.teamId, userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        take: 1
      });

      return {
        ...tm,
        team: {
          ...team,
          project,
          tasks,
          checkIns
        }
      };
    })
  )).filter(Boolean) as Array<{
    id: string;
    teamId: string;
    userId: string;
    assignedRole: string | null;
    team: {
      id: string;
      name: string;
      project: {
        id: string;
        title: string;
        deadline: string;
      };
      tasks: Array<{ id: string; title: string; status: string }>;
      checkIns: Array<{ aiFeedback: string | null }>;
    };
  }>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome back, {user.name}</h1>
        <p className="text-gray-600 font-medium mt-2 text-lg">Here is the status of your assigned projects.</p>
      </div>

      {populatedTeamMembers.length === 0 ? (
        <Card className="bg-gray-50 border-dashed border-2 border-gray-300 shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <h3 className="text-xl font-bold text-gray-900 mb-2">No active projects</h3>
            <p className="text-gray-600 font-medium mb-6 text-center max-w-md">You have not been assigned to a team yet. Your teacher will assign you to a project soon.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {populatedTeamMembers.map(tm => {
            const project = tm.team.project;
            const myTasks = tm.team.tasks;
            const completedTasks = myTasks.filter(t => t.status === 'DONE').length;
            const taskProgress = myTasks.length > 0 ? Math.round((completedTasks / myTasks.length) * 100) : 0;
            const latestCheckIn = tm.team.checkIns[0];

            return (
              <Card key={tm.id} className="overflow-hidden shadow-sm border-gray-200">
                <CardHeader className="bg-white border-b border-gray-100 pb-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className="bg-blue-100 text-blue-900 hover:bg-blue-200 border-0 uppercase font-bold tracking-wide text-[10px]">
                          {tm.team.name}
                        </Badge>
                      </div>
                      <CardTitle className="text-2xl font-extrabold text-gray-900">{project.title}</CardTitle>
                      <CardDescription className="mt-2 text-base text-gray-700 font-bold">
                        My Role: <Badge variant="outline" className="ml-2 text-sm bg-gray-50 border-gray-300 text-gray-900">{tm.assignedRole || 'Unassigned'}</Badge>
                      </CardDescription>
                    </div>
                    <div className="text-right bg-red-50 px-4 py-2 rounded-lg border border-red-200">
                      <div className="text-xs font-extrabold text-red-900 uppercase tracking-wider mb-1">Next Milestone</div>
                      <div className="text-sm font-bold flex items-center text-red-700">
                        <Calendar className="mr-2 h-4 w-4" />
                        {formatDistanceToNow(new Date(project.deadline), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Tasks Summary */}
                  <div className="flex flex-col h-full">
                    <h4 className="font-extrabold text-sm text-gray-700 uppercase tracking-wider mb-4 flex items-center">
                      <LayoutList className="mr-2 h-4 w-4 text-gray-500" />
                      Task Progress
                    </h4>
                    
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-extrabold text-gray-900">{completedTasks} / {myTasks.length}</span>
                        <span className="text-sm font-bold text-gray-600">completed</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 border border-gray-300">
                        <div className="bg-blue-600 h-3 rounded-full transition-all" style={{ width: `${taskProgress}%` }}></div>
                      </div>
                    </div>

                    <div className="flex-1">
                      {myTasks.length > 0 ? (
                        <ul className="space-y-3">
                          {myTasks.slice(0, 3).map(task => (
                            <li key={task.id} className="text-sm flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                              <span className={task.status === 'DONE' ? 'line-through text-gray-500 font-bold' : 'font-bold text-gray-900'}>{task.title}</span>
                              <Badge variant={task.status === 'DONE' ? 'default' : 'secondary'} className={task.status === 'DONE' ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-white font-bold border-gray-300 text-gray-800'}>
                                {task.status}
                              </Badge>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-600 font-medium italic p-4 bg-gray-50 rounded-lg border border-gray-200">No tasks assigned yet.</p>
                      )}
                    </div>
                    
                    <Link href={`/dashboard/student/project/${project.id}/tasks`} className="mt-4">
                      <Button className="w-full font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-transform hover:scale-[1.02]">Open Task Board</Button>
                    </Link>
                  </div>

                  {/* AI Coaching & Check-ins */}
                  <div className="flex flex-col h-full">
                    <h4 className="font-extrabold text-sm text-gray-700 uppercase tracking-wider mb-4 flex items-center">
                      <Sparkles className="mr-2 h-4 w-4 text-purple-600" />
                      SYNERGIA Coach
                    </h4>
                    
                    <div className="flex-1 bg-purple-50 p-5 rounded-xl border border-purple-200 shadow-sm">
                      {latestCheckIn ? (
                        <>
                          <div className="flex items-center space-x-2 mb-3 pb-3 border-b border-purple-200">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            <span className="text-sm font-extrabold text-gray-900">Check-in submitted</span>
                          </div>
                          <p className="text-xs font-extrabold text-purple-900 uppercase tracking-wider mb-2">Latest Advice</p>
                          <p className="text-sm text-purple-950 leading-relaxed font-semibold">"{latestCheckIn.aiFeedback}"</p>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center py-4">
                          <AlertCircle className="w-8 h-8 text-purple-500 mb-3" />
                          <p className="text-sm text-purple-900 font-extrabold mb-1">Weekly Check-in Due</p>
                          <p className="text-xs text-purple-800 font-medium">Submit your progress to get AI coaching.</p>
                        </div>
                      )}
                    </div>
                    
                    <Link href={`/dashboard/student/project/${project.id}/check-in`} className="mt-4">
                      <Button className="w-full font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-transform hover:scale-[1.02]">
                        <MessageSquarePlus className="w-4 h-4 mr-2" />
                        {latestCheckIn ? 'Submit Next Check-in' : 'Submit Check-in'}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
