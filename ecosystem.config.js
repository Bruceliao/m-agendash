module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // First application
    {
      name      : 'm-agendash-ui',
      script    : './bin/agendash-standalone.js',
      env_production : {
        NODE_ENV: 'production'
      }
    },

    // Second application
    {
      name      : 'm-agenda-server',
      script    : 'agenda-start.js'
    }
  ]
};
