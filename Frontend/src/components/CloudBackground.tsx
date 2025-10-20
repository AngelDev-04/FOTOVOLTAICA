import { motion } from "motion/react";

interface Cloud {
  id: number;
  top: string;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

export function CloudBackground() {
  // Generate cloud data with varied positions, sizes, and speeds
  const clouds: Cloud[] = [
    { id: 1, top: "5%", size: 1.2, duration: 90, delay: 0, opacity: 0.6 },
    { id: 2, top: "15%", size: 0.8, duration: 70, delay: 10, opacity: 0.4 },
    { id: 3, top: "25%", size: 1.5, duration: 100, delay: 20, opacity: 0.5 },
    { id: 4, top: "8%", size: 1, duration: 85, delay: 30, opacity: 0.45 },
    { id: 5, top: "35%", size: 1.3, duration: 95, delay: 40, opacity: 0.55 },
    { id: 6, top: "45%", size: 0.9, duration: 75, delay: 15, opacity: 0.4 },
    { id: 7, top: "18%", size: 1.1, duration: 80, delay: 50, opacity: 0.5 },
    { id: 8, top: "55%", size: 1.4, duration: 105, delay: 25, opacity: 0.45 },
    { id: 9, top: "12%", size: 0.7, duration: 65, delay: 35, opacity: 0.35 },
    { id: 10, top: "65%", size: 1.2, duration: 90, delay: 45, opacity: 0.5 },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {clouds.map((cloud) => (
        <motion.div
          key={cloud.id}
          className="absolute"
          style={{
            top: cloud.top,
            scale: cloud.size,
          }}
          initial={{ x: "100vw" }}
          animate={{ x: "-20vw" }}
          transition={{
            duration: cloud.duration,
            delay: cloud.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <CloudShape opacity={cloud.opacity} />
        </motion.div>
      ))}
    </div>
  );
}

function CloudShape({ opacity }: { opacity: number }) {
  return (
    <div className="relative" style={{ width: "200px", height: "80px", opacity }}>
      {/* Cloud made of multiple overlapping circles with subtle blue-white tint */}
      <div
        className="absolute rounded-full blur-sm"
        style={{
          width: "60px",
          height: "60px",
          left: "0px",
          top: "20px",
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(220, 235, 250, 0.9) 100%)",
          boxShadow: "0 2px 8px rgba(100, 150, 200, 0.15)",
        }}
      />
      <div
        className="absolute rounded-full blur-sm"
        style={{
          width: "80px",
          height: "80px",
          left: "40px",
          top: "0px",
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(220, 235, 250, 0.9) 100%)",
          boxShadow: "0 2px 8px rgba(100, 150, 200, 0.15)",
        }}
      />
      <div
        className="absolute rounded-full blur-sm"
        style={{
          width: "70px",
          height: "70px",
          left: "80px",
          top: "10px",
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(220, 235, 250, 0.9) 100%)",
          boxShadow: "0 2px 8px rgba(100, 150, 200, 0.15)",
        }}
      />
      <div
        className="absolute rounded-full blur-sm"
        style={{
          width: "60px",
          height: "60px",
          left: "120px",
          top: "20px",
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(220, 235, 250, 0.9) 100%)",
          boxShadow: "0 2px 8px rgba(100, 150, 200, 0.15)",
        }}
      />
      <div
        className="absolute rounded-full blur-md"
        style={{
          width: "100px",
          height: "50px",
          left: "50px",
          top: "30px",
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(220, 235, 250, 0.9) 100%)",
          boxShadow: "0 2px 8px rgba(100, 150, 200, 0.15)",
        }}
      />
    </div>
  );
}
