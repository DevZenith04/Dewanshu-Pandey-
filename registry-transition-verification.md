# Registry and transition verification

Project desk now exposes a shared live search input and risk filters. Typing `Gomti` immediately reduced the visible project rows to Gomti Riverside Development while preserving the selected-file panel and the rest of the shell.

Parcel registry now exposes an independent live search input and status filters for All status, ACQUIRED, SURVEYED, NOTIFIED, DISPUTED, and PENDING. The browser confirms the controls render with all seven source records before filtering.

The static runtime uses a `.content.view-enter` transition on every render, with a reduced-motion override. The initial intro remains gated by `sessionStorage.zv_splash_seen` and the reduced-motion media query, so navigation renders do not replay it.

Risk studio now uses the shared project query and risk filter contract. Navigating from Project desk preserved the `Gomti` query, and the review queue displayed only the matching Gomti record. Clicking Critical kept the filtered result and updated the active control without a full page reload.
