// import SearchInput from "@/components/SearchInput";
// import TextFilesList from "@/components/text-file-list";
import GenerateInvertedIndexButton from "@/components/create-reversed-index";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import SearchComponent from "@/components/SearchInput";

export default function Home() {
  return (
    <MaxWidthWrapper>
      <div className="w-full h-screen ">
        <div className="w-full h-[100px] flex items-center justify-end">
          <GenerateInvertedIndexButton />
        </div>

        <div className="w-full h-[calc(100%-100px)] flex flex-col items-center ">
          {/* <SearchInput /> */}
          <SearchComponent />
          {/* <TextFilesList /> */}
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
