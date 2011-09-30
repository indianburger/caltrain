#!/usr/bin/env bash
mkdir tweetData
for (( i = 1; i <= 20; i++ )); do
    curl "http://api.twitter.com/1/statuses/user_timeline.json?screen_name=caltrain&count=200&page=$i&trim_user=true&include_rts=false" -o "tweetData/test$i.json"
done