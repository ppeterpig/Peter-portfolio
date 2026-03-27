import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, ArrowLeft, GraduationCap, Award, Code, 
  Layout, Cpu, Globe, ChevronUp, Sparkles, Send, Loader2 
} from 'lucide-react';

// --- 翻译字典 ---
const TRANSLATIONS = {
  cn: {
    nav: ['首页', '项目目录', '个人信息', '实习经历'],
    hero: { line1: "Peter", line2: "UIUX Design", line3: "2025-2026", scroll: "探索作品" },
    gallery: { 
      title: "项目目录", 
      projects: [
        { tag: "H5页面设计", title: "海外语聊产品视觉设计" },
        { tag: "UI项目", title: "AI记账APP改本设计" },
        { tag: "运营项目", title: "荔枝线上运营系项目" },
        { tag: "IP形象设计", title: "充电产品智能IP设计" },
        { tag: "UX项目", title: "教育App改版设计" }
      ]
    },
    about: { 
      title: "个人信息", 
      edu: "教育经历", 
      skills: "专业技能", 
      award: "获奖荣誉",
      aiAssistant: "Peter小助手",
      aiPlaceholder: "向小助手提问...",
      schools: [
        { name: "广东工业大学", degree: "工业设计工程专业 硕士" },
        { name: "中南林业科技大学", degree: "工业设计 本科" }
      ],
      awards: [
        "三项实用新型专利以及一项外观专利",
        "第十六届蓝桥杯视觉艺术设计大赛省级三等奖 2025",
        "2025年米兰设计周广东赛区三等奖 2025",
        "第九届华灿杯二等奖 2024",
        "第十二届未来设计师全国高校数字艺术设计大赛省级一等奖 2024"
      ]
    },
    exp: { 
      title: "实习经历",
      list: [
        { c: "Apple", r: "产品设计实习", d: "2024 - 至今", desc: "探索 VisionOS 的空间交互边界。" },
        { c: "Pentagram", r: "视觉设计", d: "2023 - 2024", desc: "参与顶级科技品牌的视觉重塑。" },
        { c: "IDEO", r: "用户研究", d: "2022 - 2023", desc: "通过人本设计驱动移动出行方案。" },
        { c: "ByteDance", r: "UI 实习", d: "2021 - 2022", desc: "负责亿级日活产品的界面迭代。" }
      ]
    },
    footer: { btn: "回到首页" },
    back: "返回项目"
  },
  en: {
    nav: ['Home', 'Project Gallery', 'About', 'Experience'],
    hero: { line1: "Peter", line2: "UIUX Design", line3: "2025-2026", scroll: "Explore" },
    gallery: { 
      title: "Project Gallery", 
      projects: [
        { tag: "H5 Design", title: "Global Audio Chat App" },
        { tag: "UI Project", title: "AI Bookkeeping App" },
        { tag: "Marketing", title: "Lizhi Operation Design" },
        { tag: "IP Design", title: "Smart Charging IP" },
        { tag: "UX Project", title: "Education App Redesign" }
      ]
    },
    about: { 
      title: "About Me", 
      edu: "Education", 
      skills: "Skills", 
      award: "Recognition",
      aiAssistant: "Peter Assistant",
      aiPlaceholder: "Ask Peter's AI...",
      schools: [
        { name: "GDUT", degree: "M.Eng Industrial Design" },
        { name: "CSUFT", degree: "B.A Industrial Design" }
      ],
      awards: [
        "3 Utility Model Patents & 1 Design Patent",
        "Lanqiao Cup Visual Arts Design - 3rd Prize 2025",
        "Milan Design Week (China) - 3rd Prize 2025",
        "9th Huacan Cup - 2nd Prize 2024",
        "12th Future Designers (NCDA) - 1st Prize 2024"
      ]
    },
    exp: { 
      title: "Experience",
      list: [
        { c: "Apple", r: "Product Design", d: "2024 - Present", desc: "Exploring boundaries of VisionOS." },
        { c: "Pentagram", r: "Visual Identity", d: "2023 - 2024", desc: "Redefining visual systems for tech giants." },
        { c: "IDEO", r: "Ux Research", d: "2022 - 2023", desc: "Human-centered design for mobility." },
        { c: "Bytedance", r: "Ui Intern", d: "2021 - 2022", desc: "Iterating UI for 1B+ active users." }
      ]
    },
    footer: { btn: "Back to Home" },
    back: "Back to Projects"
  }
};

const PROJECT_COVERS = [
  "https://i.postimg.cc/1fcRKh0J/1.jpg",
  "https://i.postimg.cc/qzXBGVcQ/2.jpg",
  "https://i.postimg.cc/LgFYnkRg/3.jpg",
  "https://i.postimg.cc/7fMPN81B/4.jpg",
  "https://i.postimg.cc/gxzzSSN9/5.jpg"
];

// --- Gemini API ---
const callGemini = async (prompt, lang) => {
  const apiKey = "AIzaSyCO5zYbYRMx_r5YwT6nsSRRicY1GXQDRrY"; 
  const systemPrompt = "你是设计师 Peter 的 AI 助理。请以专业、极简且亲切的口吻回答问题。回答应简短精炼，不超过100字。";
  const fetchWithRetry = async (retries = 5, delay = 1000) => {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] }
        })
      });
      if (!response.ok) throw new Error('API Error');
      return await response.json();
    } catch (error) {
      if (retries > 0) {
        await new Promise(res => setTimeout(res, delay));
        return fetchWithRetry(retries - 1, delay * 2);
      }
      throw error;
    }
  };
  const result = await fetchWithRetry();
  return result.candidates?.[0]?.content?.parts?.[0]?.text || "抱歉，我暂时无法回答。";
};

// --- 3D Background ---
const ThreeBackground = ({ isJumping, isHiding }) => {
  const containerRef = useRef();
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 25;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    const count = 1800; 
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 30 + Math.random() * 150;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i*3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i*3+2] = r * Math.cos(phi);
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.ShaderMaterial({
      uniforms: { opacity: { value: 0.6 } },
      vertexShader: `void main() { vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); gl_PointSize = (350.0 / -mvPosition.z); gl_Position = projectionMatrix * mvPosition; }`,
      fragmentShader: `uniform float opacity; void main() { float dist = length(gl_PointCoord - vec2(0.5, 0.5)); if (dist > 0.5) discard; gl_FragColor = vec4(1.0, 1.0, 1.0, opacity * (0.5 - dist) * 2.0); }`,
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const onMouseMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', onMouseMove);
    const animate = () => {
      points.rotation.y += 0.0002;
      const targetRotationX = mouseRef.current.y * 0.15;
      const targetRotationY = mouseRef.current.x * 0.15;
      points.rotation.x = THREE.MathUtils.lerp(points.rotation.x, targetRotationX, 0.05);
      points.rotation.y = THREE.MathUtils.lerp(points.rotation.y, targetRotationY, 0.05);
      if (isHiding) {
        material.uniforms.opacity.value = THREE.MathUtils.lerp(material.uniforms.opacity.value, 0, 0.1);
        points.scale.setScalar(THREE.MathUtils.lerp(points.scale.x, 0.5, 0.1));
      } else if (isJumping) {
        points.scale.setScalar(THREE.MathUtils.lerp(points.scale.x, 3.0, 0.05));
        material.uniforms.opacity.value = THREE.MathUtils.lerp(material.uniforms.opacity.value, 1.0, 0.1);
      } else {
        points.scale.setScalar(THREE.MathUtils.lerp(points.scale.x, 1, 0.05));
        material.uniforms.opacity.value = THREE.MathUtils.lerp(material.uniforms.opacity.value, 0.6, 0.05);
      }
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();
    return () => { 
        window.removeEventListener('mousemove', onMouseMove);
        if (containerRef.current) containerRef.current.removeChild(renderer.domElement); 
    };
  }, [isJumping, isHiding]);
  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0" />;
};

// --- Animations ---
const dropContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};
const dropIn = {
  hidden: { opacity: 0, y: -150 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] } }
};

const GlassPanel = ({ children, className = "" }) => (
  <div className={`relative bg-white/5 backdrop-blur-[25px] border border-white/10 rounded-[24px] shadow-lg ${className}`}>
    {children}
  </div>
);
const PageHeader = ({ children }) => (
  <motion.h2 variants={dropIn} className="text-[#555555] text-[20px] font-bold tracking-[0.02em] opacity-80 uppercase select-none h-[52px] flex items-center mb-9 font-sans">
    {children}
  </motion.h2>
);

export default function App() {
  const [lang, setLang] = useState('cn');
  const [activeTab, setActiveTab] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isJumping, setIsJumping] = useState(false);
  const [isHiding, setIsHiding] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showHello, setShowHello] = useState(false);
  const cursorRef = useRef(null);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'gallery', 'about', 'experience'];
      const offsets = sections.map(id => {
        const el = document.getElementById(id);
        return el ? Math.abs(el.getBoundingClientRect().top) : Infinity;
      });
      setActiveTab(offsets.indexOf(Math.min(...offsets)));
    };
    window.addEventListener('scroll', handleScroll);
    setTimeout(() => setIsLoaded(true), 100);
    const moveCursor = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };
    window.addEventListener('mousemove', moveCursor);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', moveCursor);
    };
  }, []);

  const handleAskAi = async (e) => {
    e.preventDefault();
    if (!aiInput || isAiLoading) return;
    setIsAiLoading(true);
    setAiResponse("");
    try {
      const res = await callGemini(aiInput, lang);
      setAiResponse(res);
    } catch (err) {
      setAiResponse("AI 助手连接失败，请稍后再试。");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleJump = () => {
    setIsHiding(true);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      setIsHiding(false); setIsJumping(true);
      setTimeout(() => { setIsJumping(false); setActiveTab(0); }, 1000);
    }, 300);
  };

  return (
    <div className={`bg-[#010103] text-white min-h-screen cursor-none overflow-x-hidden selection:bg-blue-500/30 ${lang === 'cn' ? 'font-chinese' : 'font-sans'}`}>
      <ThreeBackground isJumping={isJumping} isHiding={isHiding} />

      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 w-6 h-6 z-[9999] pointer-events-none mix-blend-difference"
        style={{ left: 0, top: 0, transition: 'transform 0.05s ease-out' }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
      </div>

      <motion.nav 
        key={`nav-${isHiding}`}
        initial="hidden" animate={!isHiding ? "visible" : "hidden"} variants={dropIn}
        className="fixed top-8 right-8 z-[100] flex items-center gap-3 scale-[0.6] origin-right font-sans"
      >
        <div className="relative bg-white/[0.03] backdrop-blur-[40px] border border-white/20 p-1.5 rounded-full flex items-center shadow-[0_8px_32px_rgba(0,0,0,0.4)] h-[52px]">
          <motion.div 
            className="absolute h-[calc(100%-12px)] rounded-full bg-white/10 backdrop-blur-md border border-white/30 z-0"
            animate={{ x: activeTab * 110 + 4, width: 110 }}
            transition={{ type: "spring", stiffness: 450, damping: 25 }}
          />
          {t.nav.map((item, i) => (
            <button
              key={i}
              onClick={() => document.getElementById(['home', 'gallery', 'about', 'experience'][i]).scrollIntoView({ behavior: 'smooth' })}
              className={`relative z-10 w-[110px] h-full flex items-center justify-center text-[12px] tracking-wider transition-all duration-500 ${activeTab === i ? 'text-white font-bold' : 'text-[#888888]'}`}
            >
              {item}
            </button>
          ))}
        </div>
        
        <button 
          onClick={() => setLang(lang === 'cn' ? 'en' : 'cn')}
          className="bg-white/[0.03] backdrop-blur-[40px] border border-white/20 px-5 py-2.5 rounded-full text-[11px] flex items-center gap-2 text-[#888888] hover:text-white transition-all h-[52px]"
        >
          <span className={lang === 'cn' ? 'text-white font-bold' : ''}>中文</span>
          <span className="opacity-30">/</span>
          <span className={lang === 'en' ? 'text-white font-bold' : ''}>EN</span>
        </button>
      </motion.nav>

      <motion.main 
        className="relative z-10 max-w-6xl mx-auto px-8 pt-[40px]"
        animate={{ opacity: isHiding ? 0 : 1, scale: isHiding ? 0.95 : 1 }} transition={{ duration: 0.3 }}
      >
        <section id="home" className="h-screen flex flex-col justify-center relative">
          <div className="flex flex-col md:flex-row items-end justify-between w-full">
            <motion.div key={`home-text-${isHiding}`} initial="hidden" animate={!isHiding ? "visible" : "hidden"} variants={dropContainer} className="flex-1">
              {[t.hero.line1, t.hero.line2, t.hero.line3].map((line, i) => (
                <motion.div key={i} variants={dropIn}>
                  <h1 className={`text-[60px] md:text-[96px] font-bold leading-[1.1] text-[#888888] tracking-[0.02em] group font-sans`}>
                    {line.split(' ').map((word, wi) => (
                      <span key={wi} className={`inline-block transition-all duration-700 hover:text-white hover:scale-[1.02] ${/[\d-]/.test(word) ? 'font-inter text-[0.8em] font-bold tracking-[0.02em]' : ''}`}>
                        {word}&nbsp;
                      </span>
                    ))}
                  </h1>
                </motion.div>
              ))}
            </motion.div>
            <motion.div key={`home-arrow-${isHiding}`} variants={dropIn} initial="hidden" animate={!isHiding ? "visible" : "hidden"} className="pb-2">
              <button onClick={() => document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' })} className="group flex items-center gap-6">
                <div className="text-right">
                  <p className="text-[#888888] text-[11px] tracking-[0.02em] uppercase mb-1">{t.hero.scroll}</p>
                  <p className="text-white text-sm font-bold tracking-[0.02em] font-sans">NEXT SPACE</p>
                </div>
                <GlassPanel className="w-14 h-14 flex items-center justify-center group-hover:bg-white/10 transition-colors border-white/20">
                  <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}><ArrowRight size={20} /></motion.div>
                </GlassPanel>
              </button>
            </motion.div>
          </div>
        </section>

        <section id="gallery" className="min-h-screen py-32 pt-[40px]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={dropContainer}>
            <PageHeader>{t.gallery.title}</PageHeader>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
              {t.gallery.projects.map((p, i) => (
                <motion.div
                  key={i} variants={dropIn}
                  onClick={() => setSelectedProject({ ...p, cover: PROJECT_COVERS[i] })}
                  whileHover={{ scale: 1.08, rotate: [0, -1, 1, -1, 1, 0], x: [0, -2, 2, -2, 2, 0], transition: { type: "spring", stiffness: 400, damping: 10 } }}
                  className={`group relative rounded-[24px] overflow-hidden ${i < 3 ? 'md:col-span-2' : 'md:col-span-3'}`}
                >
                  <GlassPanel className="h-full border border-white/10 transition-all duration-700 overflow-hidden bg-white/[0.02]">
                    <div className="aspect-[16/10] overflow-hidden">
                      <motion.img src={PROJECT_COVERS[i]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                    </div>
                    <div className="p-6 relative z-10">
                      <p className="text-[#555555] text-[10px] tracking-[0.02em] uppercase mb-1 font-sans">{p.tag}</p>
                      <h3 className="text-sm font-bold group-hover:text-white transition-colors font-sans">{p.title}</h3>
                    </div>
                  </GlassPanel>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        <section id="about" className="min-h-screen py-32 flex flex-col justify-center pt-[40px]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={dropContainer}>
            <PageHeader>{t.about.title}</PageHeader>
            <div className="grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] gap-12 items-stretch min-h-[600px]">
              <div className="flex flex-col gap-9 h-full">
                <div className="relative max-w-[320px] group">
                    <motion.div 
                        variants={dropIn} 
                        onMouseEnter={() => setShowHello(true)}
                        onMouseLeave={() => setShowHello(false)}
                        whileHover={{ x: [0, -1.5, 1.5, -1.5, 1.5, 0], transition: { type: "spring", stiffness: 500, damping: 8 } }}
                        className="relative aspect-square rounded-[32px] overflow-hidden border border-white/10 shadow-2xl cursor-pointer"
                    >
                        <img src="https://i.postimg.cc/0jxftpqJ/IMG-7894.avif" className="w-full h-full object-cover" />
                    </motion.div>
                    <AnimatePresence>
                        {showHello && (
                            <motion.div initial={{ opacity: 0, y: 10, scale: 0.5 }} animate={{ opacity: 1, y: -80, scale: 1.2 }} exit={{ opacity: 0, y: 0, scale: 0.5 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl pointer-events-none drop-shadow-2xl">👋</motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <motion.div variants={dropIn} className="max-w-[320px]">
                  <GlassPanel className="p-4 border-white/10 shadow-[0_0_50px_rgba(30,144,255,0.02)] w-full h-[96px] flex flex-col justify-center overflow-hidden transition-all duration-500 hover:h-[auto] hover:min-h-[96px]">
                      <div className="flex items-center gap-3 mb-2 text-purple-400">
                        <Sparkles size={14} /> <h3 className="text-[12px] font-bold tracking-tight font-sans">{t.about.aiAssistant}</h3>
                      </div>
                      <form onSubmit={handleAskAi} className="flex gap-2 h-[32px] items-center mb-1">
                        <input type="text" value={aiInput} onChange={(e) => setAiInput(e.target.value)} placeholder={t.about.aiPlaceholder} className="flex-1 h-full bg-white/5 border border-white/10 rounded-full px-4 text-[10px] focus:outline-none focus:border-purple-500 transition-colors" />
                        <button disabled={isAiLoading} className="w-[32px] h-[32px] rounded-full border border-[#555555] bg-transparent flex items-center justify-center group hover:border-white transition-colors shrink-0">
                          {isAiLoading ? <Loader2 size={14} className="text-[#888888] animate-spin" /> : <Send size={14} className="text-[#888888] group-hover:text-white" />}
                        </button>
                      </form>
                      <AnimatePresence>
                        {aiResponse && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-2 border-t border-white/5">
                            <p className="text-[10px] text-[#BBBBBB] leading-relaxed italic">{aiResponse}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                  </GlassPanel>
                </motion.div>
              </div>
              <div className="flex flex-col justify-start py-1 h-full gap-[40px]">
                <motion.div variants={dropIn}>
                  <h3 className="text-[#555555] text-[20px] font-bold mb-6 tracking-[0.02em]">{t.about.edu}</h3>
                  <div className="space-y-4">
                    {t.about.schools.map((school, i) => (
                      <div key={i} className="flex justify-between items-end border-b border-white/5 pb-1">
                        <span className="text-base font-bold text-white leading-tight">{school.name}</span>
                        <span className="text-[12px] text-[#888888] font-medium leading-tight text-right whitespace-nowrap ml-4 mb-0.5">{school.degree}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
                <motion.div variants={dropIn}>
                  <h3 className="text-[#555555] text-[20px] font-bold mb-6 tracking-[0.02em]">{t.about.skills}</h3>
                  <div className="flex flex-wrap gap-2">
                    {[{ i: Layout, n: 'Figma' }, { i: Code, n: 'React' }, { i: Globe, n: 'Three.js' }, { i: Cpu, n: 'Ai' }].map((sk, i) => (
                       <motion.div key={i} whileHover={{ y: -5, scale: 1.05 }} className="cursor-default"><GlassPanel className="px-4 py-2 flex items-center gap-2 border-white/5 bg-white/5"><sk.i size={12} className="text-purple-400" /><span className="text-[10px] font-bold uppercase">{sk.n}</span></GlassPanel></motion.div>
                    ))}
                  </div>
                </motion.div>
                <motion.div variants={dropIn} className="w-full">
                  <h3 className="text-[#555555] text-[20px] font-bold mb-6 tracking-[0.02em]">{t.about.award}</h3>
                  <div className="space-y-3">
                    {t.about.awards.map((a, i) => ( <p key={i} className="text-[12px] text-[#888888] leading-relaxed italic border-l border-white/10 pl-3">"{a}"</p> ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>

        <section id="experience" className="min-h-screen py-32 relative pt-[40px]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={dropContainer}>
            <PageHeader>{t.exp.title}</PageHeader>
            <div className="relative mt-20">
              <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/5 hidden md:block border-l border-dashed border-white/10" />
              <div className="space-y-24">
                {t.exp.list.map((ex, i) => (
                  <motion.div key={i} variants={dropIn} className={`relative flex flex-col md:flex-row items-center gap-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'} font-sans`}>
                       <h4 className="text-2xl font-bold text-white mb-1">{ex.c}</h4>
                       <p className="text-blue-400 text-[10px] font-bold tracking-[0.2em] uppercase mb-3">{ex.r}</p>
                       <p className="text-[#888888] text-[12px] max-w-sm mx-auto md:mx-0 leading-relaxed">{ex.desc}</p>
                    </div>
                    <div className="z-10 bg-[#010103] p-2"><div className="w-2.5 h-2.5 rounded-full bg-white ring-8 ring-white/5" /></div>
                    <div className="flex-1">
                        <span className={`font-inter text-3xl md:text-[52px] font-black transition-all block tracking-[0.02em] text-[#444444] ${i % 2 === 0 ? 'text-left' : 'md:text-right'}`}>
                            {ex.d.split(' ')[0]}
                        </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        <footer className="h-screen flex flex-col items-center justify-center text-center pt-[40px]">
          <motion.div key={`footer-text-${isHiding}`} initial="hidden" animate={!isHiding ? "visible" : "hidden"} variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } }} className="text-[50px] md:text-[90px] font-black text-[#888888] uppercase mb-32 tracking-[0.02em] opacity-30 select-none leading-[0.9] font-sans">
            <p>Thanks for</p><p>watching</p>
          </motion.div>
          <motion.button whileHover={{ scale: 1.05 }} onClick={handleJump} className="group">
            <GlassPanel className="px-12 py-6 flex items-center gap-6 group-hover:bg-white/10 transition-all border-white/20">
              <span className="text-sm font-bold tracking-[0.2em] text-white uppercase font-sans">{t.footer.btn}</span>
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center"><ChevronUp className="text-black" size={20} /></div>
            </GlassPanel>
          </motion.button>
        </footer>
      </motion.main>

      <AnimatePresence>
        {selectedProject && (
          <motion.div initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 200 }} className="fixed inset-0 z-[1000] bg-[#010103] overflow-y-auto no-scrollbar pt-[40px]">
            <div className="sticky top-0 z-[1100] px-8 py-4 flex justify-between items-center bg-[#010103]/90 backdrop-blur-md border-b border-white/5">
              <button onClick={() => setSelectedProject(null)} className="group flex items-center gap-4 text-[#888888] hover:text-white transition-all font-sans">
                <ArrowLeft size={24} /> <span className="text-[20px] font-bold tracking-tight">{t.back}</span>
              </button>
            </div>
            <div className="max-w-6xl mx-auto px-8 py-24">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start mb-24">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
                  <img src={selectedProject.cover} className="w-full rounded-[24px] shadow-2xl border border-white/10" />
                </motion.div>
                <div className="space-y-8 font-sans">
                  <h1 className="text-[48px] font-black tracking-tight uppercase leading-none">{selectedProject.title}</h1>
                  <p className="text-sm text-[#888888] leading-relaxed max-w-sm">
                    {lang === 'cn' ? "该项目致力于在极致的极简主义中寻找功能与美学的平衡点。通过捕捉数字纯度，打造沉浸式的空间交互体验。" : "Balancing functionality and aesthetics through digital purity and spatial interaction."}
                  </p>
                  <div className="grid grid-cols-2 gap-10 border-t border-white/5 pt-10 uppercase text-[10px] font-bold">
                    <div><p className="text-[#555555] mb-1">Role</p><p>Lead Designer</p></div>
                    <div><p className="text-[#555555] mb-1">Year</p><p>2026</p></div>
                  </div>
                </div>
              </div>
              <div className="space-y-12">
                {[...Array(10)].map((_, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}>
                    <img src={`https://placehold.co/1200x800/05070A/888888?text=Project+Detail+Visual+${i+1}`} className="w-full rounded-[24px] border border-white/5" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        body { margin: 0; background-color: #010103; overflow-x: hidden; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .font-chinese { font-family: "Alibaba PuHuiTi 3.0", "PingFang SC", "Microsoft YaHei", sans-serif; }
        .font-sans, .font-inter { font-family: 'Inter', system-ui, sans-serif; }
        ::selection { background: rgba(59, 130, 246, 0.4); color: white; }
      ` }} />
    </div>
  );
}