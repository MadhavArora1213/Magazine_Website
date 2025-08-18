import React from "react";

const SubCategory = ({
  title,
  description,
  tags = [],
  children,
  bgColor = "#ffffff",
  textColor = "#162048",
}) => (
  <div className="relative flex flex-col items-center justify-center py-16 mb-10" style={{ background: bgColor }}>
    {/* Animated floating shapes */}
    <div className="absolute inset-0 pointer-events-none z-0">
      <div className="absolute left-10 top-0 w-32 h-32 rounded-full bg-[#162048]/10 animate-bounce-slow" />
      <div className="absolute right-10 top-10 w-24 h-24 rounded-full bg-[#162048]/20 animate-pulse" />
      <div className="absolute left-1/2 bottom-0 w-40 h-16 bg-[#162048]/10 rounded-full blur-2xl -translate-x-1/2" />
    </div>
    <span className="relative z-10 text-xs uppercase tracking-widest font-bold text-[#162048] bg-white px-4 py-1 rounded-full shadow border border-[#162048] mb-3">
      {title}
    </span>
    <h1
      className="relative z-10 text-6xl md:text-7xl font-black text-center tracking-tight mb-4"
      style={{
        color: textColor,
        letterSpacing: "0.02em",
        textShadow: "0 6px 24px #16204822",
      }}
    >
      {title}
    </h1>
    {description && (
      <p className="relative z-10 text-lg md:text-2xl text-[#1a1a1a] font-medium max-w-2xl text-center mb-2">
        {description}
      </p>
    )}
    {tags.length > 0 && (
      <div className="relative z-10 mt-4 flex gap-3 flex-wrap justify-center">
        {tags.map((tag, idx) => (
          <span
            key={idx}
            className="inline-block bg-[#162048] text-white px-4 py-1 rounded-full font-semibold text-xs shadow"
          >
            {tag}
          </span>
        ))}
      </div>
    )}
    {children}
    <style>
      {`
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite alternate;
        }
        @keyframes bounce-slow {
          0% { transform: translateY(0);}
          100% { transform: translateY(30px);}
        }
        .animate-pulse {
          animation: pulse 2s infinite alternate;
        }
        @keyframes pulse {
          0% { opacity: 1;}
          100% { opacity: 0.7;}
        }
      `}
    </style>
  </div>
);

export default SubCategory;