# **Comprehensive Email Management Rules & Logic Framework**

## **1\. Core Category System Architecture**

### **1.1 Category Structure**

Each category consists of:  
\- Category ID: Unique identifier  
\- Name: Human-readable label  
\- Description: What emails belong here  
\- Action Type: Determines processing behavior  
\- Categorization Prompt: Semantic matching guidance  
\- Rules: Precise pattern-matching conditions

### **1.2 Action Types (Processing Behaviors)**

#### **BriefAction**

* Behavior: Archives email from inbox, includes in daily Brief summary  
* User Experience: Email disappears from inbox but shows in Daily Brief  
* Use Cases: Newsletters, promotions, informational content, status updates  
* Key Point: Email is not deleted—just archived and summarized for later review

#### **DraftAction**

* Behavior: Keeps email in inbox, generates1-3 AI response drafts  
* User Experience: Email stays in inbox with draft responses ready to review  
* Use Cases: Emails needing replies (simple or complex), calendar invites  
* Key Point: User can accept, edit, or reject the drafted response

#### **InboxAction**

* Behavior: Keeps email in inbox, no processing or drafting  
* User Experience: Email remains unread and untouched in inbox  
* Use Cases: Important emails needing human decision-making, urgent items, critical family/work emails  
* Key Point: Zero processing—user sees the raw email

#### **UnsubscribeAction**

* Behavior: Archives email, excludes from Brief, suppresses all future mail from sender  
* User Experience: Current email and all future emails from sender bypass all Cora processing  
* Use Cases: Spam, unwanted newsletters, marketing emails  
* Key Point: User never sees future emails from this sender in Brief or inbox via Cora (but Gmail still receives them)  
* WARNING: Must always alert user before applying this action

---

## **2\. Default Category Taxonomy**

### **2.1 Important Family (User Attention Required)**

#### **Important Draft (InboxAction → DraftAction)**

* Purpose: Simple responses needed  
* Behavior: Email stays in inbox \+ AI drafts reply  
* Detection Logic:  
  * Reply clearly needed but straightforward  
  * No complex context required  
  * Standard response patterns applicable  
* Example Triggers: Scheduling requests, quick confirmations, simple questions

#### **Important Context (InboxAction)**

* Purpose: Complex/thoughtful responses needed  
* Behavior: Email stays in inbox, NO draft generated  
* Detection Logic:  
  * Reply needed but requires significant consideration  
  * Multiple decision factors  
  * Nuanced or sensitive response required  
* Example Triggers: Strategic decisions, sensitive family matters, complex negotiations

#### **Important Info (BriefAction)**

* Purpose: Important awareness, no action needed  
* Behavior: Archives and emphasizes in Brief  
* Detection Logic:  
  * Contains important information  
  * No response or action required  
  * User should be aware but not act immediately  
* Example Triggers: Confirmations, status updates, policy changes

#### **Important SOP (DraftAction)**

* Purpose: Standardized response templates  
* Behavior: Keeps in inbox \+ AI drafts from SOP template  
* Detection Logic:  
  * Matches a predefined Standard Operating Procedure  
  * Response should follow exact template  
  * Recurring email type with fixed response pattern  
* Example Triggers: Recurring vendor confirmations, automated form submissions, template-based inquiries

---

### **2.2 Transactional Category Family (Automated, Time-Sensitive)**

#### **Calendar (DraftAction)**

* Purpose: Meeting invitations and event management  
* Behavior: Stays in inbox \+ AI drafts acceptance/decline  
* Detection Logic:  
  * Contains calendar event invite  
  * Needs RSVP or attendance decision  
  * Time-bound commitment  
* Rules: Look for Invitation, Cal.com, Google Calendar, ^Accepted:

#### **Payments (BriefAction)**

* Purpose: Payment receipts and confirmations  
* Behavior: Archives and includes in Brief  
* Detection Logic:  
  * Payment confirmation (receipt, invoice confirmation, transfer confirmation)  
  * NOT payment requests or bills ← Critical distinction- Transactional record  
* Rules: a Zelle payment, Stripe receipts, PayPal confirmations  
* Anti-Pattern: Invoice requests (go to Action), payment reminders (go to Action)

#### **Packages (BriefAction)**

* Purpose: Shipping and delivery tracking  
* Behavior: Archives and includes in Brief  
* Detection Logic:  
  * Shipping notification or tracking update  
  * Package delivery status  
  * Order confirmation  
* Rules: Amazon tracking emails, FedEx/UPS notifications, order-update emails

#### **Comments (BriefAction)**

* Purpose: Collaboration notifications  
* Behavior: Archives and includes in Brief  
* Detection Logic:  
  * Someone commented on adocument/design  
  * Collaboration platform notification  
  * Requires review but not immediate response  
* Rules: Google Docs comments, Figma feedback, Linear notifications, GitHub comments

---

### **2.3 Informational Category Family (Passive Consumption)**

#### **Newsletter (BriefAction)**

* Purpose: Subscribed newsletters and publications  
* Behavior: Archives and includes in Brief  
* Detection Logic:  
  * Explicitly subscribed newsletter  
  * Regular publication  
  * Informational/educational content  
  * No action required  
* Rules:  
  * From contains @substack.com  
  * From starts with notification@, notifications@, announcements@, alerts@  
  * Has CATEGORY\_FORUMS label

#### **Promotion (BriefAction)**

* Purpose: Marketing and promotional content  
* Behavior: Archives and includes in Brief  
* Detection Logic:  
  * Marketing/sales material  
  * Discount offers or deals  
  * Promotional campaign  
  * Brand messaging  
* Rules: Has CATEGORY\_PROMOTIONS label (Gmail's auto-categorization)

#### **Other (BriefAction)**

* Purpose: Miscellaneous emails (catch-all)  
* Behavior: Archives and includes in Brief  
* Detection Logic:  
  * Doesn't fit other categories  
  * Social notifications (LinkedIn, Facebook, Twitter)  
  * Engagement metrics (likes, follows)  
  * General informational  
* Rules: 18+ patterns for social platforms, auto-generated notifications

---

### **2.4 Critical Action Categories**

#### **Action (BriefAction)**

* Purpose: Tasks/decisions required, no response needed  
* Behavior: Archives and EMPHASIZES in Brief  
* Detection Logic:  
  * Action/task required (sign documents, submit info, make decision)  
  * No reply to sender needed  
  * Time-bound deadline often present  
* Rules:  
  * Subject contains Reminder  
  * Body contains please sign  
  * Document signing requests  
* Anti-Pattern: NOT payment requests (see Payments)

#### **Timely (InboxAction — Stay Alert)**

* Purpose: Ultra-urgent, time-sensitive  
* Behavior: Stays in inbox, NEVER archived or briefed  
* Detection Logic:  
  * OTP/verification codes (time-limited)  
  * Login alerts or suspicious activity  
  * Meeting changes for TODAY  
  * Same-day event reminders  
  * Subject contains URGENT  
  * Password resets or security alerts  
  * Webinar reminders (time-specific)  
* Rules: Pattern matches for OTP, URGENT, meeting change notifications  
* Critical: Used for anything that should NEVER be delayed by Brief processing

#### **Spam (UnsubscribeAction)**

* Purpose: Malicious or unwanted email  
* Behavior: Archives without briefing, sender blocked  
* Detection Logic:  
  * Phishing attempts  
  * Credential requests via suspicious links  
  * Brand impersonation  
  * Suspicious attachments with malware indicators  
  * Urgency-based scams  
  * Requests for personal/financial info via untrusted channels  
* Rules: Pattern detection for common phishing indicators

---

## **3\. Rule System: Pattern Matching Logic**

### **3.1 Rule Types**

#### **Classification Rules (Sender/Subject/Body/Label-Based)**

* Field: from, subject, body, labels  
* Pattern: Literal text match (automatically escaped, not regex)  
* Matching: Case-insensitive substring match  
* Use: Reliable, precise sender or content matching  
* Example:  
  * Field: from, Pattern: @company.com → Matches all emails from company domain  
  * Field: subject, Pattern: Invoice → Matches any email with Invoice in subject  
  * Field: labels, Pattern: CATEGORY\_PROMOTIONS → Matches Gmail's promo label

#### **Timely Rules (Simple Sender-Based Urgency)**

* Field: from, subject  
* Pattern: Literal text match  
* Behavior: Email bypasses Brief, goes straight to Timely (InboxAction)  
* Use: Sender-based urgent rules (OTP providers, security alerts)  
* Example:  
  * Field: from, Pattern: @twilio.com → All Twilio emails marked Timely

#### **Semantic Category Prompts (AI-Guided Matching)**

* Mechanism: Descriptive prompt for AI semantic matching  
* Use: Content-based categorization (not just sender)  
* Example:  
  * Prompt: Emails about airline flights, booking confirmations, and flight updates  
  * Matches: Your flight is delayed, Boarding pass attached, Check-in now available  
  * Without needing specific sender domain rules

---

### **3.2 Rule Priority & Conflict Resolution**

Priority Order (highest to lowest):  
1\. Explicit user classification (manually set by user)  
2\. Timely rules (exact pattern matches for OTP, codes, etc.)  
3\. Precise classification rules (exact sender/subject matches)  
4\. Semantic prompts (AI-guided content matching)  
5\. Default category (fallback if no rules match)

Conflict Resolution:  
\- First matching rule wins  
\- Multiple rules in same category: OR logic (any match applies category)  
\- Multiple categories matching: Use priority order above  
\- Example: If email matches both Newsletter and Promotion rules, use the first rule created

---

## **4\. Email Processing Decision Tree**

### **4.1 Incoming Email Flow**

```
Email arrives↓
[Step 1: Apply Rules in Priority Order]
    ├─ Timely rule match? → Timely (InboxAction)
    ├─ Explicit rules match? → Apply matched category
    └─ No rule match? → [Step 2: Semantic Matching]
         ↓
[Step 2: AI Semantic Categorization]
    ├─ Matches category prompt? → Apply category
    └─ No semantic match? → [Step 3: Default]
         ↓
[Step 3: Default Categorization]
    └─ Other (BriefAction)
         ↓
[Step 4: Apply Action]├─ BriefAction → Archive + include in Brief
    ├─ DraftAction → Keep in inbox + generate drafts
    ├─ InboxAction → Keep in inbox (no processing)
    └─ UnsubscribeAction → Archive + block sender
         ↓
Email categorized
```

---

### **4.2 Action-Specific Processing**

#### **When BriefAction is Applied:**

1. Archive email from inbox (Gmail's Archive action)  
2. Extract subject, sender, key content snippet  
3. Add to Daily Brief summary  
4. Include category tag for user context  
5. Never generate draft responses  
6. Email remains in Gmail (not deleted)

#### **When DraftAction is Applied:**

1. Keep email in inbox (do NOT archive)  
2. Analyze email content for intent  
3. Generate 1-3 draft responses (based on user's draft mode setting)  
4. Include drafts in Brief or as separate draft notification  
5. User can accept, edit, or reject draft  
6. After user sends: email may be archived by user's preference

#### **When InboxAction is Applied:**

1. Keep email in inbox (do NOT archive)  
2. Mark as important/prominent if critical  
3. NO draft generation  
4. NO Brief inclusion  
5. User must manually process  
6. Useful for emails requiring human decision-making

#### **When UnsubscribeAction is Applied:**

1. Archive email from inbox  
2. Create rule to suppress ALL future emails from sender  
3. Add sender to do not brief list  
4. Future emails from sender: automatically archived, never briefed  
5. NOT deleted from Gmail (just suppressed from Cora)

---

## **5\. Semantic Matching Guidelines**

### **5.1 When to Use Semantic Prompts**

Use Semantic Prompts For (content-based):  
\- Emails about flights, bookings, and airline updates  
\- Emails regarding house/home maintenance issues  
\- Emails about delivery and shipping from any carrier  
\- Emails from any healthcare provider about appointments  
\- Emails about investment and financial planning

Use Classification Rules For (sender/subject-based):  
\- Specific sender domains (@company.com)  
\- Known newsletter sources (newsletter@xyz.com)  
\- Specific subject line patterns (Invoice, Receipt)  
\- GitHub notifications, Slack updates

---

### **5.2 Semantic Prompt Best Practices**

Good Prompt:

*Emails about vehicle maintenance, car repairs, auto insurance, and automotive services. Includes estimates, service appointments, and maintenance reminders.*

Bad Prompt:

*Car stuff*

Good Prompt:

*Meeting invitations, event invitations, calendar updates, and RSVP requests. Includes calendar platform notifications and event scheduling.*

Bad Prompt:

*Meetings*

---

## **6\. Critical Logic Rules**

### **6.1 Inbox Behavior Rules**

Email Should Stay in Inbox (InboxAction):  
\- Important decisions needed  
\- Urgent personal/family matters  
\- High-stakes work communications  
\- Requires human judgment  
\- Time-sensitive same-day events  
\- OTP/verification codes

Email Should Be Archived (BriefAction):  
\- Informational (no action)  
\- Newsletters/subscriptions  
\- Low-priority notifications  
\- Can be reviewed later in Brief  
\- Routine updates

### **6.2 Response Generation Rules**

Generate Draft (DraftAction):  
\- Email requires a reply  
\- Clear intent is evident  
\- Standard response patterns exist

DO NOT Generate Draft (InboxAction):  
\- Email too complex  
\- Significant context needed  
\- Sensitive/personal decision  
\- User needs to think deeply  
\- No clear right answer

NEVER Generate Draft (UnsubscribeAction):  
\- Spam or phishing  
\- Unwanted content  
\- Malicious intent

### **6.3 Briefing Rules**

Include in Brief (BriefAction):  
\- Can be summarized  
\- Not time-sensitive  
\- Can wait until next Brief  
\- Useful for batch review

Never Include in Brief (InboxAction, Timely, UnsubscribeAction):  
\- Time-critical  
\- User decision pending  
\- Malicious content  
\- Requires immediate attention

---

## **7\. Advanced Categorization Scenarios**

### **7.1 Ambiguous Email Resolution**

Scenario: Payment Request or Payment Confirmation?  
\- Invoice from vendor → Might be Payments (confirmation) or Action (payment due)  
\- Resolution: Check context- Contains phrase like Payment received → Payments  
\- Contains Please remit by \[date\] → Action  
\- Default to Action if uncertain (user needs to see)

Scenario: Newsletter or Promotion?  
\- Monthly update from brand → Might be Newsletter or Promotion  
\- Resolution:  
\- Primarily informational/educational → Newsletter  
\- Contains discount codes, sales pitch → Promotion  
\- If unclear → use Gmail's built-in category (CATEGORY\_PROMOTIONS label)

Scenario: Important Info or Important Draft?  
\- Project update from manager → Could be FYI (Important Info) or needs acknowledgment (Important Draft)  
\- Resolution:  
\- Explicit request for reply → Important Draft  
\- Informational update → Important Info  
\- If unclear, err toward Important Context (keep in inbox, let user decide)

---

### **7.2 Time-Based Categorization**

Emails with Deadlines:  
\- Action required by Friday → Action (emphasize in Brief)  
\- Meeting tomorrow at 2pm → Timely (InboxAction if same-day, Calendar if future)  
\- URGENT: Verify your account → Timely (likely phishing, verify before accepting)

Emails with Recurrence:  
\- Weekly newsletter → Newsletter with rule  
\- Daily report → Newsletter with rule (or Other if low value)  
\- Monthly statement → Payments or Action depending on required response

I have incorporated the list of tasks into the document's framework by classifying each one using the most appropriate existing category and action type.

**7.3 Additional Task Classification Examples**:-----**7.3 Additional Task Classification Examples (New)**

This table maps common email-driven tasks to the most appropriate default category and action type based on the framework's logic.

| Task | Recommended Category | Action Type | Rationale |
| ----- | ----- | ----- | ----- |
| **Reply** | Important Draft | DraftAction | Explicitly requires a reply; AI can draft a response. |
| **Signup** | Action | BriefAction | Requires a task/decision, but no direct reply to the sender is needed. |
| **Initiate returns** | Action | BriefAction | Requires a task (initiation), to be emphasized in the Brief. |
| **View updates about child in school app** | Timely | InboxAction | Ultra-urgent, time-sensitive personal information requiring immediate review. |
| **Fill out form** | Action | BriefAction | Requires a task/decision (submission), no reply needed. |
| **Print doc** | Action | BriefAction | Requires a task, no reply needed. |
| **Save doc** | Action | BriefAction | Requires a task, no reply needed. |
| **Review proposals (e.g., home contractor)** | Important Context | InboxAction | Requires significant consideration and human decision-making; should not be archived. |
| **Research purchase or service** | Important Info | BriefAction | Informational content for later awareness/review; no immediate action. |
| **Compose (user task to write)** | Important Context | InboxAction | Requires complex human decision and composition; should not be processed. |
| **Purchase item** | Action | BriefAction | Requires a task, no reply needed. |
| **Refill med** | Action | BriefAction | Requires a task, no reply needed. |
| **Pay bill** | Action | BriefAction | Represents a payment *request* or bill, which requires a task/action (not a *confirmation*). |
| **Click link from friend or fam** | Timely | InboxAction | Critical/urgent personal communication; requires human judgment before action. |
| **Subscription renewals** | Action | BriefAction | Requires a task/decision (to renew or not), no reply needed. |
| **Applications with deadlines** | Action | BriefAction | Time-bound task/decision required. |
| **Payments with deadlines** | Action | BriefAction | Time-bound task/decision required. |
| **Prescription pickups** | Action | BriefAction | Requires a task, no reply needed. |
| **Docusigns** | Action | BriefAction | Explicitly a task/decision ("sign documents"). |
| **Promotions saved by users to review for purchase** | Promotion | BriefAction | Marketing content, but intended for later, passive consumption via the Brief. |
| **Appointments** | Calendar | DraftAction | Meeting/event management requiring an RSVP/attendance decision; AI drafts response. |
| **Schedule coordination** | Important Draft | DraftAction | Requires a reply for simple coordination; AI can draft responses. |
| **License Renewals** | Action | BriefAction | Time-bound task/decision required. |
| **Changes to fee structures** | Important Info | BriefAction | Important awareness; no action/response needed. |
| **Registration reminders** | Action | BriefAction | Task/decision required; matches rule: "Subject contains Reminder." |
| **Meeting links** | Calendar | DraftAction | Part of meeting/event management. |
| **Travel itineraries** | Important Info | BriefAction | Informational confirmation; no action/response needed. |
| **Emails to self** | Important Context | InboxAction | Personal notes or reminders requiring human review; should not be archived. |
| **Any tax document** | Important Context | InboxAction | High-stakes, critical information requiring human decision/review. |
| **“Wait for” tasks:** |  |  |  |
| *Shipping updates* | Packages | BriefAction | Explicitly covered as tracking updates. |
| *Tax return status* | Important Info | BriefAction | Status update; no action/reply needed. |
| *Customer service correspondence (no reply needed)* | Important Info | BriefAction | Informational update; no action/reply needed. |

---

## **8\. User Customization Framework**

### **8.1 Allowed Customizations**

Users can:  
\- Create custom categories with any action type  
\- Add rules to existing or custom categories  
\- Modify category prompts for semantic matching  
\- Change action types on categories  
\- Delete empty categories  
\- Create email templates for standardized responses  
\- Unsubscribe from senders

### **8.2 Customization Constraints**

Users CANNOT:  
\- Delete system default categories (only customize)  
\- Send emails directly (only draft them)  
\- Permanently delete emails (only archive/suppress)  
\- Change email content before drafting  
\- Access email attachments

---

## **9\. Error Handling & Edge Cases**

### **9.1 Categorization Failures**

If email matches multiple categories:  
\- Apply highest priority rule  
\- Log conflict for debugging  
\- Don't break processing

If no rules match and semantic matching is ambiguous:  
\- Default to Other (BriefAction)  
\- Do NOT mark as Spam unless clear malicious intent  
\- Allow user to recategorize

### **9.2 Action Execution Failures**

If DraftAction fails to generate drafts:  
\- Don't break email processing  
\- Keep email in inbox without draft  
\- Alert user that draft generation failed

If Archive action fails:  
\- Keep email in inbox  
\- Log error  
\- Don't apply BriefAction

---

## **10\. Performance & Scale Considerations**

### **10.1 Rule Evaluation Order**

1. Fast path: Check Timely rules first (simplest, most time-critical)  
2. Precise rules: Check classification rules (exact matches, no AI needed)  
3. Semantic matching: Use AI for content analysis (slower, last resort)  
4. Default: Apply fallback category

### **10.2 Batch Processing**

* Process Briefs once daily (or at user-specified times)  
* Don't reprocess emails daily  
* Cache categorization decisions  
* Update only when rules change or email is reclassified

