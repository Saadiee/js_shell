const readline = require("readline");
const fs = require("fs");

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
    } else {
      console.log(`${answer}: command not found`);
    }
    prompt();
  });
};

prompt();

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
