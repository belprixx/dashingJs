'use strict';

dashingJs.
controller('dashingJsTeamMoodCtrl', function($scope, $http, $interval, $element) {

    $scope.title = '&nbsp;';
    $scope.loading = true;
    $scope.dependentiesLoading = true;
    $scope.token = $scope.item.params.token;
    $scope.moods = [];
    $scope.tags = [];
    $scope.showing = null;
    $scope.showingMessage = null;
    var moods = [];

    $scope.getMoods = function(){
        $http({
            method: 'GET',
            url: 'https://jsonp.afeld.me/?url=http://app.teammood.com/api/'+$scope.token+'/moods?since=30'
        }).then(function(response){
            var data = response.data.days[0] || null;
            if(!data || !data.values.length) return;
            $scope.at = new Date(data.nativeDate);
            for(var i in data.values){
                var item = data.values[i];
                moods.push(item);
                for(var ii in item.tags) {
                    var tag = item.tags[ii] || null;
                    if (tag && $scope.tags.indexOf(tag) === -1) {
                        $scope.tags.push(tag);
                    }
                }
            }
            $scope.loading = false;
            setShowingTeamMood();
            setShowingCommentTeamMood();
        });
    };
    $interval($scope.getMoods, 1000*60*5);
    $scope.getMoods();

    function setShowingTeamMood(){
        $scope.moods = {
            'bad' : [],
            'hard' : [],
            'average' : [],
            'good' : [],
            'excellent' : []
        };

        $scope.comments = [];

        if($scope.showing +1  >= $scope.tags.length || $scope.showing === null){
            $scope.showing = 0;
        }else{
            $scope.showing++;
        }

        var tag = $scope.tags[$scope.showing];
        $scope.title = tag;

        for(var i in moods){
            if(moods[i].tags.indexOf(tag) !== -1){
                if(!$scope.moods[moods[i].mood]){
                    $scope.moods[moods[i].mood] = [];
                }
                $scope.moods[moods[i].mood].push(moods[i]);

                if(moods[i].comment){
                    $scope.comments.push(moods[i])
                }
            }
        }

        var tendance = 'bad';
        if($scope.moods.hard.length >= $scope.moods.bad.length){
            tendance = 'hard';
        }
        if($scope.moods.hard.length >= $scope.moods.hard.length){
            tendance = 'average';
        }
        if($scope.moods.good.length >= $scope.moods.average.length){
            tendance = 'good';
        }
        if($scope.moods.excellent.length >= $scope.moods.good.length){
            tendance = 'excellent';
        }
        $($element).removeClass('bad').removeClass('hard').removeClass('average').removeClass('good').removeClass('excellent');
        $($element).addClass(tendance);
    }

    $interval(setShowingTeamMood, 3000);

    function setShowingCommentTeamMood(){
        if($scope.showingComment +1  >= $scope.comments.length || $scope.showingComment === null){
            $scope.showingComment = 0;
        }else{
            $scope.showingComment++;
        }

    }

    //var stop = $interval(setShowingTeamMood, $scope.item.params.interval);
    $interval(setShowingCommentTeamMood, 5000);

});