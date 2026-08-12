import React from 'react'

export function DashStyles() {
  return (
    <style>{`
      @media (max-width: 900px) {
        .dash-layout { margin-left: 0 !important; }
        .mobile-menu-btn { display: flex !important; }
        .mobile-overlay { display: block !important; }
        .hero-landscape { display: none !important; }
        .search-bar { display: none !important; }
        .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        .forms-grid { grid-template-columns: 1fr !important; }
        .activity-layout { flex-direction: column !important; }
        .analytics-card { flex: unset !important; width: 100% !important; }
        .blueprints-grid { grid-template-columns: repeat(2, 1fr) !important; }
      }
      @media (max-width: 540px) {
        .stats-grid { grid-template-columns: 1fr 1fr !important; }
        .blueprints-grid { grid-template-columns: 1fr !important; }
      }
    `}</style>
  )
}
