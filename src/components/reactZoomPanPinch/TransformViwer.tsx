import React from "react";
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
  imageSrc: string;
  alt?: string;
  isLoaded: boolean;
}

const TransformViwer = React.memo(
  ({ imageSrc, alt, isLoaded }: TransformViwerProps) => {
    // 내부 useEffect 제거 - 이미지 상태를 외부에서만 관리

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
                {isLoaded ? (
                  <img src={imageSrc} alt={alt} />
                ) : (
                  <div>Loading...</div>
                )}
              </TransformComponent>
            </div>
          </>
        )}
      </TransformWrapper>
    );
  }
);

export default TransformViwer;
