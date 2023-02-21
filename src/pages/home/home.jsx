import { lazy, Suspense } from "react";
import Footer from "../../components/footer/footer";
import Header from "../../components/header/header";
// import AttendanceTable from "../parts/attendanceTable";
const AttendanceTable = lazy( ()=> import('../parts/attendanceTable') );

export default function Home() {
    return(
        <div style={{height: '100%', userSelect: 'none'}}>
        <Header></Header>

        <Suspense fallback={<div>Loading...</div>}>
            <AttendanceTable></AttendanceTable>
        </Suspense>

        <Footer></Footer>
        </div>
    )
}

