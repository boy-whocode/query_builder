'use client'
import React, { useState } from "react";
import ConditionGroup from "@/components/ConditionGroup"

function Home() {

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 shadow rounded">
        <h1 className="text-2xl font-bold mb-4">Query Builder</h1>
        <ConditionGroup isRoot />
      </div>
    </div>
  );
}

export default Home;
