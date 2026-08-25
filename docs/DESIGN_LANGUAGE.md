# Zameen Vivaad AI design language

The supplied Glassmorphism System is the product’s interaction and surface language. Zameen Vivaad AI keeps its existing parchment, coral, teal, ochre, and near-black palette rather than importing the reference’s purple/cyan colors. The reference’s reusable rules are applied to the current dashboard without changing its information architecture, page names, navigation, charts, ML workflow, or DOM structure.

## Mapping

| Reference principle | Zameen implementation |
|---|---|
| Layered glass surfaces | Existing panels, metric cards, map surfaces, modals, controls, and status cards use translucent fills, backdrop blur, inner top highlights, and ambient shadows. |
| Rounded system | Existing 14–22px dashboard cards remain intact; the new token layer establishes 12px small, 18px medium, 28px large, and pill radii for new or refined controls. |
| Distinct interaction states | Buttons, icon controls, navigation items, project rows, priority rows, and text actions define rest, hover, active, focus-visible, and disabled behavior. |
| Transform-only interaction motion | Hover lifts use `translateY`; presses use scale; layout dimensions are not animated. |
| Two interaction speeds | Hover transitions use 220ms and press transitions use 100ms, both with the reference ease-out curve. Existing long-form splash timing remains separate because it is an intentional cinematic sequence rather than an interaction state. |
| Inner glass highlight | All major glass surfaces carry a top inset highlight so they read as material layers instead of flat rounded rectangles. |
| Focus visibility | Keyboard focus uses an independent ring based on the current coral accent, preserving the existing palette. |
| Primary-action emphasis | Existing coral/ink primary actions retain their Zameen identity; the reference’s purple accent glow is not introduced. |

The dashboard remains the same product: Overview, Project desk, Risk studio, Parcel registry, Archive, analytics charts, real FastAPI ML assessments, persisted project history, and explicit fallback provenance.

## Visible implementation checkpoint

The first design-token pass was too subtle because the source stylesheet already contained later surface overrides. The current visible pass therefore applies the glass treatment at the end of the cascade, where it is authoritative: the page now uses layered ambient color fields, stronger translucent cards, 24px surface blur, visible edge highlights, separation shadows, frosted topbar/sidebar surfaces, glass chart/map wells, and clearer interaction surfaces. This preserves the existing content structure while making the material treatment perceptible in the live dashboard.

## Live visual check

The live Overview dashboard was reviewed after the design-language layer was applied. The existing near-black page, coral/teal/ochre risk palette, sidebar, topbar, four-card metric row, morning brief, two-column chart grid, map/priority sections, and current project history remain present. Cards now read as distinct glass planes through the inner highlight, border, blur, and ambient shadow treatment; the charts continue to render in their existing positions.
