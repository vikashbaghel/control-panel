import { Tooltip } from "antd";
import { useEffect, useRef, useState } from "react";

export default function WrapText({ children, len = 0, width = 0 }) {
  const textNode = useRef();
  const [isToolTip, setisToolTip] = useState(false);

  const Parent = (props) => {
    return isToolTip ? (
      <Tooltip {...props} title={children} placement="topLeft" />
    ) : (
      <div {...props} />
    );
  };

  useEffect(() => {
    if (
      (width &&
        textNode.current &&
        textNode.current.scrollWidth > textNode.current.offsetWidth) ||
      (len && children?.length > len)
    ) {
      setisToolTip(true);
    } else setisToolTip(false);
  }, [children, len, width]);

  if (!children) return "";

  return (
    <Parent>
      <div
        ref={textNode}
        style={{
          ...(width !== 0 && {
            maxWidth: width,
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }),
          textTransform: "capitalize",
          wordBreak: "break-word",
        }}
      >
        {len && children.length > len
          ? children.slice(0, len) + "..."
          : children}
      </div>
    </Parent>
  );
}
