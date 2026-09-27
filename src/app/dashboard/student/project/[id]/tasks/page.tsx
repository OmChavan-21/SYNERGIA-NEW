"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, LayoutList, CheckCircle2, PlayCircle, Clock } from "lucide-react";
import { toast } from "sonner";

export default function StudentTasksPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  
  const [project, setProject] = useState<any>(null);
  const [myTasks, setMyTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/projects/${resolvedParams.id}/tasks`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
           setMyTasks(data);
        }
        setProject({ id: resolvedParams.id, title: "Your Project" }); // Fetching project could be another call, but let's just keep a placeholder title for now.
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [resolvedParams.id]);

  const handleUpdateStatus = async (taskId: string, newStatus: string) => {
    setMyTasks(prev => 
      prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t)
    );
    
    if (newStatus === 'DOING') toast.info("Task started.");
    if (newStatus === 'DONE') toast.success("Task marked complete!");

    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (e) {
      toast.error("Failed to update task");
    }
  };

  if (loading) return <div className="p-12 text-center animate-pulse text-gray-500">Loading tasks...</div>;

  const todoTasks = myTasks.filter(t => t.status === "TODO");
  const doingTasks = myTasks.filter(t => t.status === "DOING");
  const doneTasks = myTasks.filter(t => t.status === "DONE");

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-2">
          <Link href={`/dashboard/student`} className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
            &larr; Back to Dashboard
          </Link>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
          <LayoutList className="mr-3 text-blue-600" /> Task Board
        </h1>
        <p className="text-gray-500 mt-2 text-lg">Manage your assigned work for {project?.title}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* TODO COLUMN */}
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
          <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="font-bold text-gray-700 uppercase tracking-wider text-sm flex items-center">
              To Do
            </h3>
            <Badge className="bg-gray-200 text-gray-700">{todoTasks.length}</Badge>
          </div>
          <div className="space-y-3">
            {todoTasks.map(task => (
              <Card key={task.id} className="shadow-sm border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group">
                <CardContent className="p-4">
                  <p className="font-medium text-gray-900 mb-3">{task.title}</p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full bg-white text-blue-600 hover:bg-blue-50 border-blue-200"
                    onClick={() => handleUpdateStatus(task.id, 'DOING')}
                  >
                    <PlayCircle className="w-4 h-4 mr-2" /> Start Task
                  </Button>
                </CardContent>
              </Card>
            ))}
            {todoTasks.length === 0 && <p className="text-center text-sm text-gray-400 py-4 font-medium border-2 border-dashed rounded-xl">No pending tasks</p>}
          </div>
        </div>

        {/* DOING COLUMN */}
        <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100">
          <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="font-bold text-blue-800 uppercase tracking-wider text-sm flex items-center">
              <Clock className="w-4 h-4 mr-1" /> Doing
            </h3>
            <Badge className="bg-blue-200 text-blue-800">{doingTasks.length}</Badge>
          </div>
          <div className="space-y-3">
            {doingTasks.map(task => (
              <Card key={task.id} className="shadow-md border-blue-200 border-l-4 border-l-blue-500 hover:shadow-lg transition-all">
                <CardContent className="p-4">
                  <p className="font-medium text-gray-900 mb-3">{task.title}</p>
                  <Button 
                    size="sm" 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                    onClick={() => handleUpdateStatus(task.id, 'DONE')}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Complete
                  </Button>
                </CardContent>
              </Card>
            ))}
            {doingTasks.length === 0 && <p className="text-center text-sm text-blue-400 py-4 font-medium border-2 border-dashed border-blue-200 rounded-xl">No active tasks</p>}
          </div>
        </div>

        {/* DONE COLUMN */}
        <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100">
          <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="font-bold text-emerald-800 uppercase tracking-wider text-sm flex items-center">
              Done
            </h3>
            <Badge className="bg-emerald-200 text-emerald-800">{doneTasks.length}</Badge>
          </div>
          <div className="space-y-3">
            {doneTasks.map(task => (
              <Card key={task.id} className="shadow-sm border-emerald-100 bg-white/60 opacity-70 hover:opacity-100 transition-opacity">
                <CardContent className="p-4 flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="font-medium text-gray-500 line-through">{task.title}</p>
                </CardContent>
              </Card>
            ))}
            {doneTasks.length === 0 && <p className="text-center text-sm text-emerald-400 py-4 font-medium border-2 border-dashed border-emerald-200 rounded-xl">No completed tasks</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
