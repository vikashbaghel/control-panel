import { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";
import filterService from "../../services/filter-service";
import { useNavigate } from "react-router";
import GallerySorting from "./GallerySorting";
import RecentSorting from "./recentSorting";
import PicDetail from "./PicDetail";
import { Divider } from "antd";
import axios from "axios";
import { BASE_URL_V2, auth_token, org_id } from "../../config";
import GalleryFilter from "./GalleryFilter";
import { Col, Row, Modal, Image, Layout } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import "./galleryStyles.css";
import ViewRecordActivityComponent from "../../components/activityModal/viewRecordActivityModal";
import InfiniteScroll from "react-infinite-scroll-component";
import AttendanceDetailView from "../../components/attendance/attendanceDetailView";

const { Sider } = Layout;

const PictureGallery = () => {
  //   state to manage inifnity loop
  const [PictureData, SetPictureData] = useState([]);
  const [pageNo, setPageNo] = useState(-1);
  const [hasMore, setHasMore] = useState(true);

  const [attendanceDetailOpen, setAttendanceDetailOpen] = useState({
    open: false,
    detail: {},
  });

  const [galleryModal, setGalleryModal] = useState({
    open: false,
    imageUrl: "",
    data: null,
  });

  const [activityId, setActivityId] = useState();
  const [activeFilters, setActiveFilters] = useState({});

  const fetchData = async (page_no) => {
    const url = `${BASE_URL_V2}/organization/${org_id}/activity/gallery/`;
    const headers = { Authorization: auth_token };
    const params = {
      page_no,
      user_id: activeFilters?.user_id,
      module_type: activeFilters?.module_type,
      module_id: activeFilters?.module_id,
      sub_module_type: activeFilters.all_activities
        ? []
        : activeFilters?.sub_module_type,
      user_ids: activeFilters?.user_ids,
      customer_ids: activeFilters?.customer_ids,
      by_date_range:
        activeFilters?.by_date_range === "Custom Range"
          ? activeFilters?.start_date
            ? "Custom"
            : ""
          : activeFilters?.by_date_range || "Month",
      start_date: activeFilters?.start_date,
      end_date: activeFilters?.end_date,
      sort_by: activeFilters?.sort_by,
      sort_order: activeFilters?.sort_order,
      state: activeFilters?.state,
    };
    const galleryData = await axios.get(url, { headers, params });
    if (galleryData?.data?.data?.length < 30) setHasMore(false);
    return galleryData?.data?.data;
  };

  const resetPage = () => {
    SetPictureData([]);
    setHasMore(true);
    setPageNo(-1);
  };

  const applyFilters = (filters) => {
    filterService.setFilters({
      ...filters,
    });
    resetPage();
  };

  //Do not change useEffect priority
  useEffect(() => {
    filterService.setEventListener(setActiveFilters);
  }, []);

  useEffect(() => {
    setActiveFilters({
      ...filterService.getFilters(),
    });
  }, []);

  useEffect(() => {
    if (pageNo === -1) {
      setPageNo(1);
    } else {
      fetchData(pageNo).then((newData) => {
        if (pageNo === 1) {
          SetPictureData(newData);
        } else SetPictureData(PictureData.concat(newData));
      });
    }
  }, [pageNo]);

  return (
    <>
      <AdminLayout
        title={
          <>
            Picture Gallery
            <div
              style={{
                display: "flex",
                justifyContent: "end",
                marginLeft: "auto",
              }}
            >
              {" "}
              <GallerySorting
                selectedValue={(data) => {
                  applyFilters({
                    page: "",
                    ...data,
                  });
                }}
                value={activeFilters}
              />
              <RecentSorting
                selectedValue={(data) => {
                  applyFilters({ page: "", ...data });
                }}
                value={activeFilters}
              />
            </div>
          </>
        }
      >
        <div className="product-layout">
          <Sider width={250}>
            <GalleryFilter
              value={activeFilters}
              onChange={(params) => {
                applyFilters({ page: "", ...params });
              }}
            />
          </Sider>

          <div style={{ width: "100%" }}>
            {PictureData && PictureData.length > 0 ? (
              <InfiniteScroll
                className="picture-list"
                dataLength={PictureData.length}
                next={() => {
                  const page = pageNo + 1 || 1;
                  setPageNo(page);
                }}
                hasMore={hasMore}
                height={550}
                loader={
                  hasMore === true ? (
                    <h4 style={{ textAlign: "center" }}>Loading...</h4>
                  ) : (
                    <></>
                  )
                }
                scrollableTarget="scrollableDiv"
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: "1.5em",
                    overflowY: "auto",
                    scrollbarWidth: "revert",
                  }}
                >
                  {PictureData.map((picture, index) => (
                    <div
                      style={{ maxHeight: "200px" }}
                      className="gallery-img clickable"
                    >
                      <img
                        src={picture.image_url}
                        alt={`imgs ${index + 1}`}
                        loading="eager"
                        style={{
                          objectFit: "cover",
                          borderRadius: "10px",
                          height: "100%",
                          width: "100%",
                        }}
                        onClick={() => {
                          setGalleryModal({
                            open: true,
                            imageUrl: picture.image_url,
                            data: picture,
                          });
                        }}
                      />
                    </div>
                  ))}
                </div>
              </InfiniteScroll>
            ) : (
              <div>No images available</div>
            )}
          </div>
        </div>

        <Modal
          footer={[null]}
          width={700}
          open={galleryModal.open}
          centered
          onOk={() => setGalleryModal({ open: false, imageUrl: "" })}
          onCancel={() => setGalleryModal({ open: false, imageUrl: "" })}
          okButtonProps={{ disabled: true }}
          cancelButtonProps={{ disabled: true }}
          className="gallery-modal"
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
            }}
          >
            <div style={{ padding: "5px" }}>
              <Image
                src={galleryModal.imageUrl}
                alt="Preview"
                style={{ width: "360px", height: "460px", objectFit: "cover" }}
              />
            </div>
            <Divider type="vertical" />
            <div style={{ display: "flex", alignContent: "center" }}>
              {PictureData && PictureData.length > 0 ? (
                <PicDetail
                  data={galleryModal?.data}
                  setActivityId={(id) =>
                    galleryModal.data?.module_type === "Attendance"
                      ? setAttendanceDetailOpen({
                          open: true,
                          detail: {
                            ...galleryModal.data,
                            action:
                              galleryModal.data.sub_module_type ===
                                "FULL_DAY" ||
                              galleryModal.data.sub_module_type === "HALF_DAY"
                                ? "Check Out"
                                : "Check In",
                          },
                        })
                      : setActivityId(id)
                  }
                />
              ) : (
                <p>No pictures available</p>
              )}
            </div>
          </div>
        </Modal>
        {galleryModal.data?.module_type === "Attendance" ? (
          <AttendanceDetailView
            {...{ attendanceDetailOpen, setAttendanceDetailOpen }}
          />
        ) : (
          <ViewRecordActivityComponent
            {...{ activityId }}
            onClose={() => {
              setActivityId();
            }}
            type="drawer"
          />
        )}
      </AdminLayout>
    </>
  );
};

export default PictureGallery;
