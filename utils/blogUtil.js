module.exports.buildSort = function (orderBy) {
  let sort = { timestamp: -1 };

  if (orderBy) {
    switch (orderBy) {
      case "timestamp":
        sort = { timestamp: 1 };
        break;
      case "timestampDesc":
        sort = { timestamp: -1 };
        break;
      case "readCount":
        sort = { readCount: 1 };
        break;
      case "readCountDesc":
        sort = { readCount: -1 };
        break;
      case "readingTime":
        sort = { readingTime: 1 };
        break;
      case "readingTimeDesc":
        sort = { readingTime: -1 };
        break;
    }
  }

  return sort;
};

module.exports.parseTags = function (tags) {
  if (!tags) return [];
  return tags.split(",").map((s) => s.trim().toLowerCase());
};

module.exports.estimateReadingTime = function (text) {
  // Calculate the estimated reading time in minutes
  // Round up the reading time to the nearest whole number of minutes
  return Math.ceil(text.split(/\s+/).length / 200);
};

module.exports.paginate = function (page, limit) {
  page = Number(page) || 1;
  limit = Number(limit) || 20;

  const skip = (page - 1) * limit;

  return { skip: skip, limit: limit, page: page };
};
