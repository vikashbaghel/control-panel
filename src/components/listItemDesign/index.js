import { Staff } from "../../assets/navbarImages";
import { CloseOutlined } from "@ant-design/icons";

export const ListItemDesign = ({ list }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 15,
        fontFamily: "Poppins",
      }}
    >
      <img
        src={list?.pic_url || list?.profile_pic_url || Staff}
        alt="img"
        width={30}
        height={30}
        style={{ borderRadius: "50%" }}
      />
      {list.name}
    </div>
  );
};

export const CustomerListItem = ({ list }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 15,
      }}
    >
      <img
        src={list.pic_url || Staff}
        alt="img"
        width={30}
        height={30}
        style={{ borderRadius: "50%" }}
      />
      <div>
        <div>{list.name}</div>
        <div style={{ color: "#727176", fontSize: ".9em" }}>
          {list.contact_person_name}
        </div>
      </div>
    </div>
  );
};

export const ListItemTag = ({ item }) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        fontSize: item?.value === -1 ? "inherit" : "10px",
        marginRight: "5px",
        borderRadius: "4px",
        paddingInline: "5px",
        background: "#0000000f",
      }}
    >
      <div>{item.label}</div>
      <CloseOutlined
        style={{
          color: "#00000073",
          cursor: "pointer",
          fontSize: 10,
        }}
        onClick={(e) => {
          e.stopPropagation();
          item.onClose();
        }}
      />
    </div>
  );
};
