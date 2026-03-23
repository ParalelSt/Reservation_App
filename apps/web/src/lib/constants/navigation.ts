import { Home, CalendarDays, Shield, Music, Flame, Dumbbell, MapPin, Info, Phone } from 'lucide-react';
import type { ComponentType } from 'react';

/** Navigation item definition */
export interface NavigationItem {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
}

/** Main navigation links */
export const NAVIGATION_ITEMS: NavigationItem[] = [
  { label: 'Početna', href: '/', icon: Home },
  { label: 'Rezervacija', href: '/book', icon: CalendarDays },
];

/** Info navigation links */
export const INFO_NAVIGATION_ITEMS: NavigationItem[] = [
  { label: 'O nama', href: '/about', icon: Info },
  { label: 'Lokacija', href: '/location', icon: MapPin },
  { label: 'Kontakt', href: '/contact', icon: Phone },
];

/** Facility navigation links */
export const FACILITY_NAVIGATION_ITEMS: NavigationItem[] = [
  { label: 'Studio', href: '/facilities/studio', icon: Music },
  { label: 'Sauna', href: '/facilities/sauna', icon: Flame },
  { label: 'Teretana', href: '/facilities/gym', icon: Dumbbell },
];

/** Admin navigation links */
export const ADMIN_NAVIGATION_ITEMS: NavigationItem[] = [
  { label: 'Admin', href: '/admin', icon: Shield },
];
