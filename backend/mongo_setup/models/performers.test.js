require('dotenv').config();
const path = require('path');
const dbcon = require(path.join(__dirname, './DbConnection'));
const Performers = require(path.join(__dirname, './performers')); // updated
const mongoose = require('mongoose');

describe("Performers model integration", () => {
  beforeAll(async () => {
    if (process.env.TESTDB_URI) {
      dbcon.connect('test');
    } else {
      dbcon.connect();
    }

    // Wait for Mongoose to connect
    await new Promise((resolve, reject) => {
      const conn = mongoose.connection;
      conn.once('open', resolve);
      conn.on('error', reject);
    });
  }, 15000);

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase(); // Clean up the test DB
    await dbcon.disconnect();
  });

  test("Create and delete a performer", async () => {
    await Performers.deleteMany({});

    const newPerformer = {
      userId: new mongoose.Types.ObjectId(),
      portfolio: { website: "https://example.com" },
      genres: ["rock", "jazz"],
      availability: [new Date(), new Date(Date.now() + 86400000)]
    };

    const created = await Performers.create(newPerformer);

    expect(created.userId.toString()).toBe(newPerformer.userId.toString());
    expect(created.genres).toContain("rock");
    expect(created.portfolio.website).toBe("https://example.com");

    await Performers.findByIdAndDelete(created._id);
    const all = await Performers.find({});
    expect(all.length).toBe(0);
  });

  test("Read a performer by ID", async () => {
    await Performers.deleteMany({});

    const newPerformer = {
      userId: new mongoose.Types.ObjectId(),
      portfolio: { demo: "https://demo.com" },
      genres: ["pop"],
      availability: [new Date()]
    };

    const created = await Performers.create(newPerformer);

    const fetched = await Performers.findById(created._id);
    expect(fetched).not.toBeNull();
    expect(fetched.genres).toContain("pop");
    expect(fetched.portfolio.demo).toBe("https://demo.com");

    await Performers.findByIdAndDelete(created._id);
    const all = await Performers.find({});
    expect(all.length).toBe(0);
  });
});
