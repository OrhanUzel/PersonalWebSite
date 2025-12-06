import { useEffect, useState } from 'react';
import { Github, Linkedin, Sun, Moon, Globe, Code, ExternalLink, Star, Copy, Store, Smartphone, Mail } from 'lucide-react';

interface Project {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  language: string;
  updated_at: string;
  topics: string[];
}



const translations = {
  tr: {
    title: "Orhan UZEL - Yazılım Geliştirici",
    subtitle: "Açık Kaynak Projelerim",
    description: "Modern yazılım çözümleri ve açık kaynak projeler",
    viewProject: "Projeyi Gör",
    more: "Dahası",
    stars: "Yıldız",
    language: "Dil",
    updated: "Güncelleme",
    contact: "İletişim",
    email: "E-posta",
    github: "GitHub",
    linkedin: "LinkedIn",
    visitProfile: "Profilime Git",
    appStores: "Uygulama Mağazaları",
    googlePlay: "Google Play Geliştirici Sayfası",
    microsoftStore: "Microsoft Store Uygulaması",
    theme: "Tema",
    dark: "Karanlık",
    light: "Aydınlık",
    system: "Sistem",
    languageSelect: "Dil Seçimi"
  },
  en: {
    title: "Orhan UZEL - Software Developer",
    subtitle: "My Open Source Projects",
    description: "Modern software solutions and open source projects",
    viewProject: "View Project",
    more: "More",
    stars: "Stars",
    language: "Language",
    updated: "Updated",
    contact: "Contact",
    email: "Email",
    github: "GitHub",
    linkedin: "LinkedIn",
    visitProfile: "Visit Profile",
    appStores: "App Stores",
    googlePlay: "Google Play Developer Page",
    microsoftStore: "Microsoft Store App",
    theme: "Theme",
    dark: "Dark",
    light: "Light",
    system: "System",
    languageSelect: "Language"
  }
};

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<'tr' | 'en'>('tr');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [toast, setToast] = useState<{visible: boolean; text: string}>({visible: false, text: ''});
  const selectedRepoNames = ['StudyJournalPro', 'StudyJournalProMobile'];

  const t = translations[language];

  const extractSummary = (raw: string, fallback?: string) => {
    const text = raw
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`[^`]*`/g, '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/!\[[^\]]*\]\([^\)]*\)/g, ' ')
      .replace(/\[[^\]]*\]\([^\)]*\)/g, (m) => m.replace(/\[[^\]]*\]\([^\)]*\)/g, ' '))
      .replace(/^#+\s+/gm, '')
      .replace(/\r/g, '')
      .replace(/\t/g, ' ')
      .replace(/\*|_/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const first = lines.find(l => /[a-zA-ZŞşİıÖöÜüÇçĞğ]/.test(l)) || fallback || '';
    return first.length > 160 ? first.slice(0, 157) + '…' : first;
  };

  useEffect(() => {
    const saved = localStorage.getItem('language');
    if (saved === 'tr' || saved === 'en') {
      setLanguage(saved as 'tr' | 'en');
      return;
    }
    const navLang = (navigator.language || '').toLowerCase();
    if (navLang.startsWith('tr')) {
      setLanguage('tr');
    } else {
      setLanguage('en');
    }
  }, []);

  // Dark mode kontrolü
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else if (savedTheme === 'light') {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, []);

  // GitHub projelerini çek ve sadece seçilenleri göster
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('https://api.github.com/users/OrhanUzel/repos?per_page=10&sort=updated');
        const data = await response.json();
        const filtered = (Array.isArray(data) ? data : []).filter((p: Project) => selectedRepoNames.includes(p.name));
        // README açıklamalarını çekmeye çalış
        const withReadmes = await Promise.all(
          filtered.map(async (p) => {
            try {
              const r = await fetch(`https://api.github.com/repos/OrhanUzel/${p.name}/readme`, {
                headers: { Accept: 'application/vnd.github.v3+json' }
              });
              if (r.ok) {
                const jr = await r.json();
                if (jr && jr.content) {
                  const decoded = atob(jr.content.replace(/\n/g, ''));
                  const summary = extractSummary(decoded, p.description);
                  return { ...p, description: summary } as Project;
                }
              }
            } catch {}
            return p;
          })
        );
        setProjects(withReadmes);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const changeLanguage = (lang: 'tr' | 'en') => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    setShowLanguageMenu(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText('orhanuzel@yahoo.com');
      setToast({visible: true, text: language === 'tr' ? 'E-posta kopyalandı' : 'Email copied'});
      setTimeout(() => setToast({visible: false, text: ''}), 1800);
    } catch {}
  };

  return (
    <div className={`min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200`}>
      {/* Header */}
      <header className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <img
                src={`${import.meta.env.BASE_URL}assets/icon.png`}
                alt="Orhan Uzel Logo"
                className="h-10 w-10 rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `${import.meta.env.BASE_URL}vite.svg`;
                }}
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.title}</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Dil Seçimi */}
              <div className="relative">
                <button
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Globe className="h-4 w-4" />
                  <span className="text-sm font-medium">{language.toUpperCase()}</span>
                </button>
                
                {showLanguageMenu && (
                  <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                    <button
                      onClick={() => changeLanguage('tr')}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
                    >
                      Türkçe
                    </button>
                    <button
                      onClick={() => changeLanguage('en')}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg"
                    >
                      English
                    </button>
                  </div>
                )}
              </div>

              {/* Tema Butonu - Tek Tık Toggle */}
              <button
                onClick={toggleDarkMode}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                <span className="text-sm font-medium">{darkMode ? t.light : t.dark}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Ana İçerik */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t.subtitle}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t.description}
          </p>
        </div>

        {/* Projeler Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {project.name}
                    </h3>
                    <Github className="h-5 w-5 text-gray-400" />
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {project.description || 'No description available'}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4" />
                        <span>{project.stargazers_count}</span>
                      </div>
                      {project.language && (
                        <div className="flex items-center space-x-1">
                          <Code className="h-4 w-4" />
                          <span>{project.language}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                      {t.updated}: {formatDate(project.updated_at)}
                    </span>
                    
                    <a
                      href={project.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
                    >
                      <span>{t.viewProject}</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-end col-span-full">
              <a
                href="https://github.com/OrhanUzel"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span>{t.more}</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        )}

        {/* Uygulama Mağazaları */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t.appStores}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a
              href="https://play.google.com/store/apps/dev?id=8938974152383282698"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-lg transition"
            >
              <div className="flex items-center space-x-4">
                <Store className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-semibold">{t.googlePlay}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">“Think simple, build smart, and create something useful for everyone.”</p>
                </div>
              </div>
              <ExternalLink className="h-5 w-5 text-gray-500 group-hover:text-primary-600" />
            </a>
            <a
              href="https://apps.microsoft.com/detail/9pjn9vzxk45m?hl=tr-TR&gl=KZ"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-lg transition"
            >
              <div className="flex items-center space-x-4">
                <Smartphone className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="font-semibold">{t.microsoftStore}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Çalışma Günlüğüm Pro — Microsoft Store’da</p>
                </div>
              </div>
              <ExternalLink className="h-5 w-5 text-gray-500 group-hover:text-primary-600" />
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-full overflow-hidden">
              <h4 className="font-semibold mb-4">{t.email}</h4>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 max-w-full">
                  <Mail className="h-4 w-4" />
                  orhanuzel@yahoo.com
                </span>
                <a
                  href="mailto:orhanuzel@yahoo.com"
                  className="inline-flex items-center gap-2 px-4 h-9 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400 shrink-0"
                  aria-label="Send mail"
                >
                  <Mail className="h-4 w-4" />
                  <span>Mail</span>
                </a>
                <button
                  onClick={copyEmail}
                  className="inline-flex items-center gap-2 px-4 h-9 rounded-lg border border-gray-300 dark:border-gray-600 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 shrink-0"
                  aria-label="Copy email"
                >
                  <Copy className="h-4 w-4" />
                  <span>Copy</span>
                </button>
              </div>
            </div>
            <a href="https://github.com/OrhanUzel" target="_blank" rel="noopener noreferrer" className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between hover:shadow">
              <div className="flex items-center space-x-3">
                <Github className="h-6 w-6" />
                <div>
                  <h4 className="font-semibold">GitHub</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t.visitProfile}</p>
                </div>
              </div>
              <ExternalLink className="h-5 w-5" />
            </a>
            <a href="https://linkedin.com/in/orhanuzel" target="_blank" rel="noopener noreferrer" className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between hover:shadow">
              <div className="flex items-center space-x-3">
                <Linkedin className="h-6 w-6" />
                <div>
                  <h4 className="font-semibold">LinkedIn</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t.visitProfile}</p>
                </div>
              </div>
              <ExternalLink className="h-5 w-5" />
            </a>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>© 2024 Orhan UZEL. Built with React & TypeScript.</p>
          </div>
        </div>
      </footer>
      {toast.visible && (
        <div className="fixed bottom-6 right-6 px-4 py-2 rounded-lg bg-gray-900 text-white shadow-lg">
          {toast.text}
        </div>
      )}
    </div>
  );
}

export default App;
