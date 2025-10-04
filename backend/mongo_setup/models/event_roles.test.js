require('dotenv').config();
const path = require('path');
const mongoose = require('mongoose');
const dbcon = require(path.join(__dirname, './DbConnection'));
const EventRole = require(path.join(__dirname, './event_roles'));
const Event = require(path.join(__dirname, './events'));
const usersDao = require(path.join(__dirname, './userDao'));

describe("EventRole model integration", () => {
  let user, event;

  // Connect to test database once before all tests
  beforeAll(async function () {
    dbcon.connect('test');
  });

  // Disconnect and clean up after all tests
  afterAll(async function () {
    await EventRole.deleteMany({});
    await Event.deleteMany({});
    await usersDao.deleteAll();
    dbcon.disconnect();
  });

  // Clear collections before each test
  beforeEach(async function () {
    await EventRole.deleteMany({});
    await Event.deleteMany({});
    await usersDao.deleteAll();

    // Create a test user and event
    user = await usersDao.create({ login: 'user@example.com', password: 'pass123', permission: 1 });
    event = await Event.create({ name: 'Test Event', date: new Date() });
  });

  test("Create EventRole successfully", async () => {
    const roleData = {
      eventId: event._id,
      userId: user._id,
      role: 'attendee',
      permissions: ['read']
    };

    const createdRole = await EventRole.create(roleData);

    expect(createdRole).toBeDefined();
    expect(createdRole.eventId.toString()).toBe(event._id.toString());
    expect(createdRole.userId.toString()).toBe(user._id.toString());
    expect(createdRole.role).toBe('attendee');
    expect(createdRole.permissions).toContain('read');
    expect(createdRole.createdAt).toBeInstanceOf(Date);
  });

  test("Fail if required fields are missing", async () => {
    let err;
    try {
      await EventRole.create({}); // missing eventId, userId, role
    } catch (e) {
      err = e;
    }
    expect(err).toBeDefined();
    expect(err.name).toBe("ValidationError");
  });

  test("Fail if role is invalid", async () => {
    let err;
    try {
      await EventRole.create({ eventId: event._id, userId: user._id, role: 'invalidRole' });
    } catch (e) {
      err = e;
    }
    expect(err).toBeDefined();
    expect(err.name).toBe("ValidationError");
  });

 

  test("Retrieve multiple roles", async () => {
    const user2 = await usersDao.create({ login: 'user2@example.com', password: 'pass123', permission: 1 });
    await EventRole.create({ eventId: event._id, userId: user._id, role: 'attendee' });
    await EventRole.create({ eventId: event._id, userId: user2._id, role: 'bouncer' });

    const roles = await EventRole.find({ eventId: event._id });
    expect(roles.length).toBe(2);
    const rolesNames = roles.map(r => r.role);
    expect(rolesNames).toContain('attendee');
    expect(rolesNames).toContain('bouncer');
  });
});
