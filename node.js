const express = require('express');
const { exec } = require('child_process');

const app = express();
const port = 3000;

app.get('/utilization', (req, res) => {
  exec('./cpu_ram_utilization.sh', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return res.status(500).send('Internal server error');
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return res.status(500).send('Internal server error');
    }
    const cpuRamUtilization = stdout.split('\n').filter(Boolean);
    exec('./disk_utilization.sh', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return res.status(500).send('Internal server error');
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
        return res.status(500).send('Internal server error');
      }
      const diskUtilization = stdout.split('\n').filter(Boolean);
      const utilization = {
        cpuUtilization: cpuRamUtilization[0],
        ramUtilization: cpuRamUtilization[1],
        diskUtilization: diskUtilization[0]
      };
      res.json(utilization);
    });
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

