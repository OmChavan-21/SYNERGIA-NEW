import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Users, Activity, Calendar, LayoutDashboard, FolderOpen } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default async function TeacherDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'TEACHER') {
    redirect('/login');
  }

  const rawProjects = await db.projects.findMany({
    where: { teacherId: session.user.id },
    orderBy: { createdAt: 'desc' }
  });

  const projects = await Promise.all(
    rawProjects.map(async (project) => {
      const teams = await db.teams.findMany({
        where: { projectId: project.id }
      });
      return {
        ...project,
        teams
      };
    })
  );

  const totalTeams = projects.reduce((acc, p) => acc + p.teams.length, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Teacher Dashboard</h1>
          <p className="text-gray-500 mt-2 text-lg">Manage your class projects and monitor team health.</p>
        </div>
        <Link href="/dashboard/teacher/projects/new">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 font-semibold shadow-sm text-white">
            <PlusCircle className="mr-2 h-5 w-5" /> Create Project
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gray-50/50">
            <CardTitle className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Projects</CardTitle>
            <FolderOpen className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-4xl font-extrabold text-gray-900">{projects.length}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gray-50/50">
            <CardTitle className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Active Teams</CardTitle>
            <Users className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-4xl font-extrabold text-gray-900">{totalTeams}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-gray-200 bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-blue-100 uppercase tracking-wider">SYNERGIA AI</CardTitle>
            <Activity className="h-5 w-5 text-blue-100" />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-lg font-medium leading-snug">
              Ready to generate balanced teams and analyze weekly check-ins.
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center mb-6">
        <LayoutDashboard className="h-6 w-6 mr-2 text-gray-400" />
        <h2 className="text-2xl font-bold text-gray-900">Your Projects</h2>
      </div>
      
      {projects.length === 0 ? (
        <Card className="bg-gray-50 border-dashed border-2 border-gray-300 shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-blue-500 mb-4 bg-blue-50 p-4 rounded-full"><FolderOpen className="h-10 w-10" /></div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-500 mb-6 max-w-md">Create your first project to start forming balanced teams with SYNERGIA AI.</p>
            <Link href="/dashboard/teacher/projects/new">
              <Button className="bg-blue-600 hover:bg-blue-700 font-semibold"><PlusCircle className="mr-2 h-4 w-4" /> Create Project</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map(project => (
            <Card key={project.id} className="hover:shadow-md transition-all border-gray-200">
              <CardHeader className="border-b border-gray-100 bg-gray-50/50 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900 mb-1">{project.title}</CardTitle>
                    <CardDescription className="line-clamp-2 text-gray-500">{project.description}</CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-white text-gray-700 border-gray-200 whitespace-nowrap ml-2">
                    {project.classDivision}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex flex-col">
                    <span className="text-gray-500 font-medium mb-1 flex items-center">
                      <Calendar className="mr-1.5 h-4 w-4" /> Deadline
                    </span>
                    <span className="font-semibold text-gray-900">{formatDistanceToNow(new Date(project.deadline), { addSuffix: true })}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500 font-medium mb-1 flex items-center">
                      <Users className="mr-1.5 h-4 w-4" /> Teams Formed
                    </span>
                    <span className="font-semibold text-gray-900">{project.teams.length > 0 ? project.teams.length : 'None yet'}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 border-t border-gray-100 flex justify-end py-4">
                <Link href={`/dashboard/teacher/projects/${project.id}`}>
                  <Button variant="default" className="bg-gray-900 hover:bg-gray-800 text-white font-medium">Manage Project &rarr;</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
