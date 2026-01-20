/**
 * Division Switcher Component
 * Allows users to switch between the 8 Groupe G. Lafrance divisions
 * 
 * Features:
 * - Visual division selector with icons
 * - Active division highlighting
 * - Service count badges
 * - Responsive design
 */

import { Building2, Home, Wrench, Trash2, Droplets, Hammer, Key, HardHat } from 'lucide-react';
import { DIVISIONS, DIVISION_SERVICE_COUNTS } from '../../data/divisions';
import type { DivisionType } from '../../types/lacoste-platform';

interface DivisionSwitcherProps {
  activeDivision: DivisionType;
  onDivisionChange: (division: DivisionType) => void;
  className?: string;
}

const DIVISION_ICONS: Record<DivisionType, any> = {
  'plomberie': Droplets,
  'construction': HardHat,
  'toitures': Home,
  'isolation': Building2,
  'conteneurs': Trash2,
  'gutters': Wrench,
  'decks': Hammer,
  'real-estate': Key
};

const DIVISION_COLORS: Record<DivisionType, string> = {
  'plomberie': 'bg-blue-500',
  'construction': 'bg-gray-700',
  'toitures': 'bg-amber-500',
  'isolation': 'bg-emerald-500',
  'conteneurs': 'bg-purple-500',
  'gutters': 'bg-cyan-500',
  'decks': 'bg-orange-500',
  'real-estate': 'bg-rose-500'
};

export function DivisionSwitcher({ activeDivision, onDivisionChange, className = '' }: DivisionSwitcherProps) {
  const activeDivisions = DIVISIONS.filter(d => d.active);

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Groupe G. Lafrance - Divisions</h3>
        <span className="text-sm text-gray-500">{activeDivisions.length} divisions actives</span>
      </div>

      {/* Desktop: Grid Layout */}
      <div className="hidden lg:grid lg:grid-cols-4 gap-3">
        {activeDivisions.map((division) => {
          const Icon = DIVISION_ICONS[division.id];
          const isActive = division.id === activeDivision;
          const serviceCount = DIVISION_SERVICE_COUNTS[division.id] || 0;
          const colorClass = DIVISION_COLORS[division.id];

          return (
            <button
              key={division.id}
              onClick={() => onDivisionChange(division.id)}
              className={`
                relative p-4 rounded-lg border-2 transition-all
                ${isActive 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }
              `}
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-full ${colorClass} flex items-center justify-center mb-3 mx-auto`}>
                <Icon className="w-6 h-6 text-white" />
              </div>

              {/* Division Name */}
              <div className="text-sm font-medium text-gray-900 text-center mb-1">
                {division.nameFr}
              </div>

              {/* Service Count Badge */}
              <div className="text-xs text-gray-500 text-center">
                {serviceCount} services
              </div>

              {/* Active Indicator */}
              {isActive && (
                <div className="absolute top-2 right-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile/Tablet: Horizontal Scroll */}
      <div className="lg:hidden flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
        {activeDivisions.map((division) => {
          const Icon = DIVISION_ICONS[division.id];
          const isActive = division.id === activeDivision;
          const serviceCount = DIVISION_SERVICE_COUNTS[division.id] || 0;
          const colorClass = DIVISION_COLORS[division.id];

          return (
            <button
              key={division.id}
              onClick={() => onDivisionChange(division.id)}
              className={`
                flex-shrink-0 w-32 p-3 rounded-lg border-2 transition-all
                ${isActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
                }
              `}
            >
              <div className={`w-10 h-10 rounded-full ${colorClass} flex items-center justify-center mb-2 mx-auto`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-xs font-medium text-gray-900 text-center truncate">
                {division.nameFr.split(' ').slice(-2).join(' ')}
              </div>
              <div className="text-xs text-gray-500 text-center">
                {serviceCount}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Division Info */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-600">
            Division active: <span className="font-medium text-gray-900">{DIVISIONS.find(d => d.id === activeDivision)?.nameFr}</span>
          </div>
          {DIVISIONS.find(d => d.id === activeDivision)?.rrbqLicense && (
            <div className="text-xs text-gray-500">
              RBQ: {DIVISIONS.find(d => d.id === activeDivision)?.rrbqLicense}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}