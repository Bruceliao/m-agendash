'use strict';
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const CronJob = require('cron').CronJob;
const parser = require('cron-parser')

module.exports = agendash => {
  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use('/', express.static(path.join(__dirname, '../../public')));

  app.get('/api', (req, res) => {
    agendash.api(req.query.job, req.query.state, (err, apiResponse) => {
      if (err) {
        return res.status(400).json(err);
      }
      res.json(apiResponse);
    });
  });

  app.post('/api/jobs/requeue', (req, res) => {
    agendash.requeueJobs(req.body.jobIds, (err, newJobs) => {
      if (err || !newJobs) {
        return res.status(404).json(err);
      }
      res.json(newJobs);
    });
  });

  app.post('/api/jobs/delete', (req, res) => {
    agendash.deleteJobs(req.body.jobIds, err => {
      if (err) {
        return res.status(404).json(err);
      }
      return res.json({deleted: true});
    });
  });

  app.get('/api/cron-cal', (req, res) => {

    try {
      var interval = parser.parseExpression(req.query.cron);
      var arr = [], i = 0, total = 5
      while(i < total) {
        arr.push(interval.next()._date.format("YYYY-MM-DD HH:mm:ss"))
        i++
      }
      res.json(arr)
    }catch(e) {
      res.status(500).json({errMsg: 'cron是错误的'})
    }
  })

  app.post('/api/jobs/create', (req, res) => {
    agendash.createJob(req.body.categoryName, req.body.jobSchedule, req.body.jobRepeatEvery, req.body.jobData, req.body.taskName, err => {
      if (err) {
        return res.status(404).json(err);
      }
      return res.json({created: true});
    });
  });

  return app;
};
