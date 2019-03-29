const parser = require('cron-parser')
const moment = require('moment')
const urlDataValidate = require('./urlDataValidate')

const isValidDate = (val) => {
  return moment(val, 'YYYY-MM-DD hh:mm:ss').isValid()
}

module.exports = (body) => {
  let {jobSchedule, jobRepeatEvery, jobData, taskName} = body
  if (!taskName) {
    throw new Error('createJob: taskName is empty')
  }
  if (!jobData) {
    throw new Error('createJob: jobData is empty')
  }
  if (jobRepeatEvery) {
    try {
      parser.parseExpression(jobRepeatEvery);
    }catch(e) {
      throw new Error('jobRepeatEvery is not valid')
    }
  }
  if (jobSchedule) {
    const isRegularJobSchedule = isValidDate(jobSchedule)
    if (!isRegularJobSchedule) {
      throw new Error('jobSchedule must be YYYY-MM-DD hh:mm:ss, eg: 2018-01-01 00:00:00')
    }
  }
  urlDataValidate(jobData)

}
