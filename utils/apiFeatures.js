/**
 * Class to handle API query features such as filtering, sorting, field selection, and pagination.
 */
export default class APIFeatures {
  /**
   * Creates an instance of APIFeatures.
   * 
   * @param {Object} query - The Mongoose query object.
   * @param {Object} queryString - The query string from the URL.
   */
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  /**
   * Filters the query based on query parameters.
   * Excludes 'sort', 'page', 'limit', and 'fields' from the filtering.
   * 
   * @returns {APIFeatures} - The updated APIFeatures instance with applied filter.
   */
  filter() {
    // Excluding sort, pagination, and field selection queries
    const queryObj = { ...this.queryString };
    const excludedQueries = ['sort', 'page', 'limit', 'fields'];
    excludedQueries.forEach((query) => delete queryObj[query]);

    // Actual Filtering
    let queryStr = JSON.stringify(queryObj);
    // Replace query operators to use MongoDB syntax
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  /**
   * Sorts the query results based on the 'sort' query parameter.
   * Defaults to sorting by 'createdAt' in descending order if 'sort' is not specified.
   * 
   * @returns {APIFeatures} - The updated APIFeatures instance with applied sorting.
   */
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  /**
   * Selects specific fields to include or exclude in the query results.
   * Defaults to excluding the '__v' field if 'fields' is not specified.
   * 
   * @returns {APIFeatures} - The updated APIFeatures instance with applied field selection.
   */
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

  /**
   * Paginates the query results based on 'page' and 'limit' query parameters.
   * Defaults to page 1 and a limit of 100 if these parameters are not specified.
   * 
   * @returns {APIFeatures} - The updated APIFeatures instance with applied pagination.
   */
  paginate() {
    const page = this.queryString.page || 1;
    const limit = this.queryString.limit || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}