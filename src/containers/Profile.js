import React,{useContext} from 'react'
import {UserContext} from '../utils/ReducerContext'
import Button from '@material-ui/core/Button'
import {useHistory} from 'react-router-dom'
function Profile() {
    const {uState,accounts,web3,contract} = useContext(UserContext);
    const history = useHistory();
    return (
        <div>
            <p> UserID: {uState.id}</p>
            {uState.isLogin?(<></>):(<>
                <Button onClick={()=>{history.push("/LogIn")}}>Log in</Button>
            </>)}
        </div>
    );
}

export default Profile;