'use client'
import SimpleButton from "@/components/SimpleButton";

export default function HelloWorld() {
  const handleOnClick = () => {
    console.log('Clicked from Hello World');
  }
  return (
    <>
      <h1 className="text-3xl font-bold">
        Hello, World!
      </h1>
      <SimpleButton text={'From HelloWorld'} onClick={handleOnClick}/>
    </>
  );
}

