import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronLeft, LogOut, ChevronDown, Moon, Sun } from "lucide-react";
import type { SidebarProps, MenuItem } from "../types/index";
import { twMerge } from "tailwind-merge";
import { LoginGetResponse } from "../types/auth";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../contexts/ThemeContext";

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggle,
  menuItems,
  user,
}: {
  isCollapsed: boolean;
  onToggle: () => void;
  menuItems: MenuItem[];
  user: LoginGetResponse["user"] | null;
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [footerMenuOpen, setFooterMenuOpen] = useState(false);
  const { logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const sidebarRef = useRef<HTMLElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const footerMenuRef = useRef<HTMLDivElement | null>(null);
  const dropdownButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const collapsedFlyoutRef = useRef<HTMLDivElement | null>(null);
  const prevCollapsedRef = useRef(isCollapsed);
  const collapsedFlyoutOpenRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const [hasMounted, setHasMounted] = useState(false);
  const [collapsedFlyoutAnchor, setCollapsedFlyoutAnchor] = useState<{ id: string; rect: DOMRect } | null>(null);
  const [collapsedFlyoutRender, setCollapsedFlyoutRender] = useState<{ id: string; parentLabel: string; subItems: MenuItem[] } | null>(null);
  const [collapsedFlyoutOpen, setCollapsedFlyoutOpen] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    collapsedFlyoutOpenRef.current = collapsedFlyoutOpen;
  }, [collapsedFlyoutOpen]);

  useEffect(() => {
    const activeParent = menuItems.find((item) =>
      item.subItems?.some((subItem) => subItem.path === location.pathname)
    );

    if (isCollapsed) {
      if (!prevCollapsedRef.current) {
        setOpenDropdown(null);
      }
      prevCollapsedRef.current = true;
      return;
    }

    prevCollapsedRef.current = false;

    if (activeParent?.id) {
      setOpenDropdown(activeParent.id);
    }
  }, [isCollapsed, location.pathname, menuItems]);

  useEffect(() => {
    if (!isCollapsed) return;
    setCollapsedFlyoutOpen(false);
    setOpenDropdown(null);
  }, [isCollapsed, location.pathname]);

  const collapsedFlyoutItems = useMemo(() => {
    if (!isCollapsed || !openDropdown) return null;
    const parent = menuItems.find((m) => m.id === openDropdown);
    if (!parent?.subItems?.length) return null;
    return { parent, subItems: parent.subItems };
  }, [isCollapsed, menuItems, openDropdown]);

  const isActivePath = (path?: string) => {
    if (!path) return false;
    const normalize = (value: string) => value.replace(/\/+$/, "") || "/";
    const current = normalize(location.pathname);
    const target = normalize(path);
    if (target === "/") return current === "/";
    return current === target || current.startsWith(`${target}/`);
  };

  const isParentActive = (item: MenuItem) => {
    if (!item.subItems?.length) return false;
    return item.subItems.some((sub) => isActivePath(sub.path));
  };

  const updateCollapsedFlyoutAnchor = () => {
    if (rafIdRef.current != null) {
      window.cancelAnimationFrame(rafIdRef.current);
    }

    rafIdRef.current = window.requestAnimationFrame(() => {
      rafIdRef.current = null;

      if (!isCollapsed || !openDropdown) {
        if (!isCollapsed) {
          setCollapsedFlyoutAnchor(null);
        }
        return;
      }

      const btn = dropdownButtonRefs.current[openDropdown];
      if (!btn) {
        if (!collapsedFlyoutRender) {
          setCollapsedFlyoutAnchor(null);
        }
        return;
      }

      const rect = btn.getBoundingClientRect();
      setCollapsedFlyoutAnchor({ id: openDropdown, rect });
    });
  };

  useEffect(() => {
    updateCollapsedFlyoutAnchor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCollapsed, openDropdown]);

  useEffect(() => {
    if (!isCollapsed) {
      setCollapsedFlyoutOpen(false);
      setCollapsedFlyoutRender(null);
      setCollapsedFlyoutAnchor(null);
      return;
    }

    if (collapsedFlyoutItems?.parent?.id) {
      setCollapsedFlyoutRender({
        id: collapsedFlyoutItems.parent.id,
        parentLabel: collapsedFlyoutItems.parent.label,
        subItems: collapsedFlyoutItems.subItems,
      });
      setCollapsedFlyoutOpen(true);
      return;
    }

    if (!openDropdown) {
      setCollapsedFlyoutOpen(false);
    }
  }, [isCollapsed, collapsedFlyoutItems, openDropdown]);

  useEffect(() => {
    if (!isCollapsed || !openDropdown) return;

    const handleResize = () => updateCollapsedFlyoutAnchor();
    const handleScroll = () => updateCollapsedFlyoutAnchor();

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, true);
    navRef.current?.addEventListener('scroll', handleScroll);

    return () => {
      if (rafIdRef.current != null) {
        window.cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll, true);
      navRef.current?.removeEventListener('scroll', handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCollapsed, openDropdown]);

  useEffect(() => {
    if (!isCollapsed || !openDropdown) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) return;

      if (collapsedFlyoutRef.current && collapsedFlyoutRef.current.contains(target)) {
        return;
      }

      if (sidebarRef.current && sidebarRef.current.contains(target)) {
        return;
      }

      setOpenDropdown(null);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCollapsed, openDropdown]);

  useEffect(() => {
    if (!footerMenuOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target) return;

      if (footerMenuRef.current && !footerMenuRef.current.contains(target)) {
        setFooterMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFooterMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [footerMenuOpen]);
  return (
    <motion.aside
      ref={sidebarRef}
      initial={false}
      animate={{ width: isCollapsed ? 70 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-white h-screen sticky top-0 overflow-visible dark:bg-gray-800 dark:border-gray-700 shadow-xl border-r border-gray-200 flex flex-col relative z-10"
    >
      {/* Header with Logo */}
      <div
        className={twMerge(
          "border-b dark:border-gray-700 border-gray-200 h-[64.8px] flex items-center justify-center",
          isCollapsed ? "px-2 py-3" : "py-2"
        )}
      >
        <div className="flex items-center justify-center gap-x-8">
          <AnimatePresence mode="wait">
            <>
              <motion.div
                className={twMerge(
                  "flex flex-col justifty-center transition-all items-center w-full animate-slideInLeft text-center",
                  isCollapsed && "animate-slideOutLeft"
                )}
              >
                <div className="flex items-center justify-center px-10">
                  {/* <img src={logoLight} alt="logo" className="block dark:hidden" />
                  <img src={logoDark} alt="logo" className="hidden dark:block" /> */}
                  <span className="text-xl font-bold text-gray-900 dark:text-white">YourApp</span>
                </div>
              </motion.div>
            </>
          </AnimatePresence>

          {isCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, delay: 0.5 }}
              className="mx-auto transition-all"
            >
              <div className="flex items-center justify-center px-1">
                {/* <img src={logoLightMini} alt="logo" className="block dark:hidden" />
                <img src={logoDarkMini} alt="logo" className="hidden dark:block" /> */}
                <span className="text-xl font-bold text-gray-900 dark:text-white">YA</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="hidden sm:block absolute -right-3 top-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1.5 shadow-md hover:shadow-lg transition-shadow z-20"
      >
        <motion.div
          animate={{ rotate: isCollapsed ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-200" />
        </motion.div>
      </button>

      {/* Navigation Menu */}
      <nav ref={navRef} className="flex-1 py-6 overflow-y-auto overflow-x-hidden">
        <ul className="space-y-2 px-3">
          {menuItems.map((item, index) => {
            const shouldAnimateMenuItem = !prefersReducedMotion && !hasMounted;
            const Wrapper: React.ElementType = shouldAnimateMenuItem ? motion.li : 'li';
            const wrapperProps = shouldAnimateMenuItem
              ? {
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                  transition: { delay: index * 0.1 },
                }
              : {};

            return (
              <Wrapper
                key={item.id}
                {...wrapperProps}
                className="relative"
              >
                {item.subItems ? (
                  <>
                    <button
                      ref={(el) => {
                        dropdownButtonRefs.current[item.id] = el;
                      }}
                      onClick={(event) => {
                        if (isCollapsed) {
                          const nextOpen = openDropdown === item.id ? null : item.id;
                          setOpenDropdown(nextOpen);

                          if (nextOpen && item.subItems?.length) {
                            const rect = (event.currentTarget as HTMLButtonElement).getBoundingClientRect();
                            setCollapsedFlyoutAnchor({ id: nextOpen, rect });
                            setCollapsedFlyoutRender({
                              id: nextOpen,
                              parentLabel: item.label,
                              subItems: item.subItems,
                            });
                            setCollapsedFlyoutOpen(true);
                          } else {
                            setCollapsedFlyoutOpen(false);
                          }
                          return;
                        }

                        setOpenDropdown(openDropdown === item.id ? null : item.id);
                      }}
                      className={twMerge(
                        "w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group relative text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white",
                        isCollapsed && isParentActive(item) && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 [&>svg]:text-blue-700 dark:[&>svg]:text-blue-300"
                      )}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0 text-gray-500 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-100" />
                      {!isCollapsed && (
                        <div className="flex items-center justify-between flex-1">
                          <span className="font-medium">{item.label}</span>
                          <motion.div
                            animate={{ rotate: openDropdown === item.id ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="w-4 h-4" />
                          </motion.div>
                        </div>
                      )}
                      {isCollapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {item.label}
                        </div>
                      )}
                    </button>

                    <AnimatePresence>
                      {!isCollapsed && openDropdown === item.id && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="mt-2 space-y-2 pl-6 overflow-hidden"
                        >
                          {item.subItems.map((subItem) => (
                            <li key={subItem.id}>
                              <NavLink
                                to={subItem.path!}
                                className={({ isActive }) =>
                                  `flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 group relative ${
                                    isActive
                                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 [&>svg]:text-blue-700 dark:[&>svg]:text-blue-300"
                                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  }`
                                }
                              >
                                <subItem.icon className="w-4 h-4 flex-shrink-0" />
                                <span className="font-medium text-sm">{subItem.label}</span>
                              </NavLink>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <NavLink
                    to={item.path || "#"}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group relative ${
                        isActive
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 [&>svg]:text-blue-700 dark:[&>svg]:text-blue-300"
                          : "text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0 text-gray-500 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-100" />
                    {!isCollapsed && (
                      <div className="flex items-center justify-between flex-1">
                        <span className="font-medium">{item.label}</span>
                      </div>
                    )}
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {item.label}
                      </div>
                    )}
                  </NavLink>
                )}
              </Wrapper>
            );
          })}
        </ul>
      </nav>

      {hasMounted && isCollapsed && collapsedFlyoutRender && collapsedFlyoutAnchor?.rect &&
        createPortal(
          <AnimatePresence
            onExitComplete={() => {
              if (!collapsedFlyoutOpenRef.current) {
                setCollapsedFlyoutRender(null);
                setCollapsedFlyoutAnchor(null);
              }
            }}
          >
            {collapsedFlyoutOpen && (
              <motion.div
                key={collapsedFlyoutRender.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.15 }}
                className="fixed z-[9999]"
                style={{
                  top: collapsedFlyoutAnchor.rect.top,
                  left: collapsedFlyoutAnchor.rect.right + 8,
                }}
              >
                <div
                  ref={collapsedFlyoutRef}
                  className="min-w-[220px] rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl p-2"
                >
                  <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {collapsedFlyoutRender.parentLabel}
                  </div>
                  <div className="space-y-1">
                    {collapsedFlyoutRender.subItems.map((subItem) => (
                      <NavLink
                        key={subItem.id}
                        to={subItem.path!}
                        onClick={() => {
                          setCollapsedFlyoutOpen(false);
                          setOpenDropdown(null);
                        }}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-2 py-2 rounded-md transition-colors ${
                            isActive
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 [&>svg]:text-blue-700 dark:[&>svg]:text-blue-300"
                              : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`
                        }
                      >
                        <subItem.icon className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm font-medium">{subItem.label}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}

      {/* Footer */}
      <div
        ref={footerMenuRef}
        className="p-4 border-t border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 relative"
      >
        <button
          type="button"
          onClick={() => setFooterMenuOpen((v) => !v)}
          className={twMerge(
            "w-full flex items-center gap-3",
            isCollapsed && "justify-center"
          )}
        >
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-semibold text-sm">
              {user?.email.slice(0, 2).toUpperCase()}
            </span>
          </div>

          {!isCollapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate w-full text-center">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate w-full">
                  {user?.email}
                </p>
              </div>
              <ChevronDown
                className={twMerge(
                  "w-4 h-4 text-gray-500 dark:text-gray-300 transition-transform",
                  footerMenuOpen && "rotate-180"
                )}
              />
            </>
          )}
        </button>

        <AnimatePresence>
          {footerMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.15 }}
              className={twMerge(
                "absolute z-50 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden",
                isCollapsed
                  ? "left-full ml-2 bottom-2 w-[220px]"
                  : "left-2 right-2 bottom-full mb-2"
              )}
            >
              <button
                type="button"
                onClick={() => {
                  toggleTheme();
                }}
                className="w-full px-3 py-2 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {isDark ? (
                  <Sun className="w-4 h-4 text-yellow-500" />
                ) : (
                  <Moon className="w-4 h-4 text-gray-700 dark:text-gray-100" />
                )}
                <span>{isDark ? "Modo claro" : "Modo oscuro"}</span>
              </button>

              <div className="h-px bg-gray-200 dark:bg-gray-700" />

              <button
                type="button"
                onClick={() => {
                  logout();
                  setFooterMenuOpen(false);
                }}
                className="w-full px-3 py-2 flex items-center gap-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                <span className="text-red-500 font-semibold">Cerrar sesión</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
};

export default React.memo(Sidebar);
