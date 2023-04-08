import React, { ReactNode } from "react";

interface CollapsableSectionProps {
  children: ReactNode;
  title: string;
}

export default function CollapsableSection({children, title}: CollapsableSectionProps) {
  const [collapsed, setCollapsed] = React.useState(true);

  return (
    <>
      <div className="cursor-pointer flex items-center mt-1" onClick={() => setCollapsed(!collapsed)}>
        <svg
          className={
            "w-[24px] fill-white transition-transform mr-1 " +
            (collapsed ? "rotate-0" : "rotate-90")
          }
          focusable="false"
          aria-hidden="true"
          viewBox="0 0 24 24"
        >
          <path d="m10 17 5-5-5-5v10z"></path>
        </svg>
        <span className="font-bold text-gray-400">{title}</span>
      </div>
      {!collapsed && children}
    </>
  );
}
