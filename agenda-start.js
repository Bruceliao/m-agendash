// var heapdump = require('heapdump');
var mongoConnectionString = 'mongodb://127.0.0.1/agenda';
const Agenda = require('m-agenda')
const request = require('request')
const moment = require('moment')
// const util = require('util')
var agenda = new Agenda({
  db: {address: mongoConnectionString},
  defaultLockLifetime: 10
});
const axios = require('axios')
const urlDataValidate = require('./lib/validate/urlDataValidate')
// var memwatch = require('memwatch-next');


agenda.define('URL', function(job, done) {
  console.log(`===> ready to run URL TASK taskName: '${job.attrs.task_name}', data is =>`, JSON.stringify(job.attrs.data))
  urlDataValidate(job.attrs.data)
  const {data} = job.attrs
  data.gzip = true
  request(data, function(err, res, body) {
    if (err) {
      console.error(new Date(), err)
      // job.fail(new Error(err))
      job.save()
      job.saveLogJob(err)
    } else if(!(res.statusCode >= 200 && res.statusCode <= 240)) {
      const reason = `statusCode: '${res.statusCode}', ${body}`
      console.error(new Date(), reason)
      // job.fail(new Error(reason))
      job.save()
      job.saveLogJob(reason)
    }

    done()
  })
});

agenda.on('ready', function() {
  agenda.start();
});

agenda.on('complete:URL', function(job){
  const now = moment().format('YYYY-MM-DD HH:mm:ss')
  console.log('time: ' + now + ' ,URL JOB FINISHED =>', JSON.stringify(job.attrs))
})

function graceful() {
  agenda.stop(function() {
    process.exit(0);
  });
}

process.on('SIGTERM', graceful);
process.on('SIGINT' , graceful);

// heapdump.writeSnapshot('./' + Date.now() + '.heapsnapshot');

// var hd;
// memwatch.on('leak', function(info) {
//  console.error(info);
//  var file = './leak-' + Date.now() + '.heapsnapshot'
//  console.log(file, "#file#####################")
//  heapdump.writeSnapshot(file, function(err3) {
//   if (err3) console.error(err3);
//   else console.error('Wrote snapshot: ' + file);
//  });
//  if (!hd) {
//    hd = new memwatch.HeapDiff();
//  } else {
//    var diff = hd.end();
//    var diffmsg = util.inspect(diff, true, null);
//    console.error(diffmsg);
//    hd = null;
//  }
// });

// memwatch.on('stats', function(stats) {
//   console.error(stats)
// });

