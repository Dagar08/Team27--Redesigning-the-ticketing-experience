# Sprint 1 Deployment Verification

**Tester:** Julius Ross  
**Task:** T14 - Verify the deployed build  
**Environment:** Deployed Vercel site  
**Date:** 13 September 2026  

## Test Results

| Test | Result | Notes |
|---|---|---|
| Email/password sign-in | PASS | Existing account signs in successfully on the deployed site. |
| Sign-up | FAIL | Registration flow did not result in the new email appearing in Firebase Authentication. |
| Email verification | PASS | Verification email was received successfully during the sign-up attempt. |
| Google sign-in | FAIL | Google authentication did not complete successfully on the deployed site. |
| Sign-out | PASS | User was signed out successfully. |
| Session persistence | PASS | Authenticated session persisted as expected. |
| Protected route while signed out | PASS | Protected route behaviour worked as expected. |
| Team page | PASS | Team page rendered correctly on the deployed site. |
| Dashboard | PASS | Dashboard rendered correctly on the deployed site. |
| Firestore `users` collection round trip | BLOCKED / NOT VERIFIED | The new account was not created in Firebase Authentication, so a corresponding `users/{uid}` document could not be created/read back to complete the round trip. |

## Defects

### Defect 1 - Google sign-in fails

**Steps to reproduce:**
1. Open the deployed site.
2. Choose Google sign-in.
3. Attempt to authenticate with Google.

**Expected:**  
Google authentication completes successfully and the user enters the application.

**Actual:**  
Google sign-in fails and the authentication flow does not complete.

---

### Defect 2 - Sign-up does not create a Firebase Authentication user

**Steps to reproduce:**
1. Open the deployed site.
2. Navigate to Sign Up.
3. Enter valid registration details using a new email address.
4. Submit the registration.
5. Complete the email verification flow.
6. Check Firebase Console -> Authentication -> Users.

**Expected:**  
A new Firebase Authentication user is created and appears in the Users list.

**Actual:**  
The verification email is received, but the new email does not appear in Firebase Authentication, so the registration does not complete successfully.

## Summary

- Every required authentication path was tested on the deployed site.
- Team page rendering was verified successfully.
- Dashboard rendering was verified successfully.
- Google sign-in failed.
- Sign-up did not create a Firebase Authentication user.
- Firestore `users` collection round trip could not be completed because sign-up did not create the user account.
- No application code was changed as part of this QA task.
