import React from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

export function Links() {
  const links = [
    {
      title: "Employee Dashboard",
      description: "Access your personal financial dashboard with health scores, goals, and recommendations",
      hash: "#dashboard",
      icon: "📊",
    },
    {
      title: "Orders",
      description: "View and manage your orders and transactions",
      hash: "#orders",
      icon: "📦",
    },
    {
      title: "AI Agent",
      description: "Chat with your AI financial assistant",
      hash: "#agent",
      icon: "🤖",
    },
    {
      title: "HR Portal",
      description: "HR management interface for employee administration",
      hash: "#hr",
      icon: "👥",
    },
    {
      title: "Kotak811 for Corporates",
      description: "Corporate relationship console for RMs and sales teams",
      hash: "#crm",
      icon: "💼",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--background))] via-white to-[hsl(var(--accent))]/20">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Application Navigation
          </h1>
          <p className="text-lg text-gray-600">
            Select a portal to access different parts of the application
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {links.map((link) => (
            <Card
              key={link.hash}
              className="p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border-2 hover:border-blue-400"
              onClick={() => (window.location.hash = link.hash.slice(1))}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="text-5xl">{link.icon}</div>
                <h2 className="text-xl font-bold text-gray-900">
                  {link.title}
                </h2>
                <p className="text-sm text-gray-600 flex-grow">
                  {link.description}
                </p>
                <Button
                  className="w-full mt-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.hash = link.hash.slice(1);
                  }}
                >
                  Go to {link.title}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            💡 Tip: You can bookmark specific pages using their direct URLs
          </p>
        </div>
      </div>
    </div>
  );
}

