const cron = require("node-cron");
const { checkMBTransactions } = require("../services/mbbankService");

let jobInstance = null;

function startMBBankJob(app) {
  if (jobInstance) {
    console.log("MB cron already started");
    return jobInstance;
  }

  jobInstance = cron.schedule("*/5 * * * * *", async () => {
    try {
      await checkMBTransactions(app);
    } catch (err) {
      console.error("Cron execution error:", err);
    }
  });

  jobInstance.start();
  return jobInstance;
}

module.exports = { startMBBankJob };
