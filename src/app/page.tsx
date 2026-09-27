"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Sparkles, LineChart, CheckCircle, BrainCircuit, Activity, BookOpen, Layers } from "lucide-react";

export default function Home() {
  const [activeStage, setActiveStage] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  const stages = [
    { title: "STUDENT PROFILES", icon: <Users className="w-5 h-5" />, desc: "Students build skill, interest, and role profiles." },
    { title: "AI MATCHMAKER", icon: <BrainCircuit className="w-5 h-5" />, desc: "SYNERGIA compares skills, interests, preferred roles, and project requirements to suggest team compositions." },
    { title: "BALANCED TEAMS", icon: <Layers className="w-5 h-5" />, desc: "Teachers review, adjust, and finalize perfectly balanced teams with strong role coverage." },
    { title: "PROJECT TASKS", icon: <CheckCircle className="w-5 h-5" />, desc: "Students break down work into an interactive shared task board." },
    { title: "WEEKLY CHECK-INS", icon: <BookOpen className="w-5 h-5" />, desc: "Students report progress, blockers, and time spent each week." },
    { title: "TEAM COACH", icon: <Sparkles className="w-5 h-5" />, desc: "Weekly check-ins and project activity help SYNERGIA identify project-level signals and suggest actions." },
    { title: "HEALTHIER PROJECTS", icon: <Activity className="w-5 h-5" />, desc: "Teams deliver better work, without the usual group project friction." }
  ];

  const steps = [
    { id: "01", name: "Profile", title: "Students build their identity", desc: "No more anonymous group members. Students input their strong skills, what they want to learn, and their preferred roles (e.g. Backend, Presenter).", icon: <Users className="w-8 h-8 text-blue-500" /> },
    { id: "02", name: "Match", title: "AI analyzes the cohort", desc: "SYNERGIA reads the project requirements and calculates the optimal distribution of skills across the entire class, suggesting teams that cover all necessary bases.", icon: <BrainCircuit className="w-8 h-8 text-purple-500" /> },
    { id: "03", name: "Build", title: "Execute with clarity", desc: "Teams organize their work on a shared task board. Everyone knows what they are responsible for, preventing the 'one person does all the work' syndrome.", icon: <Layers className="w-8 h-8 text-emerald-500" /> },
    { id: "04", name: "Coach", title: "Continuous monitoring", desc: "Through quick weekly check-ins, SYNERGIA's AI coach provides private feedback to students and alerts teachers if a team is at risk of falling behind.", icon: <Activity className="w-8 h-8 text-red-500" /> }
  ];

  return (
    <div className="flex flex-col bg-white">
      {/* Hero Section */}
      <section className="flex flex-col justify-center items-center text-center px-4 pt-24 pb-16 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-white">
        <span className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors cursor-default border-0 px-4 py-1.5 text-sm font-semibold rounded-full flex items-center shadow-sm">
          <Sparkles className="w-4 h-4 mr-2" />
          The future of college group projects
        </span>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 max-w-4xl leading-tight">
          Build Better Teams. <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Work Better Together.</span>
        </h1>
        <p className="max-w-2xl text-xl text-gray-600 mb-10 leading-relaxed">
          SYNERGIA is an AI-powered matchmaker and team coach. We analyze skills to build perfectly balanced teams and provide weekly AI coaching to ensure everyone succeeds.
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-20">
          <Link href="/signup">
            <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 font-semibold transition-transform hover:scale-105">
              Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-2 border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 font-semibold transition-colors">
              Sign In
            </Button>
          </Link>
          <a href="#how-it-works">
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-gray-200 text-gray-700 font-semibold bg-white hover:bg-gray-50 transition-colors">
              How it works
            </Button>
          </a>
        </div>

        {/* Interactive Visual Flow */}
        <div className="max-w-5xl w-full mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-8 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">The SYNERGIA Workflow</h3>
          
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 relative">
            {/* Connecting Line for Desktop */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-10 -translate-y-1/2 rounded-full"></div>
            
            {stages.map((stage, idx) => (
              <div 
                key={idx} 
                className={`relative flex flex-col items-center group cursor-pointer transition-all duration-300 ${activeStage === idx ? 'scale-110' : 'opacity-60 hover:opacity-100'}`}
                onClick={() => setActiveStage(idx)}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 shadow-md transition-colors ${activeStage === idx ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
                  {stage.icon}
                </div>
                <span className={`text-[10px] sm:text-xs font-bold text-center max-w-[80px] leading-tight ${activeStage === idx ? 'text-blue-700' : 'text-gray-500'}`}>
                  {stage.title}
                </span>
                
                {/* Connecting Line for Mobile */}
                {idx !== stages.length - 1 && (
                  <div className="lg:hidden w-1 h-6 bg-gray-200 my-2 rounded-full"></div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 bg-blue-50/50 rounded-xl p-6 border border-blue-100 min-h-[120px] flex items-center justify-center transition-all">
            <p className="text-lg md:text-xl text-blue-900 font-medium text-center animate-in fade-in duration-500" key={activeStage}>
              {stages[activeStage].desc}
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Features Section */}
      <section id="how-it-works" className="py-24 px-4 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900">A systematic approach to group work.</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">No more random assignments. No more carrying the entire team.</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-12 items-start">
            {/* Steps Selector */}
            <div className="w-full md:w-1/3 flex flex-col space-y-4">
              {steps.map((step, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`text-left p-6 rounded-2xl transition-all duration-300 border-2 ${activeStep === idx ? 'bg-white border-blue-600 shadow-md transform scale-[1.02]' : 'bg-transparent border-transparent hover:bg-gray-100'}`}
                >
                  <div className={`text-sm font-bold mb-1 ${activeStep === idx ? 'text-blue-600' : 'text-gray-400'}`}>{step.id}</div>
                  <div className={`text-2xl font-extrabold ${activeStep === idx ? 'text-gray-900' : 'text-gray-500'}`}>{step.name}</div>
                </button>
              ))}
            </div>

            {/* Step Content Display */}
            <div className="w-full md:w-2/3">
              <div className="bg-white p-10 md:p-16 rounded-3xl shadow-xl border border-gray-100 h-full flex flex-col justify-center animate-in fade-in slide-in-from-right-8 duration-500" key={activeStep}>
                <div className="mb-8 p-4 bg-gray-50 rounded-2xl inline-block w-fit">
                  {steps[activeStep].icon}
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">{steps[activeStep].title}</h3>
                <p className="text-xl text-gray-600 leading-relaxed">
                  {steps[activeStep].desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
