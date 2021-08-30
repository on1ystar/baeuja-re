module.exports = {
  apps: [
    {
      name: 'baeuja-api-server',
      script: './build/server.js',
      args: 'start',
      instances: 0,
      exec_mode: 'cluster',
      merge_logs: true,
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};
