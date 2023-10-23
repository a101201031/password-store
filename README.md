# password store

**_개인용 비밀번호 관리_**

![메인페이지](https://github.com/a101201031/password-store/assets/17742366/2b83b1c1-aa98-4dbd-b274-fb8e5a32bf22)

## 기능

| 기능                                                                  |
| --------------------------------------------------------------------- |
| 회원 가입 및 로그인                                                   |
| 관리 계정 등록/조회/수정/삭제                                         |
| 관리 계정 그룹 등록/조회/수정/삭제                                    |
| 관리 계정의 비밀번호 조회                                             |
| 관리 계정의 비밀번호 복사                                             |
| 관리 계정의 비밀번호 암호화                                           |
| 사용자 계정 비밀번호 변경                                             |
| 회원 탈퇴                                                             |
| OAuth가 설정된 관리 계정 비밀번호 조회 시 해당 OAuth 인증 정보를 표시 |

## 사용 stack

**_backend_**

- node.js
- typescript
- middy
- serverless framework
- mysql
- firebase
- typescript

**_frontend_**

- react
- recoil
- mui

**_CI_**

- github action

## 프로젝트 구성

```
.
├── packages
│   ├── backend
│   │   ├── src
│   │   │   ├── apiSchema             # API 요청에 대한 스키마
│   │   │   │   ├── account.ts
│   │   │   │   ├── group.ts
│   │   │   │   ├── password.ts
│   │   │   │   ├── signIn.ts
│   │   │   │   ├── signUp.ts
│   │   │   │   └── user.ts
│   │   │   ├── functions             # API 요청 처리 함수
│   │   │   │   ├── account.ts
│   │   │   │   ├── accountList.ts
│   │   │   │   ├── group.ts
│   │   │   │   ├── hello.ts
│   │   │   │   ├── password.ts
│   │   │   │   ├── signIn.ts
│   │   │   │   ├── signUp.ts
│   │   │   │   ├── token.ts
│   │   │   │   ├── user.ts
│   │   │   │   └── userActionLog.ts
│   │   │   ├── libs                  # aws 유틸리티
│   │   │   │   ├── api-gateway.ts
│   │   │   │   ├── handler-resolver.ts
│   │   │   │   └── lambda.ts
│   │   │   ├── middleware            # 미들웨어 디렉터리
│   │   │   │   ├── authorizer.ts
│   │   │   │   └── firebaseConnect.ts
│   │   │   ├── model                 # 데이터베이스 모델
│   │   │   │   ├── account.ts
│   │   │   │   ├── accountGroup.ts
│   │   │   │   ├── user.ts
│   │   │   │   └── userActionLog.ts
│   │   │   ├── types
│   │   │   │   └── global.d.ts
│   │   │   ├── util                  # aws 제외 유틸리티
│   │   │   │   ├── crypto.ts
│   │   │   │   ├── firebase.ts
│   │   │   │   ├── mysql.ts
│   │   │   │   └── userActionLogger.ts
│   │   │   └── handlers.ts           # API 함수 설정 파일
│   │   ├── package.json
│   │   ├── serverless.ts
│   │   ├── tsconfig.json
│   │   └── yarn.lock
│   └── frontend
│       ├── public
│       │   ├── logo
│       │   │   ├── default_logo.png
│       │   │   ├── epic_games_logo.png
│       │   │   ├── facebook_logo.png
│       │   │   ├── google_logo.jpeg
│       │   │   ├── naver_logo.png
│       │   │   └── riot_games_logo.png
│       │   └── favicon.ico
│       ├── src
│       │   ├── bootstrap             # provider 등 선행작업 디렉터리
│       │   │   ├── Bootstrap.tsx
│       │   │   ├── Firebase.tsx
│       │   │   └── MaterialUI.tsx
│       │   ├── components            # 페이지 구성 컴포넌트
│       │   │   ├── sign
│       │   │   │   ├── SignIn.tsx
│       │   │   │   ├── SignOut.tsx
│       │   │   │   ├── SignUp.tsx
│       │   │   │   └── index.ts
│       │   │   ├── Account.tsx
│       │   │   ├── AccountBoard.tsx
│       │   │   ├── AccountCard.tsx
│       │   │   ├── AccountList.tsx
│       │   │   ├── AsyncBoundary.tsx
│       │   │   ├── Feedback.tsx
│       │   │   ├── Group.tsx
│       │   │   ├── GroupBoard.tsx
│       │   │   ├── Home.tsx
│       │   │   ├── ItemList.tsx
│       │   │   ├── Main.tsx
│       │   │   ├── Progress.tsx
│       │   │   ├── User.tsx
│       │   │   └── index.ts
│       │   ├── constants             # 환경변수 등 상수
│       │   │   ├── ENV.ts
│       │   │   └── SERVICES.ts
│       │   ├── helper                # 유틸리티 디렉터리
│       │   │   ├── axiosHandler.ts
│       │   │   ├── dateHelper.ts
│       │   │   ├── fetcher.ts
│       │   │   ├── firebaseHandler.ts
│       │   │   └── index.ts
│       │   ├── model                 # 데이터베이스 모델 타입
│       │   │   ├── account.ts
│       │   │   ├── accountGroup.ts
│       │   │   ├── index.ts
│       │   │   └── user.ts
│       │   ├── router                # 커스텀 라우터
│       │   │   ├── ProtectedRoute.tsx
│       │   │   └── index.ts
│       │   ├── store                 # recoil 상태 관리 디렉터리
│       │   │   ├── account.ts
│       │   │   ├── auth.ts
│       │   │   ├── feedback.ts
│       │   │   ├── group.ts
│       │   │   ├── index.ts
│       │   │   ├── password.ts
│       │   │   ├── selectorControl.ts
│       │   │   ├── style.ts
│       │   │   └── user.ts
│       │   ├── style
│       │   │   ├── Input.tsx
│       │   │   ├── Layout.tsx
│       │   │   ├── Text.tsx
│       │   │   ├── global.ts
│       │   │   └── index.ts
│       │   ├── types
│       │   │   └── global.d.ts
│       │   ├── validation            # 유효성 검증 디렉터리
│       │   │   ├── account.ts
│       │   │   ├── index.ts
│       │   │   ├── sign.ts
│       │   │   └── user.ts
│       │   ├── App.tsx
│       │   ├── main.tsx
│       │   └── vite-env.d.ts
│       ├── index.html
│       ├── package.json
│       ├── tsconfig.json
│       ├── vite.config.ts
│       └── yarn.lock
├── README.md
├── lerna.json
├── package.json
├── tsconfig.json
└── yarn.lock
```
