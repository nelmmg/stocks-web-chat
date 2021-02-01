import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import { Avatar, IconButton } from "@material-ui/core";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { SearchOutlined } from "@material-ui/icons";
import SidebarStock from "./SidebarStock";
import db from './firebase';
import firebase from 'firebase/app';
import { useHistory } from "react-router-dom";
import { useStateValue } from './StateProvider';

const auth = firebase.auth();

function Sidebar(props) {

    const [stocks, setstocks] = useState([]);
    const user = auth.currentUser;
    const history = useHistory();
    let firstStock = true;


    useEffect(() => {
        const unsubscribe = db.collection('stocks').orderBy("lastMessage", "desc").onSnapshot(snapshot => {

            setstocks(snapshot.docs.map(doc => (
                {
                    id: doc.id,
                    data: doc.data()
                }
            )));

            if (snapshot.size > 0 && firstStock) {
                let id = snapshot.docs[0].id;
                history.push('/stocks/' + id);
                firstStock = false;
            }

            if (snapshot.size == 0) {
                firstStock = true;
            }
        });

        return () => {
            unsubscribe();
        }
    }, []);


    return (
        <div className="sidebar">
            <div className="sidebar_header">
                <div className="sidebar_headerLeft">
                    <Avatar src={user?.photoURL} />
                    <h3>{user?.displayName}</h3>
                </div>
                <div className="sidebar_headerRight">
                    <IconButton onClick={() => auth.signOut()}>
                        <ExitToAppIcon />
                    </IconButton>
                </div>
            </div>
            {/* <div className="sidebar_search">
                <div className="sidebar_searchContainer">
                    <SearchOutlined />
                    <input type="text" placeholder="Search or start new stock" />
                </div>
            </div> */}
            <div className="sidebar_stocks">
                <SidebarStock addNewStock />
                {stocks.map(room => (
                    <SidebarStock key={room.id} id={room.id} logo={room.data.logo} name={room.data.name} symbol={room.data.symbol} />
                ))}
            </div>

        </div>
    );
}

export default Sidebar;