"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import VocabTransform from "@/components/VocabTransform";

export default function Home() {
  const [activeItem, setActiveItem] = useState("vocab");

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F4F6FB" }}>
      <Sidebar activeItem={activeItem} onSelect={setActiveItem} />
      <main style={{ flex: 1, overflowY: "auto", minHeight: "100vh" }}>
        {activeItem === "vocab" && <VocabTransform />}
      </main>
    </div>
  );
}
