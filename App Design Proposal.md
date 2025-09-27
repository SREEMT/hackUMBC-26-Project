# Party/Rave App - Event Roles, Guests, Bouncers, and Organizers

## Feature Focus
We are focusing on the **interaction between guests, bouncers, and organizers**.

Key parts:
- Organizers create and manage events.
- Attendees go through a pre-screening process.
- Bouncers check in attendees at the event and can flag them.
- Organizers get real-time updates from bouncers via Redis.
- Organizers can remember flagged/banned attendees for future events, but bans are scoped to that organizer.

---

## System Flow

1. **Event Creation**
   - Any user can create an event.
   - Event stored in `events` collection.
   - Creator becomes the event’s first organizer (via `event_roles`).

2. **Attendee Application**
   - User applies or is invited to an event.
   - Their request is stored in `attendees` with status `pending`.

3. **Pre-Screening**
   - Organizer or bouncer reviews the application.
   - Status updated to `approved` or `denied`.
   - Approved attendees receive the event address.

4. **At the Event**
   - Bouncers check in attendees, flag them, or deny entry.
   - Updates are published to Redis.
   - Organizers’ dashboards subscribe to live updates.
   - Notes and flags are stored in MongoDB for persistence.

5. **Post-Event**
   - Attendee notes/flags are saved in `organizer_attendee_status`.
   - Future events by the same organizer respect those bans/flags.
   - Other organizers are unaffected.

---

## System Diagram (High Level)
```
[ React Frontend ]  
|  
v  
[ Ruby on Rails API ] -----------------------> [ MongoDB ]  
| ^  
v |  
[ Redis Pub/Sub ] <------ Bouncers update --------|  
|  
+-----> Organizers' Dashboards (real-time feed)
```

---

## MongoDB Database Design

### `users`
Global user profile, no fixed roles.
```json
{
  "_id": ObjectId,
  "name": String,
  "email": String,
  "phone": String,
  "createdAt": Date,
  "updatedAt": Date
}
```

- ```events```
- Event-level details.
```
json
Copy code
{
  "_id": ObjectId,
  "name": String,
  "date": Date,
  "genre": [String],
  "location": String,  // hidden/encrypted until approval
  "guestLimit": Number,
  "guestPassesAllowed": Number,
  "createdAt": Date
}
```

- ```event_roles```
- Links users to events with roles.
```
json
Copy code
{
  "_id": ObjectId,
  "eventId": ObjectId, // ref: events
  "userId": ObjectId,  // ref: users
  "role": "organizer" | "bouncer" | "attendee" | "performer",
  "permissions": [ "checkIn", "flagGuests", "manageEvent" ],
  "createdAt": Date
}
```

- ```attendees```
- Tracks event participation and screening.
```
json
Copy code
{
  "_id": ObjectId,
  "eventId": ObjectId, // ref: events
  "userId": ObjectId,  // ref: users
  "status": "pending" | "approved" | "denied",
  "checkedIn": Boolean,
  "notes": [
    { "by": ObjectId, "text": String, "createdAt": Date }
  ],
  "createdAt": Date
}
```

- ```organizer_attendee_status```
- Organizer-specific bans and flags across events.
```
json
Copy code
{
  "_id": ObjectId,
  "organizerId": ObjectId, // ref: users
  "userId": ObjectId,      // ref: users
  "status": "ok" | "flagged" | "banned",
  "notes": [
    { "by": ObjectId, "text": String, "createdAt": Date }
  ],
  "updatedAt": Date
}
```

- ```performers```
- Optional performer/DJ profiles.
```
json
Copy code
{
  "_id": ObjectId,
  "userId": ObjectId, // ref: users
  "portfolio": String, // link or JSON
  "genres": [String],
  "availability": [Date]
}
```

- Database Relationships
 ```users
   |
   | 1--* (has roles in events)
   v
 event_roles  ---> eventId ---> events
   |
   | 1--* (attendee participation)
   v
 attendees (status, notes, check-in)
   |
   | organizer-specific bans
   v
 organizer_attendee_status
```

- Redis Usage
```
Each event has its own channel: event:<eventId>:updates

Bouncers publish updates:

json
Copy code
{
  "type": "checkIn" | "flag" | "denied",
  "attendeeId": ObjectId,
  "by": ObjectId, // bouncerId
  "timestamp": Date
}
```
- Organizers subscribe for real-time updates on their dashboard.
