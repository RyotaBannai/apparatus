module.exports = [
  {
    name: "development",
    type: "postgres",
    database: "apparatus",
    port: 5432,
    username: "ryota",
    password: "bannai",
    database: "apparatus",
    synchronize: true,
    logging: false,
    entities: ["src/entity/**/*.ts"],
    migrations: ["src/migration/**/*.ts"],
    subscribers: ["src/subscriber/**/*.ts"],
    cli: {
      entitiesDir: "src/entity",
      migrationsDir: "src/migration",
      subscribersDir: "src/subscriber",
    },
  },
  {
    name: "production",
    type: "postgres",
    host: "localhost",
    port: 3306,
    username: "test", // you might be able to set in env file.
    password: "test",
    database: "test",
    url: process.env.DATABASE_URL,
    synchronize: true, // switch this to false once you have the initial tables created and use migrations instead
    logging: false,
    entities: ["dist/entity/**/*.js"],
    migrations: ["dist/migration/**/*.js"],
    subscribers: ["dist/subscriber/**/*.js"],
    cli: {
      entitiesDir: "dist/entity",
      migrationsDir: "dist/migration",
      subscribersDir: "dist/subscriber",
    },
  },
];
