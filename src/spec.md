# Specification

## Summary
**Goal:** Build a simple web prototype of “Voice UPI Alert” that lets users manually paste UPI/SMS-like text, parses credit transactions offline, and announces new credits via browser Text-To-Speech.

**Planned changes:**
- Create a modern home screen showing total money received today, exactly the last 5 transactions (or fewer), a large Voice ON/OFF toggle, dark mode, and large readable typography.
- Add a first-run permission/explanation screen explaining SMS/notification access is not available in this web build, requiring acknowledgment that persists across reloads.
- Implement manual transaction capture (paste/import text) with offline parsing to detect credit-only transactions and extract INR amount, sender (when available), date/time (when available), and a heuristic source label; store transactions locally in app state.
- Implement voice announcements via `SpeechSynthesis` when a new credit transaction is added and Voice is ON, plus a UI control to play a test announcement.
- Add a “Buy Me a Coffee ☕” button at the bottom of the home screen that opens a UPI intent/payment link containing `taranseetharaman273@oksbi`.
- Apply a cohesive clean visual theme (not blue/purple) consistently across screens and components.

**User-visible outcome:** Users acknowledge a web limitations screen, then can paste transaction text to log recent credit payments, see today’s total and last 5 entries, toggle voice announcements (and test them), use dark mode, and tap “Buy Me a Coffee ☕” to open a UPI payment link.
