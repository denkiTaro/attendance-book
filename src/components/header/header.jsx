
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
// import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';

/**
 * 
 * @param { { color: String } } props 
 * @returns 
 */
function Header( props ) {
  return(
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ background: (props.color)?props.color.toString():'#1976EB' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            デジタル出席簿(Digital&nbsp;Attendance&nbsp;Book)
          </Typography>
          <Button font href={ (()=>{ return (window.location.pathname === '/')?'/memory':'/' })() } sx={{color: '#fff', width: 'initial'}}>
            {
              (()=>{
                if( window.location.pathname === '/' ) {
                  return '→総合'
                } else {
                  return '→月間'
                }
              })()
            }
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  )
}


export default Header;
