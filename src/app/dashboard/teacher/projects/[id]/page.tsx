"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users, Bot, Sparkles, CheckCircle, AlertTriangle, BrainCircuit, Activity, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function ProjectDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // AI Generation States
  const [generating, setGenerating] = useState(false);
  const [aiStage, setAiStage] = useState(0);
  const [aiError, setAiError] = useState<string | null>(null);
  
  const [aiTeams, setAiTeams] = useState<any>(null);
  const [rawStudents, setRawStudents] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  
  // UI States
  const [expandedTeam, setExpandedTeam] = useState<number | null>(null);
  const [staleAnalysis, setStaleAnalysis] = useState<boolean>(false);

  useEffect(() => {
    fetch(`/api/projects/${resolvedParams.id}`)
      .then(res => res.json())
      .then(data => {
        setProject(data);
        setLoading(false);
      });
  }, [resolvedParams.id]);

  const runAiSimulation = async () => {
    const stages = [
      "Reading project requirements...",
      "Analyzing student skills...",
      "Checking role coverage...",
      "Comparing interests...",
      "Building team suggestions..."
    ];
    
    for (let i = 0; i < stages.length; i++) {
      setAiStage(i);
      await new Promise(r => setTimeout(r, 600)); // 600ms per stage
    }
  };

  const handleGenerateTeams = async () => {
    setGenerating(true);
    setStaleAnalysis(false);
    setAiError(null);
    try {
      // Run visual simulation in parallel with actual fetch
      const [res] = await Promise.all([
        fetch("/api/matchmaker", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId: resolvedParams.id })
        }),
        runAiSimulation()
      ]);
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "API Error");
      
      setAiTeams(data);
      if (data.rawStudents) {
        setRawStudents(data.rawStudents);
      }
      toast.success("Teams generated successfully");
    } catch (e: any) {
      console.error("[SYNERGIA] Generate Teams Error:", e);
      setAiError(e.message || "SYNERGIA couldn't generate teams.");
      toast.error("Failed to generate teams.");
    }
    setGenerating(false);
  };

  const handleFinalizeTeams = async () => {
    if (!confirm("Finalize these teams? Once finalized, students will see their assigned teams.")) return;
    
    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${resolvedParams.id}/teams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teams: aiTeams.teams })
      });
      
      if (res.ok) {
        toast.success("Teams finalized successfully!");
        setAiTeams(null);
        fetch(`/api/projects/${resolvedParams.id}`)
          .then(res => res.json())
          .then(data => {
            setProject(data);
            setSaving(false);
          });
      }
    } catch (e) {
      toast.error("Failed to save teams.");
      setSaving(false);
    }
  };

  const getStudentDetails = (studentId: string) => {
    return rawStudents.find(s => s.id === studentId) || null;
  };

  const calculateTeamBalance = (team: any) => {
    if (!project) return { roles: "Missing", missingRoles: [], rawPct: 0 };
    const reqRoles = JSON.parse(project.requiredRoles || '[]');
    const coveredRoles = team.members.map((m: any) => m.assignedRole);
    
    const missingRoles = reqRoles.filter((r: string) => !coveredRoles.includes(r));
    const coverageCount = reqRoles.length - missingRoles.length;
    const rawPct = reqRoles.length > 0 ? Math.round((coverageCount / reqRoles.length) * 100) : 100;
    
    let roleBalance = "Strong";
    if (missingRoles.length > 0) roleBalance = "Partial";
    if (missingRoles.length > 1) roleBalance = "Missing";

    return { roles: roleBalance, missingRoles, rawPct };
  };

  const moveStudent = (studentId: string, fromTeamIdx: number, toTeamIdx: number) => {
    const updatedTeams = { ...aiTeams };
    const memberIndex = updatedTeams.teams[fromTeamIdx].members.findIndex((m: any) => m.studentId === studentId);
    if (memberIndex > -1) {
      const member = updatedTeams.teams[fromTeamIdx].members.splice(memberIndex, 1)[0];
      updatedTeams.teams[toTeamIdx].members.push(member);
      setAiTeams(updatedTeams);
      setStaleAnalysis(true);
      
      const newBalance = calculateTeamBalance(updatedTeams.teams[toTeamIdx]);
      if (newBalance.missingRoles.length > 0) {
        toast.warning(`Team ${toTeamIdx + 1} now has a role gap: ${newBalance.missingRoles[0]}`);
      } else {
        toast.info(`Student moved to Team ${toTeamIdx + 1}`);
      }
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin h-10 w-10 text-blue-600 mb-4" />
      <p className="text-gray-500 font-medium">Loading project details...</p>
    </div>
  );
  if (!project) return <div className="p-8 text-center text-red-500">Project not found</div>;

  const aiStagesText = [
    "Reading project requirements...",
    "Analyzing student skills...",
    "Checking role coverage...",
    "Comparing interests...",
    "Building team suggestions..."
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 mb-2 border-0">Project details</Badge>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{project.title}</h1>
          <p className="text-gray-600 mt-2 max-w-3xl text-lg font-medium">{project.description}</p>
        </div>
        {!aiTeams && project.teams.length === 0 && !generating && (
          <Button onClick={handleGenerateTeams} size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-md border-0 h-12 px-6 transition-transform hover:scale-105">
            <Sparkles className="mr-2 h-5 w-5" /> Generate Teams with AI
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-2 bg-gray-50/50">
            <CardTitle className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Required Skills</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-wrap gap-2">
              {JSON.parse(project.requiredSkills).map((skill: string, i: number) => (
                <Badge key={i} variant="secondary" className="bg-gray-100 text-gray-800 font-bold">{skill}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-2 bg-blue-50/50">
            <CardTitle className="text-sm font-semibold text-blue-700 uppercase tracking-wider">Required Roles</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-wrap gap-2">
              {JSON.parse(project.requiredRoles).map((role: string, i: number) => (
                <Badge key={i} variant="outline" className="border-blue-200 bg-blue-50 text-blue-800 font-bold">{role}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-2 bg-gray-50/50">
            <CardTitle className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Team Size</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-gray-900">{project.teamSize}</span>
            <span className="text-lg font-bold text-gray-500">members</span>
          </CardContent>
        </Card>
      </div>

      {aiError && !generating && (
        <Card className="border-2 border-red-200 shadow-md bg-red-50/50 mb-8 animate-in fade-in">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">SYNERGIA couldn't generate teams.</h3>
            <p className="text-red-800 font-medium text-center max-w-lg mb-6">
              {aiError === "No student profiles available in this class division."
                ? "Add student profiles before generating teams."
                : "Check that the project has required roles and that students have completed their profiles."}
              <br />
              <span className="text-sm mt-2 block text-red-600/70 font-semibold">Error detail: {aiError}</span>
            </p>
            <div className="flex space-x-4">
              <Button onClick={handleGenerateTeams} variant="outline" className="border-red-200 text-red-700 font-bold hover:bg-red-100">Retry Generation</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {generating && (
        <Card className="border-2 border-purple-200 shadow-lg bg-purple-50/50 mb-8 animate-in fade-in zoom-in-95">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-purple-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
              <Bot className="w-16 h-16 text-purple-600 relative z-10 animate-bounce" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-purple-500" /> SYNERGIA AI is analyzing
            </h3>
            <p className="text-purple-800 font-bold h-6">{aiStagesText[aiStage]}</p>
            <div className="w-64 bg-gray-200 rounded-full h-2 mt-6">
              <div className="bg-purple-600 h-2 rounded-full transition-all duration-500" style={{ width: `${((aiStage + 1) / 5) * 100}%` }}></div>
            </div>
          </CardContent>
        </Card>
      )}

      {project.teams.length > 0 && (
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center text-gray-900">
              <CheckCircle className="mr-2 h-6 w-6 text-emerald-500" /> Active Teams
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {project.teams.map((team: any) => (
              <Card key={team.id} className="shadow-sm border-gray-200 overflow-hidden">
                <CardHeader className="bg-white border-b border-gray-100 pb-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-extrabold text-gray-900">{team.name}</CardTitle>
                    <Badge variant="outline" className="bg-green-50 text-green-800 font-bold border-green-200">
                      <Activity className="w-3 h-3 mr-1" /> Active
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-3">
                    {team.members.map((m: any) => (
                      <li key={m.id} className="flex justify-between items-center text-sm p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                            {m.user.name.charAt(0)}
                          </div>
                          <span className="font-extrabold text-gray-900">{m.user.name}</span>
                        </div>
                        <Badge variant="secondary" className="bg-white text-gray-900 font-bold border-gray-200 border">{m.assignedRole}</Badge>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <Link href={`/dashboard/teacher/projects/${project.id}/teams/${team.id}`}>
                      <Button className="w-full font-bold bg-blue-600 hover:bg-blue-700 text-white">View Team Health Dashboard &rarr;</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {aiTeams && project.teams.length === 0 && !generating && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center bg-purple-50 p-6 rounded-xl border border-purple-100 shadow-sm">
            <div>
              <h2 className="text-2xl font-bold flex items-center text-purple-900 mb-1">
                <BrainCircuit className="mr-2 h-7 w-7 text-purple-600" /> {aiTeams.teams.length} Team Suggestions Ready
              </h2>
              <p className="text-purple-800 font-bold">Review, adjust, and finalize these AI-suggested teams.</p>
            </div>
            <div className="flex space-x-3">
              <Button onClick={handleGenerateTeams} variant="outline" className="bg-white border-purple-200 text-purple-700 font-bold hover:bg-purple-100">
                Regenerate
              </Button>
              <Button onClick={handleFinalizeTeams} disabled={saving} size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 shadow-sm">
                {saving ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : null}
                {saving ? 'Saving...' : 'Finalize Teams'}
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {aiTeams.teams.map((team: any, idx: number) => {
              const balance = calculateTeamBalance(team);
              const isExpanded = expandedTeam === idx;
              
              return (
                <Card key={idx} className="border-2 border-gray-100 shadow-sm hover:border-purple-200 transition-colors overflow-hidden">
                  <div 
                    className="bg-white p-5 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                    onClick={() => setExpandedTeam(isExpanded ? null : idx)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold text-xl shadow-sm border border-blue-100">
                        T{idx+1}
                      </div>
                      <div>
                        <CardTitle className="text-xl font-extrabold text-gray-900">{team.name}</CardTitle>
                        <div className="flex items-center text-sm text-gray-700 mt-1 font-bold space-x-4">
                          <span className="flex items-center"><Users className="w-4 h-4 mr-1" /> {team.members.length} Members</span>
                          {balance.roles === "Strong" ? (
                            <span className="flex items-center text-emerald-700"><CheckCircle className="w-4 h-4 mr-1"/> Strong Coverage</span>
                          ) : (
                            <span className="flex items-center text-amber-700"><AlertTriangle className="w-4 h-4 mr-1"/> Gaps Present</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="hidden md:flex flex-col items-end mr-4">
                        <span className="text-xs uppercase font-extrabold text-gray-600 tracking-wider mb-1">Role Coverage</span>
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                           <div className={`h-2 rounded-full ${balance.rawPct === 100 ? 'bg-emerald-600' : 'bg-amber-500'}`} style={{ width: `${balance.rawPct}%` }}></div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-gray-700 hover:text-gray-900">
                        {isExpanded ? <ChevronUp /> : <ChevronDown />}
                      </Button>
                    </div>
                  </div>

                  {isExpanded && (
                    <CardContent className="pt-0 pb-6 px-6 bg-gray-50/50 border-t border-gray-200 animate-in slide-in-from-top-2 duration-200">
                      <div className="grid md:grid-cols-3 gap-8 mt-6">
                        {/* Members Panel */}
                        <div className="col-span-2 space-y-4">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-extrabold text-sm text-gray-900 uppercase tracking-wider">Members & Roles</h4>
                            {balance.missingRoles.length > 0 && (
                              <Badge variant="outline" className="bg-amber-50 text-amber-800 font-bold border-amber-200">Missing: {balance.missingRoles.join(", ")}</Badge>
                            )}
                          </div>
                          <ul className="space-y-3">
                            {team.members.map((m: any, mIdx: number) => {
                              const studentInfo = getStudentDetails(m.studentId);
                              return (
                                <li key={mIdx} className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm transition-all hover:shadow-md">
                                  <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center space-x-3">
                                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                                        {(m.studentName || m.studentId).charAt(0)}
                                      </div>
                                      <div>
                                        <span className="font-extrabold text-gray-900 block leading-tight mb-1">{m.studentName || m.studentId}</span>
                                        <Badge variant="secondary" className="text-xs font-bold bg-blue-50 text-blue-800 border border-blue-100">{m.assignedRole}</Badge>
                                      </div>
                                    </div>
                                    
                                    {/* Manual adjustment dropdown */}
                                    <div className="flex flex-col items-end">
                                      <select 
                                        className="text-xs border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-900 py-1.5 pl-2 pr-6 focus:ring-blue-500 cursor-pointer font-bold"
                                        value={idx}
                                        onChange={(e) => moveStudent(m.studentId, idx, parseInt(e.target.value))}
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        {aiTeams.teams.map((t: any, i: number) => (
                                          <option key={i} value={i}>Move to {t.name}</option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                  {studentInfo && (
                                    <div className="pt-3 border-t border-gray-100 flex flex-wrap gap-1.5">
                                      {studentInfo.skills.slice(0, 4).map((s: string, sIdx: number) => (
                                        <span key={sIdx} className="text-[10px] uppercase font-bold tracking-wider text-gray-700 bg-gray-100 px-2 py-1 rounded-md">{s}</span>
                                      ))}
                                      {studentInfo.skills.length > 4 && <span className="text-[10px] font-bold text-gray-500 pt-1">+{studentInfo.skills.length - 4}</span>}
                                    </div>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </div>

                        {/* AI Explanation Panel */}
                        <div className="col-span-1">
                          <h4 className="font-extrabold text-sm text-gray-900 uppercase tracking-wider mb-4">SYNERGIA Analysis</h4>
                          
                          {staleAnalysis ? (
                            <div className="bg-gray-100 p-5 rounded-xl border border-gray-200 flex flex-col items-center justify-center text-center h-48">
                              <AlertCircle className="w-8 h-8 text-gray-500 mb-2" />
                              <p className="text-sm font-bold text-gray-700 mb-3">Team composition changed. Analysis is stale.</p>
                              <Button size="sm" variant="outline" className="font-bold text-gray-800" onClick={handleGenerateTeams}>Re-analyze Team</Button>
                            </div>
                          ) : (
                            <div className="bg-purple-50 p-5 rounded-xl border border-purple-200 h-full">
                              <div className="mb-4 pb-4 border-b border-purple-200">
                                <h5 className="text-xs font-extrabold text-purple-900 uppercase tracking-wider flex items-center mb-2">
                                  <CheckCircle className="w-3.5 h-3.5 mr-1" /> Why this team?
                                </h5>
                                <p className="text-sm text-purple-950 leading-relaxed font-semibold">
                                  {team.reasoning}
                                </p>
                              </div>
                              
                              <div>
                                <h5 className="text-xs font-extrabold text-amber-900 uppercase tracking-wider flex items-center mb-2">
                                  <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Potential Gaps
                                </h5>
                                {balance.missingRoles.length > 0 ? (
                                  <p className="text-sm text-amber-950 leading-relaxed font-semibold">
                                    Missing <strong>{balance.missingRoles.join(", ")}</strong>. Assign this role temporarily during milestones.
                                  </p>
                                ) : (
                                  <p className="text-sm text-emerald-800 leading-relaxed font-semibold">
                                    No major role gaps detected.
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
