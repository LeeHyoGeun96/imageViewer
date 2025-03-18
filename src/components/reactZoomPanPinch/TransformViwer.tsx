import {
  TransformWrapper,
  TransformComponent,
  useControls,
} from "react-zoom-pan-pinch";

const Controls = () => {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <div className="flex gap-2 tools absolute bottom-0 right-0 z-10">
      <button onClick={() => zoomIn()}>+</button>
      <button onClick={() => zoomOut()}>-</button>
      <button onClick={() => resetTransform()}>x</button>
    </div>
  );
};

interface TransformViwerProps {
  imageSrc: string; // 이미지 경로를 props로 받음
  alt?: string; // 대체 텍스트(옵션)
}

const TransformViwer = ({ imageSrc, alt }: TransformViwerProps) => {
  return (
    <TransformWrapper
      initialScale={1}
      initialPositionX={200}
      initialPositionY={100}
      wheel={{
        step: 100,
      }}
    >
      {() => (
        <>
          <div className="relative">
            <Controls />
            <TransformComponent>
              <img src={imageSrc} alt={alt} />
            </TransformComponent>
          </div>
        </>
      )}
    </TransformWrapper>
  );
};

export default TransformViwer;
