"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CreateProject() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [title, setTitle] = useState("Smart Campus Assistant");
  const [description, setDescription] = useState("An AI-driven mobile app to help students navigate campus resources, schedules, and events.");
  const [teamSize, setTeamSize] = useState("4");
  const [deadline, setDeadline] = useState("");
  const [classDivision, setClassDivision] = useState("CS-101");
  const [skills, setSkills] = useState("React, Node.js, AI/ML, UI/UX");
  const [roles, setRoles] = useState("Frontend Developer, Backend Developer, AI Specialist, Designer");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Convert comma-separated string to arrays
    const reqSkills = skills.split(',').map(s => s.trim());
    const reqRoles = roles.split(',').map(s => s.trim());
    
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, description, teamSize: parseInt(teamSize), deadline, classDivision, requiredSkills: reqSkills, requiredRoles: reqRoles
        })
      });
      
      if (res.ok) {
        router.push("/dashboard/teacher");
        router.refresh();
      } else {
        alert("Failed to create project");
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
        <p className="text-gray-500 mt-1">Define the project details and required skills to generate balanced teams.</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Project Description</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="classDivision">Class / Division</Label>
                <Input id="classDivision" value={classDivision} onChange={(e) => setClassDivision(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teamSize">Team Size</Label>
                <Input id="teamSize" type="number" min="2" max="10" value={teamSize} onChange={(e) => setTeamSize(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input id="deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Required Skills (Comma separated)</Label>
              <Input id="skills" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="e.g. React, Python, UI/UX" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="roles">Required Roles (Comma separated)</Label>
              <Input id="roles" value={roles} onChange={(e) => setRoles(e.target.value)} placeholder="e.g. Frontend Developer, Designer" required />
              <p className="text-xs text-gray-500">For best AI matching, the number of required roles should match or be close to the team size.</p>
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Project'}
              </Button>
            </div>
            
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
