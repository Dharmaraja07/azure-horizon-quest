import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Zap, Sword, Sparkles } from "lucide-react";

// Types
type BattleState = "idle" | "player-turn" | "enemy-turn" | "victory" | "defeat";
type PlayerAction = "dash" | "slash" | "spin" | "energy-burst" | null;
type EnemyAction = "tentacle-slam" | "lightning-strike" | null;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  type: "energy" | "dust" | "lightning" | "spark";
}

interface DamageNumber {
  x: number;
  y: number;
  value: number;
  life: number;
  maxLife: number;
  isCritical: boolean;
}

interface BattleArenaProps {
  onBack?: () => void;
}

export const BattleArena = ({ onBack }: BattleArenaProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  
  // Battle state
  const [battleState, setBattleState] = useState<BattleState>("idle");
  const [playerHP, setPlayerHP] = useState(100);
  const [enemyHP, setEnemyHP] = useState(100);
  const [playerAction, setPlayerAction] = useState<PlayerAction>(null);
  const [enemyAction, setEnemyAction] = useState<EnemyAction>(null);
  const [comboCount, setComboCount] = useState(0);
  const [cameraShake, setCameraShake] = useState({ x: 0, y: 0, intensity: 0 });
  
  // Animation state
  const [kaiaPosition, setKaiaPosition] = useState({ x: 200, y: 300 });
  const [kaiaRotation, setKaiaRotation] = useState(0);
  const [kaiaScale, setKaiaScale] = useState(1);
  const [krakenPosition, setKrakenPosition] = useState({ x: 800, y: 200 });
  const [tentaclePositions, setTentaclePositions] = useState<Array<{ x: number; y: number; angle: number }>>([]);
  
  // Effects
  const [particles, setParticles] = useState<Particle[]>([]);
  const [damageNumbers, setDamageNumbers] = useState<DamageNumber[]>([]);
  const [speedlines, setSpeedlines] = useState<Array<{ x: number; y: number; length: number; angle: number }>>([]);
  
  // Refs for animation timing
  const actionStartTimeRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);

  // Initialize battle
  useEffect(() => {
    setBattleState("player-turn");
    initializeTentacles();
  }, []);

  const initializeTentacles = () => {
    const tentacles = Array.from({ length: 6 }, (_, i) => ({
      x: 800 + Math.cos((i * Math.PI * 2) / 6) * 50,
      y: 200 + Math.sin((i * Math.PI * 2) / 6) * 50,
      angle: (i * Math.PI * 2) / 6,
    }));
    setTentaclePositions(tentacles);
  };

  // Particle system
  const createParticle = useCallback((
    x: number,
    y: number,
    type: Particle["type"],
    count: number = 1
  ) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      let color = "";
      let vx = 0;
      let vy = 0;
      let size = 0;
      let life = 0;

      switch (type) {
        case "energy":
          color = `hsl(${200 + Math.random() * 20}, 95%, ${60 + Math.random() * 20}%)`;
          vx = (Math.random() - 0.5) * 8;
          vy = (Math.random() - 0.5) * 8;
          size = 3 + Math.random() * 4;
          life = 30 + Math.random() * 20;
          break;
        case "dust":
          color = `hsl(0, 0%, ${70 + Math.random() * 20}%)`;
          vx = (Math.random() - 0.5) * 4;
          vy = (Math.random() - 0.5) * 4 - 2;
          size = 2 + Math.random() * 3;
          life = 20 + Math.random() * 15;
          break;
        case "lightning":
          color = `hsl(${220 + Math.random() * 20}, 100%, ${80 + Math.random() * 15}%)`;
          vx = (Math.random() - 0.5) * 12;
          vy = (Math.random() - 0.5) * 12;
          size = 2 + Math.random() * 3;
          life = 15 + Math.random() * 10;
          break;
        case "spark":
          color = `hsl(${45 + Math.random() * 20}, 100%, ${60 + Math.random() * 20}%)`;
          vx = (Math.random() - 0.5) * 6;
          vy = (Math.random() - 0.5) * 6;
          size = 1 + Math.random() * 2;
          life = 10 + Math.random() * 10;
          break;
      }

      newParticles.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        vx,
        vy,
        life,
        maxLife: life,
        color,
        size,
        type,
      });
    }
    setParticles((prev) => [...prev, ...newParticles]);
  }, []);

  // Damage number system
  const createDamageNumber = useCallback((x: number, y: number, damage: number, isCritical: boolean = false) => {
    setDamageNumbers((prev) => [
      ...prev,
      {
        x,
        y,
        value: damage,
        life: 60,
        maxLife: 60,
        isCritical,
      },
    ]);
  }, []);

  // Camera shake
  const triggerCameraShake = useCallback((intensity: number, duration: number = 10) => {
    setCameraShake({ x: 0, y: 0, intensity });
    let frame = 0;
    const shakeInterval = setInterval(() => {
      frame++;
      if (frame >= duration) {
        clearInterval(shakeInterval);
        setCameraShake({ x: 0, y: 0, intensity: 0 });
        return;
      }
      setCameraShake({
        x: (Math.random() - 0.5) * intensity,
        y: (Math.random() - 0.5) * intensity,
        intensity: intensity * (1 - frame / duration),
      });
    }, 16);
  }, []);

  // Speedlines
  const createSpeedlines = useCallback((x: number, y: number, direction: number) => {
    const lines: Array<{ x: number; y: number; length: number; angle: number }> = [];
    for (let i = 0; i < 15; i++) {
      lines.push({
        x: x + (Math.random() - 0.5) * 400,
        y: y + (Math.random() - 0.5) * 400,
        length: 50 + Math.random() * 100,
        angle: direction + (Math.random() - 0.5) * 0.3,
      });
    }
    setSpeedlines((prev) => [...prev, ...lines]);
    setTimeout(() => {
      setSpeedlines((prev) => prev.slice(lines.length));
    }, 300);
  }, []);

  // Player actions
  const executePlayerAction = useCallback((action: PlayerAction) => {
    if (battleState !== "player-turn" || !action) return;

    setPlayerAction(action);
    actionStartTimeRef.current = Date.now();
    setBattleState("player-turn");

    switch (action) {
      case "dash":
        // Dash forward
        setKaiaPosition((prev) => ({ x: prev.x + 150, y: prev.y }));
        createSpeedlines(kaiaPosition.x, kaiaPosition.y, -Math.PI / 2);
        setTimeout(() => {
          setPlayerAction("slash");
          createParticle(kaiaPosition.x + 150, kaiaPosition.y, "energy", 20);
        }, 200);
        break;

      case "slash":
        // Slash attack
        setKaiaRotation((prev) => prev + Math.PI / 4);
        createParticle(kaiaPosition.x, kaiaPosition.y, "energy", 15);
        createParticle(kaiaPosition.x, kaiaPosition.y, "spark", 10);
        const slashDamage = 15 + Math.floor(Math.random() * 10);
        setEnemyHP((prev) => Math.max(0, prev - slashDamage));
        createDamageNumber(krakenPosition.x, krakenPosition.y - 50, slashDamage);
        triggerCameraShake(5, 8);
        setTimeout(() => {
          setPlayerAction("spin");
        }, 300);
        break;

      case "spin":
        // Aerial spin attack
        setKaiaPosition((prev) => ({ x: prev.x + 100, y: prev.y - 80 }));
        setKaiaRotation((prev) => prev + Math.PI * 2);
        createParticle(kaiaPosition.x, kaiaPosition.y, "energy", 30);
        createSpeedlines(kaiaPosition.x, kaiaPosition.y, -Math.PI / 2);
        const spinDamage = 20 + Math.floor(Math.random() * 15);
        setEnemyHP((prev) => Math.max(0, prev - spinDamage));
        createDamageNumber(krakenPosition.x, krakenPosition.y - 50, spinDamage, true);
        triggerCameraShake(8, 10);
        setTimeout(() => {
          setPlayerAction("energy-burst");
        }, 400);
        break;

      case "energy-burst":
        // Energy burst
        setKaiaScale(1.5);
        createParticle(kaiaPosition.x, kaiaPosition.y, "energy", 50);
        createParticle(kaiaPosition.x, kaiaPosition.y, "spark", 30);
        const burstDamage = 30 + Math.floor(Math.random() * 20);
        setEnemyHP((prev) => Math.max(0, prev - burstDamage));
        createDamageNumber(krakenPosition.x, krakenPosition.y - 50, burstDamage, true);
        triggerCameraShake(12, 15);
        setTimeout(() => {
          setKaiaScale(1);
          setPlayerAction(null);
          setComboCount((prev) => prev + 1);
          if (enemyHP - burstDamage <= 0) {
            setBattleState("victory");
          } else {
            setBattleState("enemy-turn");
            setTimeout(() => executeEnemyAction(), 1000);
          }
        }, 500);
        break;
    }
  }, [battleState, kaiaPosition, krakenPosition, enemyHP, createParticle, createSpeedlines, createDamageNumber, triggerCameraShake]);

  // Enemy actions
  const executeEnemyAction = useCallback(() => {
    if (battleState !== "enemy-turn") return;

    const actions: EnemyAction[] = ["tentacle-slam", "lightning-strike"];
    const action = actions[Math.floor(Math.random() * actions.length)];
    setEnemyAction(action);
    actionStartTimeRef.current = Date.now();

    switch (action) {
      case "tentacle-slam":
        // Animate tentacles slamming down
        setTentaclePositions((prev) =>
          prev.map((tentacle) => ({
            ...tentacle,
            y: tentacle.y + 200,
            angle: tentacle.angle + Math.PI / 4,
          }))
        );
        createParticle(kaiaPosition.x, kaiaPosition.y + 100, "dust", 40);
        createParticle(kaiaPosition.x, kaiaPosition.y + 100, "spark", 20);
        const tentacleDamage = 10 + Math.floor(Math.random() * 15);
        setPlayerHP((prev) => Math.max(0, prev - tentacleDamage));
        createDamageNumber(kaiaPosition.x, kaiaPosition.y - 50, tentacleDamage);
        triggerCameraShake(10, 12);
        setTimeout(() => {
          initializeTentacles();
          setEnemyAction(null);
          if (playerHP - tentacleDamage <= 0) {
            setBattleState("defeat");
          } else {
            setBattleState("player-turn");
          }
        }, 800);
        break;

      case "lightning-strike":
        // Lightning strike
        createParticle(kaiaPosition.x, kaiaPosition.y, "lightning", 60);
        createParticle(kaiaPosition.x, kaiaPosition.y, "energy", 30);
        const lightningDamage = 15 + Math.floor(Math.random() * 20);
        setPlayerHP((prev) => Math.max(0, prev - lightningDamage));
        createDamageNumber(kaiaPosition.x, kaiaPosition.y - 50, lightningDamage);
        triggerCameraShake(8, 10);
        setTimeout(() => {
          setEnemyAction(null);
          if (playerHP - lightningDamage <= 0) {
            setBattleState("defeat");
          } else {
            setBattleState("player-turn");
          }
        }, 600);
        break;
    }
  }, [battleState, kaiaPosition, playerHP, createParticle, createDamageNumber, triggerCameraShake]);

  // Start combo
  const startCombo = () => {
    if (battleState === "player-turn" && !playerAction) {
      setComboCount(0);
      executePlayerAction("dash");
    }
  };

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateParticles = () => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.2, // gravity for dust
            life: p.life - 1,
          }))
          .filter((p) => p.life > 0)
      );
    };

    const updateDamageNumbers = () => {
      setDamageNumbers((prev) =>
        prev
          .map((dn) => ({
            ...dn,
            y: dn.y - 2,
            life: dn.life - 1,
          }))
          .filter((dn) => dn.life > 0)
      );
    };

    const animate = () => {
      const now = Date.now();
      const deltaTime = now - lastFrameTimeRef.current;
      lastFrameTimeRef.current = now;

      updateParticles();
      updateDamageNumbers();

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Apply camera shake
      ctx.save();
      ctx.translate(cameraShake.x, cameraShake.y);

      // Draw background (floating island)
      drawArena(ctx, canvas.width, canvas.height);

      // Draw speedlines
      drawSpeedlines(ctx);

      // Draw particles
      drawParticles(ctx);

      // Draw Kraken
      drawKraken(ctx, krakenPosition.x, krakenPosition.y, enemyAction);

      // Draw Kaia
      drawKaia(ctx, kaiaPosition.x, kaiaPosition.y, kaiaRotation, kaiaScale, playerAction);

      // Draw damage numbers
      drawDamageNumbers(ctx);

      ctx.restore();

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    lastFrameTimeRef.current = Date.now();
    animate();

    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [cameraShake, kaiaPosition, kaiaRotation, kaiaScale, krakenPosition, playerAction, enemyAction, particles, damageNumbers, speedlines]);

  // Drawing functions
  const drawArena = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
    skyGradient.addColorStop(0, "hsl(220, 50%, 15%)");
    skyGradient.addColorStop(1, "hsl(220, 60%, 8%)");
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, width, height);

    // Floating clouds
    for (let i = 0; i < 5; i++) {
      const cloudX = (Date.now() * 0.01 + i * 200) % (width + 200) - 100;
      const cloudY = 100 + i * 150;
      drawCloud(ctx, cloudX, cloudY);
    }

    // Floating island platform
    const islandY = height - 150;
    const islandGradient = ctx.createLinearGradient(0, islandY, 0, height);
    islandGradient.addColorStop(0, "hsl(30, 40%, 25%)");
    islandGradient.addColorStop(1, "hsl(30, 50%, 15%)");
    ctx.fillStyle = islandGradient;
    ctx.beginPath();
    ctx.ellipse(width / 2, islandY, width * 0.4, 80, 0, 0, Math.PI * 2);
    ctx.fill();

    // Glowing runes
    for (let i = 0; i < 6; i++) {
      const runeX = width / 2 + Math.cos((i * Math.PI * 2) / 6) * (width * 0.3);
      const runeY = islandY + Math.sin((i * Math.PI * 2) / 6) * 30;
      drawRune(ctx, runeX, runeY);
    }
  };

  const drawCloud = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.fillStyle = "hsla(220, 30%, 20%, 0.4)";
    ctx.beginPath();
    ctx.arc(x, y, 40, 0, Math.PI * 2);
    ctx.arc(x + 30, y, 50, 0, Math.PI * 2);
    ctx.arc(x + 60, y, 40, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawRune = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const pulse = Math.sin(Date.now() * 0.005) * 0.3 + 0.7;
    ctx.strokeStyle = `hsla(200, 95%, 65%, ${pulse})`;
    ctx.lineWidth = 2;
    ctx.shadowBlur = 20;
    ctx.shadowColor = "hsl(200, 95%, 65%)";
    ctx.beginPath();
    // Simple rune pattern
    ctx.moveTo(x, y - 15);
    ctx.lineTo(x - 10, y);
    ctx.lineTo(x, y + 15);
    ctx.lineTo(x + 10, y);
    ctx.closePath();
    ctx.stroke();
    ctx.shadowBlur = 0;
  };

  const drawSpeedlines = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = "hsla(200, 95%, 65%, 0.6)";
    ctx.lineWidth = 2;
    speedlines.forEach((line) => {
      ctx.beginPath();
      ctx.moveTo(line.x, line.y);
      ctx.lineTo(
        line.x + Math.cos(line.angle) * line.length,
        line.y + Math.sin(line.angle) * line.length
      );
      ctx.stroke();
    });
  };

  const drawParticles = (ctx: CanvasRenderingContext2D) => {
    particles.forEach((particle) => {
      const alpha = particle.life / particle.maxLife;
      ctx.fillStyle = particle.color.replace("hsl", "hsla").replace("%)", `%, ${alpha})`);
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  const drawKaia = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    rotation: number,
    scale: number,
    action: PlayerAction
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.scale(scale, scale);

    // Blue energy aura
    if (action) {
      const auraGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 60);
      auraGradient.addColorStop(0, "hsla(200, 95%, 65%, 0.6)");
      auraGradient.addColorStop(1, "hsla(200, 95%, 65%, 0)");
      ctx.fillStyle = auraGradient;
      ctx.beginPath();
      ctx.arc(0, 0, 60, 0, Math.PI * 2);
      ctx.fill();
    }

    // Body (simplified anime-style character)
    // Head
    ctx.fillStyle = "#FFDBAC";
    ctx.beginPath();
    ctx.arc(0, -40, 15, 0, Math.PI * 2);
    ctx.fill();

    // Hair (blue-tinted)
    ctx.fillStyle = "#4A90E2";
    ctx.beginPath();
    ctx.arc(0, -50, 18, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = "#2C5F8D";
    ctx.fillRect(-12, -25, 24, 35);

    // Arms with energy blades
    ctx.fillStyle = "#1A3A5A";
    ctx.fillRect(-20, -20, 8, 25);
    ctx.fillRect(12, -20, 8, 25);

    // Energy blades
    if (action === "slash" || action === "spin" || action === "energy-burst") {
      const bladeGradient = ctx.createLinearGradient(-25, -15, -35, -25);
      bladeGradient.addColorStop(0, "hsl(200, 95%, 80%)");
      bladeGradient.addColorStop(1, "hsl(200, 95%, 50%)");
      ctx.fillStyle = bladeGradient;
      ctx.beginPath();
      ctx.moveTo(-25, -15);
      ctx.lineTo(-35, -25);
      ctx.lineTo(-30, -30);
      ctx.lineTo(-20, -20);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(25, -15);
      ctx.lineTo(35, -25);
      ctx.lineTo(30, -30);
      ctx.lineTo(20, -20);
      ctx.closePath();
      ctx.fill();
    }

    // Legs
    ctx.fillStyle = "#1A3A5A";
    ctx.fillRect(-10, 10, 8, 25);
    ctx.fillRect(2, 10, 8, 25);

    ctx.restore();
  };

  const drawKraken = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    action: EnemyAction
  ) => {
    ctx.save();
    ctx.translate(x, y);

    // Main body (storm cloud)
    const bodyGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 80);
    bodyGradient.addColorStop(0, "hsl(220, 60%, 30%)");
    bodyGradient.addColorStop(1, "hsl(220, 80%, 15%)");
    ctx.fillStyle = bodyGradient;
    ctx.beginPath();
    ctx.arc(0, 0, 80, 0, Math.PI * 2);
    ctx.fill();

    // Glowing eyes
    const eyeGlow = Math.sin(Date.now() * 0.01) * 0.3 + 0.7;
    ctx.fillStyle = `hsla(200, 100%, 80%, ${eyeGlow})`;
    ctx.shadowBlur = 20;
    ctx.shadowColor = "hsl(200, 100%, 80%)";
    ctx.beginPath();
    ctx.arc(-25, -20, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(25, -20, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Tentacles
    tentaclePositions.forEach((tentacle, i) => {
      ctx.save();
      ctx.translate(tentacle.x - x, tentacle.y - y);
      ctx.rotate(tentacle.angle);

      const tentacleGradient = ctx.createLinearGradient(0, 0, 0, 150);
      tentacleGradient.addColorStop(0, "hsl(220, 60%, 25%)");
      tentacleGradient.addColorStop(1, "hsl(220, 80%, 15%)");
      ctx.fillStyle = tentacleGradient;
      ctx.beginPath();
      ctx.ellipse(0, 0, 15, 150, 0, 0, Math.PI * 2);
      ctx.fill();

      // Lightning on tentacles during attack
      if (action === "tentacle-slam") {
        ctx.strokeStyle = `hsl(${220 + Math.random() * 20}, 100%, 80%)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo((Math.random() - 0.5) * 30, 50);
        ctx.lineTo((Math.random() - 0.5) * 30, 100);
        ctx.stroke();
      }

      ctx.restore();
    });

    // Lightning aura during lightning strike
    if (action === "lightning-strike") {
      for (let i = 0; i < 10; i++) {
        ctx.strokeStyle = `hsl(${220 + Math.random() * 20}, 100%, ${80 + Math.random() * 15}%)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100);
        ctx.lineTo((Math.random() - 0.5) * 200, (Math.random() - 0.5) * 200);
        ctx.stroke();
      }
    }

    ctx.restore();
  };

  const drawDamageNumbers = (ctx: CanvasRenderingContext2D) => {
    damageNumbers.forEach((dn) => {
      const alpha = dn.life / dn.maxLife;
      const scale = 1 + (1 - alpha) * 0.5;
      ctx.save();
      ctx.translate(dn.x, dn.y);
      ctx.scale(scale, scale);
      ctx.fillStyle = dn.isCritical
        ? `hsla(0, 100%, 60%, ${alpha})`
        : `hsla(0, 0%, 100%, ${alpha})`;
      ctx.font = dn.isCritical ? "bold 32px Arial" : "24px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(dn.value.toString(), 0, 0);
      ctx.restore();
    });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* Canvas for battle animation */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ imageRendering: "pixelated" }}
      />

      {/* UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Player HP Bar */}
        <div className="absolute top-8 left-8 w-80">
          <div className="text-white mb-2 font-bold text-lg">Kaia Stormwind</div>
          <div className="h-8 bg-black/50 rounded-lg overflow-hidden border-2 border-blue-500/50">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300 relative overflow-hidden"
              style={{ width: `${playerHP}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
                {playerHP} / 100
              </span>
            </div>
          </div>
        </div>

        {/* Enemy HP Bar */}
        <div className="absolute top-8 right-8 w-80">
          <div className="text-white mb-2 font-bold text-lg text-right">Storm Kraken</div>
          <div className="h-8 bg-black/50 rounded-lg overflow-hidden border-2 border-purple-500/50">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-300 relative overflow-hidden"
              style={{ width: `${enemyHP}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
                {enemyHP} / 100
              </span>
            </div>
          </div>
        </div>

        {/* Combo Counter */}
        {comboCount > 0 && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="text-6xl font-bold text-yellow-400 drop-shadow-2xl animate-pulse">
              {comboCount}x COMBO!
            </div>
          </div>
        )}

        {/* Ability Icons */}
        {battleState === "player-turn" && !playerAction && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 pointer-events-auto">
            <Button
              onClick={startCombo}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg font-bold shadow-lg hover:scale-110 transition-all"
            >
              <Zap className="mr-2 h-5 w-5" />
              Start Combo
            </Button>
          </div>
        )}

        {/* Victory/Defeat Screen */}
        {battleState === "victory" && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <Card className="p-8 text-center">
              <div className="text-6xl font-bold text-yellow-400 mb-4">VICTORY!</div>
              <div className="text-xl text-white mb-6">Kaia has defeated the Storm Kraken!</div>
              {onBack && (
                <Button onClick={onBack} className="mt-4">
                  Return to Hub
                </Button>
              )}
            </Card>
          </div>
        )}

        {battleState === "defeat" && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <Card className="p-8 text-center">
              <div className="text-6xl font-bold text-red-400 mb-4">DEFEAT</div>
              <div className="text-xl text-white mb-6">The Storm Kraken was too powerful...</div>
              {onBack && (
                <Button onClick={onBack} className="mt-4">
                  Return to Hub
                </Button>
              )}
            </Card>
          </div>
        )}

        {/* Back Button */}
        {onBack && (
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 pointer-events-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="bg-black/50 border-white/30 text-white hover:bg-black/70"
            >
              <X className="h-4 w-4 mr-2" />
              Exit Battle
            </Button>
          </div>
        )}
      </div>

      {/* Motion Blur Effect */}
      {(playerAction || enemyAction) && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backdropFilter: "blur(2px)",
            opacity: 0.3,
          }}
        />
      )}
    </div>
  );
};
