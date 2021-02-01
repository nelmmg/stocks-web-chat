import React, { useState, useEffect, useRef } from 'react';
import { Avatar, IconButton } from '@material-ui/core';
import { AttachFile, MoreVert, SearchOutlined } from '@material-ui/icons';
import './Stock.css';
import { useParams } from 'react-router-dom';
import db from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import firebase from 'firebase/app';
import StockChat from './StockChat';
import StockPosition from './StockPosition';

const auth = firebase.auth();

function Stock() {
    const [input, setInput] = useState("");
    const { stockId } = useParams();
    const [stockName, setStockName] = useState("");
    const [stockLogo, setStockLogo] = useState("");
    const [stockSymbol, setStockSymbol] = useState("");

    const [messages, setMessages] = useState([]);
    const [user] = useAuthState(auth);

    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages]);


    useEffect(() => {
        if (stockId) {
            const stockSub = db.collection('stocks').doc(stockId).onSnapshot(snapshot => {
                if (snapshot.exists) {
                    setStockName(snapshot.data().name);
                    setStockLogo(snapshot.data().logo);
                    setStockSymbol(snapshot.data().symbol);
                }
            });

            return function cleanup() {
                stockSub();
            }
        }
    }, [stockId])


    return (
        <div className='stock'>
            <div className='stock_header'>
                <Avatar src={stockLogo} />
                <div className='stock_headerInfo'>
                    <h3 className='stock-room-name'>{stockName} ({stockSymbol})</h3>
                </div>
                <div className="stock_headerRight">
                </div>
            </div>
            <div className='stock_body'>
                <StockChat stockId={stockId} />
                <StockPosition key={stockId} stockId={stockId} />
            </div>
        </div>
    )
}

export default Stock
