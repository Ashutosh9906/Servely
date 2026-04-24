export function buildMenuFilter(query) {
  const where = {};
  const orderBy = {};

  // 🔍 SEARCH (name + description)
  if (query.search) {
    where.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { description: { $regex: query.search, $options: "i" } }
    ];
  }

  // 📂 CATEGORY FILTER
  if (query.category) {
    where.category = query.category;
  }

  // 💰 PRICE FILTER
  if (query.minPrice || query.maxPrice) {
    where.price = {};

    if (query.minPrice) {
      where.price.$gte = Number(query.minPrice);
    }

    if (query.maxPrice) {
      where.price.$lte = Number(query.maxPrice);
    }
  }

  // ✅ AVAILABILITY FILTER
  if (query.available === "true") {
    where.isAvailable = true;
  }

  // 🔽 SORT
  if (query.sort === "price_low") {
    orderBy.price = 1;
  } else if (query.sort === "price_high") {
    orderBy.price = -1;
  } else {
    orderBy.createdAt = -1; // default latest
  }

  return { where, orderBy };
}