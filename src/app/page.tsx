import { AlgorithmSwitcher } from "@/components/AlgorithmSwitcher";
// import SearchInput from "@/components/SearchInput";
import TextFilesList from "@/components/text-file-list";

export default function Home() {
  return (
    <div className="w-full h-screen ">
      <div className="w-full h-[100px] flex items-center justify-end">
        <AlgorithmSwitcher />
      </div>

      <div className="w-full h-[calc(100%-100px)] flex flex-col items-center ">
        {/* <SearchInput /> */}
        <TextFilesList />
      </div>
    </div>
  );
}
