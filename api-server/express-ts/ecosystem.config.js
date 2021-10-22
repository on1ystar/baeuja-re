module.exports = {
  apps: [
    {
      name: process.env.NODE_ENV === 'prod' ? 'baeuja-prod' : 'baeuja-dev',
      script:
        process.env.NODE_ENV === 'prod'
          ? './build/prod/server.js'
          : './build/dev/server.js',
      args: 'start',
      instances: 0,
      exec_mode: 'cluster',
      merge_logs: true,
      env: {
        NODE_ENV: 'dev'
      },
      env_production: {
        NODE_ENV: 'prod'
      },
      env_test: {
        NODE_ENV: 'test'
      }
    }
  ]
};
