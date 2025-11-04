import React from 'react';

// Base Icon component for props
const Icon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size || 24}
    height={props.size || 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke={props.color || 'currentColor'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {props.children}
  </svg>
);

/**
 * 1. Dashboard: A clipboard with a rising trendline, representing
 * logging, performance, and overview.
 */
export const DashboardIcon = (props) => (
  <Icon {...props}>
    {/* The clipboard backing */}
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    {/* The clip at the top */}
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    {/* The trendline on the "paper" */}
    <polyline points="7 12 10 9 13 12 17 9" />
    {/* A line of "text" below the trend */}
    <path d="M7 16h10" />
  </Icon>
);

/**
 * 2. Daily Log: A calendar with a small hard hat,
 * representing daily field reports.
 */
export const DailyLogIcon = (props) => (
  <Icon {...props}>
    {/* Calendar body */}
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    {/* Calendar top ticks */}
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    {/* Calendar horizontal line */}
    <line x1="3" y1="10" x2="21" y2="10" />
    {/* Small Hard Hat */}
    <path d="M8 14h8v2a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2z" />
    <path d="M12 12a2 2 0 0 0-2 2v0h4v0a2 2 0 0 0-2-2z" />
  </Icon>
);

/**
 * 3. Equipment: A standard wrench combined with a
 * device tag, representing tagged equipment.
 */
export const EquipmentIcon = (props) => (
  <Icon {...props}>
    {/* Wrench (from Lucide) */}
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.7-3.7a1 1 0 0 0 0-1.4l-1.6-1.6a1 1 0 0 0-1.4 0l-3.7 3.7z" />
    <path d="M6 8.8 15 18l-1.4 1.4-9-9L6 8.8z" />
    <path d="m18 15 4-4" />
    <path d="m2 2 5.5 5.5" />
    {/* Device Tag */}
    <path d="M4 16v-5a2 2 0 0 1 2-2h5l4 4v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
    <circle cx="8" cy="12" r="1" />
  </Icon>
);

/**
 * 4. Safety: A shield with a checkmark, representing
 * safety checks and compliance.
 */
export const SafetyIcon = (props) => (
  <Icon {...props}>
    {/* Shield */}
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    {/* Checkmark */}
    <path d="m9 12 2 2 4-4" />
  </Icon>
);

/**
 * 5. Geo-Map: A map pin that is "broadcasting" signal
 * waves, representing geotagged data.
 */
export const GeoMapIcon = (props) => (
  <Icon {...props}>
    {/* Map Pin */}
    <path d="M12 20s-7-4.5-7-11a7 7 0 0 1 14 0c0 6.5-7 11-7 11z" />
    <circle cx="12" cy="9" r="2.5" />
    {/* Signal Waves */}
    <path d="M14.1 7.9a3 3 0 0 1 0 4.2" />
    <path d="M16.2 5.8a6 6 0 0 1 0 8.4" />
  </Icon>
);

/**
 * 6. AI Analyzer: A camera lens with the 'BrainCircuit'
 * icon inside, representing AI photo analysis.
 */
export const AiAnalyzerIcon = (props) => (
  <Icon {...props}>
    {/* Camera Lens */}
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    {/* Circuit Lines */}
    <path d="M12 4v2" />
    <path d="M12 18v2" />
    <path d="M4 12h2" />
    <path d="M18 12h2" />
    <path d="m15.9 6.1 1.4-1.4" />
    <path d="m6.7 17.3 1.4-1.4" />
    <path d="m15.9 17.9 1.4 1.4" />
    <path d="m6.7 6.7 1.4 1.4" />
  </Icon>
);

/**
 * 7. Team: The 'Users' icon, but the lead user
 * is wearing a hard hat.
 */
export const TeamIcon = (props) => (
  <Icon {...props}>
    {/* Back User */}
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    {/* Front User Body */}
    <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
    {/* Front User Head (with Hard Hat) */}
    <path d="M19 10v-1a3 3 0 0 0-3-3h-1a3 3 0 0 0-3 3v1" />
    <path d="M14.5 10.5a3.5 3.5 0 1 1 3 0" />
  </Icon>
);
