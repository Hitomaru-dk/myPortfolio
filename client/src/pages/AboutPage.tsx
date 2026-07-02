import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Mail,
  Phone,
  Cake,
  MessageCircle,
  ExternalLink,
  Edit2,
  Save,
  X,
  Upload,
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import SectionHeading from '../components/SectionHeading';
import TechTag from '../components/TechTag';
import Button from '../components/Button';
import { GithubIcon, InstagramIcon, FacebookIcon } from '../components/BrandIcons';
import Spinner from '../components/Spinner';
import { useScrollReveal, useStaggerReveal } from '../hooks/useScrollReveal';
import type { Profile, ProfileFormData } from '../types';

export default function AboutPage() {
  const { t, i18n } = useTranslation();
  const { isAdmin } = useAuth();
  const currentLang = i18n.language;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    email: '',
    phone: '',
    birthdayTh: '',
    birthdayEn: '',
    avatarUrl: '',
    githubUrl: '',
    lineUrl: '',
    instagramUrl: '',
    facebookUrl: '',
    aboutTextTh: '',
    aboutTextEn: '',
    skills: '',
    tools: '',
    certifications: '',
  });

  // Scroll-reveal hooks for each section
  const [headerRef, headerVisible] = useScrollReveal();
  const [photoRef, photoVisible] = useScrollReveal<HTMLDivElement>({ threshold: 0.2 });
  const [contactRef, contactVisible] = useScrollReveal({ delay: 100 });
  const [socialsRef, socialsVisible] = useScrollReveal({ delay: 150 });
  const [aboutMeRef, aboutMeVisible] = useScrollReveal();
  const [skillsRef, skillsVisible] = useScrollReveal();
  const [toolsRef, toolsVisible] = useScrollReveal();
  const [langsRef, langsVisible] = useScrollReveal();
  const [certsRef, certsVisible] = useScrollReveal();

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/api/profile');
      setProfile(res.data);
      // เตรียมข้อมูลลงฟอร์ม
      setFormData({
        email: res.data.email || '',
        phone: res.data.phone || '',
        birthdayTh: res.data.birthdayTh || '',
        birthdayEn: res.data.birthdayEn || '',
        avatarUrl: res.data.avatarUrl || '',
        githubUrl: res.data.githubUrl || '',
        lineUrl: res.data.lineUrl || '',
        instagramUrl: res.data.instagramUrl || '',
        facebookUrl: res.data.facebookUrl || '',
        aboutTextTh: res.data.aboutTextTh || '',
        aboutTextEn: res.data.aboutTextEn || '',
        skills: Array.isArray(res.data.skills) ? res.data.skills.join(', ') : '',
        tools: Array.isArray(res.data.tools) ? res.data.tools.join(', ') : '',
        certifications: res.data.certifications ? JSON.stringify(res.data.certifications, null, 2) : '[]',
      });
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ฟังก์ชันอ่านไฟล์ภาพจากเครื่องแล้วแปลงเป็น Base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // จำกัดขนาดภาพ 3MB เพื่อประหยัดพื้นที่ฐานข้อมูล
    if (file.size > 3 * 1024 * 1024) {
      alert('ขนาดรูปภาพต้องไม่เกิน 3MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        avatarUrl: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let parsedCerts = [];
      try {
        parsedCerts = JSON.parse(formData.certifications);
      } catch {
        alert('รูปแบบ JSON ของใบรับรองไม่ถูกต้อง กรุณาตรวจสอบวงเล็บและเครื่องหมายคำพูด');
        setLoading(false);
        return;
      }

      const payload = {
        ...formData,
        skills: formData.skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        tools: formData.tools
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        certifications: parsedCerts,
      };

      const res = await axios.put('/api/profile', payload, { withCredentials: true });
      setProfile(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setLoading(false);
    }
  };

  // ป้องกันกรณีเกิดข้อผิดพลาดในการโหลดข้อมูล
  // (ต้องอยู่ก่อน hooks เพราะ hooks ห้ามอยู่หลัง conditional return)
  const activeProfile = profile || {
    email: 'example@email.com',
    phone: '+66 XX-XXX-XXXX',
    birthdayTh: '1 มกราคม 2543',
    birthdayEn: '1 January 2000',
    avatarUrl: null,
    githubUrl: 'https://github.com',
    lineUrl: 'https://line.me',
    instagramUrl: 'https://instagram.com',
    facebookUrl: 'https://facebook.com',
    aboutTextTh: 'ข้อมูลโปรไฟล์เริ่มต้น',
    aboutTextEn: 'Default Profile Text',
    skills: [],
    tools: [],
    certifications: [],
  };

  // ประกันความปลอดภัยกรณีข้อมูลอาเรย์เป็นค่าว่างหรือไม่ได้กำหนดไว้
  const skillsArray = Array.isArray(activeProfile.skills) ? activeProfile.skills : [];
  const toolsArray = Array.isArray(activeProfile.tools) ? activeProfile.tools : [];
  const certsArray = Array.isArray(activeProfile.certifications) ? activeProfile.certifications : [];

  // Stagger reveals for skills, tools, and certs
  // (hooks ต้องถูกเรียกทุก render — ห้ามอยู่หลัง conditional return)
  const skillsStagger = useStaggerReveal(skillsArray.length, 50);
  const toolsStagger = useStaggerReveal(toolsArray.length, 50);
  const certsStagger = useStaggerReveal(certsArray.length, 80);

  if (loading && !profile) {
    return (
      <div className="max-w-6xl mx-auto px-4 text-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
      {/* Page Header + Admin edit button */}
      <div
        ref={headerRef}
        className={`flex items-start justify-between mb-12 reveal ${headerVisible ? 'visible' : ''}`}
      >
        <div>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-text tracking-wide uppercase">
            {t('about.title')}
            <span className="text-accent-gold">.</span>
          </h1>
          <p className="font-mono text-xs text-accent-blue tracking-wider uppercase mt-2">
            {t('about.role')}
          </p>
        </div>

        {isAdmin && !isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            <Edit2 size={14} />
            แก้ไขโปรไฟล์
          </Button>
        )}
      </div>

      {isEditing ? (
        /* ===== หน้ากากโหมดแก้ไขประวัติ (Admin Edit Form) ===== */
        <form onSubmit={handleSave} className="bg-surface border border-hairline p-6 space-y-6 animate-fade-in-up">
          <SectionHeading title="แก้ไขข้อมูลส่วนตัวของคุณ (About Me Data)" />

          {/* อัปโหลดรูปภาพโปรไฟล์ */}
          <div className="flex flex-col sm:flex-row gap-5 items-center bg-bg/50 p-4 border border-hairline">
            <div className="w-24 h-24 bg-surface flex items-center justify-center overflow-hidden border border-hairline shrink-0">
              {formData.avatarUrl ? (
                <img src={formData.avatarUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="font-display text-4xl text-accent-blue/20 font-bold">
                  {t('home.name') ? t('home.name').charAt(0) : 'N'}
                </span>
              )}
            </div>
            <div className="flex-1 w-full text-center sm:text-left">
              <p className="font-display text-sm text-text mb-1">รูปประจำตัว (Profile Picture)</p>
              <p className="font-mono text-[10px] text-text-muted mb-3">แนะนำขนาดสี่เหลี่ยมจัตุรัส ไม่เกิน 3MB</p>
              <label className="inline-flex items-center gap-2 font-display text-xs text-accent-blue border border-accent-blue/30 px-3 py-2 bg-accent-blue/5 hover:bg-accent-blue/20 transition-all cursor-pointer">
                <Upload size={12} />
                เลือกรูปภาพจากเครื่อง
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs text-text-muted uppercase tracking-wider mb-1.5">อีเมล (Email)</label>
              <input type="text" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-bg border border-hairline text-text px-3 py-2 text-sm focus:outline-none focus:border-accent-blue" />
            </div>
            <div>
              <label className="block font-mono text-xs text-text-muted uppercase tracking-wider mb-1.5">เบอร์โทรศัพท์ (Phone)</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} required className="w-full bg-bg border border-hairline text-text px-3 py-2 text-sm focus:outline-none focus:border-accent-blue" />
            </div>
            <div>
              <label className="block font-mono text-xs text-text-muted uppercase tracking-wider mb-1.5">วันเกิดภาษาไทย (Birthday TH)</label>
              <input type="text" name="birthdayTh" value={formData.birthdayTh} onChange={handleChange} required className="w-full bg-bg border border-hairline text-text px-3 py-2 text-sm focus:outline-none focus:border-accent-blue" />
            </div>
            <div>
              <label className="block font-mono text-xs text-text-muted uppercase tracking-wider mb-1.5">วันเกิดภาษาอังกฤษ (Birthday EN)</label>
              <input type="text" name="birthdayEn" value={formData.birthdayEn} onChange={handleChange} required className="w-full bg-bg border border-hairline text-text px-3 py-2 text-sm focus:outline-none focus:border-accent-blue" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs text-text-muted uppercase tracking-wider mb-1.5">Link GitHub</label>
              <input type="text" name="githubUrl" value={formData.githubUrl} onChange={handleChange} className="w-full bg-bg border border-hairline text-text px-3 py-2 text-sm focus:outline-none focus:border-accent-blue" />
            </div>
            <div>
              <label className="block font-mono text-xs text-text-muted uppercase tracking-wider mb-1.5">Link Line</label>
              <input type="text" name="lineUrl" value={formData.lineUrl} onChange={handleChange} className="w-full bg-bg border border-hairline text-text px-3 py-2 text-sm focus:outline-none focus:border-accent-blue" />
            </div>
            <div>
              <label className="block font-mono text-xs text-text-muted uppercase tracking-wider mb-1.5">Link Instagram</label>
              <input type="text" name="instagramUrl" value={formData.instagramUrl} onChange={handleChange} className="w-full bg-bg border border-hairline text-text px-3 py-2 text-sm focus:outline-none focus:border-accent-blue" />
            </div>
            <div>
              <label className="block font-mono text-xs text-text-muted uppercase tracking-wider mb-1.5">Link Facebook</label>
              <input type="text" name="facebookUrl" value={formData.facebookUrl} onChange={handleChange} className="w-full bg-bg border border-hairline text-text px-3 py-2 text-sm focus:outline-none focus:border-accent-blue" />
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs text-text-muted uppercase tracking-wider mb-1.5">เกี่ยวกับฉันภาษาไทย (About Text TH)</label>
            <textarea name="aboutTextTh" value={formData.aboutTextTh} onChange={handleChange} rows={3} className="w-full bg-bg border border-hairline text-text px-3 py-2 text-sm focus:outline-none focus:border-accent-blue resize-y" />
          </div>

          <div>
            <label className="block font-mono text-xs text-text-muted uppercase tracking-wider mb-1.5">เกี่ยวกับฉันภาษาอังกฤษ (About Text EN)</label>
            <textarea name="aboutTextEn" value={formData.aboutTextEn} onChange={handleChange} rows={3} className="w-full bg-bg border border-hairline text-text px-3 py-2 text-sm focus:outline-none focus:border-accent-blue resize-y" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs text-text-muted uppercase tracking-wider mb-1.5">ทักษะคอมพิวเตอร์ (Skills - คั่นด้วยเครื่องหมาย `,` )</label>
              <input type="text" name="skills" value={formData.skills} onChange={handleChange} className="w-full bg-bg border border-hairline text-text px-3 py-2 text-sm focus:outline-none focus:border-accent-blue" />
            </div>
            <div>
              <label className="block font-mono text-xs text-text-muted uppercase tracking-wider mb-1.5">เครื่องมือที่ใช้ (Tools - คั่นด้วยเครื่องหมาย `,` )</label>
              <input type="text" name="tools" value={formData.tools} onChange={handleChange} className="w-full bg-bg border border-hairline text-text px-3 py-2 text-sm focus:outline-none focus:border-accent-blue" />
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs text-text-muted uppercase tracking-wider mb-1.5">
              ข้อมูลใบรับรอง (Certifications JSON)
            </label>
            <textarea
              name="certifications"
              value={formData.certifications}
              onChange={handleChange}
              rows={6}
              className="w-full bg-bg border border-hairline text-text font-mono px-3 py-2 text-sm focus:outline-none focus:border-accent-blue"
            />
            <p className="text-[10px] text-text-muted/60 mt-1 font-mono">
              ข้อมูลต้องอยู่ในรูปแบบ JSON Array: [ {"{"} "name": "ชื่อใบรับรอง", "issuer": "สถาบัน", "year": "ปี ค.ศ." {"}"} ]
            </p>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>
              <Save size={14} />
              บันทึกข้อมูล
            </Button>
            <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>
              <X size={14} />
              ยกเลิก
            </Button>
          </div>
        </form>
      ) : (
        /* ===== หน้าแสดงผลปกติ (Read Mode) with scroll-reveal ===== */
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-10 lg:gap-14">
          {/* ===== Left Column ===== */}
          <aside>
            {/* Profile photo frame */}
            <div
              ref={photoRef}
              className={`target-bracket-full mb-6 p-1 reveal-scale ${photoVisible ? 'visible' : ''}`}
            >
              <div className="bg-surface aspect-square flex items-center justify-center overflow-hidden">
                {activeProfile.avatarUrl ? (
                  <img
                    src={activeProfile.avatarUrl}
                    alt={t('home.name')}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-surface to-bg flex items-center justify-center animate-pulse">
                    <span className="font-display text-6xl text-accent-blue/30 font-bold">
                      {t('home.name') ? t('home.name').charAt(0) : 'N'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Name + role */}
            <h2 className={`font-display font-bold text-2xl text-text mb-1 reveal ${photoVisible ? 'visible' : ''}`}>
              {t('home.name')}
            </h2>
            <p className={`font-mono text-xs text-accent-blue tracking-wider uppercase mb-6 reveal ${photoVisible ? 'visible' : ''}`}>
              {t('about.role')}
            </p>

            {/* Contact info */}
            <div ref={contactRef} className={`reveal ${contactVisible ? 'visible' : ''}`}>
              <SectionHeading title={t('about.contact')} />
              <div className="space-y-3 mb-8">
                <ContactRow icon={Mail} label={t('about.email')} value={activeProfile.email} />
                <ContactRow icon={Phone} label={t('about.phone')} value={activeProfile.phone} />
                <ContactRow
                  icon={Cake}
                  label={t('about.birthday')}
                  value={currentLang === 'th' ? activeProfile.birthdayTh : activeProfile.birthdayEn}
                />
              </div>
            </div>

            {/* Socials */}
            <div ref={socialsRef} className={`reveal ${socialsVisible ? 'visible' : ''}`}>
              <SectionHeading title={t('about.socials')} />
              <div className="space-y-2.5">
                <SocialRow name="GitHub" handle="GitHub Profile" url={activeProfile.githubUrl} icon={GithubIcon} />
                <SocialRow name="Line" handle="Line ID / Link" url={activeProfile.lineUrl} icon={MessageCircle} />
                <SocialRow name="Instagram" handle="Instagram" url={activeProfile.instagramUrl} icon={InstagramIcon} />
                <SocialRow name="Facebook" handle="Facebook" url={activeProfile.facebookUrl} icon={FacebookIcon} />
              </div>
            </div>
          </aside>

          {/* ===== Right Column ===== */}
          <div className="space-y-10">
            {/* About Me */}
            <section ref={aboutMeRef} className={`reveal ${aboutMeVisible ? 'visible' : ''}`}>
              <SectionHeading title={t('about.aboutMe')} />
              <p className="font-body text-base text-text-muted leading-relaxed whitespace-pre-line">
                {currentLang === 'th' ? activeProfile.aboutTextTh : activeProfile.aboutTextEn}
              </p>
            </section>

            {/* Technical Skills */}
            <section ref={skillsRef} className={`reveal ${skillsVisible ? 'visible' : ''}`}>
              <SectionHeading title={t('about.skills')} />
              <div ref={skillsStagger.containerRef} className="flex flex-wrap gap-2">
                {skillsArray.map((skill, i) => (
                  <span
                    key={skill}
                    className={`reveal-item ${skillsStagger.visibleItems[i] ? 'visible' : ''}`}
                  >
                    <TechTag label={skill} />
                  </span>
                ))}
              </div>
            </section>

            {/* Tools & Software */}
            <section ref={toolsRef} className={`reveal ${toolsVisible ? 'visible' : ''}`}>
              <SectionHeading title={t('about.tools')} />
              <div ref={toolsStagger.containerRef} className="flex flex-wrap gap-2">
                {toolsArray.map((tool, i) => (
                  <span
                    key={tool}
                    className={`reveal-item ${toolsStagger.visibleItems[i] ? 'visible' : ''}`}
                  >
                    <TechTag label={tool} />
                  </span>
                ))}
              </div>
            </section>

            {/* Languages */}
            <section ref={langsRef} className={`reveal ${langsVisible ? 'visible' : ''}`}>
              <SectionHeading title={t('about.languages')} />
              <div className="space-y-3">
                <LanguageBar name={t('about.langThai')} level={t('about.langThaiLevel')} percent={100} animate={langsVisible} />
                <LanguageBar name={t('about.langEnglish')} level={t('about.langEnglishLevel')} percent={55} animate={langsVisible} />
              </div>
            </section>

            {/* Certifications */}
            <section ref={certsRef} className={`reveal ${certsVisible ? 'visible' : ''}`}>
              <SectionHeading title={t('about.certifications')} />
              <div ref={certsStagger.containerRef} className="space-y-3">
                {certsArray.map((cert: any, i) => (
                  <div
                    key={cert.name}
                    className={`bg-surface border border-hairline p-4 flex items-start justify-between cert-card reveal-item ${
                      certsStagger.visibleItems[i] ? 'visible' : ''
                    }`}
                  >
                    <div>
                      <p className="font-display text-sm text-text font-medium">{cert.name}</p>
                      <p className="font-mono text-xs text-text-muted mt-1">{cert.issuer}</p>
                    </div>
                    <span className="font-mono text-xs text-accent-gold shrink-0 ml-4">{cert.year}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===== Sub-components ===== */

function ContactRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size: number; className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 group">
      <Icon size={14} className="text-accent-blue shrink-0 transition-transform duration-200 group-hover:scale-110" />
      <div className="flex flex-col">
        <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider">
          {label}
        </span>
        <span className="font-body text-sm text-text">{value}</span>
      </div>
    </div>
  );
}

function SocialRow({
  name,
  handle,
  url,
  icon: Icon,
}: {
  name: string;
  handle: string;
  url: string;
  icon: React.ComponentType<{ style?: React.CSSProperties }>;
}) {
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 text-text-muted hover:text-accent-blue transition-colors group"
    >
      <span className="social-bounce inline-flex">
        <Icon style={{ width: 16, height: 16 }} />
      </span>
      <span className="font-body text-sm">{name}</span>
      <span className="font-mono text-xs text-text-muted/60">{handle}</span>
      <ExternalLink size={12} className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-0 -translate-x-2" />
    </a>
  );
}

function LanguageBar({
  name,
  level,
  percent,
  animate,
}: {
  name: string;
  level: string;
  percent: number;
  animate: boolean;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="font-display text-sm text-text">{name}</span>
        <span className="font-mono text-xs text-text-muted">{level}</span>
      </div>
      <div className="h-1.5 bg-surface border border-hairline overflow-hidden">
        <div
          className={`h-full bg-accent-blue lang-bar-fill ${animate ? 'visible' : ''}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
