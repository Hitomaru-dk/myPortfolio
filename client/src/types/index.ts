export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  imageUrl: string | null;
  liveUrl: string | null;
  repoUrl: string | null;
  createdAt: string;
}

export interface ProjectFormData {
  title: string;
  description: string;
  techStack: string;
  imageUrl: string;
  liveUrl: string;
  repoUrl: string;
}

export interface Profile {
  id: string;
  email: string;
  phone: string;
  birthdayTh: string;
  birthdayEn: string;
  avatarUrl: string | null;
  githubUrl: string;
  lineUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  aboutTextTh: string;
  aboutTextEn: string;
  skills: string[];
  tools: string[];
  certifications: { name: string; issuer: string; year: string }[];
}

export interface ProfileFormData {
  email: string;
  phone: string;
  birthdayTh: string;
  birthdayEn: string;
  avatarUrl: string; // เก็บ Base64
  githubUrl: string;
  lineUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  aboutTextTh: string;
  aboutTextEn: string;
  skills: string; // คั่นด้วยคอมมาเวลาพิมพ์ในฟอร์ม
  tools: string;  // คั่นด้วยคอมมาเวลาพิมพ์ในฟอร์ม
  certifications: string; // เก็บในรูปแบบ JSON string สำหรับพิมพ์แก้ไขได้ง่าย
}
