var schedule = require('node-schedule');
const WalmartController = require('../controllers/walmart');
let count = 0;

exports.runSchedure = function () {
   console.log('runSchedure');
    schedule.scheduleJob('WalmartSchedule', '0 */2 * * *', function() {
        WalmartController.WalmartNotification();
        currentTime();
    });
}

exports.runCleanUp = function () {
   console.log('runCleanUp');
    schedule.scheduleJob('WalmartClean', '0 0 * * *', function() {
        WalmartController.WalmartCleanUp();
        currentTime();
    });
}

exports.runWalmartDailyUpdate = function () {
   console.log('runWalmartDailyUpdate');
    schedule.scheduleJob('WalmartDailyUpdate', '0 0 * * *', function() {
        WalmartController.WalmartDailyUpdate();
        currentTime();
    });
}

stopSchedure = function () {

    var my_job = schedule.scheduledJobs['WalmartSchedule'];
    my_job.cancel();
    console.log('WalmartSchedule job canceled ');
} 
currentTime = function () {
    count ++ ;
    console.log(`${count} Current Date is: ` + new Date().toISOString().slice(0, 10));
    if (count > 3) {
      stopSchedure();  
    }
    console.log()
};
