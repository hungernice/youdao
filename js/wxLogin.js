var wxloginObj = null;

function wxLogin(page) {
	plus.oauth.getServices(function(services) {
//		console.log(JSON.stringify(services));
		for (var i in services) {
			if(services[i].id == "weixin"){
				wxloginObj= services[i];
			}
		}
		
		if(wxloginObj == null){
			mui.toast("获取微信登录失败");
			return false;
		}
		else{
			wxloginObj.login(function(res){
				wxloginObj.getUserInfo(function(){
					var unID = wxloginObj.userInfo.openid;
					var nickname = wxloginObj.userInfo.nickname;
					var face = wxloginObj.userInfo.headimgurl;
					mui.post(						 
						"http://hoa.hcoder.net/index.php?c=members&m=addByWx",
						{
							openid: unID,
							nickname: nickname
						},function(data){
							if(data.status =="ok"){
								eval("changeSub(4); h('#mFoot').find('a').removeClass('mui-active'); h('#nav4').addClass('mui-active')");
								plus.storage.setItem('uid', data.id);
								plus.storage.setItem("unickname", data.nickname);
								plus.storage.setItem("uface", face);
								plus.storage.setItem('randnumber', data.randnumber);
								mui.toast("登录成功");
								h("#faceImg").attr("src", face);
								h("#nickname").html(nickname);
								
								alert(nickname+"，"+face);
								h("#scipt").hide();
														
							}


							
						},"json"
					);
					return false;
				},function(){
					mui.toast("获取用户信息失败");
					eval("changeSub(1); h('#mFoot').find('a').removeClass('mui-active'); h('#nav1').addClass('mui-active')")
				});
			});
		} 

		
		
	}, function() {
		mui.toast("未找到微信应用，请检查是否安装过微信")
	});
}

mui("#logout").on("tap", "a", function(){
	logout(); 
});

function changeSub(index){
	var Sub1= plus.webview.getWebviewById("sub1.html");
	var Sub2= plus.webview.getWebviewById("sub2.html");
	var Sub3= plus.webview.getWebviewById("sub3.html");
	var Sub4= plus.webview.getWebviewById("sub4.html");
	Sub1.setStyle({left: (1-index)*100 +'%'});
	Sub2.setStyle({left: (2-index)*100 +'%'});
	Sub3.setStyle({left: (3-index)*100 +'%'});
	Sub4.setStyle({left: (4-index)*100 +'%'});
	
}

function logout(){			//退出登录
	mui.confirm("是否退出登录","退出登录", ["是","否"], function(e){
		if(e.index == 0){		//确认
			plus.oauth.getServices(function(services){
				for (var i in services) {
					if(services[i].id == "weixin"){
						wxloginObj= services[i];
					}
				}
				if(wxloginObj == null){
					mui.toast("获取微信登录服务失败");
					return false; 
				}  
				else{
					wxloginObj.logout(function(){
						plus.storage.removeItem("uid");
						plus.storage.removeItem("unickname");
						plus.storage.removeItem("uface");
						plus.storage.removeItem("randnumber");
						mui.toast("退出成功");
						var _index =plus.webview.getLaunchWebview();
						_index.evalJS("changeSub(1); h('#mFoot').find('a').removeClass('mui-active'); h('#nav1').addClass('mui-active')");
					},function(){ 
						mui.toast("退出失败！");
					});
				}
			}, function(){
				mui.toast("未找到微信应用，请检查是否安装过微信");
			});			
		}
		
	});
	
	
	

}
