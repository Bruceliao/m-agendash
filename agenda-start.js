var mongoConnectionString = 'mongodb://127.0.0.1/agenda';
const Agenda = require('m-agenda')
var agenda = new Agenda({db: {address: mongoConnectionString}});


agenda.define('URL', function(job, done) {
  console.log(job.attrs)
  done();
});

agenda.on('ready', function() {
  var weeklyReport = agenda.create('URL', {to: '小时'}, "firstTaskName")
  weeklyReport.repeatEvery('0 */1 * * *').save();
  agenda.start();
});
