import { Button } from "@repo/ui/components/ui/button";
import ActionButton from "@repo/ui/components/parts/ActionButton";
import MainButton from "./_components/MainSection/MainButton";

export default function Page() {
  return (
    <main className="justify-center text-xl flex flex-col items-center min-h-screen space-y-8 bg-black text-white">
      <h1 className="font-bold">
        Turborepo Starter - Client: (NextJS/Zustand/Tanstack-Query)
      </h1>
      <ActionButton>공유 컴포넌트 테스트 버튼</ActionButton>
      <Button className="bg-indigo-500">Shadcn 컴포넌트 테스트 버튼</Button>
      <MainButton />
      <text className="text-xs">Generated By Jaekyeong Yuk</text>
    </main>
  );
}
