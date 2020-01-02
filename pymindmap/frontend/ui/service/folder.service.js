angular.module('kityminderEditor')
    .service('folder',  ['config','$http',function(config,$http) {
        var url = config.get('folder');
        var addfolder = function(name,path){
          $http.post(url,{name:name,path:path,method:'addfolder'})
        }
        var delfolder = function(name,path){
          $http.post(url,{name:name,path:path,method:'delfolder'})
        }
        var renamefolder = function(name,path){
          $http.post(url,{name:name,path:path,method:'renamefolder'})
        }
        var addminder = function(name,path){
          $http.post(url,{name:name,path:path,method:'addminder'})
        }
        var delminder = function(name,path){
          $http.post(url,{name:name,path:path,method:'delminder'})
        }
        var renameminder = function(name,path){
          $http.post(url,{name:name,path:path,method:'renameminder'})
        }
        var downloadminder = function(name,path){
          $http.post(url,{name:name,path:path,method:'downloadminder'}).then(function(response){
            var a = document.createElement('a');
            a.setAttribute('style', 'display:none');
            var objectUrl = window.URL.createObjectURL(new Blob([response.data]))
            a.setAttribute('href', objectUrl);
            a.setAttribute('download', name+'.html');
            a.click()
            $(a).remove();
            window.URL.revokeObjectURL(objectUrl);
          })
          // console.log(name,path)
        }
        var downloadmd = function(name){
          editor.minder.exportData('markdown').then(function(response){
            var a = document.createElement('a');
            a.setAttribute('style', 'display:none');
            var objectUrl = window.URL.createObjectURL(new Blob([response]))
            a.setAttribute('href', objectUrl);
            a.setAttribute('download', name+'.md');
            a.click()
            $(a).remove();
            window.URL.revokeObjectURL(objectUrl);
          })
        }

        var getnodes= function(fn){
          $http.get(url,{               
            params: {  
              "ask": 'detail'
            }
          }).then(function (json){
              fn(json.data.folder)
          }).catch(function(){
            fn([])
          })
        }
        var getplaces = function(fn){
          $http.get(url,{               
            params: {  
              "ask": 'trunk'
            }
          }).then(function (json){
            fn(json.data.folder)
          }).catch(function(){
            fn([])
          })
        }

        return {
          getplaces: getplaces,
          getnodes:getnodes,
          addfolder:addfolder,
          delfolder:delfolder,
          renamefolder:renamefolder,
          addminder:addminder,
          delminder:delminder,
          renameminder:renameminder,
          downloadminder:downloadminder,
          downloadmd:downloadmd
        }
    }]);