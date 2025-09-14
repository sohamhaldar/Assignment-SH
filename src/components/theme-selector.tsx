'use client';
import { useEffect, useRef, useState } from 'react';
import { Palette } from "lucide-react";
import { useTheme, Theme } from "@/contexts/ThemeContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

const themes = [
  { name: 'Light', value: 'light', colors: ['#ffffff', '#f8f9fa', '#e9ecef'] },
  { name: 'Dark', value: 'dark', colors: ['#212529', '#343a40', '#495057'] },
  { name: 'Blue', value: 'blue', colors: ['#0066cc', '#3399ff', '#66b3ff'] },
  { name: 'Green', value: 'green', colors: ['#28a745', '#34ce57', '#5dd879'] },
  { name: 'Purple', value: 'purple', colors: ['#6f42c1', '#8a63d2', '#a584e3'] },
  { name: 'Orange', value: 'orange', colors: ['#fd7e14', '#ff8c42', '#ff9a70'] }
];

const ThemeSelector = ({align = 'end', side = 'bottom', sideOffset = 8}: {
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
}) => {
  const { theme: selectedTheme, setTheme } = useTheme();

  const handleThemeChange = (themeValue: string) => {
    setTheme(themeValue as Theme);
  };

  const [open, setOpen] = useState(false);
  const [openTip, setOpenTip] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [isTriggerVisible, setIsTriggerVisible] = useState(true);

  useEffect(() => {
    const update = () => {
      const el = triggerRef.current;
      setIsTriggerVisible(!!el && el.offsetParent !== null);
    };
    update();
    window.addEventListener('resize', update);
    const onOrientationChange: EventListener = () => update();
    window.addEventListener('orientationchange', onOrientationChange);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', onOrientationChange);
    };
  }, []);

  useEffect(() => {
    if (!isTriggerVisible) return;
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const typing = tag === 'input' || tag === 'textarea' || target?.isContentEditable;
      if (!open && !typing && e.key.toLowerCase() === 't') {
        e.preventDefault();
        setOpen(true);
      } else if (open && e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isTriggerVisible, open]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <Popover open={openTip} onOpenChange={setOpenTip}>
        <PopoverTrigger asChild onMouseEnter={() => setOpenTip(true)} onMouseLeave={() => setOpenTip(false)}>
          <DropdownMenuTrigger asChild>
            <div className=" flex flex-col items-center justify-center rounded-lg hover:bg-accent p-2 px-4 cursor-pointer" role="button" aria-label="Theme (T)" ref={triggerRef}>
              <Palette className="w-10 h-10 md:w-8 md:h-8 lg:h-10 lg:w-10 mb-1"/>
              <p className="font-mono text-center text-xs text-medium">Theme</p>
            </div>
          </DropdownMenuTrigger>
        </PopoverTrigger>
        <PopoverContent side="top" align="center" className="px-2 py-1 text-xs w-fit font-mono">Theme (T)</PopoverContent>
      </Popover>
      <DropdownMenuContent className="w-64" align={align} side={side} sideOffset={sideOffset}>
      <DropdownMenuLabel className="font-mono font-semibold text-sm">Choose Theme</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <div className="grid grid-cols-2 gap-3 p-2">
        {themes.map((theme) => (
        <DropdownMenuItem
          key={theme.value}
          onClick={() => handleThemeChange(theme.value)}
          className={`p-3 rounded-lg border-2 transition-all hover:scale-105 cursor-pointer ${
          selectedTheme === theme.value
            ? 'border-primary bg-accent'
            : 'border-border hover:border-ring'
          }`}
        >
          <div className="flex flex-col items-center w-full">
          <div className="flex gap-1 mb-2">
            {theme.colors.map((color, index) => (
            <div
              key={index}
              className="w-4 h-4 rounded-full border border-border"
              style={{ backgroundColor: color }}
            />
            ))}
          </div>
          <p className="text-xs font-medium">{theme.name}</p>
          </div>
        </DropdownMenuItem>
        ))}
      </div>
      <DropdownMenuSeparator />
      <div className="p-2">
  <p className="text-xs text-muted-foreground text-center">
        Current: {themes.find(t => t.value === selectedTheme)?.name}
        </p>
      </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSelector;