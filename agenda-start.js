var mongoConnectionString = 'mongodb://127.0.0.1/agenda';
const Agenda = require('m-agenda')
const request = require('request')
var agenda = new Agenda({
  db: {address: mongoConnectionString},
  defaultLockLifetime: 10
});
const axios = require('axios')
const urlDataValidate = require('./lib/validate/urlDataValidate')


agenda.define('URL', function(job, done) {
  console.log(`===> ready to run URL TASK taskName: '${job.attrs.task_name}', data is =>`, JSON.stringify(job.attrs.data))
  urlDataValidate(job.attrs.data)
  const {data} = job.attrs
  request(data, function(err, res, body) {
    if (err) {
      console.error(err)
      job.fail(new Error(err))
      job.save()
    } else if(!(res.statusCode >= 200 && res.statusCode <= 240)) {
      console.error("statusCode:", res.statusCode, body)
      job.fail(new Error(`statusCode: '${res.statusCode}', ${body}`))
      job.save()
    } else {
      done()
    }
  })
  // const _param = {
  //   method: data.method.toLowerCase(),
  //   url: data.url
  // }
  // if (data.data) {
  //   _param.data = data
  // }
  // axios(_param)
  //   .then(() => {
  //     console.log("done1111")
  //     done()
  //   })
  //   .catch((e) => {
  //     job.fail(new Error(e.message))
  //     // job.save()
  //   })
});

agenda.on('ready', function() {
  agenda.start();
});

agenda.on('complete:URL', function(job){
  console.log('URL JOB %s finished', job.attrs.name);
})

function graceful() {
  agenda.stop(function() {
    process.exit(0);
  });
}

process.on('SIGTERM', graceful);
process.on('SIGINT' , graceful);

