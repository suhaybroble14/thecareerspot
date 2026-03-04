# Smoke Tests - The Career Spot

Manual verification checklist before each deploy.

## Prerequisites

- [ ] `npm run build` passes with 0 errors
- [ ] `/api/health` returns `{ "status": "healthy" }` (200)
- [ ] All env vars set: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_APP_URL`, `RESEND_API_KEY`

---

## 1. Application Flow

| # | Step | Expected Result |
|---|------|-----------------|
| 1.1 | Go to `/membership/apply` | Form loads with name, email, phone, message fields |
| 1.2 | Submit with valid data | Success message shown |
| 1.3 | Check inbox | "Application received" email arrives |
| 1.4 | Submit same email again | Error: "You already have a pending application" |
| 1.5 | Submit 4+ times in 1 hour (different emails) | Rate limited after 3rd attempt per email |
| 1.6 | Check `membership_applications` table | Row exists with status `submitted` |
| 1.7 | Check admin inbox | "New application" notification email received |

## 2. Approval Flow (Admin)

| # | Step | Expected Result |
|---|------|-----------------|
| 2.1 | Go to `/admin/applications` | List of applications shown |
| 2.2 | Click an application | Detail page loads with full info, admin notes |
| 2.3 | Click "Under Review" | Confirmation modal appears |
| 2.4 | Confirm | Status updates, applicant gets "under review" email |
| 2.5 | Click "Approve" | Modal shows capacity preview: "Active members: X -> X+1, Day pass capacity: Y -> Y-1" |
| 2.6 | Confirm approval | Status updates, applicant gets "approved" email |
| 2.7 | Click "Send Payment Link" | Payment link email sent to applicant |
| 2.8 | Click "Reject" on a different app | Modal appears, confirm, applicant gets "rejection" email with day pass CTA |
| 2.9 | Check `audit_logs` table | Entries for approve, reject, under_review, payment_link |

## 3. Day Pass Booking

| # | Step | Expected Result |
|---|------|-----------------|
| 3.1 | Go to `/day-pass` | Calendar loads with availability per day |
| 3.2 | Select a future date with availability | "Book Day Pass" button enabled |
| 3.3 | Click Book (logged in) | Redirected to Stripe checkout |
| 3.4 | Complete test payment (`4242 4242 4242 4242`) | Redirected to confirmation page with QR code |
| 3.5 | Check inbox | "Day pass confirmed" email with booking date and code |
| 3.6 | Go to `/dashboard/bookings` | Booking visible with QR code and status "confirmed" |
| 3.7 | Try booking same date again | Error: "You already have a booking for this date" |
| 3.8 | Try booking 11+ times in 1 hour | Rate limited after 10th attempt |

## 4. QR Check-in

| # | Step | Expected Result |
|---|------|-----------------|
| 4.1 | Go to `/admin/check-in` | Camera mode and manual entry tabs shown |
| 4.2 | Deny camera permission | Auto-switches to manual input with "Camera access denied" message |
| 4.3 | Scan valid day pass QR (for today) | Green success: name, "day pass", date shown |
| 4.4 | Scan same QR again | Red error: "QR code has already been used" |
| 4.5 | Enter invalid code manually | Red error: "Invalid code. No matching booking or membership found." |
| 4.6 | Scan day pass QR for wrong date | Red error: "Booking is for [date], not today" |
| 4.7 | Scan valid monthly membership QR | Green success: name, "monthly" shown |
| 4.8 | Scan same monthly QR again (same day) | Red error: "Already checked in today" |
| 4.9 | Scan expired membership | Red error: "Membership has expired" |
| 4.10 | Check `check_ins` table | Records for successful scans |
| 4.11 | Check `audit_logs` table | Entries for both successful and failed scans |

## 5. Capacity

| # | Step | Expected Result |
|---|------|-----------------|
| 5.1 | Check `/admin` overview | Shows "X/14" current occupancy |
| 5.2 | Verify formula | Available = 14 - active monthly members - confirmed day passes for date |
| 5.3 | Book day passes until capacity = 0 | `/day-pass` calendar shows date as full |
| 5.4 | Try booking a full date | Error: "No spots available for this date" |
| 5.5 | Approve a membership application | Admin overview updates active monthly count |

## 6. Admin Panel (Mobile)

| # | Step | Expected Result |
|---|------|-----------------|
| 6.1 | Open `/admin` on mobile viewport | Sidebar collapses, hamburger menu works |
| 6.2 | Navigate between admin pages | All pages load, no horizontal overflow |
| 6.3 | Use QR scanner on mobile | Camera opens (or manual fallback on denial) |
| 6.4 | Review application on mobile | All buttons accessible, modal fits screen |

## 7. Security

| # | Step | Expected Result |
|---|------|-----------------|
| 7.1 | Visit `/admin` while logged out | Redirected to `/login` |
| 7.2 | Visit `/admin` as non-admin user | Redirected to `/dashboard` |
| 7.3 | Visit `/dashboard` while logged out | Redirected to `/login` |
| 7.4 | Call `/api/check-in` without auth | 401 response |
| 7.5 | Call `/api/check-in` as non-admin | 403 response |
| 7.6 | Check browser DevTools sources | No `SUPABASE_SERVICE_ROLE_KEY` in client bundle |

## 8. No Console Errors

| # | Step | Expected Result |
|---|------|-----------------|
| 8.1 | Load homepage | No console errors |
| 8.2 | Load `/day-pass` | No console errors |
| 8.3 | Load `/dashboard` (logged in) | No console errors |
| 8.4 | Load `/admin` (as admin) | No console errors |
| 8.5 | Complete a check-in flow | No console errors |

---

## Quick Regression Check

After any deploy, run these 5 checks minimum:

1. `/api/health` returns 200
2. `/login` - magic link sends
3. `/day-pass` - calendar loads with correct availability
4. `/admin` - overview stats load
5. `/admin/check-in` - scanner initializes or falls back to manual
