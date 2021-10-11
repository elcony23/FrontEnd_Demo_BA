import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';

interface LoaderProps{
    message:string
    open:boolean
}
const Loader :React.FC<LoaderProps> = ({open,message}) => {
    return(<Dialog open={open} fullScreen>
        <div style={{display:'flex',flexDirection:'column',width:'100%',height:'100%',justifyContent:'center',alignItems:'center'}}>
            <CircularProgress size={80}/>
            <br/>
            <br/>
            <strong>{message}</strong>
       </div>
        </Dialog>)
}

export default Loader
