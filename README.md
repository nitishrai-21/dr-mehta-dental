Dr. Mehta Dental

A modern full-stack dental clinic website and appointment management demo built with Next.js, TypeScript, PostgreSQL, Prisma, and Tailwind CSS.

The project is intentionally designed as a freelance portfolio / client-demo application rather than only a static marketing website.

The public-facing website presents the dental clinic professionally, while the backend is being developed into a practical admin system for managing appointment requests, patients, and prescriptions.

Project Goals

This project demonstrates the ability to build a complete small-business web application with:

A polished responsive public website

Appointment request workflow

Server-side form validation

PostgreSQL persistence

Prisma ORM

Admin dashboard

Appointment management

Patient management

Appointment history

Prescription management

Relational database design

Production-oriented project structure

Clear separation between public UI, server actions, validation, and database access

The application is currently a demo project, so authentication, email notifications, payment processing, and other production concerns are intentionally kept for later phases.

Tech Stack
Frontend

Next.js 16

React 19

TypeScript

App Router

Tailwind CSS v4

shadcn/ui

Base UI

tw-animate-css

lucide-react

Embla Carousel

next/image

Backend

Next.js Server Actions

Prisma ORM 7

PostgreSQL

Neon PostgreSQL

Zod

Prisma PostgreSQL adapter

Development

ESLint

TypeScript

Prisma migrations

Turbopack

Package Versions

Important project versions currently include:

Next.js 16.3.6
React 19.2.8
Prisma 7.10.0
TypeScript 5.9.3
Node.js 22.x
Tailwind CSS 4.x
Zod 4.x
PostgreSQL Neon

The exact installed versions should always be confirmed from package.json and the lockfile rather than assumed from this document.

Database Sync Notes

This project includes an audit log table for admin activity tracking. If the database schema falls out of sync locally, the app can fail when loading audit history for patient, appointment, or prescription records.

To guard against that, the dev startup flow now runs a small check before the Next.js server starts:

npm run dev

This invokes the audit log table ensure script automatically. You can also run it manually:

npm run db:ensure-audit

If Prisma migrations and the database drift apart, run:

npx prisma migrate dev

Current Architecture

The project currently follows this general structure:

dr-mehta-dental/
│
├── prisma/
│ ├── schema.prisma
│ └── migrations/
│
├── public/
│ └── images/
│ └── dental/
│ ├── clinic.jpg
│ ├── dentist.jpg
│ ├── treatment.jpg
│ ├── consultation.jpg
│ └── interior.jpg
│
├── src/
│ │
│ ├── app/
│ │ ├── globals.css
│ │ ├── layout.tsx
│ │ ├── page.tsx
│ │ └── actions/appointments.ts
│ │ └── admin/layout.tsx
│ │ └── admin/page.tsx
│ │
│ ├── components/
│ │ ├── dental/
│ │ │ ├── navbar.tsx
│ │ │ ├── hero.tsx
│ │ │ ├── trust-strip.tsx
│ │ │ ├── about.tsx
│ │ │ ├── testimonials.tsx
│ │ │ ├── appointment.tsx
│ │ │ ├── faq.tsx
│ │ │ └── footer.tsx
│ │ │
│ │ ├── admin/
│ │ │ └── admin-header.tsx
│ │ │ └── admin-sidebar.tsx
│ │ │ └── dashbaord-stats.tsx
│ │ │
│ │ └── ui/
│ │ ├── button.tsx
│ │ ├── sheet.tsx
│ │ ├── accordion.tsx
│ │ └── carousel.tsx
│ │
│ ├── generated/
│ │ └── prisma/
│ │
│ └── lib/
│ ├── db/
│ │ └── prisma.ts
│ │
│ ├── validations/
│ │ └── appointment.ts
│ │
│ └── utils.ts
│
├── .env
├── prisma7.config.ts
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md

Generated Prisma files under src/generated/prisma should not be manually edited.

Public Website

The public website is already polished and is currently the primary completed part of the application.

The public page contains:

Navigation

Hero section

Trust indicators

About section

Testimonials

Appointment request section

FAQ section

Clinic contact information

Footer

The visual direction is intentionally:

Professional

Calm

Premium

Healthcare-oriented

Minimal

Responsive

Suitable for a private dental clinic

Design System

The project uses CSS variables and Tailwind CSS.

Current core colors include:

Background: #f8f8f6
Foreground: #17252b

Surface: #ffffff
Surface Muted: #f1f4f2

Primary: #0f5c5e
Primary Dark: #0b4648
Primary Light: #e3f0ef

Accent: #c79a5b
Accent Light: #f4eadc

Muted: #667477
Border: #dfe6e3

Typography uses:

Inter for interface/body text

Playfair for headings

The design system should be preserved when building the admin interface so that the public site and dashboard feel like one product.

Database

The application uses PostgreSQL hosted on Neon.

The project intentionally uses a hosted development database rather than requiring every developer to install PostgreSQL locally.

Environment variable:

DATABASE_URL="..."

The actual database URL must never be committed to Git.

Prisma

Prisma is configured using Prisma 7.

The generated client is located at:

src/generated/prisma

The Prisma database client is exposed through:

src/lib/db/prisma.ts

Application code should import the shared client rather than creating new Prisma clients throughout the application.

Database Models

The current database contains:

Admin
Patient
Appointment
Prescription
PrescriptionItem

Admin

Represents a clinic administrator/dental professional using the management system.

Fields include:

id

name

email

createdAt

updatedAt

Relations:

appointments

prescriptions

Patient

Represents a patient.

Fields include:

id

name

phone

email

createdAt

updatedAt

Email is currently:

Optional

Not unique

Phone is:

Required

Indexed

Not unique

This is intentional. A shared phone number or email address should not automatically be treated as a globally unique patient identity.

Appointment

Represents an appointment request or scheduled appointment.

Important fields:

patientId

preferredDate

preferredTime

treatment

patientStatus

message

status

adminId

createdAt

updatedAt

Appointment status:

PENDING
CONFIRMED
CANCELLED
COMPLETED

The default status is:

PENDING

Public appointment requests therefore enter the admin system as pending requests.

Prescription

Represents a prescription associated with an appointment.

It belongs to:

Patient

Appointment

Admin

A prescription can contain multiple prescription items.

PrescriptionItem

Represents an individual medication within a prescription.

Current fields include:

medication

dosage

frequency

duration

instructions

This allows the demo to demonstrate a realistic one-to-many relationship.

Appointment Workflow

The current public appointment workflow is:

Visitor
│
▼
Appointment Form
│
▼
Zod Validation
│
▼
Server Action
│
▼
Find patient by phone
│
├── Existing patient
│ │
│ ▼
│ Update patient
│
└── New patient
│
▼
Create patient
│
▼
Create appointment
│
▼
PENDING

The appointment form currently collects:

Full name

Phone

Email

Preferred date

Preferred time

Treatment

Patient status

Message

Validation

Appointment input is validated server-side using Zod.

Validation is located at:

src/lib/validations/appointment.ts

The validation layer should remain independent from the UI.

The server action validates the incoming data again even if the frontend already performs validation.

This is important because server actions must not trust client-provided data.

Server Actions

Appointment creation is currently implemented in:

src/app/actions/appointments.ts

The action:

Receives appointment input

Validates it with Zod

Validates the appointment date

Finds an existing patient by phone

Updates the patient if found

Creates a patient if necessary

Creates the appointment

Returns a structured success/error result

The action does not expose Prisma directly to the browser.

Prisma Migrations

Database changes are managed through Prisma migrations.

Example:

npx prisma migrate dev --name add_patient_status

After schema changes:

npx prisma generate

Useful commands:

npx prisma migrate dev
npx prisma generate
npx prisma studio

Never manually modify already-applied migration SQL unless there is a specific database recovery reason.

Admin Dashboard Roadmap

The admin system is the major next phase of the project.

Phase 1 — Admin Shell

Build:

Admin layout

Sidebar

Header

Dashboard navigation

Responsive mobile navigation

Dashboard overview

Suggested navigation:

Dashboard
Appointments
Patients
Prescriptions

Potential future sections:

Settings
Profile

Phase 2 — Dashboard Overview

Display useful clinic metrics:

Today's appointments
Pending requests
Confirmed appointments
Completed appointments
New patients

Add an appointment overview table containing:

Patient

Date

Time

Treatment

Status

Actions

The dashboard should look like a real SaaS/business application rather than a collection of database tables.

Phase 3 — Appointment Management

Admin should be able to:

View appointment

Confirm appointment

Cancel appointment

Mark appointment completed

View patient information

View appointment history

Open patient profile

Useful filters:

All
Pending
Confirmed
Completed
Cancelled

Potential date filters:

Today
Tomorrow
This week
Custom range

Phase 4 — Patient Management

Create a searchable patient directory.

Patient list should support:

Name search

Phone search

Email search

Pagination

Patient detail page

Patient detail should show:

Patient information
│
├── Contact details
│
├── Appointment history
│
└── Prescriptions

Phase 5 — Prescription Management

Admin should be able to create a prescription from an appointment.

Example flow:

Appointment
│
▼
Patient
│
▼
Create prescription
│
├── Medication
├── Dosage
├── Frequency
├── Duration
└── Instructions

Allow multiple medication rows.

Example:

Prescription
├── Amoxicillin
├── Ibuprofen
└── Mouthwash

Phase 6 — Demo Polish

After the core functionality works:

Loading states

Empty states

Error states

Confirmation dialogs

Toast notifications

Skeleton loaders

Responsive tables

Mobile-friendly admin interface

Search debounce

Pagination

URL-based filters

Accessible keyboard navigation

These details are important for demonstrating freelance-level implementation quality.

Future Production Features

These are intentionally not part of the current demo milestone.

Potential production features include:

Admin authentication

Role-based access control

Email notifications

Appointment confirmation emails

SMS/WhatsApp notifications

Calendar integration

Google Calendar integration

File/document uploads

Prescription PDF generation

Audit logs

Rate limiting

CSRF/security hardening

Automated backups

Monitoring

Error tracking

Production database configuration

Authentication

Authentication should be added after the admin workflow has been built and tested.

The demo currently prioritizes demonstrating the actual business workflow first.

When authentication is introduced, it should protect:

/admin/\*

while keeping the public clinic website accessible.

Current Progress
Completed

Next.js project setup

App Router

TypeScript

Tailwind CSS v4

shadcn/Base UI foundation

Public dental website

Responsive navigation

Hero

Trust section

About section

Testimonials

Appointment section

FAQ

Clinic contact information

Footer

Prisma 7

PostgreSQL

Neon database

Prisma schema

Prisma migrations

Generated Prisma client

Shared Prisma database client

Appointment Zod validation

Appointment server action

Patient creation/update workflow

Appointment creation workflow

Appointment status model

Patient status model

Prescription database model

Prescription item database model

Admin database model

TypeScript compilation verified

Production build verified

Appointment submission tested successfully

Current Database Status

The database is synchronized with Prisma migrations.

The current important relationships are:

Admin
│
├── Appointment
│
└── Prescription
│
└── PrescriptionItem

Patient
│
├── Appointment
│
└── Prescription

Appointment:

Patient ────< Appointment >──── Admin
│
│
▼
Prescription
│
▼
PrescriptionItem

Development Commands

Install dependencies:

npm install

Start development:

npm run dev

Run lint:

npm run lint

Run TypeScript checking:

npx tsc --noEmit

Create production build:

npm run build

Run production server:

npm start

Prisma:

npx prisma generate
npx prisma migrate dev
npx prisma studio

Important Development Rules
Do not expose Prisma to client components

Database access belongs on the server.

Do not import Prisma into:

"use client"

components.

Use server actions or server-side functions.

Validate server-side

Client-side validation improves UX.

Server-side validation provides the actual boundary.

Every public form that modifies database state should validate its input on the server.

Keep database identity separate from user data

Do not assume:

email = patient identity
phone = patient identity

The database ID is the patient identity.

Email and phone are searchable attributes.

Preserve the public design

The public website is already polished.

New backend/admin work should not unnecessarily modify the public-facing design.

The admin interface should reuse the same design language while being optimized for operational workflows.

Portfolio Positioning

The project should eventually demonstrate more than:

"I can build a dental website."

The target demonstration is:

"I can build a complete small-business web application with a polished marketing site, appointment workflow, relational database, admin dashboard, patient management, and prescription management."

That distinction is important for freelance opportunities.

Next Immediate Milestone

The next implementation milestone is:

ADMIN DASHBOARD FOUNDATION

Recommended order:

Admin route structure

Admin layout

Admin sidebar

Dashboard page

Dashboard statistics

Appointment table

Appointment status actions

Patient directory

Patient detail

Prescription management

Authentication

Final production polish

Do not start with authentication or advanced infrastructure before the core admin workflow is visually and functionally complete.
