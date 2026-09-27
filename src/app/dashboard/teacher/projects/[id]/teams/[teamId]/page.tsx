"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, AlertTriangle, CheckCircle, ListTodo, ShieldAlert, X, FileText, Sparkles } from "lucide-react";

export default function TeamHealthPage({ params }: { params: Promise<{ id: string, teamId: string }> }) {
  const resolvedParams = use(params);
  
  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<'tasks' | 'checkins' | null>(null);

  useEffect(() => {
    // Fetch team details (mocking the previous server component fetch with a client fetch)
    // Actually, I can just use a server component and pass data to a client component.
    // Let me rewrite this as a Client Component that fetches via a new or existing API, 
    // OR just use a wrapper.
    fetch(`/api/projects/${resolvedParams.id}/teams/${resolvedParams.teamId}`)
      .then(res => res.json())
      .then(data => {
        setTeam(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [resolvedParams.id, resolvedParams.teamId]);

  if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading team health...</div>;
  if (!team || team.error) return <div className="p-8 text-center text-red-500">Team not found</div>;

  // Calculate Health Metrics
  const totalTasks = team.tasks.length;
  const completedTasks = team.tasks.filter((t:any) => t.status === 'DONE').length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const membersWithCheckIns = new Set(team.checkIns.map((c:any) => c.userId)).size;
  const missingCheckIns = team.members.length - membersWithCheckIns;

  let healthStatus = "Healthy";
  if (progress < 50 || missingCheckIns > 0) healthStatus = "Needs Attention";
  if (progress < 30 || missingCheckIns > 1) healthStatus = "At Risk";

  const unsubmittedMembers = team.members.filter((m:any) => 
    !team.checkIns.some((c:any) => c.userId === m.user.id)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      {/* Modal Overlay */}
      {activeModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">
                {activeModal === 'checkins' ? 'Check-in Evidence' : 'Task Breakdown'}
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {activeModal === 'checkins' && (
                <ul className="space-y-3">
                  {team.members.map((m: any) => {
                    const submitted = team.checkIns.find((c:any) => c.userId === m.user.id);
                    return (
                      <li key={m.id} className="flex justify-between items-center p-3 rounded-lg border border-gray-100 bg-white">
                        <span className="font-semibold text-gray-800">{m.user.name}</span>
                        {submitted ? (
                          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-0"><CheckCircle className="w-3 h-3 mr-1"/> Submitted</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-0"><AlertTriangle className="w-3 h-3 mr-1"/> Missing</Badge>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
              {activeModal === 'tasks' && (
                <ul className="space-y-3">
                  {team.tasks.map((t: any) => (
                    <li key={t.id} className="flex justify-between items-center p-3 rounded-lg border border-gray-100 bg-white">
                      <span className="font-medium text-gray-800 truncate pr-4">{t.title}</span>
                      <Badge variant="outline" className={t.status === 'DONE' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}>
                        {t.status}
                      </Badge>
                    </li>
                  ))}
                  {team.tasks.length === 0 && <p className="text-center text-gray-500 py-4">No tasks assigned.</p>}
                </ul>
              )}
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <Button onClick={() => setActiveModal(null)} variant="outline">Close</Button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8 flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Link href={`/dashboard/teacher/projects/${resolvedParams.id}`} className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
              &larr; Back to Project
            </Link>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-1">{team.name} Health</h1>
          <p className="text-gray-500 font-medium text-lg">Project: {team.project.title}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 bg-gray-50/50">
            <CardTitle className="text-xs font-bold text-gray-500 uppercase tracking-widest">Overall Status</CardTitle>
          </CardHeader>
          <CardContent className="pt-5 flex items-center">
            {healthStatus === "Healthy" && <CheckCircle className="w-8 h-8 text-emerald-500 mr-3" />}
            {healthStatus === "Needs Attention" && <AlertTriangle className="w-8 h-8 text-amber-500 mr-3" />}
            {healthStatus === "At Risk" && <ShieldAlert className="w-8 h-8 text-red-500 mr-3" />}
            <span className={`text-2xl font-extrabold ${
              healthStatus === "Healthy" ? "text-emerald-600" : 
              healthStatus === "Needs Attention" ? "text-amber-600" : "text-red-600"
            }`}>{healthStatus}</span>
          </CardContent>
        </Card>
        
        <Card 
          className="shadow-sm border-gray-200 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all group"
          onClick={() => setActiveModal('tasks')}
        >
          <CardHeader className="pb-2 bg-gray-50/50 group-hover:bg-blue-50/30 transition-colors">
            <CardTitle className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center justify-between">
              Task Progress <FileText className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="flex items-end justify-between mb-3">
              <span className="text-3xl font-extrabold text-gray-900 leading-none">{completedTasks} <span className="text-lg text-gray-400">/ {totalTasks}</span></span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="shadow-sm border-gray-200 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all group"
          onClick={() => setActiveModal('checkins')}
        >
          <CardHeader className="pb-2 bg-gray-50/50 group-hover:bg-blue-50/30 transition-colors">
            <CardTitle className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center justify-between">
              Check-ins <Activity className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
             <div className="flex items-center">
               <div className="text-3xl font-extrabold text-gray-900 leading-none">{membersWithCheckIns} <span className="text-lg text-gray-400">/ {team.members.length}</span></div>
             </div>
             <p className="text-sm font-medium text-gray-500 mt-2">Submitted this week</p>
          </CardContent>
        </Card>

        <Card className="shadow-md border-purple-200 bg-gradient-to-br from-purple-50 to-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-purple-500"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-purple-700 uppercase tracking-widest flex items-center">
              <Sparkles className="w-4 h-4 mr-1" /> SYNERGIA Coach
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3">
             {healthStatus === "Healthy" && (
               <p className="text-sm font-semibold text-purple-900 leading-snug">Team is well-balanced and progressing steadily. No intervention needed.</p>
             )}
             {healthStatus === "Needs Attention" && missingCheckIns > 0 && (
               <>
                 <p className="text-sm font-semibold text-purple-900 leading-snug mb-2">
                   {missingCheckIns} members have not submitted check-ins.
                 </p>
                 <Button variant="outline" size="sm" className="w-full text-xs bg-white text-purple-700 hover:bg-purple-100" onClick={() => setActiveModal('checkins')}>
                   View Evidence
                 </Button>
               </>
             )}
             {healthStatus === "At Risk" && (
               <p className="text-sm font-semibold text-red-700 leading-snug">Critical task backlog and missing check-ins. Schedule a brief intervention meeting.</p>
             )}
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center mb-6 border-b border-gray-100 pb-4">
        <Activity className="w-6 h-6 mr-2 text-gray-400" />
        <h2 className="text-2xl font-bold text-gray-900">Recent Check-ins</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {team.checkIns.map((checkIn:any) => (
          <Card key={checkIn.id} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 border-b border-gray-100 bg-white">
              <CardTitle className="text-lg font-bold flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm">
                    {checkIn.user.name.charAt(0)}
                  </div>
                  <span>{checkIn.user.name}</span>
                </div>
                <Badge variant="secondary" className="bg-gray-100 text-gray-700 font-medium">{checkIn.hoursSpent} hrs</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-5">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Worked On</span>
                <p className="text-sm text-gray-800 font-medium">{checkIn.workedOn}</p>
              </div>
              {checkIn.blockers && (
                <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                  <span className="text-[10px] font-bold text-red-800 uppercase tracking-widest block mb-1">Blockers</span>
                  <p className="text-sm text-red-900 font-medium">{checkIn.blockers}</p>
                </div>
              )}
              {checkIn.aiFeedback && (
                <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 relative overflow-hidden">
                   <span className="text-[10px] font-bold text-purple-800 uppercase tracking-widest block mb-1 flex items-center">
                     <Sparkles className="w-3 h-3 mr-1" /> AI Coaching Sent
                   </span>
                   <p className="text-sm text-purple-900 italic font-medium relative z-10">"{checkIn.aiFeedback}"</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {team.checkIns.length === 0 && (
          <div className="col-span-full p-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium text-lg">No check-ins submitted by this team yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
