import { db } from "@/db";
import { categories } from "@/db/schema";

const categoryNames = [
  "Art",
  "Business",
  "Design",
  "Education",
  "Entertainment",
  "Environment",
  "Fashion",
  "Food",
  "Gaming",
  "Health",
  "History",
  "Music",
  "News",
  "Personal growth",
  "Sports",
  "Technology",
];

async function main() {
  console.log("Seeding categories...");

  try {
    const categoriesWithDescription = categoryNames.map((name) => ({
      name,
      description: `Videos about ${name}`,
    }));

    await db.insert(categories).values(categoriesWithDescription);

    console.log("Categories seeded successfully!");
  } catch (error) {
    console.error("Error seeding categories:", error);
    process.exit(1);
  }
}

main();
