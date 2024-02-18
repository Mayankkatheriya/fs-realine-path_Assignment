const { stdin, stdout, exit } = require("process");
const readline = require("readline");
const path = require("path");
//--------- const fs = require("fs"); // Method 1 for file operations------------>
const fs = require("fs").promises; // Method 2 for file operations using promises

const filePath = path.join(__dirname, "tasks.txt");

//TODO--------- Function to get user input using readline------------>
const getInput = (question) => {
  const rl = readline.createInterface({
    input: stdin,
    output: stdout,
  });

  //--------- Return a promise to handle asynchronous input------------>
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
      rl.close();
    });
  });
};

//TODO--------- Function to add a new task to the file------------>
const addTask = async () => {
  try {
    const task = await getInput("Type your task => ");

    //* method 1 using a callback
    // fs.appendFile(filePath, `\n${task}`, (err) => {
    //     if(err) {
    //         console.log(err)
    //     }
    // })

    try {
      // Check if the file exists
      await fs.access(filePath);

      // File exists, read its content
      const fileContent = await fs.readFile(filePath, "utf8");

      // Check if the file is blank and write the task accordingly
      if (fileContent.trim() === "") {
        await fs.writeFile(filePath, task);
      } else {
        await fs.appendFile(filePath, `\n${task}`);
      }
      console.log("Task added successfully!");
    } catch (notFoundError) {
      // File does not exist, create it and write the task
      await fs.writeFile(filePath, task);
      console.log("Task added successfully!");
    }
  } catch (error) {
    console.error(`Error adding task: ${error.message}`);
  }
};

//TODO--------- Function to view tasks from the file------------>
const viewFile = async () => {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return data.split("\n");
  } catch (error) {
    console.error(`Error reading file: ${error.message}`);
    return [];
  }
};

//TODO--------- Function to mark a task as complete------------>
const markComplete = async () => {
  try {
    const data = await viewFile();

    if (data.length === 0) {
      console.log("No tasks available to mark as complete.");
      return;
    }

    console.log("\nYour tasks are:");
    data.map((line, idx) => {
      console.log(`${idx + 1}. ${line}`);
    });

    let idx = Number(
      await getInput("Choose which task you want to mark as complete => ")
    );

    //--------- Validate user input for task index------------>
    if (isNaN(idx) || idx < 1 || idx > data.length) {
      console.log("Invalid task index. Please enter a valid number.");
      return;
    }

    data[idx - 1] = `[${data[idx - 1]}]`;
    await fs.writeFile(filePath, data.join("\n"));

    console.log("Task marked as completed.");
  } catch (error) {
    console.error(`Error marking task as complete: ${error.message}`);
  }
};

//TODO--------- Function to remove a task------------>
const removeTask = async () => {
  try {
    const data = await viewFile();

    if (data.length === 0) {
      console.log("No tasks available to remove.");
      return;
    }

    console.log("\nYour tasks are:");
    data.map((line, idx) => {
      console.log(`${idx + 1}. ${line}`);
    });

    let idx = Number(
      await getInput("Choose which task you want to remove => ")
    );

    //--------- Validate user input for task index------------>
    if (isNaN(idx) || idx < 1 || idx > data.length) {
      console.log("Invalid task index. Please enter a valid number.");
      return;
    }

    const newData = data.filter((task, index) => index !== idx - 1);
    await fs.writeFile(filePath, newData.join("\n"));

    console.log("Task has been removed.");
  } catch (error) {
    console.error(`Error removing task: ${error.message}`);
  }
};

//TODO--------- Main function to run the task manager application------------>
async function main() {
  while (true) {
    console.log("\n1. Add a new task.");
    console.log("2. View a list of tasks.");
    console.log("3. Mark a task as complete.");
    console.log("4. Remove a task.");
    console.log("5. Exit");

    const choice = await getInput("Enter Your choice? ");

    switch (choice) {
      case "1":
        await addTask();
        break;
      case "2":
        const data = await viewFile();
        if (data.length > 0) {
          console.log("\nYour tasks are:");
          data.map((line, idx) => {
            console.log(`${idx + 1}. ${line}`);
          });
        } else {
          console.log("No tasks available.");
        }
        break;
      case "3":
        await markComplete();
        break;
      case "4":
        await removeTask();
        break;
      case "5":
        exit();
      default:
        console.log(`Please enter a valid number.`);
        break;
    }
  }
}

//TODO--------- Run the main function------------>
main();
