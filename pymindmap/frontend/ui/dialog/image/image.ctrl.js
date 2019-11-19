angular.module('kityminderEditor')
    .controller('image.ctrl', ['$http', '$scope', '$modalInstance', 'image', 'server','config', function($http, $scope, $modalInstance, image, server,config) {

        $scope.data = {
            list: [],
            url: image.url || '',
            title: image.title || '',
            R_URL: /^https?\:\/\/\w+/
        };

        setTimeout(function() {
            var $imageUrl = $('#image-url');
            $imageUrl.focus();
            $imageUrl[0].setSelectionRange(0, $scope.data.url.length);
        }, 300);


        // 搜索图片按钮点击事件
        $scope.searchImage = function() {
            $scope.list = [];
            var key = $scope.data.searchKeyword2;
            // var url = 'https://image.so.com/zj?ch='+key+'&sn=30&listtype=new&temp=1'
            var url = 'https://image.so.com/hads?q='+key+'&cliw=1366&t_ver='
            var fullhost = window.location.protocol+"//"+window.location.hostname+":"+window.location.port
            server.antiCors(url).then(function(json) {
                // console.log(json)
                if(json && json.data) {
                    for(var i = 0; i < json.data.commercial_imgmate_ads.length; i++) {
                        if(json.data.commercial_imgmate_ads[i].thumb) {
                            $scope.list.push({
                                title: key,
                                src: fullhost+'/api/picture?url='+json.data.commercial_imgmate_ads[i].thumb,
                                url: json.data.commercial_imgmate_ads[i].thumb
                            });
                        }
                    }
                }
            })
        };

        // 选择图片的鼠标点击事件
        $scope.selectImage = function($event) {
            var targetItem = $('#img-item'+ (this.$index));
            var targetImg = $('#img-'+ (this.$index));

            targetItem.siblings('.selected').removeClass('selected');
            targetItem.addClass('selected');

            $scope.data.url = targetImg.attr('src');
            $scope.data.title = targetImg.attr('alt');
        };

        // 自动上传图片，后端需要直接返回图片 URL
        $scope.uploadImage = function() {
            var fileInput = $('#upload-image');
            if (!fileInput.val()) {
                return;
            }
            if (/^.*\.(jpg|JPG|jpeg|JPEG|gif|GIF|png|PNG)$/.test(fileInput.val())) {
                var file = fileInput[0].files[0];
                return server.uploadImage(file).then(function (json) {
                    var resp = json.data;
                    if (resp.errno === 0) {
                        $scope.data.url = resp.data.url;
                    }
                });
            } else {
                alert("后缀只能是 jpg、gif 及 png");
            }
        };

        $scope.shortCut = function(e) {
            e.stopPropagation();

            if (e.keyCode == 13) {
                $scope.ok();
            } else if (e.keyCode == 27) {
                $scope.cancel();
            }
        };

        $scope.ok = function () {
            // console.log($scope.data.url)
            if($scope.data.R_URL.test($scope.data.url) ||  $scope.data.url.indexOf('api/static')===0) {
                $modalInstance.close({
                    url: $scope.data.url,
                    title: $scope.data.title
                });
            } else {
                $scope.urlPassed = false;

                var $imageUrl = $('#image-url');
                if ($imageUrl) {
                    $imageUrl.focus();
                    $imageUrl[0].setSelectionRange(0, $scope.data.url.length);
                }

            }

            editor.receiver.selectAll();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
            editor.receiver.selectAll();
        };
    }]);