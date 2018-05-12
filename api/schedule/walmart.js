//var schedule = require('node-schedule');

/*
exports.runSchedure = function (req, res, next) {
    console.log(req.user);
    var job1 = new schedule.Job('cancelJob', function() {});
      job1.schedule({
        second: new schedule.Range(8, 22);	
      });
    
    var rule = new schedule.RecurrenceRule();
    rule.hour = 
    rule.minute = 0;
    var j = schedule.scheduleJob(scheduleId, rule, function(){
        console.log('Schedule started');
    });
    
    return res.status(200).json({ message: `Schedule started ` });
}

exports.stopSchedure = function (req, res, next) {
    console.log(req.user);	
    var j = schedule.scheduleJob(scheduleId, rule, function(){
        console.log('Schedule started');
    });
    j.cancel();
    return res.status(200).json({ message: `Schedule stopped ` });
} 

*/

exports.currentTime = function () {
    console.log('Current Date is: ' + new Date().toISOString().slice(0, 10))
};
