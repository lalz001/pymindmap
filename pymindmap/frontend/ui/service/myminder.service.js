angular.module('kityminderEditor')
    .service('myminder', ['config', '$http','$stateParams', '$timeout','$websocket','$state', function(config, $http,$stateParams,$timeout,$websocket,$state) {
        // 捕获minder
        var minder;
        var setminder = function(m){
            minder=m
        };
        //获得minder数据
        var buildno,minderdata,resultdata;
        //增加离线模式
        var offlinemode = false
        var setdatabyid= function(data){
            // console.log(data)
            if (typeof(data) == "undefined"){
                var url = config.get('getminder'); 
                $http.get(url,{  
                    params: {  
                        "kityID": $stateParams.kityID 
                    }  
                }).then(function (json) {
                    minderdata = json.data.minder
                    buildno = json.data.buildno
                    resultdata = json.data.resultdata
                    minder.importJson(minderdata);
                });
            }else{
                minderdata = data.minder
                buildno = data.buildno
                resultdata = data.resultdata
                offlinemode = true
                minder.importJson(minderdata);
            }
        };
        var pushdatabyid = _.debounce(function(){
            if (!offlinemode){
                // console.log(offlinemode)
                minderdata = minder.exportJson()
                $http.post(config.get('getminder'),
                    {minder:minderdata,buildno:buildno,resultdata:resultdata },
                    {params: {"kityID": $stateParams.kityID }}
                )
            }
        },2000, { 'maxWait': 8000 })
        // 获得&更改数据
        // 更改程序跑出来的结果数据
        var getResultdataById = function(id){
            return resultdata[id]
        }
        var setResultdataById = function(id,md){
            // console.log(123,md)
            resultdata[id] = md
        }
        var clearResultdata = function(){
            resultdata={}
            pushdatabyid()
        }
        var codestatus =["code","waiting","running","err","finish","timeout"]
        // 给标签为id的添加内容标签
        var setResourceById = function(id,data){
            node = minder.getNodeById(id)
            if (codestatus.indexOf(data)!==-1){
                resource = node.data.resource
                filldata = _.pullAllBy(resource,codestatus) || []
                filldata.push(data)
            }else if(!data){
                filldata = []
            }else{
                filldata = [data]
            }
            node.setData('resource', filldata).render()
            //如果内容过多，防止内存泄露
            if (minder.getUsedResource().length>3000){
                $state.reload(); 
            }
            // node = minder.getNodeById(id)
            // resource = node.data.resource
            // filldata = _.pullAllBy(resource,["code","waiting","running","err","finish","timeout"]).push(data)
            // console.log(id)
            // minder.select(node)
            //     .fire('resource', filldata)
            //     .refresh()
        }
        var clearResource = function(){
            nodes = minder.getAllNode()
            for (i=0;i<nodes.length;i++){
                node = nodes[i]
                // killcode(node.data.id)
                
                if(_.intersection(node.data.resource, codestatus).length>0){
                    // filldata = _.pullAllBy(node.data.resource,codestatus).push("code")
                    // node.setData('resource', filldata).render()
                    minder.select(node)
                        .fire('resource', _.pullAllBy(node.data.resource,codestatus).push("code"))
                        .refresh();
                }
            }
        }

        var setHyperLinkById = function(id,url){
            node = minder.getNodeById(id)
            node.setData('hyperlink', url).render()
            // minder.removeAllSelectedNodes().select(node)
            //     .execCommand('HyperLink', url)
        }
        var setImageById = function(id,url){
            node = minder.getNodeById(id)
            minder.removeAllSelectedNodes().select(node).execCommand('image',url,  '')
            // minder
            // node.setData('image', url).setData('imageTitle', url).setData('imageSize', url ).render();
            // minder.fire('saveScene').refresh();
        }
        
        //执行代码触发的回调
        var runcode = function(id){
            socketminder.send(JSON.stringify({
                'kityID':$stateParams.kityID,
                'buildno':0,
                'method':'setResourceById',
                'param':{
                    id:id,
                    data:'waiting'
            }}))
            $http.post(config.get('runcode'),
                {id:id,buildno:0,code: minder.getNodeById(id).data.note },
                {params: {"kityID": $stateParams.kityID }}
            )
        }
        var runallcode = function(){
            nodes = minder.getAllNode()
            for (i=0;i<nodes.length;i++){
                node = nodes[i]
                if(_.intersection(node.data.resource, codestatus).length>0){
                    runcode(node.data.id)
                }
            }
        }

        var killcode = function(id){
            key = $stateParams.kityID + '_' + id
            $http.delete(config.get('runcode')+'/'+key)
        }

        var killallcode = function(){
            nodes = minder.getAllNode()
            for (i=0;i<nodes.length;i++){
                node = nodes[i]
                killcode(node.data.id)
            }
        }

        //minder改变触发的回调
        var contentchange = function(){
            diffdata = window.diff(minderdata,minder.exportJson())
            if (diffdata.length > 0){
                buildno = buildno + 1
                socketminder.send(JSON.stringify({
                    'kityID':$stateParams.kityID,
                    'buildno':buildno,
                    'method':'applyPatches',
                    'diffdata':diffdata}))
                pushdatabyid()
            }
        }
        // websocket
        try{
            var socketminder = $websocket('ws://'+ window.location.hostname+":"+window.location.port+'/'+ config.get('socketminder')  );
            var heartbeat_msg = '--heartbeat--', heartbeat_interval = null, missed_heartbeats = 0;
            socketminder.onOpen(function(){
                if (heartbeat_interval === null) {
                    missed_heartbeats = 0;
                    heartbeat_interval = setInterval(function() {
                        try {
                            missed_heartbeats++;
                            if (missed_heartbeats >= 3)
                                throw new Error("Too many missed heartbeats.");
                            socketminder.send(heartbeat_msg);
                        } catch(e) {
                            clearInterval(heartbeat_interval);
                            heartbeat_interval = null;
                            console.warn("Closing connection. Reason: " + e.message);
                            socketminder.close();
                            socketminder = $websocket('ws://'+ window.location.hostname+":"+window.location.port+ '/'+ config.get('socketminder')  );
                            window.alert("网络连接已经断开，建议刷新")
                            // window.location.reload()
                        }
                    }, 5000);
                }
            }) 
            socketminder.onMessage(function(message) { 
                // console.log(message)
                if (message.data === heartbeat_msg) {
                    missed_heartbeats = 0;
                    return;
                }
                data =JSON.parse(message.data)
                // console.log(data)
                if(data.kityID === $stateParams.kityID  ){
                    //处理更新
                    if (data.buildno>buildno){
                        if(data.method==='applyPatches'){
                            minder.applyPatches(data.diffdata); 
                        }
                        buildno = data.buildno   
                        return;
                    }
                    if (data.buildno===0){
                        buildno+=1
                        if(data.method==='setResourceById'){
                            setResourceById(data.param.id,data.param.data)
                        }
                        if(data.method==='setHyperLinkById'){
                            setHyperLinkById(data.param.id,data.param.url)
                        }
                        if(data.method==='setImageById'){
                            setImageById(data.param.id,data.param.url)
                        }
                        if(data.method==='setResultdataById'){
                            setResultdataById(data.param.id,data.param.md)
                        }
                        pushdatabyid()
                        return;
                    }
                }
            });
        }catch(err){
           console.log(err)
        }

        return {
            minder:minder,
            setminder:setminder,
            setdatabyid: setdatabyid,
            contentchange: contentchange, 
            runcode:runcode,
            runallcode:runallcode,
            killcode:killcode,
            killallcode:killallcode,
            getResultdataById:getResultdataById,
            clearResultdata:clearResultdata,
            clearResource:clearResource
        }
    }]);

