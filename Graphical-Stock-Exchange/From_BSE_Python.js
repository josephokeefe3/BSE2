/*
// -*- coding: utf-8 -*-
//
// BSE: The Bristol Stock Exchange
//
// Version 1.3; July 21st, 2018.
// Version 1.2; November 17th, 2012.
//
// Copyright (c) 2012-2018, Dave Cliff
//
//
// ------------------------
//
// MIT Open-Source License:
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
// associated documentation files (the "Software"), to deal in the Software without restriction,
// including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all copies or substantial
// portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
// LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
// ------------------------
//
//
//
// BSE is a very simple simulation of automated execution traders
// operating on a very simple model of a limit order book (LOB) exchange
//
// major simplifications in this version:
//       (a) only one financial instrument being traded
//       (b) traders can only trade contracts of size 1 (will add variable quantities later)
//       (c) each trader can have max of one order per single orderbook.
//       (d) traders can replace/overwrite earlier orders, and/or can cancel
//       (d) simply processes each order in sequence and republishes LOB to all traders
//           => no issues with exchange processing latency/delays or simultaneously issued orders.
//
// NB this code has been written to be readable/intelligible, not efficient!

// could import pylab here for graphing etc
*/

/*
import sys
import math
import random
import time
*/


// an Order/quote has a trader id, a type (buy/sell) price, quantity, timestamp, and unique i.d.
class Order {
    constructor(tid, otype, price, qty, time, qid){
        this.tid = tid;     // trader i.d.
        this.otype = otype;  // order type
        this.price = price;  // price
        this.qty = qty;      // quantity
        this.time = time;    // timestamp
        this.qid = qid;      // quote i.d. (unique to each quote)
	}

}

// Orderbook_half is one side of the book: a list of bids or a list of asks, each sorted best-first

class Orderbook_half {

    constructor(booktype, worstprice){
        // booktype: bids or asks?
        this.booktype = booktype;
        // dictionary of orders received, indexed by Trader ID
        this.orders = {};
        // limit order book, dictionary indexed by price, with order info
        this.lob = {};
        // anonymized LOB, lists, with only price/qty info
        this.lob_anon = [];
        // summary stats
        this.best_price;
        this.best_tid;
        this.worstprice = worstprice;
        this.n_orders = 0;  // how many orders?
        this.lob_depth = 0;  // how many different prices on lob?
	}

    anonymize_lob() {
        // anonymize a lob, strip out order details, format as a sorted list
        // NB for asks, the sorting should be reversed
        this.lob_anon = [];
        for (var priceIndex=0; priceIndex<Object.keys(this.lob).length; priceIndex+=1){//this.lob
            this.lob_anon.push([int(Object.keys(this.lob)[priceIndex]), this.lob[Object.keys(this.lob)[priceIndex]][0]]);
        }
        this.lob_anon = sort(this.lob_anon);
    }


    build_lob(){
	    // print(this.lob)
	    // print('BUILDING')
        var lob_verbose = false;
        // take a list of orders and build a limit-order-book (lob) from it
        // NB the exchange needs to know arrival times and trader-id associated with each order
        // returns lob as a dictionary (i.e., unsorted)
        // also builds anonymized version (just price/quantity, sorted, as a list) for publishing to traders
        this.lob = {};
        for (var tidIndex=0; tidIndex<Object.keys(this.orders).length; tidIndex+=1){
            var order = this.orders[Object.keys(this.orders)[tidIndex]];
            var price = order.price;
            if (this.lob[price]){
                // update existing entry
                var qty = this.lob[price][0];
                var orderlist = this.lob[price][1];
                orderlist.push([order.time, order.qty, order.tid, order.qid]);
                this.lob[price] = [qty + order.qty, orderlist];
            } else {
                // create a new dictionary entry
                this.lob[price] = [order.qty, [[order.time, order.qty, order.tid, order.qid]]];
            }
        }
        // create anonymized version
        this.anonymize_lob();
        // record best price and associated trader-id
        if (Object.keys(this.lob).length) {
            if (this.booktype === 'Bid'){
                this.best_price = this.lob_anon[this.lob_anon.length-1][0];
            } else {
                this.best_price = this.lob_anon[0][0];
            }
            this.best_tid = this.lob[this.best_price][1][0][2];
        } else {
            this.best_price;
            this.best_tid;
		}
	}

    book_add(order){
        // add order to the dictionary holding the list of orders
        // either overwrites old order from this trader
        // or dynamically creates new entry in the dictionary
        // so, max of one order per trader per list
        // checks whether length or order list has changed, to distinguish addition/overwrite
        //// print('book_add > %s %s' % (order, this.orders))
        var n_orders = this.n_orders;
        this.orders[order.tid] = order;
        this.n_orders = Object.keys(this.orders).length;
        this.build_lob();
        if (n_orders !== this.n_orders){
            return('Addition');
        } else {
            return('Overwrite');
        }
	}


    book_del(order){
        // delete order from the dictionary holding the orders
        // assumes max of one order per trader per list
        // checks that the Trader ID does actually exist in the dict before deletion
        if (this.orders[order.tid]){
            delete this.orders[order.tid];
            this.n_orders = this.orders.length;
            this.build_lob();
        }
    }


    delete_best(){
        // delete order: when the best bid/ask has been hit, delete it from the book
        // the TraderID of the deleted order is return-value, as counterparty to the trade
        var best_price_orders = this.lob[this.best_price];
        var best_price_qty = best_price_orders[0];
        var best_price_counterparty = best_price_orders[1][0][2];
        if (best_price_qty === 1){
            // here the order deletes the best price
            delete this.lob[this.best_price];
            delete this.orders[best_price_counterparty];
            this.n_orders = this.n_orders - 1;
            if (this.n_orders > 0){
                if (this.booktype === 'Bid'){
                    this.best_price = Math.max(...Object.keys(this.lob));
                } else {
                    this.best_price = Math.min(...Object.keys(this.lob));
                }
                this.lob_depth = Object.keys(this.lob).length;
            } else {
                this.best_price = this.worstprice;
                this.lob_depth = 0;
            }
        } else {
            // best_bid_qty>1 so the order decrements the quantity of the best bid
            // update the lob with the decremented order data
            this.lob[this.best_price] = [best_price_qty - 1, best_price_orders[1].slice(1)];

            // update the bid list: counterparty's bid has been deleted
            delete this.orders[best_price_counterparty];
            this.n_orders = this.n_orders - 1;
        }
        this.build_lob();
        return best_price_counterparty;
    }

}

// Orderbook for a single instrument: list of bids and list of asks

class Orderbook extends Orderbook_half {
    constructor(bids,asks,tape,quote_id){
	    super();
        this.bids = new Orderbook_half('Bid', bse_sys_minprice);
        this.asks = new Orderbook_half('Ask', bse_sys_maxprice);
        this.tape = [];
        this.quote_id = 0;  //unique ID code for each quote accepted onto the book
    }
}

// Exchange's internal orderbook

class Exchange extends Orderbook{

    add_order(order, verbose){
        // add a quote/order to the exchange and update all internal records; return unique i.d.
        order.qid = this.quote_id;
        this.quote_id = order.qid + 1;
        var tid = order.tid;
        if (order.otype === 'Bid'){
            var response = this.bids.book_add(order);
            var best_price = this.bids.lob_anon[this.bids.lob_anon.length-1][0];
            this.bids.best_price = best_price;
            this.bids.best_tid = this.bids.lob[best_price][1][0][2];
        } else {
            response=this.asks.book_add(order)
            best_price = this.asks.lob_anon[0][0];
            this.asks.best_price = best_price;
            this.asks.best_tid = this.asks.lob[best_price][1][0][2];
        }
        return [order.qid, response];
	}

    del_order(time, order, verbose){
        // delete a trader's quot/order from the exchange, update all internal records
        var tid = order.tid;
        if (order.otype === 'Bid'){
            this.bids.book_del(order);
            if (this.bids.n_orders > 0){
                best_price = this.bids.lob_anon[this.bids.lob_anon.length-1][0];
                this.bids.best_price = best_price;
                this.bids.best_tid = this.bids.lob[best_price][1][0][2];
            }
            else { // this side of book is empty
                this.bids.best_price = null;
                this.bids.best_tid = null;
            }
            cancel_record = { 'type': 'Cancel', 'time': time, 'order': order };
            this.tape.push(cancel_record);
		}
        else if(order.otype === 'Ask'){
            this.asks.book_del(order);
            if (this.asks.n_orders > 0){
                var best_price = this.asks.lob_anon[0][0];
                this.asks.best_price = best_price;
                this.asks.best_tid = this.asks.lob[best_price][1][0][2];
            }
            else { // this side of book is empty
                this.asks.best_price = null;
                this.asks.best_tid = null;
            }
            var cancel_record = { 'type': 'Cancel', 'time': time, 'order': order };
            this.tape.push(cancel_record);
        }
        else {

        }
	}


    process_order2(time, order, verbose){
        // receive an order and either add it to the relevant LOB (ie treat as limit order)
        // or if it crosses the best counterparty offer, execute it (treat as a market order)
        var oprice = order.price;
        var counterparty = null;
        var qidResponse = this.add_order(order, verbose);  // add it to the order lists -- overwriting any previous order
        var qid = qidResponse[0];
        var response = qidResponse[1];
        
        order.qid = qid;
        
        var best_ask = this.asks.best_price;
        var best_ask_tid = this.asks.best_tid;
        var best_bid = this.bids.best_price;
        var best_bid_tid = this.bids.best_tid;
        if (order.otype === 'Bid'){
            if (this.asks.n_orders > 0 && best_bid >= best_ask){
                // bid lifts the best ask
                if (verbose){ // print("Bid " + oprice + " lifts best ask");
	            }
                counterparty = best_ask_tid;
                var price = best_ask;  // bid crossed ask, so use ask price
                if (verbose){ // print('counterparty, price', counterparty, price);
	                }
                // delete the ask just crossed
                this.asks.delete_best();
                // delete the bid that was the latest order
                this.bids.delete_best();
            }
        }
        else if (order.otype === 'Ask'){
            if (this.bids.n_orders > 0 && best_ask <= best_bid){
                // ask hits the best bid
                if (verbose){ // print("Ask " + oprice + " hits best bid");
	                }
                // remove the best bid
                counterparty = best_bid_tid;
                var price = best_bid;  // ask crossed bid, so use bid price
                if (verbose){ // print('counterparty, price', counterparty, price);
	                }
                // delete the bid just crossed, from the exchange's records
                this.bids.delete_best();
                // delete the ask that was the latest order, from the exchange's records
                this.asks.delete_best();
            }
        }
        else {
            // we should never get here
//             sys.exit('process_order() given neither Bid nor Ask')
        }
        // NB at this point we have deleted the order from the exchange's records
        // but the two traders concerned still have to be notified
        if (verbose){ // print('counterparty ' + counterparty);
	    }
        if (counterparty){
            // process the trade
            var transaction_record = { 'type': 'Trade',
                                   'time': time,
                                   'price': price,
                                   'party1':counterparty,
                                   'party2':order.tid,
                                   'qty': order.qty
                                   };
            this.tape.push(transaction_record);
            return transaction_record;
        } else {
            return null;
        }
	}

    // this returns the LOB data "published" by the exchange,
    // i.e., what is accessible to the traders
    publish_lob(time, verbose){
        var public_data = {};
        public_data['time'] = time;
        public_data['bids'] = {'best':this.bids.best_price,
                               'worst':this.bids.worstprice,
                               'n': this.bids.n_orders,
                               'lob':this.bids.lob_anon};
        public_data['asks'] = {'best':this.asks.best_price,
                               'worst':this.asks.worstprice,
                               'n': this.asks.n_orders,
                               'lob':this.asks.lob_anon};
        public_data['QID'] = this.quote_id;
        public_data['tape'] = this.tape;
        if (verbose){
            lob_data.push([public_data['bids']['lob'], public_data['asks']['lob']]);
        }

        return public_data;
	}
}




////////////////////////////////////--Traders below here--//////////////////////////


// Trader superclass
// all Traders have a trader id, bank balance, blotter, and list of orders to execute
class Trader {

    constructor(ttype, tid, balance, time){
        this.ttype = ttype;      // what type / strategy this trader is
        this.tid = tid;          // trader unique ID code
        this.balance = balance;  // money in the bank
        this.blotter = [];       // record of trades executed
        this.orders = [];        // customer orders currently being worked (fixed at 1)
        this.n_quotes = 0;       // number of quotes live on LOB
        this.willing = 1;        // used in ZIP etc
        this.able = 1;           // used in ZIP etc
        this.birthtime = time;   // used when calculating age of a trader/strategy
        this.profitpertime = 0;  // profit per unit time
        this.n_trades = 0;       // how many trades has this trader done?
        this.lastquote = null;   // record of what its last quote was
	}

    add_order(order, verbose){
        // in this version, trader has at most one order,
        // if allow more than one, this needs to be this.orders.push(order)
        if (this.n_quotes > 0){
            // this trader has a live quote on the LOB, from a previous customer order
            // need response to signal cancellation/withdrawal of that quote
            var response = 'LOB_Cancel';
        }
        else {
            var response = 'Proceed';
        }
        this.orders = [order];
        if (verbose){ 	        }
        return response;
	}

    del_order(order){
        // this is lazy: assumes each trader has only one customer order with quantity=1, so deleting sole order
        // CHANGE TO DELETE THE HEAD OF THE LIST AND KEEP THE TAIL
        this.orders = [];
	}

    bookkeep(trade, order, verbose, time){
	    if (this.orders.length){
	        var outstr="";
	        for (var orderIndex=0; orderIndex<this.orders.length; orderIndex+=1){
		        outstr = outstr + this.orders[orderIndex].toString();
		    }
	
	        this.blotter.push(trade);  // add trade record to trader's blotter
	        // NB What follows is **LAZY** -- assumes all orders are quantity=1
	        var transactionprice = trade['price'];
			if (this.orders[0].otype === 'Bid'){
	            var profit = this.orders[0].price - transactionprice;
	        } else {
	            var profit = transactionprice - this.orders[0].price;
	        }   this.balance += profit;
	
	        this.n_trades += 1;
	        this.profitpertime = this.balance/(time - this.birthtime);
	        
	        if (profit < 0) {
	            // print(profit);
	            // print(trade);
	            // print(order);
	//             sys.exit()
	         }
	
	        this.del_order(order);  // delete the order
        } else {
	        print('NO ORDERS: ' + this.orders.length)
        }
	}

    // specify how trader responds to events in the market
    // this is a null action, expect it to be overloaded by specific algos
    respond(time, lob, trade, verbose){
        return null;
    }

    // specify how trader mutates its parameter values
    // this is a null action, expect it to be overloaded by specific algos
    mutate(time, lob, trade, verbose){
        return null;
    }

}

// Trader subclass Giveaway
// even dumber than a ZI-U: just give the deal away
// (but never makes a loss)
class Trader_Giveaway extends Trader{

    getorder(time, countdown, lob){
        if (this.orders.length < 1){
            var order = null;
        } else {
	        
            var quoteprice = this.orders[0].price;
            var order = new Order(this.tid,
                          this.orders[0].otype,
                          quoteprice,
                          this.orders[0].qty,
                          time, lob['QID']);
            
            
            this.lastquote=order;
        }
        return order;
    }
}

// Trader subclass ZI-C
// After Gode & Sunder 1993
class Trader_ZIC extends Trader{

    getorder(time, countdown, lob){
        if (this.orders.length < 1){
            // no orders: return NULL
            var order = null;
        } else {
            var minprice = lob['bids']['worst'];
            var maxprice = lob['asks']['worst'];
            var qid = lob['QID'];
            var limit = this.orders[0].price;
            var otype = this.orders[0].otype;
            if (otype === 'Bid'){
                var quoteprice = int(random(minprice, limit));
            }
            else {
                var quoteprice = int(random(limit, maxprice));
                // NB should check it == 'Ask' and barf if not
            }
            var order = new Order(this.tid, otype, quoteprice, this.orders[0].qty, time, qid);
            this.lastquote = order;
        }
        return order;
    }
}

// Trader subclass Shaver
// shaves a penny off the best price
// if there is no best price, creates "stub quote" at system max/min
class Trader_Shaver extends Trader{

    getorder(time, countdown, lob){
        if (this.orders.length < 1){
            var order = null;
        } else {
            var limitprice = this.orders[0].price;
            var otype = this.orders[0].otype;
            if (otype === 'Bid'){
                if (lob['bids']['n'] > 0){
                    var quoteprice = lob['bids']['best'] + 1;
                    if (quoteprice > limitprice){
                        quoteprice = limitprice;
                    }
                }else{
                    quoteprice = lob['bids']['worst'];
                }
            } else{
                if (lob['asks']['n'] > 0){
                    quoteprice = lob['asks']['best'] - 1;
                    if (quoteprice < limitprice){
                        quoteprice = limitprice;
                    }
                } else{
                    quoteprice = lob['asks']['worst'];
                }
            }
            var order = new Order(this.tid, otype, quoteprice, this.orders[0].qty, time, lob['QID']);
            this.lastquote = order;
        }
        return order;
    }
}

// Trader subclass Sniper
// Based on Shaver,
// "lurks" until time remaining < threshold% of the trading session
// then gets increasing aggressive, increasing "shave thickness" as time runs out
class Trader_Sniper extends Trader{

    getorder(time, countdown, lob){
        var lurk_threshold = 0.2;
        var shavegrowthrate = 3;
        var shave = int(1.0 / (0.01 + countdown / (shavegrowthrate * lurk_threshold)));
        if ((this.orders.length < 1) || (countdown > lurk_threshold)){
            var order = null;
//             print('not order')
        } else {
// 	        print('order')
            var limitprice = this.orders[0].price;
            var otype = this.orders[0].otype;
            if (otype === 'Bid'){
	            
                if (lob['bids']['n'] > 0){
                    var quoteprice = lob['bids']['best'] + shave;
                    if (quoteprice > limitprice){
                        quoteprice = limitprice;
                    }
                }else{
                    var quoteprice = lob['bids']['worst'];
                }
            } else{
                if (lob['asks']['n'] > 0){
                    var quoteprice = lob['asks']['best'] - shave;
                    if (quoteprice < limitprice){
                        quoteprice = limitprice;
                    }
                } else{
                    var quoteprice = lob['asks']['worst'];
                }
            }
            var order = new Order(this.tid, otype, quoteprice, this.orders[0].qty, time, lob['QID']);
            this.lastquote = order;
        }
//         print(order)
        return order;
	}
}


// Trader subclass ZIP
// After Cliff 1997
class Trader_ZIP extends Trader{

    // ZIP init key param-values are those used in Cliff's 1997 original HP Labs tech report
    // NB this implementation keeps separate margin values for buying & selling,
    //    so a single trader can both buy AND sell
    //    -- in the original, traders were either buyers OR sellers

    constructor(ttype, tid, balance, time){
	    super();
        this.ttype = ttype;
        this.tid = tid;
        this.balance = balance;
        this.birthtime = time;
        this.profitpertime = 0;
        this.n_trades = 0;
        this.blotter = [];
        this.orders = [];
        this.n_quotes = 0;
        this.lastquote = null;
        this.job = null;  // this gets switched to 'Bid' or 'Ask' depending on order-type
        this.active = null;  // gets switched to True while actively working an order
        this.prev_change = 0;  // this was called last_d in Cliff'97
        this.beta = 0.1 + 0.4 * random();
        this.momntm = 0.1 * random();
        this.ca = 0.05;  // this.ca & .cr were hard-coded in '97 but parameterised later
        this.cr = 0.05;
        this.margin = null;  // this was called profit in Cliff'97
        this.margin_buy = -1.0 * (0.05 + 0.3 * random());
        this.margin_sell = 0.05 + 0.3 * random();
        this.price = null;
        this.limit = null;
        // memory of best price & quantity of best bid and ask, on LOB on previous update
        this.prev_best_bid_p = null;
        this.prev_best_bid_q = null;
        this.prev_best_ask_p = null;
        this.prev_best_ask_q = null;
	}

    getorder(time, countdown, lob){
        if (this.orders.length < 1){
	        this.active = false;
            order = null;
        } else {
            this.active = true;
            this.limit = this.orders[0].price;
            this.job = this.orders[0].otype;
            if (this.job === 'Bid'){
                // currently a buyer (working a bid order)
                this.margin = this.margin_buy;
            }
            else{
                // currently a seller (working a sell order)
                this.margin = this.margin_sell;
            }
            var quoteprice = int(this.limit * (1 + this.margin),10);
            this.price = quoteprice;

            var order = new Order(this.tid, this.job, quoteprice, this.orders[0].qty, time, lob['QID']);
            this.lastquote = order;
        }
        return order;
	}

    // update margin on basis of what happened in market
    respond(time, lob, trade, verbose){
        // ZIP trader responds to market events, altering its margin
        // does this whether it currently has an order to work or not

        function target_up(price){
            // generate a higher target price by randomly perturbing given price
            var ptrb_abs = this.ca * random();  // absolute shift
            var ptrb_rel = price * (1.0 + (this.cr * random()));  // relative shift
            var target = int(round(ptrb_rel + ptrb_abs, 0));
            return target;
        }


        function target_down(price){
            // generate a lower target price by randomly perturbing given price
            var ptrb_abs = this.ca * random();  // absolute shift
            var ptrb_rel = price * (1.0 - (this.cr * random()));  // relative shift
            var target = int(round(ptrb_rel - ptrb_abs, 0));
            return target;
        }


        function willing_to_trade(price){
            // am I willing to trade at this price?
            var willing = false;
            if (this.job === 'Bid' && this.active && this.price >= price){
                willing = true;
            }
            if (this.job === 'Ask' && this.active && this.price <= price){
                willing = true;
            }
            return willing;
        }


        function profit_alter(price){
            var oldprice = this.price;
            var diff = price - oldprice;
            var change = ((1.0 - this.momntm) * (this.beta * diff)) + (this.momntm * this.prev_change);
            this.prev_change = change;
            var newmargin = ((this.price + change) / this.limit) - 1.0;

            if (this.job === 'Bid'){
                if (newmargin < 0.0){
                    this.margin_buy = newmargin;
                    this.margin = newmargin;
                }
            }else{
                if (newmargin > 0.0){
                    this.margin_sell = newmargin;
                    this.margin = newmargin;
                }
			}
            // set the price from limit and profit-margin
            this.price = int(round(this.limit * (1.0 + this.margin), 0));
   		}

        // what, if anything, has happened on the bid LOB?
        var bid_improved = false;
        var bid_hit = false;
        var lob_best_bid_p = lob['bids']['best'];
        var lob_best_bid_q = null;
        if (lob_best_bid_p !== null){
            // non-empty bid LOB
            lob_best_bid_q = lob['bids']['lob'][-1][1];
            if (this.prev_best_bid_p < lob_best_bid_p){
                // best bid has improved
                // NB doesn't check if the improvement was by this
                bid_improved = true;
            } else if (trade !== null && ((this.prev_best_bid_p > lob_best_bid_p) || ((this.prev_best_bid_p === lob_best_bid_p) && (this.prev_best_bid_q > lob_best_bid_q)))){
                // previous best bid was hit
                bid_hit = true;
            }
        }
        else if (this.prev_best_bid_p !== null){
            // the bid LOB has been emptied: was it cancelled or hit?
            last_tape_item = lob['tape'][-1];
            if (last_tape_item['type'] === 'Cancel'){
                bid_hit = false;
            }else{
                bid_hit = true;
            }
        }

        // what, if anything, has happened on the ask LOB?
        var ask_improved = false;n
        var ask_lifted = false;
        var lob_best_ask_p = lob['asks']['best'];
        var lob_best_ask_q = null;
        if (lob_best_ask_p !== null){
            // non-empty ask LOB
            lob_best_ask_q = lob['asks']['lob'][0][1];
            if (this.prev_best_ask_p > lob_best_ask_p){
                // best ask has improved -- NB doesn't check if the improvement was by this
                ask_improved = true;
            } else if (trade !== null && ((this.prev_best_ask_p < lob_best_ask_p) || ((this.prev_best_ask_p === lob_best_ask_p) && (this.prev_best_ask_q > lob_best_ask_q)))){
                // trade happened and best ask price has got worse, or stayed same but quantity reduced -- assume previous best ask was lifted
                ask_lifted = true;
            }
        } else if (this.prev_best_ask_p !== null){
            // the ask LOB is empty now but was not previously: canceled or lifted?
            last_tape_item = lob['tape'][-1];
            if (last_tape_item['type'] === 'Cancel'){
                ask_lifted = false;
            }else{
                ask_lifted = true;
            }
        }


        if (verbose && (bid_improved || bid_hit || ask_improved || ask_lifted)){
//             // print ('B_improved', bid_improved, 'B_hit', bid_hit, 'A_improved', ask_improved, 'A_lifted', ask_lifted)
        }


        var deal = bid_hit || ask_lifted;

        if (this.job === 'Ask'){
            // seller
            if (deal){
                var tradeprice = trade['price'];
                if (this.price <= tradeprice){
                    // could sell for more? raise margin
                    target_price = target_up(tradeprice);
                    profit_alter(target_price);
                }else if (ask_lifted && this.active && !willing_to_trade(tradeprice)){
                    // wouldnt have got this deal, still working order, so reduce margin
                    target_price = target_down(tradeprice);
                    profit_alter(target_price);
                }
            } else {
                // no deal: aim for a target price higher than best bid
                if (ask_improved && this.price > lob_best_ask_p){
                    if (lob_best_bid_p !== null){
                        target_price = target_up(lob_best_bid_p);
                    } else {
                        target_price = lob['asks']['worst'];  // stub quote
                    }
                    profit_alter(target_price);
                }
            }
		}
        if (this.job === 'Bid'){
            // buyer
            if (deal){
                var tradeprice = trade['price'];
                if (this.price >= tradeprice){
                    // could buy for less? raise margin (i.e. cut the price)
                    target_price = target_down(tradeprice);
                    profit_alter(target_price);
                }
                else if (bid_hit && this.active && willing_to_trade(tradeprice)===false){
                    // wouldnt have got this deal, still working order, so reduce margin
                    target_price = target_up(tradeprice);
                    profit_alter(target_price);
                }
            }
            else{
                // no deal: aim for target price lower than best ask
                if (bid_improved && this.price < lob_best_bid_p){
                    if (lob_best_ask_p !== null){
                        target_price = target_down(lob_best_ask_p);
                    } else {
                        target_price = lob['bids']['worst'];  // stub quote
                    }
                    profit_alter(target_price);
                }
            }
		}

        // remember the best LOB data ready for next response
        this.prev_best_bid_p = lob_best_bid_p;
        this.prev_best_bid_q = lob_best_bid_q;
        this.prev_best_ask_p = lob_best_ask_p;
        this.prev_best_ask_q = lob_best_ask_q;
    }
}




////////////////////////////////////////////////////---trader-types have all been defined now--////////////////////////////////




////////////////////////////////////////////////////---Below lies the experiment/test-rig---////////////////////////////////////



// trade_stats()
// dump CSV statistics on exchange data and trader population to file for later analysis
// this makes no assumptions about the number of types of traders, or
// the number of traders of any one type -- allows either/both to change
// between successive calls, but that does make it inefficient as it has to
// re-analyse the entire set of traders on each call
function trade_stats(expid, traders, time, lob){
    var trader_types = {};
    var n_traders = traders.length;
    for (var tIndex=0; tIndex<traders.length; tIndex+=1){
        var ttype = traders[traders[tIndex]].ttype;
        if (trader_types[ttype]){
            var t_balance = trader_types[ttype]['balance_sum'] + traders[traders[tIndex]].balance;
            var n = trader_types[ttype]['n'] + 1;
        } else{
            var t_balance = traders[traders[tIndex]].balance;
            var n = 1;
        }
        trader_types[ttype] = {'n':n, 'balance_sum':t_balance};
    }
}


// create a bunch of traders from traders_spec
// returns tuple (n_buyers, n_sellers)
// optionally shuffles the pack of buyers and the pack of sellers

function populate_market(traders_spec, traders, shuffle, verbose){

    function trader_type(robottype, name){
        if (robottype === 'GVWY'){
            return new Trader_Giveaway('GVWY', name, 0.00, 0);
        }else if (robottype === 'ZIC'){
            return new Trader_ZIC('ZIC', name, 0.00, 0);
        }else if (robottype === 'SHVR'){
            return new Trader_Shaver('SHVR', name, 0.00, 0);
        }else if (robottype === 'SNPR'){
            return new Trader_Sniper('SNPR', name, 0.00, 0);
        }else if (robottype === 'ZIP'){
            return new Trader_ZIP('ZIP', name, 0.00, 0);
        }else{
//             sys.exit('FATAL: don\'t know robot type %s\n' % robottype)
        }
	}

    function shuffle_traders(ttype_char, n, traders){
        for (var swap=0; swap<n; swap+=1){
            var t1 = (n - 1) - swap;
            var t2 = int(random(0, t1));
            var t1name = ttype_char+t1;
            var t2name = ttype_char+t2;
            traders[t1name].tid = t2name;
            traders[t2name].tid = t1name;
            var temp = traders[t1name];
            traders[t1name] = traders[t2name];
            traders[t2name] = temp;
        }
	}

    var n_buyers = 0
    for (var bsIndex=0; bsIndex<Object.keys(traders_spec['buyers']).length; bsIndex+=1){
        var ttype = Object.keys(traders_spec['buyers'])[bsIndex];
        for (var b=0; b<traders_spec['buyers'][ttype]; b+=1){
            var tname = 'B' + n_buyers;  // buyer i.d. string
            traders[tname] = trader_type(ttype, tname);
            n_buyers = n_buyers + 1;
        }
	}

    if (n_buyers < 1){
//         sys.exit('FATAL: no buyers specified\n')
    }

    if (shuffle){ shuffle_traders('B', n_buyers, traders);}

    var n_sellers = 0
    for (var ssIndex=0; ssIndex<Object.keys(traders_spec['sellers']).length; ssIndex+=1){
        var ttype = Object.keys(traders_spec['sellers'])[ssIndex];
        for (var s=0; s<traders_spec['sellers'][ttype]; s+=1){
            var tname = 'S' + n_sellers;  // buyer i.d. string
            traders[tname] = trader_type(ttype, tname);
            n_sellers = n_sellers + 1;
        }
	}

    if (n_sellers < 1){
//         sys.exit('FATAL: no buyers specified\n')
    }

    if (shuffle){ shuffle_traders('S', n_sellers, traders);}

    if (verbose){
        for (var t=0; t<n_buyers; t+=1){
            var bname = 'B' + t;
        }
        for (var t=0; t<n_sellers; t+=1){
            var bname = 'S' + t;
        }
    }


    return [{'n_buyers':n_buyers, 'n_sellers':n_sellers},traders];

}

// customer_orders(): allocate orders to traders
// parameter "os" is order schedule
// os['timemode'] is either 'periodic', 'drip-fixed', 'drip-jitter', or 'drip-poisson'
// os['interval'] is number of seconds for a full cycle of replenishment
// drip-poisson sequences will be normalised to ensure time of last replenishment <= interval
// parameter "pending" is the list of future orders (if this is empty, generates a new one from os)
// revised "pending" is the returned value
//
// also returns a list of "cancellations": trader-ids for those traders who are now working a new order and hence
// need to kill quotes already on LOB from working previous order
//
//
// if a supply or demand schedule mode is "random" and more than one range is supplied in ranges[],
// then each time a price is generated one of the ranges is chosen equiprobably and
// the price is then generated uniform-randomly from that range
//
// if len(range)==2, interpreted as min and max values on the schedule, specifying linear supply/demand curve
// if len(range)==3, first two vals are min & max, third value should be a function that generates a dynamic price offset
//                   -- the offset value applies equally to the min & max, so gradient of linear sup/dem curve doesn't vary
// if len(range)==4, the third value is function that gives dynamic offset for schedule min,
//                   and fourth is a function giving dynamic offset for schedule max, so gradient of sup/dem linear curve can vary
//
// the interface on this is a bit of a mess... could do with refactoring


function customer_orders(time, last_update, traders, trader_stats, os, pending, verbose){


    function sysmin_check(price){
        if (price < bse_sys_minprice){
            price = bse_sys_minprice;
        }
        return price;
	}

    function sysmax_check(price){
        if (price > bse_sys_maxprice){
            price = bse_sys_maxprice;
        }
        return price;
    }



    function getorderprice(i, sched, n, mode, issuetime){
	    //t, sched, n_sellers, mode, issuetime
	    
        // does the first schedule range include optional dynamic offset function(s)?
        if (sched[0].length > 2){
            var offsetfn = sched[0][2];
//             if (callable(offsetfn)){
                // same offset for min and max
            var offset_min = offsetfn(issuetime);
            var offset_max = offset_min;
//             }
//             else{
//                 sys.exit('FAIL: 3rd argument of sched in getorderprice() not callable')
// 			}
            if (sched[0].length > 3){
                // if second offset function is specfied, that applies only to the max value
                offsetfn = sched[0][3];
                if (callable(offsetfn)){
                    // this function applies to max
                    var offset_max = offsetfn(issuetime);
                }
                else{
//                     sys.exit('FAIL: 4th argument of sched in getorderprice() not callable');
				}
			}
        } else {
            var offset_min = 0.0;
            var offset_max = 0.0;
        }
		
        var pmin = (offset_min + Math.min(sched[0][0], sched[0][1]));
        var pmax = (offset_max + Math.max(sched[0][0], sched[0][1]));
        
        pmin = sysmin_check(pmin)
        pmax = sysmax_check(pmax)

        var prange = pmax - pmin;
        var stepsize = prange / (n - 1);
        var halfstep = round(stepsize / 2.0);


		
        if (mode === 'fixed'){
            var orderprice = pmin + round(i * stepsize);
        } else if (mode === 'jittered'){
            var orderprice = pmin + round(i * stepsize) + round(random(-halfstep, halfstep));
        } else if (mode === 'random'){
            if (sched.length > 1){
                // more than one schedule: choose one equiprobably
                var s = floor(random(0, sched.length - 1));
                pmin = sysmin_check(Math.min(sched[s][0], sched[s][1]));
                pmax = sysmax_check(Math.max(sched[s][0], sched[s][1]));
            }
            var orderprice = round(random(pmin, pmax));
        } else{
//             sys.exit('FAIL: Unknown mode in schedule')
        }
        
        orderprice = sysmin_check(sysmax_check(orderprice));
        return orderprice;
    }


    function getissuetimes(n_traders, mode, interval, shuffle, fittointerval){
        interval = float(interval);
        if (n_traders < 1){
//             sys.exit('FAIL: n_traders < 1 in getissuetime()')
        }else if (n_traders === 1){
            var tstep = interval;
        } else {
            tstep = interval / (n_traders - 1);
        }
        var arrtime = 0;
        var issuetimes = [];
        for (var t=0; t<n_traders; t+=1){
            if (mode === 'periodic'){
                arrtime = interval;
            } else if (mode === 'drip-fixed'){
                arrtime = t * tstep;
            } else if (mode === 'drip-jitter'){
                arrtime = t * tstep + tstep * random();
            } else if (mode === 'drip-poisson'){
                // poisson requires a bit of extra work
                var interarrivaltime = random.expovariate(n_traders / interval);
                arrtime += interarrivaltime;
            } else{
//                 sys.exit('FAIL: unknown time-mode in getissuetimes()')
			}
            issuetimes.push(arrtime);
		}
		
            // at this point, arrtime is the last arrival time
        if (fittointerval && ((arrtime > interval) || (arrtime < interval))){
            // generated sum of interarrival times longer than the interval
            // squish them back so that last arrival falls at t=interval
            for  (var t=0; t<n_traders; t+=1){
                issuetimes[t] = interval * (issuetimes[t] / arrtime);
            }
        }
        // optionally randomly shuffle the times
        if (shuffle){
            for (var t=0; t<n_traders; t+=1){
                var i = (n_traders - 1) - t;
                var j = int(random(0, i));
                var tmp = issuetimes[i];
                issuetimes[i] = issuetimes[j];
                issuetimes[j] = tmp;
            }
        }
        return issuetimes;
	}

    function getschedmode(time, os){
        var got_one = false;
        for (var schedIndex=0; schedIndex<os.length; schedIndex+=1){
	        var sched = os[schedIndex];
	        'sched'+sched
            if ((sched['from'] <= time) && (time < sched['to'])){
                // within the timezone for this schedule
                var schedrange = sched['ranges'];
                var mode = sched['stepmode'];
                got_one = true;
                break;  // jump out the loop -- so the first matching timezone has priority over any others
            }
        }
        if (got_one===false){
//             sys.exit('Fail: time=%5.2f not within any timezone in os=%s' % (time, os))
        }
        return [schedrange, mode];
    }


    var n_buyers = trader_stats['n_buyers'];
    var n_sellers = trader_stats['n_sellers'];

    var shuffle_times = true;

    var cancellations = [];
    
//     print(os)
    
	// print(pending)
    if (pending.length < 1){
        // list of pending (to-be-issued) customer orders is empty, so generate a new one
        var new_pending = [];

        // demand side (buyers)
        var issuetimes = getissuetimes(n_buyers, os['timemode'], os['interval'], shuffle_times, true);
		var issuetime;
		var tname;
		var orderprice;
		var order;
		
        var ordertype = 'Bid';
        var schedMode = getschedmode(time, os['dem']);
        var sched = schedMode[0];
        var mode = schedMode[1];
        for (var t=0; t<n_buyers; t+=1){
            issuetime = time + issuetimes[t];
            tname = 'B' + t;
            orderprice = getorderprice(t, sched, n_buyers, mode, issuetime);
            order = new Order(tname, ordertype, orderprice, 1, issuetime, -3.14);
            new_pending.push(order);
        }

        // supply side (sellers)
        issuetimes = getissuetimes(n_sellers, os['timemode'], os['interval'], shuffle_times,true);
        ordertype = 'Ask';
        schedMode = getschedmode(time, os['dem']);
        sched = schedMode[0];
        mode = schedMode[1];
        for (var t=0; t<n_sellers; t+=1){
            issuetime = time + issuetimes[t];
            tname = 'S' + t;
            orderprice = getorderprice(t, sched, n_sellers, mode, issuetime);
            order = new Order(tname, ordertype, orderprice, 1, issuetime, -3.14);
            new_pending.push(order);
        }
    } else {
        // there are pending future orders: issue any whose timestamp is in the past
        var new_pending = [];
        var order;
        var tname;
        var response;
        for (var orderIndex=0; orderIndex<pending.length; orderIndex+=1){
	        order = pending[orderIndex];
            if (order.time < time){
                // this order should have been issued by now
                // issue it to the trader
                tname = order.tid;
                // print(tname)
                response = traders[tname].add_order(order, verbose);
                if (verbose){ // print('Customer order: %s %s' % (response, order));
	            }
                if (response === 'LOB_Cancel'){
                    cancellations.push(tname);
                    if (verbose){ // print('Cancellations: %s' % (cancellations));
	                }
                }
                // and then don't add it to new_pending (i.e., delete it)
            } else {
                // this order stays on the pending list
                new_pending.push(order);
            }
        }
    }
    return [new_pending, cancellations];
}


// one session in the market
function market_session(sess_id, starttime, endtime, trader_spec, order_schedule, dump_each_trade, verbose){
	
	var LOBDATAless = [];
	var LOBDATAmore = [];

    // initialise the exchange
    var exchange = new Exchange();


    // create a bunch of traders
    var allTraderData = populate_market(trader_spec, {}, true, verbose);
    var trader_stats = allTraderData[0];
    var traders = allTraderData[1];

    // timestep set so that can process all traders in one second
    // NB minimum interarrival time of customer orders may be much less than this!!
    var timestep = 1.0 / float(trader_stats['n_buyers'] + trader_stats['n_sellers']);

    var duration = float(endtime - starttime);

    var last_update = -1.0;

    var time = starttime;
    var prevTime = time;

    var orders_verbose = false;
    var lob_verbose = false;
    var process_verbose = false;
    var respond_verbose = false;
    var bookkeep_verbose = false;

    var pending_cust_orders = [];
	var kills;
    // if verbose: // print('\n%s;  ' % (sess_id))

    while (time < endtime){

        // how much time left, as a percentage?
        var time_left = (endtime - time) / duration;

        var trade = null;
		
		var customerOrders = customer_orders(time, last_update, traders, trader_stats,
                                                       order_schedule, pending_cust_orders, orders_verbose);
		
        var pending_cust_orders = customerOrders[0];
        
        var kills = customerOrders[1];
        
        // if any newly-issued customer orders mean quotes on the LOB need to be cancelled, kill them
        if (kills.length){
            // if verbose : // print('Kills: %s' % (kills))
            for (var killIndex=0; killIndex<kills.length; killIndex+=1){
	            var kill = kills[killIndex];
                // if verbose : // print('lastquote=%s' % traders[kill].lastquote)
                if (traders[kill].lastquote !== null){
                    // if verbose : // print('Killing order %s' % (str(traders[kill].lastquote)))
                    exchange.del_order(time, traders[kill].lastquote, verbose);
                }
            }
        }


        // get a limit-order quote (or null) from a randomly chosen trader
        var tid = Object.keys(traders)[int(random(0, Object.keys(traders).length - 1))];
        var order = traders[tid].getorder(time, time_left, exchange.publish_lob(time, lob_verbose));
		
        if (order !== null){
            // send order to exchange
            traders[tid].n_quotes = 1;
            var trade = exchange.process_order2(time, order, process_verbose);
            if (trade !== null){
                // trade occurred,
                // so the counterparties update order lists and blotters
                traders[trade['party1']].bookkeep(trade, order, bookkeep_verbose, time);
                traders[trade['party2']].bookkeep(trade, order, bookkeep_verbose, time);
                if (dump_each_trade){trade_stats(sess_id, traders, time, exchange.publish_lob(time, lob_verbose));}
			}
            // traders respond to whatever happened
            var lob = exchange.publish_lob(time, lob_verbose);
            for (var t=0; t<traders.length; t+=1){
                // NB respond just updates trader's internal variables
                // doesn't alter the LOB, so processing each trader in
                // sequence (rather than random/shuffle) isn't a problem
                traders[traders[t]].respond(time, lob, trade, respond_verbose);
            }
		}
	    prevTime = time;
        time = time + timestep;
        
        LOBDATAmore.push([exchange.bids.lob_anon, exchange.asks.lob_anon]);
        if (floor(prevTime)!==floor(time)){
	        LOBDATAless.push([exchange.bids.lob_anon, exchange.asks.lob_anon]);
	    }
    }

    // end of an experiment -- dump the tape

//     exchange.publish_lob(time, true);


    // write trade_stats for this experiment NB end-of-session summary only
//     trade_stats(sess_id, traders, time, exchange.publish_lob(time, lob_verbose));

	return [LOBDATAless,LOBDATAmore];
}

//////////////////////////////////////////////////////////

// // Below here is where we set up and run a series of experiments

// set up parameters for the session

	

function experimentSetUp(lobGraphNums){

    var start_time = 0;
    var end_time = lobGraphNums;
    var duration = end_time - start_time;


    // schedule_offsetfn returns time-dependent offset on schedule prices
    function schedule_offsetfn(t){
        var pi2 = Math.pi * 2;
        var c = Math.pi * 3000;
        var wavelength = t / c;
        var gradient = 100 * t / (c / pi2);
        var amplitude = 100 * t / (c / pi2);
        var offset = gradient + amplitude * Math.sin(wavelength * t);
        return int(round(offset, 0));
    }


	var stepmode;
	for (var stepMode=0; stepMode<stepModes.length; stepMode+=1){
		if (radios[tabNames['Config']][1][stepMode].selected){
			stepmode = stepModes[stepMode];
		}
	}
	
	var timemode;
	for (var timeMode=0; timeMode<timeModes.length; timeMode+=1){
		if (radios[tabNames['Config']][2][timeMode].selected){
			timemode = timeModes[timeMode];
		}
	}
	
    var range1 = [slides[tabNames['Config']][0][1].value, slides[tabNames['Config']][0][0].value, schedule_offsetfn];
    var supply_schedule = [ {'from':start_time, 'to':end_time, 'ranges':[range1], 'stepmode':stepmode}
                        ];

    var range1 = [slides[tabNames['Config']][0][1].value, slides[tabNames['Config']][0][0].value, schedule_offsetfn];
    var demand_schedule = [ {'from':start_time, 'to':end_time, 'ranges':[range1], 'stepmode':stepmode}
                        ];

    var order_sched = {'sup':supply_schedule, 'dem':demand_schedule,
                   'interval':slides[tabNames['Config']][1][0].value, 'timemode':timemode};             // NOT drip-poisson as doesn't work in P5 currently
	

    // run a sequence of trials that exhaustively varies the ratio of four trader types
    // NB this has weakness of symmetric proportions on buyers/sellers -- combinatorics of varying that are quite nasty


	var trader_ratios_b = [];
	for (var trader_ratio=0; trader_ratio<traderNames.length; trader_ratio+=1){
		trader_ratios_b.push(slides[tabNames['Buyers']][0][trader_ratio].value);
	}
	var n_traders_b;
	for (var traderNumOption=0; traderNumOption<traderNumOptions.length; traderNumOption+=1){
		if (radios[tabNames['Buyers']][0][traderNumOption].selected){
			n_traders_b = traderNumOptions[traderNumOption];
		}
	}
	var trader_ratios_s = [];
	for (var trader_ratio=0; trader_ratio<traderNames.length; trader_ratio+=1){
		trader_ratios_s.push(slides[tabNames['Sellers']][0][trader_ratio].value);
	}
	var n_traders_s;
	for (var traderNumOption=0; traderNumOption<traderNumOptions.length; traderNumOption+=1){
		if (radios[tabNames['Sellers']][0][traderNumOption].selected){
			n_traders_s = traderNumOptions[traderNumOption];
		}
	}

	var n_trader_types = trader_types.length;
	
	function generateSpec(trader_types,trader_ratios,n_traders){
		if (trader_ratios.length!==trader_types.length){
			alert("ERROR: The arrays: 'trader_ratios' and 'trader_types' should be of the same length.");
		}
		var trader_ratio_sum = 0;
		for (var i=0; i<trader_ratios.length; i+=1){
			trader_ratio_sum += trader_ratios[i];
		}
		var spec = {};
		for (var i=0; i<trader_ratios.length; i+=1) {
		    spec[trader_types[i]] = round(n_traders * trader_ratios[i]/trader_ratio_sum);
		}
		return spec;
	}
	
    var buyers_spec = generateSpec(trader_types,trader_ratios_b,n_traders_b);//{'GVWY': 50,'SNPR': 100};//{'GVWY': 30,'ZIC': 0,'SHVR': 0,'SNPR': 170,'ZIP': 0}; // GVWY,ZIC,SHVR,SNPR,ZIP
    var sellers_spec = generateSpec(trader_types,trader_ratios_s,n_traders_s);
    var traders_spec = {'sellers':sellers_spec, 'buyers':buyers_spec};
    var trial = 0;
    return market_session('trial' + trial, start_time, end_time, traders_spec,order_sched, false, false);
}