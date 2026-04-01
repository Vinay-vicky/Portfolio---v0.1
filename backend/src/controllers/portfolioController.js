import { db } from "../db/client.js";

const profileFields = [
  "full_name",
  "role",
  "quote",
  "bio",
  "about_intro",
  "about_text",
  "tagline",
  "email",
  "phone",
  "location",
  "github_url",
  "linkedin_url",
  "whatsapp_url",
  "instagram_url",
  "facebook_url",
  "resume_pdf_url",
  "profile_image_url",
];

const experienceFields = [
  "company",
  "company_url",
  "position",
  "period_label",
  "start_date",
  "end_date",
  "location",
  "description",
];

const educationFields = ["years", "institution", "location", "level", "field", "description"];
const skillFields = ["category", "name", "sort_order"];
const projectFields = ["title", "description", "tech_stack", "project_url", "image_url", "sort_order"];

const pickFields = (source, allowedFields) => {
  const payload = {};

  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(source, field)) {
      payload[field] = source[field];
    }
  }

  return payload;
};

const normalizeNumericFields = (payload, numericFields) => {
  for (const field of numericFields) {
    if (!Object.prototype.hasOwnProperty.call(payload, field)) continue;
    const parsed = Number(payload[field]);
    payload[field] = Number.isFinite(parsed) ? parsed : 0;
  }
};

const buildUpdate = (tableName, id, payload) => {
  const columns = Object.keys(payload);
  const setClause = columns.map((column) => `${column} = ?`).join(", ");
  return {
    sql: `UPDATE ${tableName} SET ${setClause} WHERE id = ?`,
    args: [...columns.map((column) => payload[column]), id],
  };
};

const ensureRecordExists = async (tableName, id) => {
  const result = await db.execute({
    sql: `SELECT id FROM ${tableName} WHERE id = ? LIMIT 1`,
    args: [id],
  });

  return result.rows.length > 0;
};

const parseId = (value) => {
  const id = Number.parseInt(value, 10);
  return Number.isFinite(id) && id > 0 ? id : null;
};

export const getPortfolioData = async (_req, res, next) => {
  try {
    const profileResult = await db.execute("SELECT * FROM profile LIMIT 1");
    const experienceResult = await db.execute("SELECT * FROM experiences ORDER BY start_date DESC");
    const educationResult = await db.execute("SELECT * FROM education ORDER BY id ASC");
    const skillsResult = await db.execute(`
      SELECT *
      FROM skills
      ORDER BY
        CASE
          WHEN category = 'Professional Skills' THEN 1
          WHEN category = 'Languages' THEN 2
          ELSE 3
        END,
        sort_order ASC
    `);
    const projectResult = await db.execute("SELECT * FROM projects ORDER BY sort_order ASC, id ASC");

    res.json({
      profile: profileResult.rows[0] ?? null,
      experiences: experienceResult.rows,
      education: educationResult.rows,
      skills: skillsResult.rows,
      projects: projectResult.rows,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const payload = pickFields(req.body ?? {}, profileFields);
    const columns = Object.keys(payload);

    if (columns.length === 0) {
      return res.status(400).json({ error: "No profile fields provided for update" });
    }

    const profileResult = await db.execute("SELECT id FROM profile LIMIT 1");
    if (!profileResult.rows.length) {
      return res.status(404).json({ error: "Profile record not found. Seed the database first." });
    }

    const profileId = profileResult.rows[0].id;
    const setClause = columns.map((column) => `${column} = ?`).join(", ");
    await db.execute({
      sql: `UPDATE profile SET ${setClause} WHERE id = ?`,
      args: [...columns.map((column) => payload[column]), profileId],
    });

    return res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const createExperience = async (req, res, next) => {
  try {
    const payload = pickFields(req.body ?? {}, experienceFields);
    if (!payload.company || !payload.position || !payload.start_date || !payload.description) {
      return res.status(400).json({ error: "company, position, start_date and description are required" });
    }

    await db.execute({
      sql: `INSERT INTO experiences (company, company_url, position, period_label, start_date, end_date, location, description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        payload.company,
        payload.company_url ?? "",
        payload.position,
        payload.period_label ?? "",
        payload.start_date,
        payload.end_date ?? "",
        payload.location ?? "",
        payload.description,
      ],
    });

    return res.status(201).json({ success: true, message: "Experience created" });
  } catch (error) {
    next(error);
  }
};

export const updateExperience = async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: "Invalid experience id" });
    }

    const exists = await ensureRecordExists("experiences", id);
    if (!exists) {
      return res.status(404).json({ error: "Experience not found" });
    }

    const payload = pickFields(req.body ?? {}, experienceFields);
    if (Object.keys(payload).length === 0) {
      return res.status(400).json({ error: "No experience fields provided for update" });
    }

    await db.execute(buildUpdate("experiences", id, payload));
    return res.json({ success: true, message: "Experience updated" });
  } catch (error) {
    next(error);
  }
};

export const deleteExperience = async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: "Invalid experience id" });
    }

    const exists = await ensureRecordExists("experiences", id);
    if (!exists) {
      return res.status(404).json({ error: "Experience not found" });
    }

    await db.execute({ sql: "DELETE FROM experiences WHERE id = ?", args: [id] });
    return res.json({ success: true, message: "Experience deleted" });
  } catch (error) {
    next(error);
  }
};

export const createEducation = async (req, res, next) => {
  try {
    const payload = pickFields(req.body ?? {}, educationFields);
    if (!payload.years || !payload.institution || !payload.location || !payload.level || !payload.field || !payload.description) {
      return res.status(400).json({ error: "years, institution, location, level, field and description are required" });
    }

    await db.execute({
      sql: `INSERT INTO education (years, institution, location, level, field, description)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [payload.years, payload.institution, payload.location, payload.level, payload.field, payload.description],
    });

    return res.status(201).json({ success: true, message: "Education created" });
  } catch (error) {
    next(error);
  }
};

export const updateEducation = async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: "Invalid education id" });
    }

    const exists = await ensureRecordExists("education", id);
    if (!exists) {
      return res.status(404).json({ error: "Education record not found" });
    }

    const payload = pickFields(req.body ?? {}, educationFields);
    if (Object.keys(payload).length === 0) {
      return res.status(400).json({ error: "No education fields provided for update" });
    }

    await db.execute(buildUpdate("education", id, payload));
    return res.json({ success: true, message: "Education updated" });
  } catch (error) {
    next(error);
  }
};

export const deleteEducation = async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: "Invalid education id" });
    }

    const exists = await ensureRecordExists("education", id);
    if (!exists) {
      return res.status(404).json({ error: "Education record not found" });
    }

    await db.execute({ sql: "DELETE FROM education WHERE id = ?", args: [id] });
    return res.json({ success: true, message: "Education deleted" });
  } catch (error) {
    next(error);
  }
};

export const createSkill = async (req, res, next) => {
  try {
    const payload = pickFields(req.body ?? {}, skillFields);
    normalizeNumericFields(payload, ["sort_order"]);

    if (!payload.category || !payload.name) {
      return res.status(400).json({ error: "category and name are required" });
    }

    await db.execute({
      sql: `INSERT INTO skills (category, name, sort_order) VALUES (?, ?, ?)`,
      args: [payload.category, payload.name, payload.sort_order ?? 0],
    });

    return res.status(201).json({ success: true, message: "Skill created" });
  } catch (error) {
    next(error);
  }
};

export const updateSkill = async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: "Invalid skill id" });
    }

    const exists = await ensureRecordExists("skills", id);
    if (!exists) {
      return res.status(404).json({ error: "Skill not found" });
    }

    const payload = pickFields(req.body ?? {}, skillFields);
    normalizeNumericFields(payload, ["sort_order"]);

    if (Object.keys(payload).length === 0) {
      return res.status(400).json({ error: "No skill fields provided for update" });
    }

    await db.execute(buildUpdate("skills", id, payload));
    return res.json({ success: true, message: "Skill updated" });
  } catch (error) {
    next(error);
  }
};

export const deleteSkill = async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: "Invalid skill id" });
    }

    const exists = await ensureRecordExists("skills", id);
    if (!exists) {
      return res.status(404).json({ error: "Skill not found" });
    }

    await db.execute({ sql: "DELETE FROM skills WHERE id = ?", args: [id] });
    return res.json({ success: true, message: "Skill deleted" });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const payload = pickFields(req.body ?? {}, projectFields);
    normalizeNumericFields(payload, ["sort_order"]);

    if (!payload.title || !payload.description || !payload.tech_stack) {
      return res.status(400).json({ error: "title, description and tech_stack are required" });
    }

    await db.execute({
      sql: `INSERT INTO projects (title, description, tech_stack, project_url, image_url, sort_order)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [
        payload.title,
        payload.description,
        payload.tech_stack,
        payload.project_url ?? "",
        payload.image_url ?? "",
        payload.sort_order ?? 0,
      ],
    });

    return res.status(201).json({ success: true, message: "Project created" });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: "Invalid project id" });
    }

    const exists = await ensureRecordExists("projects", id);
    if (!exists) {
      return res.status(404).json({ error: "Project not found" });
    }

    const payload = pickFields(req.body ?? {}, projectFields);
    normalizeNumericFields(payload, ["sort_order"]);

    if (Object.keys(payload).length === 0) {
      return res.status(400).json({ error: "No project fields provided for update" });
    }

    await db.execute(buildUpdate("projects", id, payload));
    return res.json({ success: true, message: "Project updated" });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: "Invalid project id" });
    }

    const exists = await ensureRecordExists("projects", id);
    if (!exists) {
      return res.status(404).json({ error: "Project not found" });
    }

    await db.execute({ sql: "DELETE FROM projects WHERE id = ?", args: [id] });
    return res.json({ success: true, message: "Project deleted" });
  } catch (error) {
    next(error);
  }
};
