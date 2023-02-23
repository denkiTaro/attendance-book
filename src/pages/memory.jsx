import Footer from "../components/footer/footer";
import Header from "../components/header/header";
import AttendanceTable from "./parts/attendanceTable";

function Memory() {
    return (
        <div>
            <Header color="orange"></Header>
            <AttendanceTable mode='data'></AttendanceTable>
            <Footer></Footer>
        </div>
    )
}

export default Memory;
