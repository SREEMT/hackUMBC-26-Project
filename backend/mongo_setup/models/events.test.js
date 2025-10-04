require('dotenv').config();
const path = require('path');
const mongoose = require('mongoose');
const dbcon = require(path.join(__dirname, './DbConnection'));
const Event = require(path.join(__dirname, './events'));

// Simple DAO for events
const dao = {
  async create(eventData) {
    return await Event.create(eventData);
  },
  async findAll() {
    return await Event.find();
  },
  async deleteAll() {
    return await Event.deleteMany({});
  }
};

describe("Event model integration", () => {
  // Executed once before all tests
  beforeAll(async function () {
    dbcon.connect('events'); // connect to test database
  });

  // Executed once after all tests
  afterAll(async function () {
    await dao.deleteAll(); // clean up collection
    dbcon.disconnect(); // close connection
  });

  // Executed before each test
  beforeEach(async function () {
    await dao.deleteAll();
  });

  test("Create an event successfully", async () => {
    const eventData = { name: "Hackathon", date: new Date("2025-12-01") };
    const event = await dao.create(eventData);

    expect(event).toBeDefined();
    expect(event.name).toBe("Hackathon");
    expect(event.date).toEqual(new Date("2025-12-01"));
  });

  test("Fail validation if name is missing", async () => {
    let err;
    try {
      await dao.create({ date: new Date() });
    } catch (e) {
      err = e;
    }

    // No required on schema yet → add it if you want stricter validation
    expect(err).toBeDefined();
    expect(err.name).toBe("ValidationError");
  });

  test("Retrieve events from collection", async () => {
    await dao.create({ name: "Conference", date: new Date("2025-11-15") });
    await dao.create({ name: "Workshop", date: new Date("2025-11-20") });

    const events = await dao.findAll();
    expect(events.length).toBe(2);
    expect(events.map(e => e.name)).toEqual(expect.arrayContaining(["Conference", "Workshop"]));
  });
});
