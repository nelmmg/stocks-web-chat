import React, { useState, useEffect, useRef } from 'react';
import { Avatar, IconButton } from '@material-ui/core';
import { AttachFile, MoreVert, SearchOutlined } from '@material-ui/icons';
import SendIcon from '@material-ui/icons/Send';
import MicIcon from '@material-ui/icons/Mic';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import './StockChat.css';
import { useParams } from 'react-router-dom';
import db from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import firebase from 'firebase/app';

const auth = firebase.auth();

function StockChat({ stockId }) {
    const [input, setInput] = useState("");
    const [stockName, setStockName] = useState("");
    const [stockLogo, setStockLogo] = useState("");
    const [stockSymbol, setStockSymbol] = useState("");

    const [messages, setMessages] = useState([]);
    const [user] = useAuthState(auth);

    const messagesEndRef = useRef(null)

    const messagesSub = null;
    const stockSub = null;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "instant" })
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
            const messagesSub = db.collection('stocks').doc(stockId).collection("messages").orderBy("timestamp", "asc").onSnapshot(snapshot => {
                setMessages(snapshot.docs.map(doc => doc.data()))
            });

            return function cleanup() {
                stockSub();
                messagesSub();
            }
        }



    }, [stockId])


    const sendMessage = (e) => {
        e.preventDefault();

        if (!input) {
            return;
        }

        db.collection('stocks').doc(stockId).collection('messages').add({
            message: input,
            name: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })

        db.collection('stocks').doc(stockId).update({
            lastMessage: firebase.firestore.FieldValue.serverTimestamp()
        })

        setInput("");
    }

    return (
        <div className='stock_chat'>
            <div className='stock_chat_body'>
                {messages.map(message => (
                    <p key={message.id} className={`stock_chat_message ${message.name == user.displayName && 'stock_chat_receiver'}`}>
                        <span className="stock_chat_name">{message.name}</span>
                        {message.message}
                        <span className="stock_chat_timestamp">{new Date(message.timestamp?.toDate()).toUTCString()}</span>
                    </p>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className='stock_chat_footer'>
                <form>
                    <input value={input} onChange={(e) => setInput(e.target.value)} type="text" placeholder="Type a message" />
                    <button type="submit" onClick={sendMessage}> <SendIcon /></button>
                </form>
            </div>

        </div>
    )
}

export default StockChat
