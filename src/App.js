import axios from 'axios';
import React, { useState } from 'react';
import qs from 'qs';

function App() {
  const [Token, setToken] = useState();
  const AUTH_URI = 'https://accounts.google.com/o/oauth2/auth';
  const SERVER_URI = 'server_auth_uri';
  const CLIENT_ID = 'google_client_id';

  // Google OAuth 요청에 필요한 파라미터들
  const googleParams = qs.stringify({
      client_id: CLIENT_ID,
      redirect_uri: 'http://localhost:3000/',
      response_type: 'token',
      scope: 'openid profile email'
  });

  // 최종 요청 URL
  const googleUrl = AUTH_URI +'?'+ googleParams;

  // OAuth 요청 메소드 //
  /* 간략한 요약
   * 1. 현재 url에서 토큰을 추출한다.
   * 2. 토큰이 없으므로 Google로 OAuth 요청한다.
   * 3. 지정한 Redirect_URI로 Access Token과 함께 리다이렉션 된다.
   * 4. 다시 현재 URI에서 토큰을 추출하고 state Token에 저장한다.
   */
  const OAuthAUth = () => {
      alert("토큰 추출 시작: [ " +window.location.hash.substr(1)+ " ]");
      const { access_token } = qs.parse(window.location.hash.substr(1));

      alert("토큰 추출 완료: [ " +access_token+ " ]");

      // 받아온 토큰값을 state로 저장
      setToken(access_token);
      alert(access_token);

      if(!access_token) {
          alert("구글 로그인 시행");
          /* axios.get()으로 진행하지 않는 이유?? */
          // axios.get()은 HTTP 통신으로, 응답을 보내면 반드시 받아와야 한다.
          // 하지만 구글 OAuth 요청은 값을 받아오는 것이 아닌 단순히 Redirect되는 개념이므로, axios로 처리할 수 없다.
          window.location.href = googleUrl;

          alert("구글 로그인 완료");
      }

      if(Token != null) {
          alert("토큰값 : [ " +Token+ " ]");
          return null;
      }
  }

  // 구현된 서버로 인증 요청하는 메소드 //
  /* 간략한 요약
   * 받아온 Access Token으로 인증을 요청하여, 해당하는 결과값을 가져온다.
   */
  const ServerAuth = async () => {
      if(Token == null)
          return null;

      const reqHeader = {
          headers: {
              'Content-Type': 'application/json'
          }
      }
      const serverAuth = await axios.post(SERVER_URI, Token, reqHeader);
      const ServerAuthData =serverAuth.data;
      alert(ServerAuthData.value1);
      alert(ServerAuthData.value2);
      alert(ServerAuthData.value3);
  }

  return (
      <>
        <div className="App">
          <header className="App-header">
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <button className="App-link"
                onClick={() => ServerAuth()}>
              서버 인증
              {(Token == null) && OAuthAUth() }
            </button>
              <div>
                  토큰값! {Token}
              </div>
          </header>
        </div>
      </>
  )
}

export default App;
