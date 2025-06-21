import Image from "next/image";
import Link from "next/link";
import logo from "@/public/img/logo-1.png";

const Footer = () => {
  return (
    <footer className="footer d-none d-md-block">
      <div className="container g-0">
        <div className="footer-sidebar row g-0">
          <Link className="logo" href="/">
            <Image src={logo} width={100} height={50} alt="" />
          </Link>
          <div className="footer-comment col-lg-4 pe-lg-2">
            <p>
              Chúng tôi luôn trân trọng và mong đợi nhận được mọi ý kiến đóng
              góp từ khách hàng để có thể nâng cấp trải nghiệm dịch vụ và sản
              phẩm tốt hơn nữa.
            </p>
            <h4>ĐĂNG KÝ NHẬN TIN </h4>
            <p>Hãy là người đầu tiên nhận khuyến mãi lớn!</p>
            <form className="newsletter-form d-flex">
              <input
                type="email"
                className="form-control me-2"
                placeholder="Nhập email của bạn"
              />
              <button type="submit" className="btn btn-primary">
                Đăng ký
              </button>
            </form>
          </div>
          <div className="footer-contact col-lg-4 px-lg-2">
            <div className="d-flex justify-content-lg-center">
              <div className="d-inline-block">
                <h4 className="mb-4">Liên hệ</h4>
                <div className="contact-item d-flex align-items-center mb-4 mb-lg-2">
                  <div className="contact-icon d-inline-block">
                    <Image
                      src={"/img/footer/iconHotline.svg"}
                      width={25}
                      height={30}
                      alt="icon-hotline"
                    />
                  </div>
                  <div className="contact-content">
                    <p>Tổng đài CSKH: 02873066060</p>
                  </div>
                </div>
                <div className="contact-item d-flex align-items-center mb-4 mb-lg-2">
                  <div className="contact-icon d-inline-block">
                    <Image
                      src={"/img/footer/iconEmail.svg"}
                      width={30}
                      height={30}
                      alt="icon-hotline"
                    />
                  </div>
                  <div className="contact-content">
                    <p>Email: cskh@icondenim.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-address col-lg-4 ps-lg-2 mt-md-4 mt-lg-0">
            <h4>Địa chỉ</h4>
            <p className="mb-1">CÔNG TY TNHH iCOND</p>
            <p className="mb-1">VQCR+GP6, khu phố 6, Thủ Đức, Hồ Chí Minh</p>
            <p className="mb-0">Giờ làm việc: Thứ 2 - CN (8:30 - 22:00)</p>
          </div>
        </div>
        <div className="footer-after row g-0 pt-3">
          <div className="copyright col col-lg-8 pe-1">
            <h5 className="copyright-title">@CÔNG TY TNHH iCOND</h5>
            <p className="copyright-description">
              Mã số doanh nghiệp: 1429837435.
            </p>
          </div>
          <div className="logo col col-lg-4 d-flex justify-content-end ps-1">
            <div className="logo-item d-inline me-3">
              <Image
                src={"/img/footer/logoDMCA.png"}
                width={121}
                height={68}
                alt="logo-dmca"
              />
            </div>
            <div className="logo-item d-inline me-3">
              <Image
                src={"/img/footer/logoIQC.png"}
                width={59}
                height={61}
                alt="logo-iqc"
              />
            </div>
            <div className="logo-item d-inline">
              <Image
                src={"/img/footer/logoSaleNoti.png"}
                width={159}
                height={61}
                alt="logo-sale-noti"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
