# \# Mock Sprint QA \& Deployment Verification

# 

# \## Deployment

# 

# \- Live URL: https://team27-redesigning-the-ticketing-ex.vercel.app

# \- Deployment status: Live — authentication flow currently blocked by email verification issue

# \- Deployment date: 16 August 2026

# \- Verified by: Julius Ross

# 

# \## Login → Redirect → Team Page Flow

# 

# | Test | Expected Result | Actual Result | Status |

# |---|---|---|---|

# | Open login page | Login page loads correctly | Login page loads successfully on deployed site | PASS |

# | Submit empty login form | Validation errors appear | Not yet tested | NOT TESTED |

# | Sign in with valid account | User is authenticated | Authentication requires email verification; verification email was not received | BLOCKED |

# | Successful login redirect | User is redirected to the expected page | Unable to complete because email verification blocks authentication | BLOCKED |

# | Navigate to Team page | Team page loads successfully | Not yet verified through authenticated flow | NOT TESTED |

# | Team member information | Photo, name, role and blurb display correctly | Not yet verified through authenticated flow | NOT TESTED |

# 

# \## Edge Case Testing

# 

# | Test | Expected Result | Actual Result | Status |

# |---|---|---|---|

# | Invalid login credentials | Clear authentication error shown | Not yet tested | NOT TESTED |

# | Mobile viewport | Layout remains usable | Not yet tested | NOT TESTED |

# | Tablet viewport | Layout remains usable | Not yet tested | NOT TESTED |

# | Long team member name | Layout does not break | Not yet tested | NOT TESTED |

# | Long team member blurb | Content wraps or truncates appropriately | Not yet tested | NOT TESTED |

# | Missing/broken team member image | Page remains usable | Not yet tested | NOT TESTED |

# | Direct access to Team page while signed out | Authentication behaviour works as intended | Not yet tested | NOT TESTED |

# 

# \## Bugs Found

# 

# \### Bug 1

# \- Description: Email verification is required during authentication, but the verification email is not received.

# \- Steps to reproduce:

# &#x20; 1. Open the deployed application.

# &#x20; 2. Attempt to authenticate using an account requiring email verification.

# &#x20; 3. Application requests email verification.

# &#x20; 4. Check the registered email inbox and spam/junk folders.

# \- Expected: A verification email containing a verification link is sent to the registered email address.

# \- Actual: No verification email was received.

# \- Severity: Medium

# \- Status: Open

# 

# \## Final Verification

# 

# \- \[x] Deployment completed successfully

# \- \[x] Live URL loads without errors

# \- \[ ] Login flow verified

# \- \[ ] Redirect verified

# \- \[ ] Team page verified

# \- \[ ] Responsive behaviour checked

# \- \[x] Bugs documented

