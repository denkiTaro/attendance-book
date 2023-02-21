import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableHead, Button, TextField, Card } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DataOperate from '../../stores/operate';
import Popup from './popup';


// Table編集ゾーン
/**
 * 
 * ユーザを編集するボタンも含める
 * @param { { 'users': Array, button: true|false } } props 
 */
function UserNamesTable(props) {
  const [openV, setOpenV] = React.useState(false);
  const [editV, setEditV] = React.useState(false);
  const [remV, setRemV] = React.useState(false);
  const [addV, setAddV] = React.useState(false);
  const [selectUser, setSelectUser] = React.useState('');
  if (props.users.length === 0) return <TableRow><TableCell>Loading...:users</TableCell></TableRow>;

  return (
    <TableRow sx={{ display: 'flex', flexFlow: 'column', width: 160, borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
      {/* 一時表示部分 */}
      {
        (() => {
          if (props.button) return <TableCell sx={{ height: 56.6666 }}><Button onClick={() => { setOpenV(true) }}>ユーザー編集</Button></TableCell>;
          if (!props.button) return <TableCell sx={{ height: 56.6666 }}></TableCell>
        })()
      }
      {/* popup ============================================================== */}
      <Popup open={openV} closeFunc={() => { setOpenV(false) }} element={
        <TableRow sx={{ display: 'flex', flexFlow: 'column' }}>

          <TableCell sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button onClick={() => { setAddV(true) }}>ユーザーを追加</Button>
          </TableCell>
          {
            props.users.map((user) =>
              <TableCell key={user}>
                <Button onClick={() => { setSelectUser(user); setRemV(true) }} size='small' sx={{ color: 'red' }}>除外</Button>
                <Button onClick={() => { setSelectUser(user); setEditV(true) }} size='small'><EditIcon></EditIcon></Button>
                {user}
              </TableCell>)
          }

          <Popup open={addV} closeFunc={() => { setAddV(false) }} element={
            <Card sx={{ display: 'flex', flexFlow: 'column', justifyContent: 'center', padding: 4 }}>
              test
            </Card>
          } />
          <Popup open={editV} closeFunc={() => { setEditV(false) }} element={
            <Card sx={{ display: 'flex', flexFlow: 'column', justifyContent: 'center', padding: 4 }}>
              {selectUser}
              を次のように変更
              <TextField sx={{ height: 64 }} autoComplete='off' id="remVInput" defaultValue={selectUser}
                label="(~) は使用不可" variant="standard" />
              <Button onClick={() => { setEditV(false) }}>名前を変更する</Button>
            </Card>
          } />
          <Popup open={remV} closeFunc={() => { setRemV(false) }} element={
            <Card sx={{ display: 'flex', flexFlow: 'column', justifyContent: 'center', padding: 4 }}>
              {selectUser}
              <Button onClick={() => { setRemV(false); DataOperate.user.removeUser(selectUser) }}>除外する</Button>
            </Card>
          } />

        </TableRow>
      } />
      {/* popup =================================================================== */}

      {
        props.users.map((user) =>
          <TableCell sx={{ height: 56.66666, ':hover': { background: 'orange' } }} key={user}>
            {user}
          </TableCell>
        )
      }
    </TableRow>
  )
}



// main table
/**
 * 
 * @param { { 'stateData': Object , 'users': Array } } props 
 */
function DayAndStatusTable(props) {
  const dailyData = props.stateData;
  const [selectUser, setSelectUser] = React.useState('');
  const [textFieldOpenV, setTextFieldOpenV] = React.useState(false);
  const [reconfirmation, setReconfirmation ] = React.useState(false);
  const [comTxt, setComTxt] = React.useState('');
  if (dailyData.length === 0) return <TableRow><TableCell>Loading...:stateData</TableCell></TableRow>
  function createDayTitle(day) {
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    return day + ' ' + days[new Date(day).getDay()];
  }
  return (
    <>
    {
      Object.keys(dailyData).sort().map((day, dayI) => {
        return (
          <TableRow sx={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(224, 224, 224, 1)', td: { lineHeight: 1 } }} key={dayI} >
            <TableCell
              sx={
                (() => {
                  if (day === new Date().toLocaleDateString().split(' ')[0]) {
                    return { height: 56.6666, width: 112, color: '#fff', background: '#1976d2' }
                  } else {
                    return { height: 56.6666, width: 112 }
                  }
                })()
              }
            >{createDayTitle(day)}</TableCell>

            {
              props.users.map((user, userI) => {
                const stateTxt = dailyData[day][user] ||= '-';
                const r = { height: 56.666666, width: 112, textAlign: 'center', overflow: 'hidden', ':hover': { padding: 0, overflowX: 'auto', height: 'auto', minHeight: 56.6666, background: 'skyblue' } };
                return (
                  <TableCell
                    sx={
                      (() => {
                        // 一番右のDayAndStatusTableを設定
                        if( dayI !== Object.keys(dailyData).length - 1) r[':hover'] = {};
                        if( userI % 2 !== 0) r['background'] = 'rgba(0, 0, 0, 0.2)';
                        if( stateTxt === '出席') {
                          r['color'] = '#1976d2';
                        } else
                        if( stateTxt === '欠席') {
                          r['color'] = 'red';
                        }
                        return r;
                      })()
                    }
                    onDoubleClick={(e) => {
                      if( day !== new Date().toLocaleDateString().split(' ')[0] )return;
                      setComTxt('');
                      setSelectUser(user);
                      if( stateTxt === '出席' || stateTxt === '欠席' || stateTxt === '-' ) {
                        DataOperate.toggle.doubleClick( user, stateTxt );
                      } else {
                        setReconfirmation(true);
                      }

                      if( stateTxt === '欠席' ) {
                        setTextFieldOpenV(true);
                      }
                    }}
                    key={userI}
                  >
                    {stateTxt}
                  </TableCell>
                )
              }
              )
            }

          </TableRow>
        )
      }
      )
    }
    {/* popup ====================================================================================================== */}
      <Popup open={textFieldOpenV} closeFunc={()=>{setTextFieldOpenV(false)}} element={
        <Card sx={{ display: 'flex', flexFlow: 'column', padding: 2 }}>
          <TextField multiline autoComplete='off' id="comInput" label="コメントを入力" variant="standard" onChange={(e)=>setComTxt(e.target.value)} />
          <Button onClick={()=>{setTextFieldOpenV(false);DataOperate.state.editStatus([selectUser, comTxt])}}>送信</Button>
        </Card>
      }
      />

      <Popup open={reconfirmation} closeFunc={()=>{setReconfirmation(false)}} element={
        <Card sx={{display: 'flex', flexFlow: 'column'}}>
          コメントを更新(コメントは削除される)
          <Button onClick={()=>{setReconfirmation(false);DataOperate.state.editStatus([selectUser, ''])}}>更新</Button>
        </Card>
      }
      />
    {/* popup ====================================================================================================== */}
    </>
  )
}




// 本体ゾーン
/**
 * 
 * @param { {mode: 'initial' | 'demo'| 'showAll' } } props 
 * @returns 
 */
function AttendanceTable(props) {
  const [initialUsers, initialStateData] =
    (props.mode === 'demo')
      ? [['U1', 'U2', 'U3'], { '2010/10/10': { 'U1': true }, '2010/10/11': { 'U2': false }, '2010/10/12': { 'U3': 'コメント' } }]
      : [[], []];
  const [users, setUsers] = React.useState(initialUsers);
  const [stateData, setStateData] = React.useState(initialStateData);

  React.useEffect(() => {
    if (props.mode === 'demo') return;
    DataOperate.onSnapshot((data) => {
      if(!(new Date().toLocaleDateString().split(' ')[0] in data['state-data']))DataOperate.state.addToday();
      setUsers(data.users.sort());
      setStateData(data['state-data']);
    });
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 64, display: 'flex', flexFlow: 'row-reverse', overflowX: 'scroll' }} aria-label="simple table">

        {/* リバースしてるので逆 */}
        {/* 一番右のtable */}
        <TableHead>
          <UserNamesTable button users={users}></UserNamesTable>
        </TableHead>
        {/* 一番右のtable */}
        {/* ============================================= */}
        {/* 出席状況表 */}
        <TableBody sx={{ display: 'flex' }}>
          <DayAndStatusTable stateData={stateData} users={users}></DayAndStatusTable>
        </TableBody>
        {/* 出席状況表 */}
        {/* ============================================= */}
        {/* 一番左のtable */}
        <TableHead>
          <UserNamesTable users={users}></UserNamesTable>
        </TableHead>
        {/* 一番左のtable */}
      </Table>
    </TableContainer>
  );
}




export default AttendanceTable;
