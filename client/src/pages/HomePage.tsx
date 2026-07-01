import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight, Crosshair, Terminal, Cpu, RefreshCw } from 'lucide-react';
import axios from 'axios';
import Button from '../components/Button';
import TechTag from '../components/TechTag';

export default function HomePage() {
  const { t } = useTranslation();
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isPinging, setIsPinging] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // เริ่มต้นตั้งค่าบรรทัดต้อนรับใน Console
  useEffect(() => {
    setTerminalLogs([
      `> ${t('home.terminal.welcomeMsg1')}`,
      `> ${t('home.terminal.welcomeMsg2')}`,
      `> ${t('home.terminal.welcomeMsg3')}`,
    ]);
  }, [t]);

  // เลื่อนหน้าจอ Terminal ลงล่างสุดเมื่อมี Log ใหม่
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  const addLogLine = (line: string) => {
    setTerminalLogs((prev) => [...prev, line]);
  };

  // คำสั่งทดสอบการเชื่อมต่อ API หลังบ้าน
  const handlePing = async () => {
    if (isPinging) return;
    setIsPinging(true);
    addLogLine(`$ ping backend_api`);
    addLogLine(`> ${t('home.terminal.pinging')}`);

    const startTime = Date.now();
    try {
      const res = await axios.get('/api/health');
      const latency = Date.now() - startTime;
      addLogLine(
        `> ${t('home.terminal.pingSuccess', { ms: latency, status: res.status })}`
      );
      addLogLine(`> payload: ${JSON.stringify(res.data)}`);
    } catch (err) {
      addLogLine(`> ${t('home.terminal.pingError')}`);
      console.error(err);
    } finally {
      setIsPinging(false);
    }
  };

  // ดึงข้อมูลทักษะผ่าน API โปรไฟล์มาแสดงผล
  const handleScanSkills = async () => {
    addLogLine(`$ query --skills`);
    addLogLine(`> ${t('home.terminal.skillsTitle')}`);
    try {
      const res = await axios.get('/api/profile');
      if (res.data && Array.isArray(res.data.skills)) {
        res.data.skills.forEach((skill: string, index: number) => {
          addLogLine(`  [${(index + 1).toString().padStart(2, '0')}] ${skill}`);
        });
      } else {
        throw new Error('No skills found');
      }
    } catch {
      // ข้อมูลสำรองเผื่อ API ยังไม่ทำงาน
      const fallback = ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express', 'PostgreSQL', 'Git', 'IT Support'];
      fallback.forEach((skill, index) => {
        addLogLine(`  [${(index + 1).toString().padStart(2, '0')}] ${skill}`);
      });
    }
  };

  // ล้างหน้าจอ
  const handleClear = () => {
    setTerminalLogs([]);
  };

  // จัดการประมวลผลคำสั่งที่ป้อนเข้ามา
  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim().toLowerCase();
    if (!cmd) return;

    addLogLine(`$ ${inputVal}`);
    setInputVal('');

    switch (cmd) {
      case 'help':
        addLogLine('> คำสั่งที่สามารถใช้งานได้ / Available commands:');
        addLogLine('  help      - แสดงรายการคำสั่งทั้งหมด');
        addLogLine('  whoami    - ข้อมูลผู้พัฒนาพอร์ตโฟลิโอ');
        addLogLine('  skills    - สแกนทักษะความรู้หลัก');
        addLogLine('  ping      - ตรวจวัดการเชื่อมต่อหลังบ้าน');
        addLogLine('  system    - ตรวจวัดสถานะ RX-93 Cockpit');
        addLogLine('  clear     - ล้างหน้าต่างคำสั่งทั้งหมด');
        break;
      case 'whoami':
        addLogLine(`> name: ${t('home.name')}`);
        addLogLine(`> role: ${t('home.role1')} / ${t('home.role2')}`);
        break;
      case 'skills':
        handleScanSkills();
        break;
      case 'ping':
        handlePing();
        break;
      case 'clear':
        handleClear();
        break;
      case 'system':
        addLogLine('> Cockpit OS metrics loaded:');
        addLogLine('  [UNIT]      RX-93 Nu Gundam (V-2)');
        addLogLine('  [POWER]     Psycoframe Synchronization Active');
        addLogLine('  [TEMP]      Core Reactor: 38.6°C');
        addLogLine('  [NETWORK]   Secure PostgreSQL/Neon database linked');
        break;
      default:
        addLogLine(`> Command not recognized: '${cmd}'. Type 'help' for instructions.`);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center">
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(var(--color-accent-blue) 1px, transparent 1px), linear-gradient(90deg, var(--color-accent-blue) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-32 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Greeting & Info */}
          <div className="lg:col-span-7 space-y-6">
            <div className="animate-fade-in-up flex items-center gap-3">
              <Crosshair size={16} className="text-accent-blue animate-pulse" />
              <span className="font-mono text-xs text-accent-blue tracking-[0.25em] uppercase typewriter-cursor">
                {t('home.greeting')}
              </span>
            </div>

            <h1 className="animate-fade-in-up font-display font-bold text-4xl sm:text-5xl md:text-6xl text-text tracking-tight uppercase leading-none">
              {t('home.name')}
              <span className="text-accent-gold">.</span>
            </h1>

            <p className="animate-fade-in-up-delay font-display text-xl md:text-2xl text-text-muted tracking-wide">
              {t('home.headline')}
            </p>

            <p className="animate-fade-in-up-delay font-body text-base md:text-lg text-text-muted max-w-2xl leading-relaxed">
              {t('home.intro')}
            </p>

            {/* Target roles badges */}
            <div className="animate-fade-in-up-delay-2 inline-block">
              <div className="bg-surface border border-hairline p-5 relative hover:border-accent-blue/30 transition-colors duration-300">
                <div className="absolute top-0 left-0 w-16 h-[2px] bg-accent-gold" />
                <p className="font-mono text-[10px] text-text-muted tracking-[0.3em] uppercase mb-3">
                  {t('home.designation')}
                </p>
                <div className="flex flex-wrap gap-2">
                  <TechTag label={t('home.role1')} variant="gold" />
                  <TechTag label={t('home.role2')} />
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="animate-fade-in-up-delay-2 pt-2">
              <Link to="/projects">
                <Button>
                  {t('home.cta')}
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: RX-93 Cockpit System Monitor Terminal */}
          <div className="lg:col-span-5 animate-fade-in-up-delay-2">
            <div className="target-bracket-full bg-surface border border-hairline relative overflow-hidden group shadow-2xl">
              
              {/* Scanline overlay for high-tech HUD feel */}
              <div className="absolute inset-0 scanline-bg opacity-[0.03] pointer-events-none" />
              
              {/* Upper console bar */}
              <div className="bg-bg border-b border-hairline px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="font-mono text-[10px] text-text tracking-wider uppercase font-semibold">
                    {t('home.terminal.title')}
                  </span>
                </div>
                <span className="font-mono text-[9px] text-accent-gold/80 px-2 py-0.5 border border-accent-gold/20 bg-accent-gold/5 uppercase">
                  {t('home.terminal.status')}
                </span>
              </div>

              {/* Scrollable logs screen */}
              <div className="h-68 overflow-y-auto font-mono text-[11px] text-text-muted p-4 space-y-1.5 select-text bg-bg/80 scrollbar-thin">
                {terminalLogs.map((log, i) => (
                  <div key={i} className="whitespace-pre-wrap leading-relaxed">
                    {log.startsWith('$') ? (
                      <span className="text-accent-blue font-semibold">{log}</span>
                    ) : log.startsWith('  [') ? (
                      <span className="text-text">{log}</span>
                    ) : log.startsWith('>') ? (
                      <span className="text-text-muted">{log}</span>
                    ) : (
                      <span>{log}</span>
                    )}
                  </div>
                ))}
                <div ref={terminalEndRef} />
              </div>

              {/* Console command input */}
              <form
                onSubmit={handleCommandSubmit}
                className="flex items-center bg-bg/50 px-4 py-2 border-t border-hairline font-mono text-xs"
              >
                <span className="text-accent-blue mr-2 font-bold select-none">$</span>
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Type help or system..."
                  className="flex-1 bg-transparent border-none text-text focus:outline-none placeholder-text-muted/20"
                />
              </form>

              {/* Actions HUD Buttons */}
              <div className="grid grid-cols-3 border-t border-hairline font-mono text-[10px] text-center divide-x divide-hairline">
                <button
                  type="button"
                  onClick={handlePing}
                  disabled={isPinging}
                  className="py-3 bg-surface hover:bg-accent-blue/5 hover:text-accent-blue transition-all uppercase cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
                >
                  <RefreshCw size={10} className={`${isPinging ? 'animate-spin' : ''}`} />
                  {t('home.terminal.btnPing')}
                </button>
                <button
                  type="button"
                  onClick={handleScanSkills}
                  className="py-3 bg-surface hover:bg-accent-blue/5 hover:text-accent-blue transition-all uppercase cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Cpu size={10} />
                  {t('home.terminal.btnSkills')}
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="py-3 bg-surface hover:bg-accent-red/5 hover:text-accent-red transition-all uppercase cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Terminal size={10} />
                  {t('home.terminal.btnClear')}
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

