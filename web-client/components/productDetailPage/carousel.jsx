import { Carousel } from "antd";
import Image from "next/image";

const CarouselFade = ({ imageList }) => {
  return (
    <Carousel>
      {imageList &&
        imageList.map((image, index) => {
          return (
            <div key={index}>
              <div
                className="position-relative"
                style={{ height: "600px", width: "100%" }}
              >
                <Image
                  className="rounded"
                  src={image}
                  fill
                  alt={`image-${index}`}
                  style={{ objectFit: "contain" }}
                />
              </div>
            </div>
          );
        })}
    </Carousel>
  );
};

export default CarouselFade;
