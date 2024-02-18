module.exports = {
  // 세션 로그인이 되어있으면 true, 아니면 false를 return하는 함수

  isOwner: function (request, response) {
    if (request.session.isLogined) {
      return true; 
    } 
    
    else {
      return false;
    }
  },
  
  // 세션 로그인 여부에 따라 다른 UI를 return하는 함수

  getAuthStatusUI: function (request, response) {
    var authStatusUI = 'Log in first!' //// 로그인 안되어있는 경우

    if (this.isOwner(request, response)) {
      authStatusUI = `Welcome, ${request.session.nickname}! | <a href="/auth/logout">Logout</a>`; //// 로그인 되어있는 경우
    }

    return authStatusUI;
  }
}