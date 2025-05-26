import { configureDatabase, findSimilarEntries, insertStringEntry, closeDatabaseConnection } from "../src/dbUtils";
import { Pool } from "pg";

jest.mock("pg", () => {
  const mockClient = {
    connect: jest.fn(),
    query: jest.fn(),
    release: jest.fn(),
  };
  const mockPool = {
    connect: jest.fn(() => mockClient),
    end: jest.fn(),
  };
  return { Pool: jest.fn(() => mockPool) };
});

const mockPool = new Pool() as jest.Mocked<Pool>;
const mockClient = mockPool.connect() as jest.Mocked<any>;

describe("dbUtils", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("configureDatabase", () => {
    it("should allow programmatic configuration of the database", () => {
      configureDatabase({
        user: "test_user",
        host: "test_host",
        database: "test_database",
        password: "test_password",
        port: 1234,
      });

      expect(mockPool.options).toMatchObject({
        user: "test_user",
        host: "test_host",
        database: "test_database",
        password: "test_password",
        port: 1234,
      });
    });
  });

  describe("findSimilarEntries", () => {
    it("should return similar entries based on the threshold", async () => {
      mockClient.query.mockResolvedValueOnce({
        rows: [
          { id: 1, value: "hello" },
          { id: 2, value: "world" },
        ],
      });

      const result = await findSimilarEntries("hello", "test_table", "value", 0.8);

      expect(mockClient.query).toHaveBeenCalledWith("SELECT id, value FROM test_table");
      expect(result).toEqual([
        { id: "1", value: "hello", similarity: expect.any(Number) },
      ]);
    });
  });

  describe("insertStringEntry", () => {
    it("should insert a string entry into the database", async () => {
      await insertStringEntry("test_table", "value", "hello world");

      expect(mockClient.query).toHaveBeenCalledWith(
        "INSERT INTO test_table (value) VALUES ($1)",
        ["hello world"]
      );
    });
  });

  describe("closeDatabaseConnection", () => {
    it("should close the database connection pool", async () => {
      await closeDatabaseConnection();

      expect(mockPool.end).toHaveBeenCalled();
    });
  });
});