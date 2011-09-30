var _ = require("underscore");
var fs = require("fs"), 
    path = require("path"),
    sys = require("sys");

var mapTime = function(file) {
    var contents = fs.readFileSync("../data/" + file);
    var parsed = JSON.parse(contents);
    return _.map(parsed, function(tweetObj) {
        return tweetObj.created_at;
    });
};



var weekdayReduce = function(out, date) {
    var day = date.getDay();
    if ( day === 0 || day === 6 ) {
        out.weekends = (out.weekends ? out.weekends + 1: 1);
    } else {
        out.weekdays = (out.weekdays ? out.weekdays + 1: 1);
    }
    out.num = out.num + 1;
    return out;
    
};

var timeOfDayReduce = function(out, date) {
    var hours = date.getHours();
    out[hours] = (out[hours] ? out[hours] + 1 : 1);
    out.num = out.num + 1;
    return out;
};

var getTrainNumFromTweet = function(text) {
    text = text.toLowerCase();
    var i = (text.indexOf("nb") === -1 ? text.indexOf("sb") : text.indexOf("nb"));
    if (i !== -1) {
        if (text.charAt(i + 2) === " "){
            i = i + 3;
        } else {
            i = i + 2;
        }
        var trainNum = text.substr(i, 3);
        if (isNaN(parseInt(trainNum, 10))){
            // console.error("MIssed: " + text);
        } else {
            return trainNum;
        }
    } else {
        // console.error("Missed" + text);
    }
}; 
var mapTrainNum = function(file) {
1") === -1 ) return;
    var contents = fs.readFileSync("../data/" + file);
    var parsed = JSON.parse(contents);
    return _.map(parsed, function(tweetObj) {
        var trainNum = getTrainNumFromTweet(tweetObj.text);
        if (trainNum) return trainNum;
    });
};

var simpleCountReduce = function(out, key) {
    out[key] = (out[key] ? out[key] + 1 : 1);
    out.num = (out.num ? out.num + 1 : 1);
    if (!key) {
        out.missed = (out.missed ? out.missed + 1 : 1);
    }
    return out;
};
var tabOutput = function(value, key) {
    sys.puts(key + "\t" + value);
};
fs.readdir("../data", function(err, files) {
    if (err) throw err;
    // _(files).chain().map(mapTime).flatten().
    //         map(function(dateString) { return new Date(Date.parse(dateString)); }).
    //         reduce(timeOfDayReduce, { num: 0 }).
    //         each(tabOutput);
    
    _(files).chain().map(mapTrainNum).flatten().
        reduce(simpleCountReduce, {}).
        each(tabOutput);
    
                
});


// fs.readFile("tweets.json", function(err, data){
//     if (err) throw err;
//     var json = JSON.parse(data);
//     var tweets = [];
//     _.each(json, function(tweet) {
//         tweets.push(tweet.text);
//     });
//     fs.writeFile("tweetsOnly.json", JSON.stringify(tweets));
// });