import React, { useEffect, useState, useNatigate } from 'react';
import { Redirect } from 'react-router-dom'
import { Avatar } from "@material-ui/core";
import './SidebarStock.css';
import db from './firebase';
import firebase from 'firebase';
import { Link } from 'react-router-dom';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import ConfirmDialog from './ConfirmDialog';

import { useHistory } from "react-router-dom";

function SidebarStock({ id, name, logo, symbol, addNewStock }) {
    const [messages, setMessages] = useState("");
    const [confirmOpen, setConfirmOpen] = React.useState(false);
    const history = useHistory();

    const finnhub_key = process.env.REACT_APP_FINNHUB_KEY;

    useEffect(() => {
        if (id) {
            db.collection('stocks').doc(id).collection('messages').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
                setMessages(snapshot.docs.map((doc) => doc.data()))
            })
        }
    }, [id]);

    const createStock = () => {
        const stockSymbol = prompt("Please enter the stock symbol");
        if (stockSymbol) {
            const stockURL = "https://finnhub.io/api/v1/stock/profile2?symbol=" + stockSymbol + "&token=" + finnhub_key;
            fetch(stockURL)
                .then(res => res.json())
                .then((data) => {
                    if (data.name) {
                        checkAndSaveStock(stockSymbol, data);
                    }
                    else {
                        alert("Error getting stock, check symbol");
                    }
                })
                .catch(console.log)
        }
    };


    const checkAndSaveStock = (stockSymbol, data) => {
        db.collection("stocks").where("symbol", "==", stockSymbol)
            .get()
            .then(function (querySnapshot) {
                if (querySnapshot.size > 0) {
                    alert("Stock already exists!");
                }
                else {
                    db.collection("stocks").add({
                        name: data.name,
                        logo: data.logo,
                        symbol: stockSymbol,
                        lastMessage: firebase.firestore.FieldValue.serverTimestamp(),
                    })
                }
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });
    }

    const deleteStock = (stockSymbol) => {
        db.collection("stocks").where("symbol", "==", stockSymbol)
            .get()
            .then(function (querySnapshot) {
                const id = querySnapshot.docs[0].id;
                querySnapshot.docs[0].ref.delete();

                var segment_str = window.location.pathname;
                var segment_array = segment_str.split('/');
                var last_segment = segment_array.pop();
                if (last_segment == id) {
                    history.push('/');
                }
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });
    }


    return !addNewStock ? (
        <div className="sidebarStock">
            <Link to={`/stocks/${id}`} key={id} className="sidebarStock_link">
                < div className="sidebarStock_logo">
                    <Avatar src={logo} />
                </div>
                < div className="sidebarStock_info">
                    <h2>{name} ({symbol})</h2>
                    <div>
                        {messages.length > 0 &&
                            <span>{messages[0]?.name.substr(0, messages[0]?.name.indexOf(' '))}: {messages[0]?.message}</span>}
                    </div>
                </div>
            </Link>
            <div className="sidebarStock_delete">
                <HighlightOffIcon onClick={() => setConfirmOpen(true)} />
                <ConfirmDialog
                    title="Detete Stock?"
                    open={confirmOpen}
                    setOpen={setConfirmOpen}
                    onConfirm={() => { deleteStock(symbol) }}
                >
                    All the messages will be deleted.
                 </ConfirmDialog>

            </div>
        </div>
    ) : (
            <div onClick={createStock} className="sidebarStock">
                <h3 className="add-new-stock-title">Add New Stock</h3>
            </div>
        )
}

export default SidebarStock
