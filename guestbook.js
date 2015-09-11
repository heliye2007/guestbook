window.onload = function() {

	var oUser = document.getElementById('user');
	var oReg = document.getElementById('reg');
	var oLogin = document.getElementById('login');
	var oUserInfo = document.getElementById('userinfo');
	var oList = document.getElementById('list');
	var iPage = 1;
	
	var oShowMore = document.getElementById('showMore');
	
	var oUsername1 = document.getElementById('username1');
	var oVerifyUserNameMsg = document.getElementById('verifyUserNameMsg');
    var b = true;
	
	//初始化
	updateUserStatus();
	
	function updateUserStatus() {
		var uid = getCookie('uid');
		var username = getCookie('username');
		if (uid) {
			//如果是登陆状态
			oUser.style.display = 'block';
			oUserInfo.innerHTML = username;
			oReg.style.display = 'none';
			oLogin.style.display = 'none';
		} else {
			oUser.style.display = 'none';
			oUserInfo.innerHTML = '';
			oReg.style.display = 'block';
			oLogin.style.display = 'block';
		}
	}
	
	showList();
	
	/*
	验证用户名
	get
		guestbook/index.php
			m : index
			a : verifyUserName
			username : 要验证的用户名
		返回
			{
				code : 返回的信息代码 0 = 没有错误，1 = 有错误
				message : 返回的信息 具体返回信息
			}
	*/
	oUsername1.onblur = function() {
		ajax('get', 'guestbook/index.php', 'm=index&a=verifyUserName&username=' + this.value, function(data) {

			var d = JSON.parse(data);
			
			oVerifyUserNameMsg.innerHTML = d.message;
			
			if (d.code) {
				oVerifyUserNameMsg.style.color = 'red';
			} else {
				oVerifyUserNameMsg.style.color = 'green';
			}
		});
	}
	
	/*
	用户注册
	get/post
		guestbook/index.php
			m : index
			a : reg
			username : 要注册的用户名
			password : 注册的密码
		返回
			{
				code : 返回的信息代码 0 = 没有错误，1 = 有错误
				message : 返回的信息 具体返回信息
			}
	*/
	var oPassword1 = document.getElementById('password1');
	var oRegBtn = document.getElementById('btnReg');
	oRegBtn.onclick = function() {
		
		ajax('post', 'guestbook/index.php', 'm=index&a=reg&username='+encodeURI(oUsername1.value)+'&password=' + oPassword1.value, function(data) {
			var d = JSON.parse(data);
			alert(d.message);
            oPassword1.value="";
            oUsername1.value="";
			
		});
		
	}
	
	/*
	用户登陆
	get/post
		guestbook/index.php
			m : index
			a : login
			username : 要登陆的用户名
			password : 登陆的密码
		返回
			{
				code : 返回的信息代码 0 = 没有错误，1 = 有错误
				message : 返回的信息 具体返回信息
			}
	*/
	var oUsername2 = document.getElementById('username2');
	var oPassword2 = document.getElementById('password2');
	var oLoginBtn = document.getElementById('btnLogin');
	oLoginBtn.onclick = function() {
		
		ajax('post', 'guestbook/index.php', 'm=index&a=login&username='+encodeURI(oUsername2.value)+'&password=' + oPassword2.value, function(data) {
			var d = JSON.parse(data);
			alert(d.message);
			
			if (!d.code) {
				updateUserStatus();
			}
			
		});
		
	}
	
	/*
	用户退出
	get/post
		guestbook/index.php
			m : index
			a : logout
		返回
			{
				code : 返回的信息代码 0 = 没有错误，1 = 有错误
				message : 返回的信息 具体返回信息
			}
	*/
	var oLogout = document.getElementById('logout');
	oLogout.onclick = function() {
		
		ajax('get', 'guestbook/index.php', 'm=index&a=logout', function(data) {
			
			var d = JSON.parse(data);
			alert(d.message);
			
			if (!d.code) {
				//退出成功
				updateUserStatus();
			}
			
		});
		
		return false;
		
	}
	
	/*
	留言
	post
		guestbook/index.php
			m : index
			a : send
			content : 留言内容
		返回
			{
				code : 返回的信息代码 0 = 没有错误，1 = 有错误
				data : 返回成功的留言的详细信息
					{
						cid : 留言id	
						content : 留言内容 
						uid : 留言人的id
						username : 留言人的名称
						dateline : 留言的时间戳(秒)
						support : 当前这条留言的顶的数量
						oppose : 当前这条留言的踩的数量
					}
				message : 返回的信息 具体返回信息
			}
	*/
	var oContent = document.getElementById('content');
	var oPostBtn = document.getElementById('btnPost');
	oPostBtn.onclick = function() {
		
		ajax('post', 'guestbook/index.php', 'm=index&a=send&content='+encodeURI(oContent.value), function(data) {
			var d = JSON.parse(data);
			alert(d.message);
			
			if (!d.code) {
				//添加当前留言到列表中
				createList(d.data, true);
			}
			
		});
		
	}
	
	function createList(data, insert) {
		var oDl = document.createElement('dl');
				
		var oDt = document.createElement('dt');
		var oStrong = document.createElement('strong');
		oStrong.innerHTML = data.username;
		oDt.appendChild(oStrong);
		
		var oDd1 = document.createElement('dd');
		oDd1.innerHTML = data.content;
		
		var oDd2 = document.createElement('dd');
		oDd2.className = 't';
		var oA1 = document.createElement('a');

        var up;
        var down;
		oA1.href = '#';
        oA1.onclick=function(){
            ajax('get', 'guestbook/index.php', 'm=index&a=doSupport&cid='+data.cid, function(data){

                var d = JSON.parse(data);

            oA1.innerHTML = '顶(<span>'+d.support+'</span>)';
            alert(d.message);
            })
        }
		oA1.innerHTML = '顶(<span>'+data.support+'</span>)';
		var oA2 = document.createElement('a');
        oA2.href = '#';
        oA2.onclick=function(){
            ajax('get', 'guestbook/index.php', 'm=index&a=doOppose&cid='+data.cid, function(data){
            var d = JSON.parse(data);
            oA2.innerHTML='踩(<span>'+d.oppose+'</span>)';
            alert(d.message);
        })
        }
		oA2.innerHTML = '踩(<span>'+data.oppose+'</span>)';
		oDd2.appendChild(oA1);
		oDd2.appendChild(oA2);

		oDl.appendChild(oDt);
		oDl.appendChild(oDd1);
		oDl.appendChild(oDd2);
		
		if (insert && oList.children[0]) {
			oList.insertBefore(oDl, oList.children[0]);
		} else {
			oList.appendChild(oDl);
		}
	}
	
	//点击显示更多的内容
	oShowMore.onclick = function() {
		iPage++;
		showList();
	}
	
	function showList() {
		/*
		初始化留言列表
		get
			guestbook/index.php
				m : index
				a : getList
				page : 获取的留言的页码，默认为1
				n : 每页显示的条数，默认为10
			返回
				{
					code : 返回的信息代码 0 = 没有错误，1 = 有错误
					data : 返回成功的留言的详细信息
						{
							cid : 留言id	
							content : 留言内容 
							uid : 留言人的id
							username : 留言人的名称
							dateline : 留言的时间戳(秒)
							support : 当前这条留言的顶的数量
							oppose : 当前这条留言的踩的数量
						}
					message : 返回的信息 具体返回信息
				}
		*/
		ajax('get', 'guestbook/index.php', 'm=index&a=getList&n=5&page=' + iPage, function(data) {
            var d = JSON.parse(data);

			var data = d.data;

			if (data) {

				for (var i=0; i<data.list.length; i++) {
					createList(data.list[i]);
				}
                oShowMore.innerHTML = '显示更多';
                if (data.list.length==0)
                {oShowMore.innerHTML="没有更多数据了";
                    oShowMore.onclick=null;}
			} else {

				if (iPage == 1) {
                    oShowMore.style.display = 'none';
					oList.innerHTML = '现在还没有留言，快来抢沙发...';
				}

			}

            b = true;
		});

	}
    //滚动加载
    window.onscroll = function() {

        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

        if ( getTop(oList) + oList.offsetHeight < document.documentElement.clientHeight + scrollTop ) {

            if ( b ) {
                b = false;
                iPage++;
                showList();
            }

        }

    }
    function getTop(obj) {
        var iTop = 0;
        while(obj) {
            iTop += obj.offsetTop;
            obj = obj.offsetParent;
        }
        return iTop;
    }
    /*
    顶
     post
     guestbook/index.php
     m : index
     a : send
     cid : 留言内容
     返回
     {
     code : 返回的信息代码 0 = 没有错误，1 = 有错误

     message : 返回的信息 具体返回信息
     }
     */
    function up(){
        ajax('get', 'guestbook/index.php', 'm=index&a=doSupport&cid=3', function(data){
            var d = JSON.parse(data);
            alert(data);
        })
        return false;
    }
//踩
    function down(){
        alert("123");
        return false;
    }

}

function getCookie(key) {
	var arr1 = document.cookie.split('; ');
	for (var i=0; i<arr1.length; i++) {
		var arr2 = arr1[i].split('=');
		if (arr2[0]==key) {
			return arr2[1];
		}
	}
}
function bind(obj, evname, fn) {
    if (obj.addEventListener) {
        obj.addEventListener(evname, fn, false);
    } else {
        obj.attachEvent('on' + evname, function() {
            fn.call(obj);
        });
    }
}