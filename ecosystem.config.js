module.exports = {
    apps: [
      {
        name: "readium-web", // Name for your PM2 service
        script: "npm", // Command to run
        args: "start", // Arguments for the command
        cwd: "/home/ubuntu/projects/myapp/frontend/readium/playground", // Replace with the absolute path to your project
        instances: 1, // Number of instances to run
        exec_mode: "fork", // Use "fork" or "cluster"
        env: {
          PORT: 3000,
          NODE_ENV: "production",
        },
      },
    ],
  };