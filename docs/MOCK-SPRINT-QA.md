# Mock Sprint QA & Deployment Verification

## Deployment

- Live URL: https://team27-redesigning-the-ticketing-ex.vercel.app
- Deployment status: Live
- Deployment date: 16 August 2026
- Verified by: Julius Ross
- Local QA environment: http://localhost:3000 using Julius Ross' personal Firebase project for authentication testing

## Login → Redirect → Team Page Flow

| Test | Expected Result | Actual Result | Status |
|---|---|---|---|
| Open login page | Login page loads correctly | Login page loads successfully | PASS |
| Submit empty login form | Validation errors appear | Not yet tested | NOT TESTED |
| Sign in with valid account | User is authenticated | User successfully authenticated in local QA environment | PASS |
| Successful login redirect | User is redirected to the expected page | Successful authentication redirected user to `/dashboard` | PASS |
| Navigate to Team page | Team page loads successfully | Team page loaded successfully at `/team` | PASS |
| Team member information | Photo, name, role and blurb display correctly | All 5 team members display with name, role and blurb. Initial/avatar placeholders are displayed instead of member photos | PARTIAL PASS |

## Edge Case Testing

| Test | Expected Result | Actual Result | Status |
|---|---|---|---|
| Invalid login credentials | Clear authentication error shown | Not yet tested | NOT TESTED |
| Mobile viewport | Layout remains usable | Not yet tested | NOT TESTED |
| Tablet viewport | Layout remains usable | Not yet tested | NOT TESTED |
| Long team member name | Layout does not break | Not yet tested | NOT TESTED |
| Long team member blurb | Content wraps or truncates appropriately | Not yet tested | NOT TESTED |
| Missing/broken team member image | Page remains usable | Team page currently uses initial/avatar placeholders rather than member photos | OBSERVATION |
| Direct access to Team page while signed out | Authentication behaviour works as intended | Not yet tested | NOT TESTED |

## Bugs / Observations Found

### Bug 1
- Description: Email verification is required on the deployed application, but the verification email was not received.
- Steps to reproduce:
  1. Open the deployed application.
  2. Attempt to authenticate using an account requiring email verification.
  3. Application requests email verification.
  4. Check the registered email inbox and spam/junk folders.
- Expected: A verification email containing a verification link is sent to the registered email address.
- Actual: No verification email was received.
- Severity: Medium
- Status: Open
- Note: Local authentication was successfully verified using a personal Firebase project.

### Observation 1
- Description: Team member cards currently display initials/avatar placeholders rather than actual member photos.
- Expected: Team page should display each member's photo, name, role and short blurb.
- Actual: Name, role and blurb display correctly, but photos are not present.
- Severity: Low
- Status: Open / pending team confirmation

## Final Verification

- [x] Deployment completed successfully
- [x] Live URL loads without errors
- [x] Login flow verified locally
- [x] Redirect verified locally
- [x] Team page verified locally
- [ ] Responsive behaviour checked
- [x] Bugs documented