class APIFeatures {
  // Here, query is the collection of all the documents
  // And queryString is the query in the url
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // Excluding sort, pagination and field selection queries
    const queryObj = { ...this.queryString };
    const excludedQueries = ['sort', 'page', 'limit', 'fields'];
    excludedQueries.forEach((query) => delete queryObj[query]);

    // Actual Filtering
    let queryStr = JSON.stringify(queryObj);
    // We need to perform this step because we can't use $ in the url (It would not be clean)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  fieldSelection() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      // Select all fields except '__v'
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page || 1;
    const limit = this.queryString.limit || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
