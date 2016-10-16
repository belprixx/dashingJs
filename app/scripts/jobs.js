'use strict';

dashingJs.
factory('jobValueA',function($http){
    return {
        getValue: function(){
            return $http.get('http://localhost:9000/server/valueA.yml');
        }
    }
}).
factory('jobValueB',function($http){
    return {
        getValue: function(){
            return $http.get('http://localhost:9000/server/valueB.yml');
        }
    }
});