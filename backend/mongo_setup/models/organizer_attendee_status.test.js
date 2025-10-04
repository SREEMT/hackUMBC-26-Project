require('dotenv').config();
const path = require('path');
const mongoose = require('mongoose');
const dbcon = require(path.join(__dirname, './DbConnection'));
const OrganizerAttendeeStatus = require(path.join(__dirname, './organizer_attendee_status'));
const usersDao = require(path.join(__dirname, './userDao'));

describe("OrganizerAttendeeStatus DAO integration", () => {
  let organizer, attendee1, attendee2;

  beforeAll(async () => {
    // Use an isolated DB for this test suite
    const dbName = `test_organizer_attendee_status_${process.pid}_${Date.now()}`;

    if (process.env.TESTDB_URI) {
      await dbcon.connect(`${process.env.TESTDB_URI}/${dbName}`);
    } else {
      await dbcon.connect(dbName);
    }

    await new Promise((resolve, reject) => {
      const conn = mongoose.connection;
      conn.once('open', resolve);
      conn.on('error', reject);
    });

    await OrganizerAttendeeStatus.syncIndexes();
  }, 20000);

  afterAll(async () => {
    // Drop the entire DB so nothing leaks
    await mongoose.connection.db.dropDatabase();
    await dbcon.disconnect();
  });

  beforeEach(async () => {
    await OrganizerAttendeeStatus.deleteMany({});
    await usersDao.deleteAll();

    // Small delay to avoid race conditions
    await new Promise(res => setTimeout(res, 50));

    // Create test users
    organizer = await usersDao.create({
      login: 'organizer@example.com',
      password: 'password123',
      permission: 2
    });
    attendee1 = await usersDao.create({
      login: 'attendee1@example.com',
      password: 'password123',
      permission: 1
    });
    attendee2 = await usersDao.create({
      login: 'attendee2@example.com',
      password: 'password123',
      permission: 1
    });
  });

  afterEach(async () => {
    await OrganizerAttendeeStatus.deleteMany({});
    await usersDao.deleteAll();
  });

  test("Create OrganizerAttendeeStatus with required fields", async () => {
    const statusData = {
      organizerId: organizer._id,
      userId: attendee1._id,
      status: 'ok'
    };
    const createdStatus = await OrganizerAttendeeStatus.create(statusData);

    expect(createdStatus.organizerId.toString()).toBe(organizer._id.toString());
    expect(createdStatus.userId.toString()).toBe(attendee1._id.toString());
    expect(createdStatus.status).toBe('ok');
    expect(createdStatus.notes).toHaveLength(0);
    expect(createdStatus.updatedAt).toBeInstanceOf(Date);
  });

  test("Create OrganizerAttendeeStatus with default status", async () => {
    const statusData = {
      organizerId: organizer._id,
      userId: attendee1._id
    };
    const createdStatus = await OrganizerAttendeeStatus.create(statusData);
    expect(createdStatus.status).toBe('ok');
  });

  test("Update timestamp on save", async () => {
    const statusData = {
      organizerId: organizer._id,
      userId: attendee1._id,
      status: 'ok'
    };
    const createdStatus = await OrganizerAttendeeStatus.create(statusData);
    const originalUpdatedAt = createdStatus.updatedAt;

    await new Promise(resolve => setTimeout(resolve, 200));

    createdStatus.status = 'flagged';
    const updatedStatus = await createdStatus.save();

    expect(updatedStatus.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
  });
});
