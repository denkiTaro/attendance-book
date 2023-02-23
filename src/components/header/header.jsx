
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
// import IconButton from '@mui/material/IconButton';

/**
 * 
 * @param { { element: HTMLElement } } props 
 * @returns 
 */
function Header( props ) {
  return(
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            デジタル出席簿(Digital&nbsp;Attendance&nbsp;Book)
          </Typography>
          {
            props.element
          }
        </Toolbar>
      </AppBar>
    </Box>
  )
}


export default Header;
