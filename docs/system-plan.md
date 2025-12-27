# Notess Platform – Build Plan

## 1. Functional Goals
- Sell and distribute course/branch-specific notes and PYQs (free + paid tiers).
- Provide secure registration/login with OTP verification via Brevo.
- Handle payments for paid resources via Razorpay (order creation + webhook verification).
- Power an admin console to manage users, resources, and payment states.
- Offer a responsive, modern React UI with clear error/validation feedback.

## 2. Backend Architecture (Node/Express/Mongo)

### 2.1 Tech Stack
- Express server with modular routers.
- MongoDB + Mongoose ODM.
- Cloudinary for asset storage, Multer for uploads.
- JWT-based auth with role-based access control.
- Razorpay SDK for payment intents + webhook validation.
- Brevo transactional email API for OTP delivery.

### 2.2 Data Models (draft)
- `User`: name, email, hashed password, course, branch, role, isVerified, otpHash, otpExpiry, purchasedItems[], audit.
- `Resource`: Generic document for both notes and PYQs.
  - fields: title, description, course, branch, type (`note|pyq`), isPaid, price, cloudinaryFile, previewImage, tags, createdBy, status.
- `Purchase`: stores Razorpay order + payment IDs, amount, currency, userId, resourceId(s), status, receipt, webhook payload snapshot.
- `UploadAudit` (optional) or embed audit fields on Resource and Purchase.

### 2.3 Modules & Responsibilities
- `auth.controller`: register (OTP send), verify OTP, login, refresh, forgot/reset password, admin role promotion.
- `otp.service`: generate OTP, hash, persist, send via Brevo.
- `resource.controller`: CRUD for notes/PYQs, filter by course/branch/type, signed download URLs, mark paid/free, toggle publish.
- `purchase.controller`: create Razorpay order, verify payment signature, update Purchase + user entitlements.
- `admin.controller`: aggregate stats, user management (reset password, disable user), manage uploads.
- Middleware: `auth`, `roleGuard`, `validateRequest`, `errorHandler`.

### 2.4 API Outline
```
POST /api/auth/register -> create user + send OTP
POST /api/auth/verify -> commit account
POST /api/auth/login -> JWT pair
POST /api/auth/request-otp -> resend
POST /api/auth/forgot-password -> OTP/temporary link
POST /api/auth/reset-password
GET  /api/resources -> filters: course, branch, type, isPaid
POST /api/resources -> admin upload (multer + cloudinary)
PATCH/DELETE /api/resources/:id -> admin manage
GET  /api/resources/:id/download -> check entitlement + return signed URL
POST /api/purchase/order -> user initiates Razorpay order for resource(s)
POST /api/purchase/verify -> verify payment signature client->server
POST /api/purchase/webhook -> Razorpay webhook for final confirmation
GET  /api/admin/users -> admin view/search
PATCH /api/admin/users/:id/password -> reset
GET  /api/admin/dashboard -> metrics
```

### 2.5 Security/Validation
- Centralized error envelope via `ApiError`/`ApiResponse` helpers.
- Joi/Zod schemas server-side; client mirrors rules.
- Rate limiting on OTP + auth endpoints (todo).
- Webhook signature verification using Razorpay secret.
- Signed download links expire quickly; server checks purchase map before generating.

## 3. Frontend Architecture (React + Vite + Tailwind)

### 3.1 Layout/Navigation
- Landing page highlighting search/filter for notes/PYQs.
- Resource Explorer page with filters (course, branch, type, price) + cards grid.
- Detail drawer/modal for each resource (includes download/purchase CTA).
- Auth pages: Register (OTP workflow wizard), Login, Forgot/Reset.
- Payment flow modal that calls Razorpay Checkout.
- Admin area (separate layout) with sidebar: Dashboard, Users, Resources, Upload, Orders, Settings.

### 3.2 State/Data
- React Query (or custom hooks) for API communication.
- Context for auth tokens + user profile.
- Separate hooks modules: `useOTP`, `useResources`, `useAdminUsers`, `useCheckout`.
- Form handling with React Hook Form + Zod (to add as dependency).

### 3.3 UX Guidelines
- Tailwind CSS with custom theme (colors, typography).
- Responsive grid for resource cards, skeleton loaders, motion via Framer Motion (optional dependency) for subtle animations.
- Toast notifications for errors/success.
- Inline form validation errors.

## 4. Integration Plan
1. **Backend foundation**: Express app, database, global middleware, health route.
2. **Auth & OTP**: Models, OTP flow with Brevo, JWT issuance.
3. **Resource CRUD**: Upload via Cloudinary, filtering endpoints.
4. **Payment**: Razorpay order creation + webhook + entitlement enforcement.
5. **Admin APIs**: user management + dashboards.
6. **Frontend shell**: routing, layout, theme, shared components.
7. **User flows**: auth forms, explorer, detail view, download/purchase.
8. **Admin UI**: dashboards, CRUD forms, tables.
9. **Testing**: unit tests (services), integration tests for APIs, manual QA for UI.

## 5. Environment & Secrets
- `.env.example` to document keys: Mongo URI, JWT secret(s), Brevo API key, Razorpay key/secret, Cloudinary creds, frontend origin, etc.
- Vite env variables prefixed with `VITE_` for API base URLs + Razorpay key.

## 6. Next Steps
- Scaffold backend Express server with basic routes + error handling.
- Define Mongoose schemas + validation utilities.
- Install remaining dependencies (frontend + backend) as per plan.
- Implement auth + OTP flow end-to-end before tackling resources.
