import { db } from "../db/client.js";

export const getPortfolioData = async (_req, res, next) => {
  try {
    const profileResult = await db.execute("SELECT * FROM profile LIMIT 1");
    const experienceResult = await db.execute("SELECT * FROM experiences ORDER BY start_date DESC");
    const educationResult = await db.execute("SELECT * FROM education ORDER BY id DESC");
    const skillsResult = await db.execute("SELECT * FROM skills ORDER BY category, sort_order");
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
