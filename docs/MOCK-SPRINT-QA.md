# Mock Sprint QA & Deployment Verification

## Deployment

- Live URL:
- Deployment status:
- Deployment date:
- Verified by: Julius Ross

## Login → Redirect → Team Page Flow

| Test | Expected Result | Actual Result | Status |
|---|---|---|---|
| Open login page | Login page loads correctly |  |  |
| Submit empty login form | Validation errors appear |  |  |
| Sign in with valid account | User is authenticated |  |  |
| Successful login redirect | User is redirected to the expected page |  |  |
| Navigate to Team page | Team page loads successfully |  |  |
| Team member information | Photo, name, role and blurb display correctly |  |  |

## Edge Case Testing

| Test | Expected Result | Actual Result | Status |
|---|---|---|---|
| Invalid login credentials | Clear authentication error shown |  |  |
| Mobile viewport | Layout remains usable |  |  |
| Tablet viewport | Layout remains usable |  |  |
| Long team member name | Layout does not break |  |  |
| Long team member blurb | Content wraps or truncates appropriately |  |  |
| Missing/broken team member image | Page remains usable |  |  |
| Direct access to Team page while signed out | Authentication behaviour works as intended |  |  |

## Bugs Found

### Bug 1
- Description:
- Steps to reproduce:
- Expected:
- Actual:
- Severity:
- Status:

## Final Verification

- [ ] Deployment completed successfully
- [ ] Live URL loads without errors
- [ ] Login flow verified
- [ ] Redirect verified
- [ ] Team page verified
- [ ] Responsive behaviour checked
- [ ] Bugs documented