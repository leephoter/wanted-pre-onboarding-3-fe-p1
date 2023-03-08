import React, { useState } from 'react';

type LoginSuccessMessage = 'SUCCESS';
type LoginFailMessage = 'FAIL';

interface LoginResponse {
  message: LoginSuccessMessage | LoginFailMessage;
  token: string;
}

interface UserInfo {
  name: string;
}

interface User {
  username: string;
  password: string;
  userInfo: UserInfo;
}

// TODO: 가입된 Users 가 있을 때를 가정
const users: User[] = [
  {
    username: 'blue',
    password: '1234',
    userInfo: { name: 'blueStragglr' },
  },
  {
    username: 'white',
    password: '1234',
    userInfo: { name: 'whiteDwarf' },
  },
  {
    username: 'red',
    password: '1234',
    userInfo: { name: 'redGiant' },
  },
];

// TODO: 이러한 Token 이 발급된다고 가정
const _secret: string = '1234qwer!@#$';

// TODO: 로그인 함수 : 이미 가입된 users 중에 username, password 가 같은 user를 찾아서 success 메시지와 token 발급,
// 아니면 null
const login = async (
  username: string,
  password: string
): Promise<LoginResponse | null> => {
  const user: User | undefined = users.find((user: User) => {
    return user.username === username && user.password === password;
  });
  return user
    ? {
        message: 'SUCCESS',
        token: JSON.stringify({ user: user.userInfo, secret: _secret }),
      }
    : null;
};

// TODO: user 정보 가져오기 함수 :
// 1. 난독화된 Token을 해석하고 secret key 값이 없거나
// 2. Token 의 secret key 의 값과 발급한 token 이 같이 않은 경우 null 리턴.

// 1. users 중 name 과 token 내부의 userName 이 같은 user를 찾아 user 정보 리턴,
// 아니면 null 리턴
const getUserInfo = async (token: string): Promise<UserInfo | null> => {
  const parsedToken = JSON.parse(token);
  if (!parsedToken?.secret || parsedToken.secret !== _secret) return null;

  const loggedUser: User | undefined = users.find((user: User) => {
    if (user.userInfo.name === parsedToken.user.name) return user;
  });
  return loggedUser ? loggedUser.userInfo : null;
};

const LoginWithMockAPI = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: '' });

  const loginSubmitHandler = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const loginRes = await login(
      formData.get('username') as string,
      formData.get('password') as string
    );
    if (!loginRes) return;

    const userInfo = await getUserInfo(loginRes.token);
    if (!userInfo) return;

    setUserInfo(userInfo);
  };

  return (
    <div>
      <h1>Login with Mock API</h1>
      <form onSubmit={loginSubmitHandler}>
        <label>
          Username:
          <input type="text" name="username" />
        </label>
        <label>
          Password:
          <input type="password" name="password" />
        </label>
        <button type="submit" value="Submit">
          submit
        </button>
      </form>
      <div>
        <h2>User info</h2>
        {JSON.stringify(userInfo)}
      </div>
    </div>
  );
};

export default LoginWithMockAPI;
