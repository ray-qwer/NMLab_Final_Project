import react ,{useState,Component,useEffect,useContext} from 'react'
import  "../App.css"
import {useHistory} from 'react-router-dom' 
import {getTime} from '../utils/utils'
import {UserContext} from '../utils/ReducerContext'

function ResultList(){
    // for Testing, can delete them, be careful that at useState also need to reclaim them 
    const myFirstVote = {
        deadLine: "2021/6/8 21:00:00",
        title: "1st Vote",
        voteID: 1
    };
    const mySecVote = {
        deadLine: "2021/6/4 11:20:00",
        title: "2nd Vote",
        voteID: 2
    };
    // end testing
    const {uState,uDispatch,accounts,web3,contract} = useContext(UserContext);
    const [Result_list,setResult_list] = useState([myFirstVote,mySecVote]);
    const [time,setTime] = useState(Date.now())
    const history = useHistory();
    useEffect(()=>{
        const timer = setTimeout(() => {
            setTime(Date.now());
          }, 1000);
    },[time])
    const getResult_list = async() => {
        // get result list
        // getTime(deadline) == false if time out  // def in utils/utils.js
    }
    const goResult = (resultItem) => {
        var URL='/Result/'+resultItem.voteID;
        history.push(URL);
    }
    const renderResult_list = Result_list.map((ResultItem,i)=>
        
            <div className="VotingListItem" onClick={()=>goResult(ResultItem)}  key={i}>
                <div className="VotingListItemTitle">{ResultItem.title}</div>
                <div className="VotingListItemCountdown">Due at: {ResultItem.deadLine}</div>
            </div>
        
    );
    return (
        <div className="ResultList">
            {renderResult_list}
        </div>
    );
}

export default ResultList;