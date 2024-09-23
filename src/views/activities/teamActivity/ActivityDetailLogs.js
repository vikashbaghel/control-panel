import StaffActivityDetails from "./StaffActivityDetails";
import TCPCDetails from "./TCPCDetails";
import { useParams } from "react-router-dom";

export default function ActivityDetailLogs() {
  const { id } = useParams();

  const activePage = {
    tc: <TCPCDetails />,
    pc: <TCPCDetails />,
    staff: <StaffActivityDetails />,
  };
  return <>{activePage[id]}</>;
}
