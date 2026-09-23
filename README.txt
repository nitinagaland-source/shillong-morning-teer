Shillong Morning Teer - pre-host final changes patch

Changes included:
- Home header rebuilt to match the light-cyan reference style with target logo, bold site name and blinking LIVE indicator.
- Today's result table rebuilt with black borders, grey title row and turquoise F/R-S/R row matching the reference.
- All 'SHILLONG MORNING TEER' branding/content changed to 'Shillong Morning Teer', including inline SVG artwork text and copyright domains.
- Dream Numbers page browser title and page branding changed to 'Shillong Morning Teer Dream Numbers'.
- Previous Results table changed to compact CITY / DATE / F/R / S/R reference layout; House and Ending removed from the table.
- Daily Common Number Direct picks increased to a minimum of 4. Old daily records with fewer than 4 are topped up without overwriting existing picks.
- Daily common and dream generation remains date-based for 12:00 AM IST and works with the existing midnight cron/request reconciliation.

Do not deploy yet. Apply this patch to the existing project and run npm run lint, npm run build, npm run dev for localhost review.

