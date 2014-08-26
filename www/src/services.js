angular.module('twitchcast.services', [])
.factory('URLservice', function($stateParams) {
    var api = 'https://api.twitch.tv/kraken/';
    var arr = '?callback=JSON_CALLBACK&limit=15&offset=0';
    return {
        games: function() {
            return api + 'games/top' + arr;
        },
        teams: function() {
            return api + 'teams' + arr;
        },
        search: function(query, type) {
            if(type == 'games') {
                return api + 'search/' + type + arr + '&type=suggest&q=' + query;
            }
            else {
                return api + 'search/' + type + arr + '&q=' + query;
            }
        },
        follow: function(username) {
            return api + 'users/' + username + '/follows/channels' + arr;
        },
        channel: function(name) {
            return api + 'channels/' + name + arr;
        },
        highlights: function(channel) {
            return api + 'channels/' + channel + '/videos' + arr;
        },
        broadcasts: function(channel) {
            return api + 'channels/' + channel + '/videos' + arr + '&broadcasts=true';
        },
        videos: function(game, period) {
            return api + 'videos/top' + arr + '&game=' + game + '&period=' + period;
        },
        streams: function(game) {
            if(game) {
                return api + 'streams' + arr + '&game=' + game;
            }
            else {
                return api + 'streams' + arr;
            }
        }
    };
});
