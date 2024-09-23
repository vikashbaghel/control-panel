import { Image, Rate } from "antd";
import styles from "./recordActivity.module.css";
import pdfIcon from "../../assets/defaultPdf.svg";
import { CommentRender } from "./viewRecordActivityModal";
import {
  imgFormatCheck,
  timeZoneConversion,
} from "../../helpers/globalFunction";
import moment from "moment";

export default function PreviewFormValues({ formItems }) {
  return (
    <>
      {formItems?.map((ele) => {
        if (ele.name === "due_datetime" || !ele.value) return null;
        else if (ele.name === "comments") {
          return (
            <>
              <div className={styles.color_grey}>Comment :</div>
              <div className={styles.bold_black}>
                <CommentRender comment={ele.value} />
              </div>
            </>
          );
        } else if (ele.type === "FILE_UPLOAD") {
          return (
            <>
              <div className={styles.color_grey}>Photo / Images :</div>
              <div className={styles.flex_wrap}>
                {ele.img_urls.map((url) =>
                  imgFormatCheck(url) ? (
                    <Image
                      preview={{
                        mask: <div>Preview</div>,
                      }}
                      width="88px"
                      height="88px"
                      src={url}
                      alt={ele.name}
                      style={{ borderRadius: 10 }}
                    />
                  ) : (
                    <a
                      href={url}
                      target="_blank"
                      className={styles.download_link}
                      style={{
                        width: "88px",
                        height: "88px",
                        display: "flex",
                        justifyContent: "center",
                      }}
                      rel="noreferrer"
                    >
                      <img src={pdfIcon} alt="pdf" width={80} height={80} />
                    </a>
                  )
                )}
              </div>
            </>
          );
        } else if (ele.type === "RATING") {
          if (ele.value.split("/")[0] !== "0")
            return (
              <>
                <div className={styles.color_grey}>{ele.label} :</div>
                <div>
                  <Rate
                    count={Number(ele.value.split("/")[1])}
                    value={Number(ele.value.split("/")[0])}
                    disabled
                  />
                </div>
              </>
            );
        } else if (ele.type === "URL_INPUT" && ele.value) {
          return (
            <>
              <div className={styles.color_grey}>{ele.label}: </div>
              <div>
                <a
                  href={ele.value}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#1677ff" }}
                >
                  {ele.value}
                </a>
              </div>
            </>
          );
        } else if (ele.type === "DATE_TIME_PICKER") {
          return (
            <>
              <div className={styles.color_grey}>{ele.label}</div>
              <div className={styles.bold_black}>
                {ele.value ? timeZoneConversion(ele.value) : ""}
              </div>
            </>
          );
        } else if (ele.type === "DATE_PICKER") {
          return (
            <>
              <div className={styles.color_grey}>{ele.label} :</div>
              <div className={styles.bold_black}>
                {ele.value
                  ? moment(ele.value, "DD-MM-YYYY").format("DD-MMM-YYYY")
                  : ""}
              </div>
            </>
          );
        } else {
          return (
            <>
              <div className={styles.color_grey}>{ele.label} :</div>
              <div className={styles.bold_black}>{ele.value}</div>
            </>
          );
        }
      })}
    </>
  );
}
