/**
 * @fileOverview
 *
 *  与后端交互的服务
 *
 * @author: zhangbobell
 * @email : zhangbobell@163.com
 *
 * @copyright: Baidu FEX, 2015
 */
angular.module('kityminderEditor')
    .service('server', ['config', '$http',  function(config, $http) {
        var url = config.get('picture');
        return {
            //处理图片
            uploadImage: function(file) {
                var fd = new FormData();
                fd.append('upload_file', file);

                return $http.post(url, fd, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                });
            },                        
            antiCors: function(targeturl){
                return $http.get(url,{  
                    params: {  
                        "url":targeturl
                    }  
                })
            }
        }
    }]);


    // http://119.3.169.145:5001/#?id=%E8%BD%A6%E6%98%93%E6%8B%8D.km