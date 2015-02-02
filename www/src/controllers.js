angular.module('twitchcast.controllers', [])
.controller('more', function($scope, $state) {
    $scope.save = function (username, check) {
        if(check == true) {
            window.localStorage.removeItem('username');
            window.localStorage.setItem('username', username);
        }
    };
    $scope.username = window.localStorage.getItem('username');

    $scope.open = function (url) {
        window.open(url, '_system');
    };

    $scope.goto = function (index) {
        $scope.$broadcast('slideBox.setSlide', index);
    }
    $scope.slide = function (index) {
        if(index == 0) {
            $scope.title = 'Following';
        }
        else if(index == 1) {
            $scope.title = 'Search';
        }
        else if(index == 2) {
            $scope.title = 'Teams';
        }
        else {
            $scope.title = 'Search';
        }
    };
    $scope.slide();
    $scope.default = 1;
})
.controller('update', function($scope, $stateParams, $http) {
    $http.get('http://www.googledrive.com/host/0B2JBNspfO2NiM1otcnBVbDBnWUU')
    .success(function(data) {
        if(data.version > 2){
            $scope.title = 'New Update';
            
            $scope.open = function (url) {
                window.open(data.url, '_system');
            };
        }
        else{
            $scope.title = 'No Updates';
        }
    })
    .error(function() {
        $scope.error = 'true';
        $scope.title = 'Service Unavailable';
    });
})
.controller('games', function($scope, $stateParams, $http, $ionicScrollDelegate, URLservice) {    
    $scope.reload = function (offset) {
        if(offset == 'next'){
            var url = $scope.next + '&callback=JSON_CALLBACK';
        }
        if(offset == 'prev'){
            var url = $scope.prev + '&callback=JSON_CALLBACK';
        }
        if(offset == null) {
            var url = URLservice.games($stateParams.name);
        }
        $http.jsonp(url)
        .success(function(data) {
            $scope.list = data.top;
            $scope.next = data._links.next;
            $scope.prev = data._links.prev;
            $scope.title = 'Games (' + data._total + ')';
        })
        .error(function() {
            $scope.error = 'true';
            $scope.title = 'Service Unavailable';
        });
        $scope.top = 'true';
        $ionicScrollDelegate.scrollTop();
    };
    $scope.reload();
})
.controller('game', function($scope, $stateParams) {
    $scope.title = $stateParams.name;
})
.controller('search', function($scope, $stateParams, $http, $ionicScrollDelegate, URLservice) {  
    $scope.reload = function (offset) {
        if(offset == 'next') {
            var url = $scope.next + '&callback=JSON_CALLBACK';
        }
        if(offset == 'prev') {
            var url = $scope.prev + '&callback=JSON_CALLBACK';
        }
        if(offset == null) {
            if($stateParams.username) {
                var url = URLservice.follow($stateParams.username) + '&sortby=last_broadcast';
            }
            else {
                var url = URLservice.search($stateParams.input, $stateParams.type);
            }
        }
        $http.jsonp(url)
        .success(function(data) {
            if(data.error == null) {
                if($stateParams.username) {
                    $scope.list = data.follows;
                    $scope.title = 'Followed channels: ' + data._total;
                    $scope.ref = 'f';
                }
                else {
                    if($stateParams.type == 'streams')
                    {
                        $scope.list = data.streams;
                        $scope.title = '"' + $stateParams.input + '" ' + data._total + ' results';
                        $scope.ref = 's';
                    }
                    if($stateParams.type == 'games')
                    {
                        $scope.list = data.games;
                        $scope.title = '"' + $stateParams.input + '" results';
                        $scope.top = 'false';
                    }
                    if($stateParams.type == 'channels')
                    {
                        $scope.list = data.channels;
                        $scope.title = '"' + $stateParams.input + '" ' + data._total + ' results';
                        $scope.ref = 's';
                    }
                }
                $scope.next = data._links.next;
                $scope.prev = data._links.prev;
            }
            else {
                $scope.list = '';
                $scope.title = data.error;
                $scope.top = 'true';
            }
        })
        .error(function() {
            $scope.error = 'true';
            $scope.title = 'Service Unavailable';
        });
        $ionicScrollDelegate.scrollTop();
    };
    $scope.reload();
})
.controller('channel', function($scope, $stateParams) {
    $scope.title = $stateParams.title;
    $scope.name = $stateParams.name;
})
.controller('video', function($scope, $stateParams, $http) { 
    $http.jsonp('https://api.twitch.tv/api/videos/' + $stateParams.id + '?callback=JSON_CALLBACK')
    .success(function(data) {
        if(data.api_id.slice(0, 1) == 'v'){
            var id = data.api_id;
            
            $http.jsonp('https://api.twitch.tv/api/vods/' + id.slice(1, id.length) + '/access_token?callback=JSON_CALLBACK')
            .success(function(auth) {
                console.log(auth)
                var sig = auth.sig;
                var token = auth.token;
                var url = 'http://usher.twitch.tv/vod/' + id.slice(1, id.length) + '?nauth=' + token + '&nauthsig=' + sig;

                $http.get(url)
                .success(function(data) {
                    var dir = /http?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.,~#?&//=]*)/gi;
                    var fmt = /NAME="(.*?)"/gi;
                    
                    $scope.type = 'vod';
                    $scope.fmt = data.match(fmt);
                    $scope.list = data.match(dir);
                    $scope.title = 'Select Quality';
                })
                .error(function() {
                    $scope.error = 'true';
                    $scope.title = 'Playlist Unavailable';
                });
            })
            .error(function() {
                $scope.error = 'true';
                $scope.title = 'Service Unavailable';
            });
        }
        else{
            $scope.type = 'chunk';
            $scope._live = data.chunks.live;
            $scope._720p = data.chunks["720p"];
            $scope._480p = data.chunks["480p"];
            $scope._360p = data.chunks["360p"];
            $scope._240p = data.chunks["240p"];
            $scope.title = 'Select Quality';
        }
    })
    .error(function() {
        $scope.error = 'true';
        $scope.title = 'Service Unavailable';
    });
    $scope.quality = '5';
    
    $scope.open = function (url) {
        window.open(url, '_system');
    };
})
.controller('highlights', function($scope, $stateParams, $http, $ionicScrollDelegate, URLservice) {
    $scope.reload = function (offset) {
        if(offset == 'next'){
            var url = $scope.next + '&callback=JSON_CALLBACK';
        }
        if(offset == 'prev'){
            var url = $scope.prev + '&callback=JSON_CALLBACK';
        }
        if(offset == null) {
            var url = URLservice.highlights($stateParams.name);
        }
        $http.jsonp(url)
        .success(function(data) {
            $scope.list = data.videos;
            $scope.next = data._links.next;
            $scope.prev = data._links.prev;
            $scope.title = $stateParams.title + ' Highlights';
            $scope.ref = 's';
        })
        .error(function() {
            $scope.error = 'true';
            $scope.title = 'Service Unavailable';
        });
        $ionicScrollDelegate.scrollTop();
    };
    $scope.reload();
})
.controller('broadcasts', function($scope, $stateParams, $http, $ionicScrollDelegate, URLservice) {
    $scope.reload = function (offset) {
        if(offset == 'next'){
            var url = $scope.next + '&callback=JSON_CALLBACK';
        }
        if(offset == 'prev'){
            var url = $scope.prev + '&callback=JSON_CALLBACK';
        }
        if(offset == null) {
            var url = URLservice.broadcasts($stateParams.name);
        }
        $http.jsonp(url)
        .success(function(data) {
            $scope.list = data.videos;
            $scope.next = data._links.next;
            $scope.prev = data._links.prev;
            $scope.title = $stateParams.title + ' Past Broadcasts';
            $scope.ref = 's';
        })
        .error(function() {
            $scope.error = 'true';
            $scope.title = 'Service Unavailable';
        });
        $ionicScrollDelegate.scrollTop();
    };
    $scope.reload();
})
.controller('videos', function($scope, $stateParams, $http, $ionicScrollDelegate, URLservice) {
    $scope.reload = function (offset) {
        if(offset == 'next'){
            var url = $scope.next + '&callback=JSON_CALLBACK';
        }
        if(offset == 'prev'){
            var url = $scope.prev + '&callback=JSON_CALLBACK';
        }
        if(offset == null) {
            var url = URLservice.videos($stateParams.name, $stateParams.period);
        }
        $http.jsonp(url)
        .success(function(data) {
            $scope.list = data.videos;
            $scope.next = data._links.next;
            $scope.prev = data._links.prev;
            if($stateParams.name){
                $scope.title = $stateParams.name + ' Videos (' + $stateParams.period + ')';
                $scope.ref = 'g';
            }
            else{
                $scope.title = 'Top Videos (' + $stateParams.period + ')';
                $scope.ref = 'v';
                $scope.top = 'true';
            }
        })
        .error(function() {
            $scope.error = 'true';
            $scope.title = 'Service Unavailable';
        });
        $scope.game = $stateParams.name;
        $scope.period = 'true';
        $ionicScrollDelegate.scrollTop();
    };
    $scope.reload();
})
.controller('streams', function($scope, $stateParams, $http, $ionicScrollDelegate, URLservice) {
    $scope.reload = function (offset) {
        if(offset == 'next'){
            var url = $scope.next + '&callback=JSON_CALLBACK';
        }
        if(offset == 'prev'){
            var url = $scope.prev + '&callback=JSON_CALLBACK';
        }
        if(offset == null) {
            var url = URLservice.streams($stateParams.name);
        }
        $http.jsonp(url)
        .success(function(data) {
            $scope.list = data.streams;
            $scope.next = data._links.next;
            $scope.prev = data._links.prev;
            
            if($stateParams.name){
                $scope.title = $stateParams.name + ' Live Channels';
                $scope.ref = 'g';
            }
            else{
                $scope.title = 'Live Channels (' + data._total + ')';
                $scope.ref = 'l';
            }
        })
        .error(function() {
            $scope.error = 'true';
            $scope.title = 'Service Unavailable';
        });
        $ionicScrollDelegate.scrollTop();
    };
    $scope.reload();
})
.controller('stream', function($scope, $stateParams, $http) {
    var channel = $stateParams.name;

    $http.jsonp('https://api.twitch.tv/api/channels/' + channel + '/access_token?callback=JSON_CALLBACK')
    .success(function(auth) {
        var sig = auth.sig;
        var token = auth.token;
        var url = 'http://usher.twitch.tv/api/channel/hls/' + channel + '.m3u8?sig=' + sig + '&token=' + token + '&allow_source=true';

        $http.get(url)
        .success(function(data) {
            var dir = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.,~#?&//=]*)/gi;
            var fmt = /NAME="(.*?)"/gi;
            
            $scope.fmt = data.match(fmt);
            $scope.list = data.match(dir);
            $scope.title = 'Select Quality';
        })
        .error(function() {
            $scope.error = 'true';
            $scope.title = 'Offline channel';
        });
    })
    .error(function() {
        $scope.error = 'true';
        $scope.title = 'Service Unavailable';
    });
    
    $scope.open = function (url) {
        window.open(url, '_system');
    };
})
.controller('teams', function($scope, $stateParams, $http, $ionicScrollDelegate, URLservice) {
    $scope.reload = function (offset) {
        if(offset == 'next'){
            var url = $scope.next + '&callback=JSON_CALLBACK';
        }
        if(offset == 'prev'){
            var url = $scope.prev + '&callback=JSON_CALLBACK';
        }
        if(offset == null) {
            var url = URLservice.teams();
        }
        $http.jsonp(url)
        .success(function(data) {
            $scope.list = data.teams;
            $scope.next = data._links.next;
            $scope.prev = data._links.prev;
        })
        .error(function() {
            $scope.error = 'true';
            $scope.title = 'Service Unavailable';
        });
        $ionicScrollDelegate.scrollTop();
    };
    $scope.reload();
})
.controller('team', function($scope, $stateParams, $http) {
    $http.jsonp('http://api.twitch.tv/api/team/' + $stateParams.team + '/live_channels.json?callback=JSON_CALLBACK')
    .success(function(data) {
        $scope.list = data.channels;
        $scope.title = $stateParams.name + ' live channels';
        $scope.ref = 't';
    })
    .error(function() {
        $scope.list = '';
        $scope.title = 'Not found';
    });
});
