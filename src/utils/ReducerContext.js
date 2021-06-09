import React,{createContext} from 'react';

export const UserReducer = (state,action)=>{
    switch(action.type){
        case 'LOGIN':
            return{
                id:action.payload.UserId,
                isManager: action.payload.isManager,
                isLogin: action.payload.isLogin
            }
        case 'LOGOUT':
            return{
                id:action.payload.UserId,
                isManager: action.payload.isManager,
                isLogin: false
            }
        default:
            return state;
    }
};



export const UserContext =createContext({
    id:"Customer",
    isManager:false,
    isLogin: false,
    web3: null,
    contract: null,
    accounts: []
}); 