const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "$",
});

// Uncomment this block to pass the first stage
const prompt = () => {
  rl.question("$ ", (answer) => {
    const parts = answer.trim().split(" ");
    const command = parts[0];
    const args = parts.slice(1);
    const commandArray = ["exit", "echo", "type"];

    if (answer === "exit 0") {
      rl.close();
      return;
    }
    if (command === "echo") {
      console.log(args.join(" "));
      prompt();
      return;
    }
    if (command === "type") {
      const cmdName = args + "";
      const found = commandArray.includes(cmdName);
      if (found) console.log(`${cmdName} is a shell builtin`);
      else console.log(`${cmdName}: not found`);
    } else {
      console.log(`${answer}: command not found`);
    }
    prompt();
  });
};

prompt();
