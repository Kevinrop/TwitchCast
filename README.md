TwitchCast
==

A unofficial Twitch mobile app

Just a simple web app I've made to see the Twitch's Highlights and Past Broadcasts (that cannot be seen thru any app I've tested).

I've made it a while ago, but it may be usefull for someone... so i'm sharing it.

Features
--

* Live streams and videos (all formats availables) on your prefered player.
* Search for Streams, Games, Channels and Teams (you need the ID).
* Check the channels you (or any user) are following.

Download
--
APK for android: [download]

Notes
--
* Only build and tested on Android Gingerbread (Galaxy Mini) and KitKat (Moto G), and everything is working as expected (should work on IOS tho... but I can't build the app without $$$).
* The Past Broadcasts aren't stored on a single file, but in many parts (~30min each).
* The Twitch website player search for a specific init and end position of a broadcast to show the Highlights (this cannot be done so the app will display all the files, not the real Highlight extract).
* Also the videos are stored on the highest quality, except for some important tournaments (Only cheched LoL) that can be seen on lower formats.
* No chat or subscription stuff support.

Version
--

0.4.3

Tech
--

It's my first attempt to work with a AngularJS (or any framework in general), and just took me 2 weeks... so fun... so bad implementation i'm sure...

* [Ionic] - Advanced HTML5 Hybrid Mobile App Framework
* [Monaca] - Hybrid mobile development cloud for cross-platform app. 
* [Twitch] API v2.

License
--

MIT

[ionic]:http://ionicframework.com//
[monaca]:http://monaca.mobi
[twitch]:https://github.com/justintv/twitch-api
[download]:https://mega.co.nz/#!4g5n3DzR!X-ac6QKpz5w2Zkvs8fUvBWUKGIjhEggf-YSqHOypNws
