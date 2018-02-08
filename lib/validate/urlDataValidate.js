module.exports = (jobData) => {
  if (!/get|post|delete|put/i.test(jobData.method)) {
    throw new Error('createJob: jobData.method is not get|post|delete|put')
  }
  if (!(jobData.url || jobData.uri)) {
    throw new Error('jobData.url is empty')
  }
}
