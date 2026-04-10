import { db } from "./client.js";

export const initSchema = async () => {
  await db.execute(`CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY,
      full_name TEXT NOT NULL,
      role TEXT NOT NULL,
      quote TEXT,
      bio TEXT NOT NULL,
      about_intro TEXT,
      about_text TEXT,
      tagline TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      location TEXT,
      github_url TEXT,
      linkedin_url TEXT,
      whatsapp_url TEXT,
      instagram_url TEXT,
      facebook_url TEXT,
      resume_pdf_url TEXT,
      profile_image_url TEXT
    );`);

  await db.execute(`CREATE TABLE IF NOT EXISTS experiences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company TEXT NOT NULL,
      company_url TEXT,
      position TEXT NOT NULL,
      period_label TEXT,
      start_date TEXT NOT NULL,
      end_date TEXT,
      location TEXT,
      description TEXT NOT NULL
    );`);

  await db.execute(`CREATE TABLE IF NOT EXISTS education (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      years TEXT NOT NULL,
      institution TEXT NOT NULL,
      location TEXT NOT NULL,
      level TEXT NOT NULL,
      field TEXT NOT NULL,
      description TEXT NOT NULL
    );`);

  await db.execute(`CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      name TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    );`);

  await db.execute(`CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      tech_stack TEXT NOT NULL,
      project_url TEXT,
      image_url TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0
    );`);

  await db.execute(`CREATE TABLE IF NOT EXISTS admin_credentials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`);

  await db.execute(`CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      subject TEXT,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'unread',
      read_at TEXT,
      archived_at TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`);

  const contactColumns = await db.execute(`PRAGMA table_info(contact_messages);`);
  const existingColumnNames = new Set(
    contactColumns.rows.map((column) => String(column.name).toLowerCase())
  );

  if (!existingColumnNames.has("status")) {
    await db.execute(
      `ALTER TABLE contact_messages ADD COLUMN status TEXT NOT NULL DEFAULT 'unread';`
    );
  }

  if (!existingColumnNames.has("read_at")) {
    await db.execute(`ALTER TABLE contact_messages ADD COLUMN read_at TEXT;`);
  }

  if (!existingColumnNames.has("archived_at")) {
    await db.execute(`ALTER TABLE contact_messages ADD COLUMN archived_at TEXT;`);
  }
};
