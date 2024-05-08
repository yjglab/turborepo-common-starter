# Turborepo-common-starter

##### 구조 설명

- 모든 프로젝트는 apps 디렉터리에서 관리되어야 합니다.
- 모든 패키지는 packages 디렉터리에서 관리되어야 합니다.
- 모든 프로젝트는 공용 패키지의 의존성을 주입하고자 할 때 반드시 packages 디렉터리에 존재하는 패키지만 포함되어야 합니다. (tsconfig/eslint/ui 등)

> packages

##### /eslint-config: 모든 프로젝트 공용 ESlint 설정 파일입니다.

##### /typescript-config: 모든 프로젝트 공용 TypeScript 설정 파일입니다.

##### /ui: 모든 프로젝트 공용 UI 컴포넌트 패키지입니다.

- src/components/parts: 컴포넌트 부품 폴더
- src/components/ui: Shadcn 컴포넌트 폴더
- src/tailwind.config.ts: 공용 TailwindCSS 설정 파일

> apps

##### /client-next: NextJS 프로젝트입니다.

- NextJS@14
- React@18
- TailwindCSS@3

##### /client-next-zustand: NextJS 프로젝트에 클라이언트 상태관리 라이브러리가 추가되어있습니다.

- NextJS@14
- React@18
- TailwindCSS@3
- Zustand@4

##### /client-next-tanstack-recoil: NextJS 프로젝트에 클라이언트/서버 상태관리 라이브러리가 추가되어있습니다.

- NextJS@14
- React@18
- TailwindCSS@3
- Recoil@0
- Tanstack-Query@5

##### /client-next-tanstack-zustand: NextJS 프로젝트에 클라이언트/서버 상태관리 라이브러리가 추가되어있습니다.

- NextJS@14
- React@18
- TailwindCSS@3
- Zustand@4
- Tanstack-Query@5

##### /server-nest-prisma: NestJS와 Prisma ORM으로 구성된 프로젝트입니다.

- NestJS@10
- Prisma@5 + MongoDB

##### /server-nest-prisma-redis: NestJS와 Prisma ORM 프로젝트에 세션 관리용 Redis/Socket 모듈이 추가되어있습니다.

- NestJS@10
- Prisma@5 + MongoDB
- Redis + Socket.io

##### /server-nest-mailer: NestJS 프로젝트에서 사용할 수 있는 메일 전송 작업 큐 모듈입니다.

- NestJS@10
- Nest-mailer@2
- Redis

> Launch Guide

##### 모든 프로젝트 의존성 패키지 설치

```
pnpm install
```

##### 모든 프로젝트 빌드

```
pnpm build
```

##### Shadcn UI 추가

```
pnpm ui:add
```

##### Component 추가

```
src/components/ 에 새 공유 디렉터리 생성 후 컴포넌트 export.
```

##### 새 프로젝트 모듈 추가

```
turbo gen workspace --copy
pnpm install
```
