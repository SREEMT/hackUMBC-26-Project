require('dotenv').config();
const path = require('path');
const dbcon = require(path.join(__dirname, './DbConnection'));
const usersDao = require(path.join(__dirname, './users'));

describe("Users DAO integration", () => {
  beforeAll(async () => {
    if (process.env.TESTDB_URI) {
      dbcon.connect('test');
    } else {
      dbcon.connect();
    }
    const mongoose = require('mongoose');
    await new Promise((resolve, reject) => {
      const conn = mongoose.connection;
      conn.once('open', resolve);
      conn.on('error', reject);
    });
  }, 15000);

  afterAll(async () => {
    await dbcon.disconnect();
  });

  test("should create and delete a user", async () => {
    await usersDao.deleteAll();

    const newUser = { login: 'test_user@example.com', password: 'plaintext', permission: 2 };
    const created = await usersDao.create(newUser);

    expect(created.login).toBe("test_user@example.com");

    const found = await usersDao.findLogin('test_user@example.com');
    expect(found).not.toBeNull();

    await usersDao.del(created._id);
    const all = await usersDao.readAll();
    expect(all.length).toBe(0);
  });
});
