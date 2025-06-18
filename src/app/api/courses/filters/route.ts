import { db } from "@/db";
import { sql } from "drizzle-orm";
import { courses } from "@/db/schemas/courses";
import { NextRequest, NextResponse } from "next/server";

// Function to group results by key (e.g., categories, skill levels)
const groupBy = (items: any[], key: string) => {
  return items.reduce((result, item) => {
    const value = item[key];
    if (!result[value]) {
      result[value] = { name: value, totalCount: 0 };
    }
    result[value].totalCount += 1;
    return result;
  }, {});
};

interface Extras {
  languages?: string[];
  links?: string[];
  filePaths?: string[];
}

export async function GET(req: NextRequest) {
  try {
    // Get isPublished parameter from URL
    const url = new URL(req.url);
    const isPublished = url.searchParams.get("isPublished");

    // Build query with optional isPublished filter
    let query = db
      .select({
        id: courses.id,
        categories: courses.categories,
        tags: sql`string_to_array(${courses.tag}, ',')`.as("tags"),
        skillLevel: courses.skillLevel,
        extras: courses.extras,
        isPublished: courses.isPublished,
      })
      .from(courses);

    // Filter by isPublished if parameter is provided
    if (isPublished === "true") {
      query = query.where(sql`${courses.isPublished} = true`);
    }

    const filtersQuery = await query;

    const categoriesMap: {
      [key: string]: { name: string; totalCount: number };
    } = {};
    const tagsMap: { [key: string]: { name: string; totalCount: number } } = {};
    const skillLevelsMap: {
      [key: string]: { name: string; totalCount: number };
    } = {};
    const languagesMap: {
      [key: string]: { name: string; totalCount: number };
    } = {};

    filtersQuery.forEach((course) => {
      // Process categories
      let categories: string[] = [];
      if (course.categories) {
        if (typeof course.categories === "string") {
          try {
            categories = JSON.parse(course.categories);
          } catch (e) {
            console.error("Error parsing categories JSON:", e);
            categories = [];
          }
        } else if (Array.isArray(course.categories)) {
          categories = course.categories;
        }
      }
      categories.forEach((category) => {
        if (!categoriesMap[category]) {
          categoriesMap[category] = { name: category, totalCount: 0 };
        }
        categoriesMap[category].totalCount += 1;
      });

      // Process tags
      let tags: string[] = [];
      if (course.tags) {
        if (Array.isArray(course.tags)) {
          tags = course.tags;
        }
      }
      tags.forEach((tag) => {
        if (!tagsMap[tag]) {
          tagsMap[tag] = { name: tag, totalCount: 0 };
        }
        tagsMap[tag].totalCount += 1;
      });

      // Process skill levels
      const skillLevel = course.skillLevel;
      if (skillLevel) {
        if (!skillLevelsMap[skillLevel]) {
          skillLevelsMap[skillLevel] = { name: skillLevel, totalCount: 0 };
        }
        skillLevelsMap[skillLevel].totalCount += 1;
      }

      // Process languages
      let languages: string[] = [];
      if (course.extras) {
        let extras: Extras;
        if (typeof course.extras === "string") {
          try {
            extras = JSON.parse(course.extras) as Extras;
          } catch (e) {
            console.error("Error parsing extras JSON:", e);
            extras = {};
          }
        } else {
          extras = course.extras as Extras;
        }
        if (extras.languages && Array.isArray(extras.languages)) {
          languages = extras.languages.map(
            (lang) => lang.charAt(0).toUpperCase() + lang.slice(1).toLowerCase()
          );
        }
      }
      languages.forEach((language) => {
        if (!languagesMap[language]) {
          languagesMap[language] = { name: language, totalCount: 0 };
        }
        languagesMap[language].totalCount += 1;
      });
    });

    // Add "All" option with total count for categories
    const totalCourseCount = filtersQuery.length;
    categoriesMap["All"] = { name: "All", totalCount: totalCourseCount };

    // Convert Maps into arrays
    const categories = Object.values(categoriesMap);
    const tags = Object.values(tagsMap);
    const skillLevels = Object.values(skillLevelsMap);
    const languages = Object.values(languagesMap);

    // Format the filterInputs object
    const filterInputs = [
      {
        name: "Categories",
        inputs: categories,
      },
      {
        name: "Tags",
        inputs: tags,
      },
      {
        name: "Skill Levels",
        inputs: skillLevels,
      },
      {
        name: "Languages",
        inputs: languages,
      },
    ];

    return NextResponse.json(filterInputs);
  } catch (error) {
    console.error("Error fetching filters:", error);
    return NextResponse.json(
      { error: "Failed to fetch filters" },
      { status: 500 }
    );
  }
}
