# Design Decisions

This document captures important design decisions made during the development of the SafetyReport application.

## Report Types

### Safety Excellence - "Recognized" vs "Reported"
**Date:** January 11, 2026

**Decision:** Use "Recognized" label instead of "Reported" for Safety Excellence metrics in the dashboard.

**Reasoning:** 
- Safety Excellence reports capture positive observations and safe behaviors, not negative incidents
- Using "Recognized" emphasizes the positive, appreciative nature of these reports
- Creates a distinction between problem reporting (Unsafe Acts, Unsafe Conditions) and positive recognition
- Encourages a culture of recognition and appreciation for good safety practices
- The term aligns with the intent to celebrate safety excellence rather than just document it

**Implementation:**
- Dashboard card for Safety Excellence uses green background (`bgcolor: 'success.light'`)
- Metric label: "Safety Excellence" 
- Count description: "Recognized" (instead of "Reported")
- Located in: `/web/src/pages/DashboardPage.tsx`

---

## Future Decisions

Document additional design decisions here as they are made.
