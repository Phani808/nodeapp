const http = require("http");
const exec = require("child_process").exec;
const path = require("path");
const async = require("async");

const projectPath = process.argv[2];
const absolutePath = path.join(projectPath);

const cmds = [ "sh ./fetch_service.sh"].concat(process.argv.slice(2));

const execCmds = cmds.map((cmd) => {
  return function(callback) {
    exec(`cd ${absolutePath} && ${cmd}`, { maxBuffer: 1024 * 600 }, (err, stdout, stderr) => {
      if (err) return callback(err);
      callback(null, `${cmd}:\nstdout: ${stdout}\nstderr: ${stderr}\n`);
    });
  };
});

const updateProject = function(callback) {
  async.series(execCmds, function(err, results) {
    if (err) return callback(err);
    callback(null, results.join(""));
  });
};

http.createServer(function(req, res) {
  res.writeHead(200, { "Content-Type": "text/plain" });
  console.log("An event has been detected on the listening port: starting execution...");
  updateProject((err, result) => {
    let response = "";
    if (err) {
      console.error(`exec error: ${err}`);
      response += `exec error: ${err}`;
    }
    if (result) {
      console.log(result);
      response += `\n${result}`;
    }
    res.end(response);
  });
}).listen(1338);

console.log("Git-auto-pull is running");