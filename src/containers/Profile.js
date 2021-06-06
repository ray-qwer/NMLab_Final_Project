import React,{useContext} from 'react'
import {UserContext} from '../utils/ReducerContext'
function Profile() {
    const {uState,uDispatch} = useContext(UserContext);
    return (
        <div>
            <p> UserID: {uState.id}</p>
        </div>
    );
}

export default Profile;