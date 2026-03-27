import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  Layout, 
  Smartphone, 
  Image, 
  Cpu, 
  ChevronUp, 
  Sparkles, 
  Send, 
  Loader2 
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
      contact: {
        email: "E-mail: 2403445400@qq.com",
        wechat: "wechat: Peter122113lin"
      },
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
        { c: "荔枝集团", r: "UI设计实习", d: "2025", desc: "线上运营活动方案的制定以及高保真页面的输出" },
        { c: "安克创新", r: "UX设计实习", d: "2025", desc: "智能充电产品界面设计以及IP形象设计" },
        { c: "迅雷集团", r: "UI设计实习", d: "2025", desc: "海外语音社交产品视觉以及运营H5页面设计" },
        { c: "欢聚集团", r: "UX设计实习", d: "2026", desc: "SaaS独立电商平台Shopline的UI及UX工作" }
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
      contact: {
        email: "E-mail: 2403445400@qq.com",
        wechat: "wechat: Peter122113lin"
      },
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
        { c: "Lizhi Inc.", r: "UI Design Intern", d: "2025", desc: "Online operation activity plan formulation" },
        { c: "Anker Innovations", r: "UX Design Intern", d: "2025", desc: "Smart charging interface and IP character design" },
        { c: "Xunlei", r: "UI Design Intern", d: "2025", desc: "Global audio social app visuals and marketing H5" },
        { c: "JOYY Inc.", r: "UX Design Intern", d: "2026", desc: "UI/UX work for SaaS platform Shopline" }
      ]
    },
    footer: { btn: "Back to Home" },
    back: "Back to Projects"
  }
};

const PROJECT_COVERS = [
  "https://i.postimg.cc/Jz3xDk1T/1.jpg",
  "https://i.postimg.cc/kgNs6bnT/2.jpg",
  "https://i.postimg.cc/rwGj0r8P/3.jpg",
  "https://i.postimg.cc/g2ysXZYt/4.jpg",
  "https://i.postimg.cc/kgNs6bnL/5.jpg"
];

// --- 完整的项目详情内容 ---
const PROJECT_DETAILS = [
  {
    desc: "负责中东地区语音社交软件H5运营活动界面设计，深度结合中东地域文化元素与节日热点，打造具有地域辨识度的活动视觉体系。结合产品定位以及调性，对中东语聊头像框训练了一套Lora。",
    role: "UI 设计", year: "2025",
    images: [
      "https://i.postimg.cc/qMVvbhT6/1.jpg", "https://i.postimg.cc/ZKt57BSy/2.jpg", "https://i.postimg.cc/TYM37L6m/3.jpg",
      "https://i.postimg.cc/15h3CnQw/4.jpg", "https://i.postimg.cc/ncbhRjJ2/5.jpg", "https://i.postimg.cc/DykwjJTB/6.jpg",
      "https://i.postimg.cc/yYmYw110/7.jpg", "https://i.postimg.cc/kXQXkJJx/8.jpg", "https://i.postimg.cc/c4R4VxxB/9.jpg"
    ]
  },
  {
    desc: "通过桌面调研与竞品分析梳理产品痛点，对核心记账场景完成全链路交互走查；采用用户访谈与线上问卷相结合的方式开展定性与定量研究，精准挖掘用户需求；基于研究结果输出设计策略。",
    role: "体验设计", year: "2024",
    images: [
      "https://i.postimg.cc/nrV0pc8Y/1.jpg", "https://i.postimg.cc/vT83bHR7/2.jpg", "https://i.postimg.cc/sxfwsDF4/3.jpg",
      "https://i.postimg.cc/hv4pcPFr/4.jpg", "https://i.postimg.cc/sxfwsDF0/5.jpg", "https://i.postimg.cc/1XRJs5xj/6.jpg",
      "https://i.postimg.cc/J07PM4wg/7.jpg", "https://i.postimg.cc/2yj2r8pM/8.jpg", "https://i.postimg.cc/SRZVsFqT/9.jpg"
    ]
  },
  {
    desc: "参与设计了荔枝集团的线上游戏化运营活动项目，活动主题为“0元盲盒超给荔”，主要负责方案的制定，视觉定义以及高保真页面的输出。",
    role: "UI 设计", year: "2025",
    images: [
      "https://i.postimg.cc/3xGCMD4H/1.jpg", "https://i.postimg.cc/x1myrbJQ/2.jpg", "https://i.postimg.cc/x1myrbJ9/3.jpg",
      "https://i.postimg.cc/XY5cMyGV/4.jpg", "https://i.postimg.cc/MpBbkjMT/5.jpg", "https://i.postimg.cc/Qd7kLW9H/6.jpg",
      "https://i.postimg.cc/kgSFrt62/7.jpg", "https://i.postimg.cc/CKVCwLkM/8.jpg", "https://i.postimg.cc/mrG3T2Cz/9.jpg",
      "https://i.postimg.cc/YSwNtqYx/10.jpg"
    ]
  },
  {
    desc: "从0到1打造智能桌充产品的IP形象，包括IP形象的制定、故事线的描绘以及参与动画制作。",
    role: "IP 设计", year: "2025",
    images: [
      "https://i.postimg.cc/9QBPFHp9/1.jpg", "https://i.postimg.cc/DwcQy3gX/2.jpg", "https://i.postimg.cc/y8ThYCP9/3.jpg",
      "https://i.postimg.cc/y8ThYCPc/4.jpg", "https://i.postimg.cc/RZT1VxRR/5.jpg", "https://i.postimg.cc/JzQ34CqK/6.jpg",
      "https://i.postimg.cc/cLc74GmD/7.jpg", "https://i.postimg.cc/VkF9LPRV/8.jpg", "https://i.postimg.cc/dV9Rtc6K/9.jpg",
      "https://i.postimg.cc/sgJPDCmr/10.jpg"
    ]
  },
  {
    desc: "针对Coursera软件进行了体验优化设计，针对找课程、浏览课程的功能链路进行痛点挖掘、用户调研、以及竞品分析，输出体验友好的交互链路。",
    role: "交互 设计", year: "2025",
    images: [
      "https://i.postimg.cc/br8NvWL4/1.jpg", "https://i.postimg.cc/rscFp3Q6/2.jpg", "https://i.postimg.cc/x8YTdhgW/3.jpg",
      "https://i.postimg.cc/MHxKGNtC/4.jpg", "https://i.postimg.cc/tJ5RnkmS/5.jpg", "https://i.postimg.cc/RhRCJdbD/6.jpg",
      "https://i.postimg.cc/QCbNKmnn/7.jpg", "https://i.postimg.cc/90pXwbNv/8.jpg", "https://i.postimg.cc/yxP63jbq/9.jpg",
      "https://i.postimg.cc/sxcfGmNd/10.jpg"
    ]
  }
];

// --- DeepSeek API ---
const callDeepSeek = async (prompt, lang) => {
  const apiKey = "sk-5518f5e795bd406e85878db7d6a3d4c8"; 
  const systemPrompt = "你是设计师 Peter 的 AI 助理。请以专业、极简且俏皮的口吻回答问题。回答应简短精炼，不超过50字。";

  try {
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        stream: false
      })
    });

    if (!response.ok) throw new Error('DeepSeek API Error');
    const result = await response.json();
    return result.choices[0].message.content || "抱歉，我暂时无法回答。";
  } catch (error) {
    console.error(error);
    return "AI 连接异常，请稍后再试。";
  }
};
      
  

// --- 3D Background ---
const ThreeBackground = ({ isJumping, isHiding }) => {
  const containerRef = useRef();
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
    const animate = () => {
      points.rotation.y += 0.0002;
      if (isHiding) material.uniforms.opacity.value = THREE.MathUtils.lerp(material.uniforms.opacity.value, 0, 0.1);
      else if (isJumping) material.uniforms.opacity.value = THREE.MathUtils.lerp(material.uniforms.opacity.value, 1.0, 0.1);
      else material.uniforms.opacity.value = THREE.MathUtils.lerp(material.uniforms.opacity.value, 0.6, 0.05);
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();
    return () => { if (containerRef.current) containerRef.current.removeChild(renderer.domElement); };
  }, [isJumping, isHiding]);
  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0" />;
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

// --- 首页标题动效组件 (Inter 900 + 6% 间距 + 缓慢延迟) ---
const BouncingChar = ({ char }) => {
  return (
    <motion.span
      className="inline-block cursor-default"
      initial={{ color: "#888888" }}
      whileHover={{ y: -25, color: "#FFFFFF" }}
      transition={{ type: "spring", stiffness: 120, damping: 18, mass: 1.2 }}
    >
      {char === " " ? "\u00A0" : char}
    </motion.span>
  );
};

const BouncingTitleLine = ({ text, className = "" }) => {
  const chars = Array.from(text);
  return (
    <h1 className={`text-[60px] md:text-[96px] font-black leading-[1.0] tracking-[0.06em] font-premium ${className}`}>
      {chars.map((c, i) => ( <BouncingChar key={i} char={c} /> ))}
    </h1>
  );
};

// --- 3D Project Card ---
const ProjectCard = ({ project, cover, index, onClick }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 300, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 300, damping: 20 });
  const handleMouse = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) / rect.width);
    y.set((event.clientY - (rect.top + rect.height / 2)) / rect.height);
    mouseX.set(event.clientX - rect.left);
    mouseY.set(event.clientY - rect.top);
  };
  const imageReveal = {
    hidden: { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
    hover: { clipPath: 'inset(0 0 0 0)', opacity: 1 }
  };
  return (
    <motion.div
      variants={dropIn} onMouseMove={handleMouse} onMouseLeave={() => { x.set(0); y.set(0); }}
      onClick={() => onClick({ ...project, index })} initial="hidden" whileInView="visible" whileHover="hover" viewport={{ once: true }}
      style={{ rotateX, rotateY, perspective: 1000 }} className={`group relative rounded-[24px] cursor-pointer ${index < 3 ? 'md:col-span-2' : 'md:col-span-3'}`}
    >
      <GlassPanel className="h-full border-white/10 transition-all duration-500 overflow-hidden bg-white/[0.02] group-hover:shadow-[0_0_40px_rgba(135,206,250,0.35)]">
        <div className="aspect-[16/10] overflow-hidden relative bg-white/[0.05]">
          <motion.div variants={imageReveal} transition={{ duration: 0.8 }} className="w-full h-full relative z-0">
            <img src={cover} fetchpriority="high" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105 hd-image-fix" alt={project.title} />
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-0 transition-opacity pointer-events-none"><div className="w-16 h-0.5 bg-white/40 rounded-full blur-[1px]" /></div>
        </div>
        <div className="p-6 relative z-10">
          <p className="text-[#555555] text-[10px] tracking-[0.02em] uppercase mb-1 font-premium">{project.tag}</p>
          <h3 className="text-sm font-bold group-hover:text-white transition-colors font-premium">{project.title}</h3>
        </div>
        <motion.div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: useTransform([mouseX, mouseY], ([mx, my]) => `radial-gradient(circle 140px at ${mx}px ${my}px, rgba(255,255,255,0.15), transparent 80%)`) }} />
      </GlassPanel>
    </motion.div>
  );
};

export default function App() {
  const [lang, setLang] = useState('cn');
  const [activeTab, setActiveTab] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isJumping, setIsJumping] = useState(false);
  const [isHiding, setIsHiding] = useState(false);
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
    window.addEventListener('mousemove', (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAskAi = async (e) => {
    e.preventDefault(); if (!aiInput || isAiLoading) return;
    setIsAiLoading(true); setAiResponse("");
    try { const res = await callDeepSeek(aiInput, lang); setAiResponse(res); } 
    catch (err) { setAiResponse("AI 连接异常。"); } finally { setIsAiLoading(false); }
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
    <div className={`bg-[#010103] text-white min-h-screen cursor-none overflow-x-hidden selection:bg-blue-500/30 ${lang === 'cn' ? 'font-chinese' : 'font-premium'}`}>
      <ThreeBackground isJumping={isJumping} isHiding={isHiding} />
      <div ref={cursorRef} className="fixed top-0 left-0 w-6 h-6 z-[9999] pointer-events-none mix-blend-difference" style={{ transition: 'transform 0.05s ease-out' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg></div>

      <motion.nav 
        key={`nav-${isHiding}`} initial="hidden" animate={!isHiding ? "visible" : "hidden"} variants={dropIn}
        className="fixed top-12 right-12 z-[100] flex items-center gap-3 scale-[0.9] origin-right font-premium"
      >
        <div className="relative bg-white/[0.03] backdrop-blur-[40px] border border-white/20 p-1.5 rounded-full flex items-center shadow-[0_8px_32px_rgba(0,0,0,0.5)] h-[52px]">
          <motion.div className="absolute h-[calc(100%-12px)] rounded-full bg-white/10 backdrop-blur-md border border-white/30 z-0" animate={{ x: activeTab * 110 + 4, width: 110 }} />
          {t.nav.map((item, i) => (<button key={i} onClick={() => document.getElementById(['home', 'gallery', 'about', 'experience'][i]).scrollIntoView({ behavior: 'smooth' })} className={`relative z-10 w-[110px] h-full flex items-center justify-center text-[12px] tracking-wider transition-all duration-500 ${activeTab === i ? 'text-white font-bold' : 'text-[#888888]'}`}>{item}</button>))}
        </div>
        <button onClick={() => setLang(lang === 'cn' ? 'en' : 'cn')} className="bg-white/[0.03] backdrop-blur-[40px] border border-white/20 px-5 py-2.5 rounded-full text-[11px] flex items-center gap-2 text-[#888888] hover:text-white transition-all h-[52px] shadow-xl">
          <span className={lang === 'cn' ? 'text-white font-bold' : ''}>中文</span> <span className="opacity-30">/</span> <span className={lang === 'en' ? 'text-white font-bold' : ''}>EN</span>
        </button>
      </motion.nav>

      <motion.main className="relative z-10 max-w-6xl mx-auto px-8 pt-[40px]" animate={{ opacity: isHiding ? 0 : 1, scale: isHiding ? 0.95 : 1 }}>
        <section id="home" className="h-screen flex flex-col justify-center relative">
          <div className="flex flex-col md:flex-row items-end justify-between w-full">
            <motion.div initial="hidden" animate={!isHiding ? "visible" : "hidden"} variants={{ visible: { transition: { staggerChildren: 0.15 } } }} className="flex-1">
              <motion.div variants={dropIn}>
                <BouncingTitleLine text={t.hero.line1} />
                <BouncingTitleLine text={t.hero.line2} />
                <BouncingTitleLine text={t.hero.line3} className="text-[0.6em] mt-2 opacity-60" />
              </motion.div>
            </motion.div>
            <motion.div variants={dropIn} initial="hidden" animate={!isHiding ? "visible" : "hidden"} className="pb-2">
              <button onClick={() => document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' })} className="group flex items-center gap-6">
                <div className="text-right"><p className="text-[#888888] text-[11px] uppercase mb-1">{t.hero.scroll}</p><p className="text-white text-sm font-bold font-premium uppercase tracking-widest">NEXT SPACE</p></div>
                <GlassPanel className="w-14 h-14 flex items-center justify-center group-hover:bg-white/10 transition-colors border-white/20"><motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}><ArrowRight size={20} /></motion.div></GlassPanel>
              </button>
            </motion.div>
          </div>
        </section>

        <section id="gallery" className="min-h-screen py-32 pt-[40px]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            <motion.h2 variants={dropIn} className="text-[#555555] text-[20px] font-bold tracking-[0.02em] opacity-80 uppercase h-[52px] flex items-center mb-9 font-premium">{t.gallery.title}</motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
              {t.gallery.projects.map((p, i) => (<ProjectCard key={i} index={i} project={p} cover={PROJECT_COVERS[i]} onClick={(proj) => setSelectedProject({ ...proj, cover: PROJECT_COVERS[i], detail: PROJECT_DETAILS[i] })} />))}
            </div>
          </motion.div>
        </section>

        <section id="about" className="min-h-screen py-32 flex flex-col justify-center pt-[40px]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            <motion.h2 variants={dropIn} className="text-[#555555] text-[20px] font-bold tracking-[0.02em] opacity-80 uppercase h-[52px] flex items-center mb-9 font-premium">{t.about.title}</motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] gap-12 items-stretch min-h-[600px]">
              
              {/* 左侧栏：垂直自然排列，不再 justify-between */}
              <div className="flex flex-col h-full">
                <div className="relative max-w-[320px] group">
                    <motion.div variants={dropIn} onMouseEnter={() => setShowHello(true)} onMouseLeave={() => setShowHello(false)} whileHover={{ x: [0, -1.5, 1.5, -1.5, 1.5, 0], transition: { type: "spring", stiffness: 500, damping: 8 } }} className="relative aspect-square rounded-[32px] overflow-hidden border border-white/10 shadow-2xl cursor-pointer">
                        <img src="https://i.postimg.cc/0jxftpqJ/IMG-7894.avif" className="w-full h-full object-cover hd-image-fix" alt="Portrait" />
                    </motion.div>
                    <AnimatePresence>{showHello && <motion.div initial={{ opacity: 0, y: 10, scale: 0.5 }} animate={{ opacity: 1, y: -80, scale: 1.2 }} exit={{ opacity: 0, y: 0, scale: 0.5 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl pointer-events-none drop-shadow-2xl">👋</motion.div>}</AnimatePresence>
                </div>

                {/* 联系方式：间距校准为 20px (mt-5) */}
                <motion.div variants={dropIn} className="space-y-1.5 pl-3 border-l border-white/10 mt-5">
                    <p className="text-[12px] text-[#888888] leading-relaxed italic">{t.about.contact.email}</p>
                    <p className="text-[12px] text-[#888888] leading-relaxed italic">{t.about.contact.wechat}</p>
                </motion.div>

                {/* AI小助手：间距校准为 16px (mt-4) */}
                <motion.div variants={dropIn} className="max-w-[320px] h-[96px] mt-4">
                    <GlassPanel className="p-4 border-white/10 shadow-[0_0_50px_rgba(30,144,255,0.02)] w-full h-full flex flex-col justify-center overflow-hidden transition-all duration-500 hover:h-auto hover:min-h-[96px]">
                        <div className="flex items-center gap-3 mb-2 text-purple-400"><Sparkles size={14} /> <h3 className="text-[12px] font-bold tracking-tight font-premium">{t.about.aiAssistant}</h3></div>
                        <form onSubmit={handleAskAi} className="flex gap-2 h-[32px] items-center mb-1">
                            <input type="text" value={aiInput} onChange={(e) => setAiInput(e.target.value)} placeholder={t.about.aiPlaceholder} className="flex-1 h-full bg-white/5 border border-white/10 rounded-full px-4 text-[10px] focus:outline-none focus:border-purple-500 transition-colors" />
                            <button disabled={isAiLoading} className="w-[32px] h-[32px] rounded-full border border-[#555555] bg-transparent flex items-center justify-center group hover:border-white transition-colors shrink-0">
                                {isAiLoading ? <Loader2 size={16} className="text-[#888888] animate-spin" /> : <Send size={14} className="text-[#888888] group-hover:text-white" />}
                            </button>
                        </form>
                        <AnimatePresence>{aiResponse && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-2 border-t border-white/5"><p className="text-[10px] text-[#BBBBBB] leading-relaxed italic">{aiResponse}</p></motion.div>}</AnimatePresence>
                    </GlassPanel>
                </motion.div>
              </div>

              {/* 右侧栏 */}
              <div className="flex flex-col justify-start py-1 h-full gap-[40px]">
                <motion.div variants={dropIn}><h3 className="text-[#555555] text-[20px] font-bold mb-6 tracking-[0.02em]">{t.about.edu}</h3><div className="space-y-4">{t.about.schools.map((school, i) => (<div key={i} className="flex justify-between items-end border-b border-white/5 pb-1"><span className="text-base font-bold text-white leading-tight">{school.name}</span><span className="text-[12px] text-[#888888] font-medium leading-tight text-right whitespace-nowrap ml-4 mb-0.5">{school.degree}</span></div>))}</div></motion.div>
                <motion.div variants={dropIn}><h3 className="text-[#555555] text-[20px] font-bold mb-6 tracking-[0.02em]">{t.about.skills}</h3><div className="flex flex-wrap gap-3">{[{ i: Layout, n: 'Figma' }, { i: Smartphone, n: 'Protopie' }, { i: Image, n: 'PS' }, { i: Cpu, n: 'Ai' }].map((sk, i) => (<motion.div key={i} whileHover={{ y: -5, scale: 1.05 }} className="cursor-default"><GlassPanel className="px-4 py-2 flex items-center gap-2 border-white/5 bg-white/5"><sk.i size={12} className="text-purple-400" /><span className="text-[10px] font-bold uppercase">{sk.n}</span></GlassPanel></motion.div>))}</div></motion.div>
                <motion.div variants={dropIn} className="w-full">
                  <h3 className="text-[#555555] text-[20px] font-bold mb-6 tracking-[0.02em]">{t.about.award}</h3>
                  <div className="space-y-3">
                    {t.about.awards.map((a, i) => ( <p key={i} className="text-[12px] text-[#888888] leading-relaxed italic border-l border-white/10 pl-3">{a}</p> ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>

        <section id="experience" className="min-h-screen py-32 relative pt-[40px]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            <motion.h2 variants={dropIn} className="text-[#555555] text-[20px] font-bold tracking-[0.02em] opacity-80 uppercase h-[52px] flex items-center mb-9 font-premium">{t.exp.title}</motion.h2>
            <div className="relative mt-20"><div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/5 hidden md:block border-l border-dashed border-white/10" /><div className="space-y-24">{t.exp.list.map((ex, i) => (<motion.div key={i} variants={dropIn} className={`relative flex flex-col md:flex-row items-center gap-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}><div className={`flex-1 flex flex-col ${i % 2 === 0 ? 'md:items-end md:text-right' : 'md:text-left md:items-start'} font-premium`}><h4 className="text-2xl font-bold text-white mb-1 leading-none">{ex.c}</h4><p className="text-blue-400 text-[10px] font-bold tracking-[0.2em] uppercase mb-3">{ex.r}</p><p className={`text-[#888888] text-[12px] max-w-md leading-relaxed ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>{ex.desc}</p></div><div className="z-10 bg-[#010103] p-2"><div className="w-2.5 h-2.5 rounded-full bg-white ring-8 ring-white/5" /></div><div className={`flex-1 ${i % 2 === 0 ? 'text-left' : 'md:text-right'}`}><span className={`font-premium text-3xl md:text-[52px] font-black tracking-[-0.04em] text-[#444444]`}>{ex.d}</span></div></motion.div>))}</div></div>
          </motion.div>
        </section>

        <footer className="h-screen flex flex-col items-center justify-center text-center pt-[40px]">
          <motion.div initial="hidden" animate={!isHiding ? "visible" : "hidden"} variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } }} className="text-[50px] md:text-[90px] font-black text-[#888888] uppercase mb-32 tracking-[0.02em] opacity-30 select-none leading-[1.2] font-premium"><p>Thanks for</p><p>watching</p></motion.div>
          <motion.button whileHover={{ scale: 1.05 }} onClick={handleJump} className="group">
            <GlassPanel className="px-12 py-6 flex items-center gap-6 group-hover:bg-white/10 transition-all border-white/20"><span className="text-sm font-bold tracking-[0.2em] text-white uppercase font-premium">{t.footer.btn}</span><div className="w-10 h-10 rounded-full bg-white flex items-center justify-center"><ChevronUp className="text-black" size={20} /></div></GlassPanel>
          </motion.button>
        </footer>
      </motion.main>

      {/* --- 项目详情 --- */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 200 }} className="fixed inset-0 z-[1000] bg-[#010103] overflow-y-auto no-scrollbar pt-[40px]">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="fixed top-12 right-12 z-[1100] scale-[0.9] origin-right font-premium">
              <button onClick={() => setSelectedProject(null)} className="bg-white/[0.03] backdrop-blur-[40px] border border-white/20 p-1.5 px-8 rounded-full flex items-center shadow-[0_8px_32px_rgba(0,0,0,0.5)] h-[52px] group hover:bg-white/10 transition-all">
                <div className="flex items-center gap-3"><ArrowLeft size={16} className="text-[#888888] group-hover:text-white transition-colors" /><span className="text-[12px] font-bold tracking-wider text-[#888888] group-hover:text-white transition-colors uppercase">{t.back}</span></div>
              </button>
            </motion.div>
            <div className="max-w-6xl mx-auto px-8 py-24">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start mb-24">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}><img src={selectedProject.cover} className="w-full rounded-[24px] shadow-2xl border border-white/10 hd-image-fix" alt="Detail" /></motion.div>
                <div className="space-y-8 font-premium">
                  <h1 className="text-[36px] font-black tracking-tight uppercase leading-tight">{selectedProject.title}</h1>
                  <p className="text-sm text-[#888888] leading-relaxed max-w-sm">{lang === 'cn' ? selectedProject.detail?.desc : selectedProject.detail?.descEn}</p>
                  <div className="grid grid-cols-2 gap-10 border-t border-white/5 pt-10 uppercase text-[10px] font-bold"><div><p className="text-[#555555] mb-1">Role</p><p>{selectedProject.detail?.role || "UI Designer"}</p></div><div><p className="text-[#555555] mb-1">Year</p><p>{selectedProject.detail?.year || "2025"}</p></div></div>
                </div>
              </div>
              <div className="space-y-12">{(selectedProject.detail?.images || [...Array(10)]).map((imgUrl, i) => (<motion.div key={i} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}><img src={typeof imgUrl === 'string' && imgUrl.startsWith('http') ? imgUrl : `https://placehold.co/1200x800/05070A/888888?text=Project+Detail+${i+1}`} className="w-full h-auto block rounded-[24px] border border-white/5 hd-image-fix" alt={`Project content ${i+1}`} /></motion.div>))}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800;900&display=swap');
        body { margin: 0; background-color: #010103; overflow-x: hidden; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .font-chinese { font-family: "Alibaba PuHuiTi 3.0", "PingFang SC", "Microsoft YaHei", sans-serif; }
        .font-premium { font-family: 'Inter', sans-serif; }
        .hd-image-fix { image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges; transform-style: preserve-3d; backface-visibility: hidden; will-change: transform, clip-path; transform: translateZ(0); }
        ::selection { background: rgba(59, 130, 246, 0.4); color: white; }
      ` }} />
    </div>
  );
}
