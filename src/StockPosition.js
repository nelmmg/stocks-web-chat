import React, { useState, useEffect, useRef } from 'react';
import { Avatar, IconButton } from '@material-ui/core';
import { AttachFile, MoreVert, SearchOutlined } from '@material-ui/icons';
import MicIcon from '@material-ui/icons/Mic';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import './StockChat.css';
import { useParams } from 'react-router-dom';
import db from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import firebase from 'firebase/app';
import moment from 'moment';
import Moment from 'moment';

const auth = firebase.auth();

function StockPosition({ stockId }) {

    const [stockData, setStockData] = useState("");
    const [stockNews, setStockNews] = useState([]);

    const finnhub_key = process.env.REACT_APP_FINNHUB_KEY;

    useEffect(() => {
        if (stockId) {
            db.collection('stocks').doc(stockId).onSnapshot(snapshot => {
                if (snapshot) {
                    getStockInfo(snapshot.data().symbol);
                    getStockNews(snapshot.data().symbol);
                }
            });
        }

    }, [stockId]);

    const getStockNews = (stockSymbol) => {
        const today_date = moment().format("YYYY-MM-DD");
        const stockURL = "https://finnhub.io/api/v1/company-news?symbol=" + stockSymbol + "&from=" + today_date + "&to=" + today_date + "&token=" + finnhub_key;
        fetch(stockURL)
            .then(res => res.json())
            .then((data) => {

                data.sort(function (x, y) {
                    return x.datetime - y.datetime;
                })

                if (data) {
                    //const sliced = data.slice(0, 5)
                    //console.log(sliced);
                    setStockNews(data);
                }
                else {
                    alert("Error getting stock, check symbol");
                }
            })
            .catch(console.log)
    }

    const getStockInfo = (stockSymbol) => {
        const stockURL = "https://finnhub.io/api/v1/quote?symbol=" + stockSymbol + "&token=" + finnhub_key;
        fetch(stockURL)
            .then(res => res.json())
            .then((data) => {
                if (data) {
                    setStockData(data);
                }
                else {
                    alert("Error getting stock, check symbol");
                }
            })
            .catch(console.log)
    }

    return (
        <div className='stock_position'>

            <div className='stock_position_stats'>
                <div className='stock_position_stats_header'>
                    <h2>Stock Position</h2>
                </div>
                <div className='stock_position_stats_body'>
                    <p><b>Open:</b> {stockData.o}</p>
                    <p><b>Current:</b> {stockData.c}</p>
                    <p><b>High:</b> {stockData.h}</p>
                    <p><b>Low:</b> {stockData.l}</p>

                    <p><b>Previous Close:</b> {stockData.pc}</p>
                </div>
            </div>
            <div className='stock_position_news'>
                <div className='stock_position_news_header'>
                    <h2>Stock News</h2>
                </div>
                <div className='stock_position_news_body'>

                    {stockNews.map(stockNew => (
                        <p key={stockNew.id} className='stock_new'>
                            <span className='stock_new_date'>{Moment(stockNew.datetime).format('HH:mm')}</span>
                            <span className="stock_new_title" onClick={() => window.open(stockNew.url, "_blank")} >{stockNew.headline}</span>
                        </p>
                    ))}

                </div>
            </div>

            <div className='stock_position_footer'>
            </div>

        </div>
    )
}

export default StockPosition
