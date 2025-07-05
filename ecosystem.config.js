module.exports = {
  apps: [
    {
      name: 'moodcycle-api',
      script: 'packages/api/src/server.js',
      cwd: '/Users/irimwebforge/Projets/pro/moodcycle/MOODCYCLE-VPS',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3001
      },
      log_file: 'logs/combined.log',
      out_file: 'logs/out.log',
      error_file: 'logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '500M',
      restart_delay: 4000,
      autorestart: true,
      watch: false,
      ignore_watch: ['node_modules', 'logs'],
      source_map_support: true
    }
  ]
}; 