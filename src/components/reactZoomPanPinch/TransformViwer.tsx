import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { FiPlus, FiMinus } from "react-icons/fi";
import { IoReloadSharp } from "react-icons/io5";
import { ImageData } from "../../api/imageApi";

interface TransformViwerProps {
  currentImageSrcMetadata?: ImageData;
  isLoaded: boolean;
}

const TransformViwer = ({
  currentImageSrcMetadata = {
    id: 0,
    src: "",
    alt: "",
  },
}: TransformViwerProps) => {
  return (
    <TransformWrapper
      initialScale={1}
      initialPositionX={200}
      initialPositionY={100}
      disablePadding={true}
    >
      {({ zoomIn, zoomOut, resetTransform }) => (
        <div className="absolute inset-0 w-full h-full ">
          <div className="flex gap-1 tools absolute bottom-4 right-4 z-10  rounded">
            <button
              aria-label="확대"
              className="text-white bg-black/60 hover:bg-black/80 focus:bg-black/80 rounded cursor-pointer p-4"
              onClick={() => zoomIn()}
              tabIndex={0}
            >
              <FiPlus aria-hidden="true" />
            </button>
            <button
              aria-label="축소"
              className="text-white bg-black/60 hover:bg-black/80 focus:bg-black/80 rounded cursor-pointer p-4"
              onClick={() => zoomOut()}
              tabIndex={0}
            >
              <FiMinus aria-hidden="true" />
            </button>
            <button
              aria-label="배율 초기화"
              className="text-white bg-black/60 hover:bg-black/80 focus:bg-black/80 rounded cursor-pointer p-4"
              onClick={() => resetTransform()}
              tabIndex={0}
            >
              <IoReloadSharp aria-hidden="true" />
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
              src={currentImageSrcMetadata.src}
              alt={currentImageSrcMetadata.alt}
              className="w-full h-full object-cover"
            />
          </TransformComponent>
        </div>
      )}
    </TransformWrapper>
  );
};

export default TransformViwer;
