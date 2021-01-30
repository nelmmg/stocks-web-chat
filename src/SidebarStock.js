import React, { useEffect, useState } from 'react';
import { Avatar } from "@material-ui/core";
import './SidebarStock.css';
import db from './firebase';
import firebase from 'firebase';
import { Link } from 'react-router-dom';

function SidebarStock({ id, name, logo, symbol, addNewStock }) {
    const [messages, setMessages] = useState("");

    const finnhub_key = process.env.REACT_APP_FINNHUB_KEY;

    useEffect(() => {
        if (id) {
            db.collection('stocks').doc(id).collection('messages').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
                setMessages(snapshot.docs.map((doc) => doc.data()))
            })
        }
    }, [id]);

    const createStock = () => {
        const stockSymbol = prompt("Please the stock symbol");

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
                console.log(querySnapshot.size)
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

    return !addNewStock ? (
        <Link to={`/stocks/${id}`} key={id}>
            <div className="sidebarStock">
                <Avatar src={logo} />
                < div className="sidebarStock_info">
                    <h2>{name} ({symbol})</h2>
                    <p>{messages[0]?.message}</p>
                </div>
            </div>
        </Link>

    ) : (
            <div onClick={createStock} className="sidebarStock">
                <h3 className="add-new-stock-title">Add New Stock</h3>
            </div>
        )
}

export default SidebarStock
