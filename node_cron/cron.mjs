import cron from "node-cron";

//The purpose of cron is to figure out a way for the front-end to keep up with changes on the backend. Cron does this. I needed something to check the current time every few seconds and compare it with the scheduled job. Basically, I set a job, I see a pending status, but when the current time falls inline with it, then change the status to busy. The logic here should not be in an API folder or inside the app folder because I want this to act as independent or run when the app runs which will run in the background. Therefore, we want to make an API to the backend sending nothing.

//This file tells the myTasks function from MyTasks.tsx when to run. The task function is being called in schedule-task
cron.schedule("*/5 * * * * *", async () => {
  console.log("⏰ Cron fired"); //debugging

  //I am just sending a POST request to schedule-task because of my setup. Meaning, I have a task function in a  separate file that I import.
  await fetch("http://localhost:3000/api/check-order-status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
});
