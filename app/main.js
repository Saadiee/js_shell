const readline = require("readline");
const fs = require("fs");
const { spawn } = require("child_process");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "$",
});

const prompt = () => {
  rl.question("$ ", (answer) => {
    const parts = answer.trim().split(" ");
    const command = parts[0];
    const args = parts.slice(1);
    const commandArray = ["exit", "echo", "type"];
    const PATH = process.env.PATH.split(":");
    const executablePath = findCommandInPath(PATH, command);

    if (answer === "exit 0") {
      rl.close();
      return;
    }
    if (command === "echo") {
      echo(args);
      return;
    }
    if (command === "type") {
      type(args, commandArray, PATH);
      return;
    }
    if (executablePath) {
      runExecutableCommand(command, args);
    } else {
      console.log(`${answer}: command not found`);
      prompt();
    }
  });
};

// --------------
prompt();
// --------------

function findCommandInPath(PATH, command) {
  for (let i = 0; i < PATH.length; i++) {
    const fullPath = `${PATH[i]}/${command}`;
    if (fs.existsSync(fullPath)) {
      return fullPath;
    }
  }
  return null;
}

function echo(args) {
  console.log(args.join(" "));
  prompt();
}
function type(args, commandArray, PATH) {
  const cmdName = args[0];
  const found = commandArray.includes(cmdName);
  if (found) {
    console.log(`${cmdName} is a shell builtin`);
    prompt();
    return;
  }

  for (let i = 0; i < PATH.length; i++) {
    const fullPath = `${PATH[i]}/${cmdName}`;
    if (fs.existsSync(fullPath)) {
      console.log(`${cmdName} is ${fullPath}`);
      prompt();
      return;
    }
  }
  console.log(`${cmdName}: not found`);
  prompt();
}

function runExecutableCommand(command, args) {
  const child = spawn(command, args, {
    stdio: "inherit",
  });
  child.on("error", (err) => {
    console.error(`Failed to start process: ${err}`);
    prompt();
  });
  child.on("close", (code) => {
    prompt();
  });
}
