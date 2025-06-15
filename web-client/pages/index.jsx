import Slider from "@/components/slider";
import { ArrowUpOutlined } from "@ant-design/icons";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="homepage">
      <div className="container-fluid g-0">
        <Slider />
      </div>
    </div>
  );
}
