# UI overlap audit

The primary overlap defect was caused by Material Symbols ligature text inheriting ordinary label typography. Sidebar items and controls were visually showing icon names inline with their labels. The static stylesheet now explicitly loads the Material Symbols font rules and isolates icon spans from label typography.

The layout repair adds flex/grid shrink guards, safe wrapping for headings, ellipsis behavior for long project labels and metadata, stable search/filter widths, and protected control sizing. The browser now shows separate sidebar icons and labels, readable dashboard cards, and non-colliding Project desk rows.

A stronger glass layer was added to panels, cards, filters, search controls, status callouts, risk pills, buttons, and navigation. Browser computed styles confirm rounded panels, backdrop blur, translucent surfaces, and layered shadows while the existing static runtime and navigation remain active.

## Route verification

Risk studio renders its distribution card, signal anatomy, confidence pill, and movement queue without overlap. Parcel registry renders all seven records with readable parcel, owner, cadastral, status, and chevron columns. Sidebar icons are visually separated from navigation labels on both routes, and the glass card treatment remains consistent.
