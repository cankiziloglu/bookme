# BookMe App

## Overview

BookMe App is a meeting scheduling application to streamline the scheduling process for both the organizer and guest. The organizer can create various events available for booking and give the links to these events or his/her booking page link to guests. Guests can then create events only at times available for the organizer.

## Features

- Authentication with Google
- Create events with various lengths and subjects
- Set available times for each day of the week
- Copy links for events to send to guests
- Guests can book meetings on organizer's available times
- Guests can choose their own timezone and available times will be shown in that timezone
- Events will be created on the Google Calendar of the Organizer with guest's email info so that an event email is also sent to the guest

## Tech Stack

- **Language**: Typescript
- **Frontend**: Next.js 15, React
- **Backend**: Next.js 15, Google Calendar API, PostgresQL Database
- **Services**: Neon Database, Clerk Authentication
- **Styling**: Tailwind CSS, shadcn/ui
- **Deployment**: This website uses the core functionality of the app, check the links below

## How the App Works

1. **User Registration/Login**: Users can sign up or sign in with their google account
2. **Event page**: After logging in, users are directed to the event page where they can see an overview of their events, create new events, update existing events. Users are also able to copy links to their events to send them to guests for booking meetings.
3. **Schedule**: Users can navigate to the Schedule page to set a weekly schedule of their available times to meet.
4. **Booking Page**: Guests can see a users booking page based on user's id. They can see all events available for booking and choose an event to book a meeting,
5. **Event Booking Page**: Guests can book a meeting with the user at times available to the user based on user's schedule and prefered times.
6. **Success Page**: After filling the booking form a meeting is scheduled in the user's calendar and an automatic email is sent to the guest from Google Calendar about the meeting.

## Pages Overview

### Public Routes

- / - Landing page with sign-in sign-up
- /sign-in - User authentication
- /sign-up - New user registration
- /book/[clerkUserId] - Public booking page for guests
- /book/[clerkUserId]/[eventId] - Event booking form
- /book/[clerkUserId]/[eventId]/success - Booking success page

### Protected Routes

- /events - List of all events
- /events/new - Create a new event
- /events/[eventId]/edit - Update an existing event
- /schedule - Availability management

## Getting Started

### Prerequisites

- Node.js 20+
- Neon Postgres Database
- Clerk account
- Google Cloud Platform account & OAuth setup

### Installation

```
# Clone the repository
git clone https://github.com/cankiziloglu/bookme.git

# Install dependencies
npm install

# Set up environment variables
cp example.env .env

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

Open http://localhost:3000 with your browser to see the result.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Contact

Can Kiziloglu - hi@cankiziloglu.com
