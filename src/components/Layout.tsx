import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Moon,
  Sun,
  Menu,
  X,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { Toaster } from "react-hot-toast";
import type { MenuItem } from "../types";
import Sidebar from "./Sidebar";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import useMenuItems from "../hooks/useMenuItems";

export const Layout = () => {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      const raw = localStorage.getItem('sidebarCollapsed');
      return raw === 'true';
    } catch {
      return false;
    }
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSmUp, setIsSmUp] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    try {
      localStorage.setItem('sidebarCollapsed', String(sidebarCollapsed));
    } catch {
      // ignore
    }
  }, [sidebarCollapsed]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px)');
    const onChange = () => setIsSmUp(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  const prettify = (segment: string) => {
    const spaced = segment.replace(/[-_]+/g, " ").trim();
    if (!spaced) return segment;
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
  };

  const menuItems = useMenuItems();

  const breadcrumbs = useMemo(() => {
    const pathname = location.pathname;

    const allItems: MenuItem[] = [];
    for (const item of menuItems) {
      allItems.push(item);
      if (item.subItems) allItems.push(...item.subItems);
    }

    const normalize = (value: string) => value.replace(/\/+$/, "") || "/";
    const normalizedPathname = normalize(pathname);

    let bestMatch: { item: MenuItem; len: number; path: string } | null = null;
    for (const item of allItems) {
      if (!item.path) continue;
      const normalizedItemPath = normalize(item.path);

      const isExactRoot = normalizedItemPath === "/" && normalizedPathname === "/";
      const isExact = normalizedItemPath === normalizedPathname;
      const isPrefix =
        normalizedItemPath !== "/" &&
        (normalizedPathname === normalizedItemPath ||
          normalizedPathname.startsWith(`${normalizedItemPath}/`));

      if (!isExactRoot && !isExact && !isPrefix) continue;
      const matchLen = normalizedItemPath.length;
      if (!bestMatch || matchLen > bestMatch.len) {
        bestMatch = { item, len: matchLen, path: normalizedItemPath };
      }
    }

    const crumbs: Array<{ label: string; to?: string }> = [];

    if (bestMatch?.item?.label && bestMatch.path) {
      crumbs.push({ label: bestMatch.item.label, to: bestMatch.item.path || bestMatch.path });
    }

    const basePath = bestMatch?.path ?? "";
    const remainder = basePath && normalizedPathname.startsWith(basePath)
      ? normalizedPathname.slice(basePath.length)
      : normalizedPathname;
    const segments = remainder.split("/").filter(Boolean);

    let accumulatedFull = bestMatch?.path && bestMatch.path !== "/" ? bestMatch.path : "";
    for (const seg of segments) {
      accumulatedFull = `${accumulatedFull}/${seg}`;
      const decoded = decodeURIComponent(seg);
      if (/^\d+$/.test(decoded)) continue;
      crumbs.push({ label: prettify(decoded), to: accumulatedFull });
    }

    const currentPath = normalize(pathname);
    for (const crumb of crumbs) {
      if (crumb.to && normalize(crumb.to) === currentPath) {
        delete crumb.to;
      }
    }

    if (crumbs.length === 0) {
      return [{ label: "" }];
    }

    return crumbs;
  }, [location.pathname, menuItems]);



  const handleSidebarToggle = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  const effectiveSidebarCollapsed = isSmUp ? sidebarCollapsed : false;

  return (
    <div className="flex h-screen overflow-y-hidden overflow-x-visible bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <motion.button
        type="button"
        className="sm:hidden fixed top-4 left-4 z-[60] p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow"
        aria-label={mobileSidebarOpen ? "Cerrar menú" : "Abrir menú"}
        onClick={() => setMobileSidebarOpen((v) => !v)}
        animate={{ x: mobileSidebarOpen ? 280 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <motion.div
          initial={false}
          animate={{ rotate: mobileSidebarOpen ? 90 : 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </motion.div>
      </motion.button>

      {mobileSidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 sm:hidden"
          aria-label="Cerrar menú"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <div
        className={
          `fixed inset-y-0 left-0 z-50 w-[280px] transform transition-transform duration-300 sm:static sm:translate-x-0 sm:w-auto ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } sm:translate-x-0`
        }
      >
        <Sidebar
          isCollapsed={effectiveSidebarCollapsed}
          onToggle={handleSidebarToggle}
          menuItems={menuItems}
          isDark={isDark}
          user={user}
        />
      </div>
      <div className="flex flex-col w-full min-w-0">
        <header>
          <div className="mx-auto pr-4 pl-17 sm:px-6 lg:px-6">
            <div className="flex items-center justify-between h-16">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-3"
              >
                <div>
                  <div className="text-sm font-medium text-gray-900/50 dark:text-white/70 flex items-center gap-2">
                    {breadcrumbs
                      .filter((c) => Boolean(c.label))
                      .map((crumb, idx, arr) => (
                        <div key={`${crumb.label}-${idx}`} className="flex items-center gap-2">
                          {crumb.to ? (
                            <Link
                              to={crumb.to}
                              className="hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                              {crumb.label}
                            </Link>
                          ) : (
                            <span className="text-gray-900/50 dark:text-white/70">{crumb.label}</span>
                          )}
                          {idx < arr.length - 1 && <span className="text-gray-400 dark:text-gray-500">&gt;</span>}
                        </div>
                      ))}
                  </div>
                </div>
              </motion.div>

              <div className="flex items-center gap-2 relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  aria-label="Cambiar tema"
                >
                  {isDark ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </header>
        <main className="mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-4 overflow-y-auto w-full min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: isDark
            ? {
                borderRadius: "10px",
                background: "#333",
                color: "#fff",
              }
            : {
                borderRadius: "10px",
                background: "#fff",
                color: "#000",
              },
        }}
      />
    </div>
  );
};
