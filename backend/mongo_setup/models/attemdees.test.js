require('dotenv').config();
const path = require('path');
const mongoose = require('mongoose');
const dbcon = require(path.join(__dirname, './DbConnection'));
const Attendee = require(path.join(__dirname, './attendees'));
const Event = require(path.join(__dirname, './events'));
const usersDao = require(path.join(__dirname, './userDao'));

describe("Attendee model integration", () => {
  let user, user2, event;

  // Connect to test database once before all tests
  beforeAll(async function () {
    dbcon.connect('test');
  });

  // Disconnect and clean up after all tests
  afterAll(async function () {
    await Attendee.deleteMany({});
    await Event.deleteMany({});
    await usersDao.deleteAll();
    dbcon.disconnect();
  });

  // Clear collections before each test
  beforeEach(async function () {
    await Attendee.deleteMany({});
    await Event.deleteMany({});
    await usersDao.deleteAll();

    // Create test user and event
    user = await usersDao.create({ login: 'user@example.com', password: 'pass123', permission: 1 });
    user2 = await usersDao.create({ login: 'user2@example.com', password: 'pass123', permission: 1 });
    event = await Event.create({ name: 'Test Event', date: new Date() });
  });

  test("Create an attendee successfully", async () => {
    const attendeeData = { eventId: event._id, userId: user._id, status: 'approved' };
    const attendee = await Attendee.create(attendeeData);

    expect(attendee).toBeDefined();
    expect(attendee.eventId.toString()).toBe(event._id.toString());
    expect(attendee.userId.toString()).toBe(user._id.toString());
    expect(attendee.status).toBe('approved');
    expect(attendee.checkedIn).toBe(false);
    expect(attendee.notes).toHaveLength(0);
    expect(attendee.createdAt).toBeInstanceOf(Date);
  });

  test("Fail if required fields are missing", async () => {
    let err;
    try {
      await Attendee.create({});
    } catch (e) {
      err = e;
    }
    expect(err).toBeDefined();
    expect(err.name).toBe("ValidationError");
  });

  test("Fail if status is invalid", async () => {
    let err;
    try {
      await Attendee.create({ eventId: event._id, userId: user._id, status: 'invalidStatus' });
    } catch (e) {
      err = e;
    }
    expect(err).toBeDefined();
    expect(err.name).toBe("ValidationError");
  });

  test("Add notes to an attendee", async () => {
    const noteData = { by: user._id, text: 'Checked details' };
    const attendee = await Attendee.create({ eventId: event._id, userId: user._id, notes: [noteData] });

    expect(attendee.notes).toHaveLength(1);
    expect(attendee.notes[0].by.toString()).toBe(user._id.toString());
    expect(attendee.notes[0].text).toBe('Checked details');
    expect(attendee.notes[0].createdAt).toBeInstanceOf(Date);
  });

 

  test("Retrieve multiple attendees", async () => {
    await Attendee.create({ eventId: event._id, userId: user._id });
    await Attendee.create({ eventId: event._id, userId: user2._id, status: 'approved' });

    const attendees = await Attendee.find({ eventId: event._id });
    expect(attendees.length).toBe(2);
    const statuses = attendees.map(a => a.status);
    expect(statuses).toContain('pending');
    expect(statuses).toContain('approved');
  });
});
