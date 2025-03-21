import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { FiPlus, FiMinus } from "react-icons/fi";
import { IoReloadSharp } from "react-icons/io5";

interface TransformViwerProps {
  imageSrc: string;
  alt?: string;
  isLoaded: boolean;
}

const TransformViwer = ({ imageSrc, alt }: TransformViwerProps) => {
  return (
    <TransformWrapper
      initialScale={1}
      initialPositionX={200}
      initialPositionY={100}
      disablePadding={true}
    >
      {({ zoomIn, zoomOut, resetTransform }) => (
        <div className="absolute inset-0 w-full h-full ">
          <div className="flex gap-1 tools absolute bottom-4 right-4 z-10 bg-black/50 rounded">
            <button
              aria-label="확대"
              className="text-white bg-black/70 hover:bg-black/50 rounded  p-2"
              onClick={() => zoomIn()}
            >
              <FiPlus />
            </button>
            <button
              aria-label="축소"
              className="text-white bg-black/70 hover:bg-black/50 rounded  p-2"
              onClick={() => zoomOut()}
            >
              <FiMinus />
            </button>
            <button
              aria-label="배율 초기화"
              className="text-white bg-black/70 hover:bg-black/50 rounded  p-2"
              onClick={() => resetTransform()}
            >
              <IoReloadSharp />
            </button>
          </div>
          <TransformComponent
            wrapperStyle={{
              width: "100%",
              height: "100%",
              overflow: "hidden",
            }}
            contentStyle={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={imageSrc}
              alt={alt}
              className="w-full h-full object-cover"
            />
          </TransformComponent>
        </div>
      )}
    </TransformWrapper>
  );
};

export default TransformViwer;
