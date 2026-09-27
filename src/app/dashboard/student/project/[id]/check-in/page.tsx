"use client";

import { useState, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquarePlus, CheckCircle, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function CheckInPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    workedOn: "",
    hours: "",
    blockers: "",
    needsHelp: "no"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.workedOn || !formData.hours) {
      toast.error("Please fill out what you worked on and hours spent.");
      return;
    }
    
    setSubmitting(true);
    
    try {
      const res = await fetch(`/api/projects/${resolvedParams.id}/check-ins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          week: 1, // hardcoded for MVP
          workedOn: formData.workedOn,
          hoursSpent: formData.hours,
          blockers: formData.blockers,
          needsHelp: formData.needsHelp === 'yes'
        })
      });

      if (!res.ok) throw new Error("Failed to submit");
      
      setSubmitting(false);
      setSubmitted(true);
      toast.success("Check-in submitted successfully!");
    } catch (error) {
      setSubmitting(false);
      toast.error("Failed to submit check-in");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href={`/dashboard/student`} className="text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors mb-4 inline-block">
          &larr; Back to Dashboard
        </Link>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
          <MessageSquarePlus className="mr-3 text-blue-600" /> Weekly Check-in
        </h1>
        <p className="text-gray-700 font-medium mt-2 text-lg">Report your progress and get private AI coaching.</p>
      </div>

      {!submitted ? (
        <Card className="shadow-lg border-gray-200">
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-900">1. What did you work on this week?</label>
                <textarea 
                  className="w-full border border-gray-300 rounded-xl p-4 min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-500 placeholder:font-medium text-gray-900 font-semibold"
                  placeholder="E.g., I finished the UI layout for the homepage..."
                  value={formData.workedOn}
                  onChange={e => setFormData({...formData, workedOn: e.target.value})}
                  disabled={submitting}
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-900">2. How much time did you spend? (Hours)</label>
                <input 
                  type="number"
                  className="w-full md:w-1/3 border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-500 placeholder:font-medium text-gray-900 font-semibold"
                  placeholder="e.g. 5"
                  value={formData.hours}
                  onChange={e => setFormData({...formData, hours: e.target.value})}
                  disabled={submitting}
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-900">3. Did you face any blockers? (Optional)</label>
                <textarea 
                  className="w-full border border-gray-300 rounded-xl p-4 min-h-[80px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-500 placeholder:font-medium text-gray-900 font-semibold"
                  placeholder="E.g., The backend API is not returning the expected data..."
                  value={formData.blockers}
                  onChange={e => setFormData({...formData, blockers: e.target.value})}
                  disabled={submitting}
                />
              </div>

              <div className="pt-4 border-t border-gray-100">
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-transform hover:scale-[1.02]"
                  disabled={submitting}
                >
                  {submitting ? (
                     <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> SYNERGIA Coach is analyzing...</>
                  ) : (
                    "Submit Check-in"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6 animate-in zoom-in-95 duration-300">
          <Card className="border-emerald-200 bg-emerald-50 shadow-sm">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-emerald-900 mb-2">Check-in Received</h2>
              <p className="text-emerald-800 font-bold">Your progress has been logged for this week.</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white shadow-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-purple-500"></div>
            <CardContent className="p-8">
              <h3 className="flex items-center text-lg font-extrabold text-purple-900 mb-4 uppercase tracking-wider">
                <Sparkles className="w-5 h-5 mr-2 text-purple-600" /> SYNERGIA Coach
              </h3>
              <p className="text-purple-900 leading-relaxed font-bold text-lg italic mb-6">
                "Great work on the UI layout! Since you mentioned a blocker with the backend API, I recommend syncing with your backend teammate tomorrow. I've flagged this in the Team Health dashboard for your teacher."
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href={`/dashboard/student/project/${resolvedParams.id}/tasks`}>
                  <Button className="w-full sm:w-auto font-bold bg-purple-600 hover:bg-purple-700 text-white">View Related Tasks</Button>
                </Link>
                <Link href={`/dashboard/student`}>
                  <Button variant="outline" className="w-full sm:w-auto font-bold text-purple-800 border-purple-300 hover:bg-purple-100">Back to Dashboard</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
