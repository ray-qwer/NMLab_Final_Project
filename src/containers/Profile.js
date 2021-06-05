import React,{useContext} from 'react'
import {UserContext} from '../utils/ReducerContext'
function Profile() {
    const {uState,uDispatch} = useContext(UserContext);
    return (
        <div>
            <p> UserID: {uState.id}</p>
            <button onClick={()=>{console.log(uState)}}>click</button>
        </div>
    );
}

export default Profile;