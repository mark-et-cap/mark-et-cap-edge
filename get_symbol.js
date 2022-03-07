//gets domain of current window
let focusDomain = window.location.hostname;

//symbol variable
let symbolOver = {};
var targetSymbol = new Proxy(symbolOver, {
        set: function (target, key, value) {
            target[key] = value;
            return true;
        }
});

//tradingview hover timer
var timer;

//cashtag websites
let linkList = [
    "twitter.com",
    "tweetdeck.twitter.com",
    "www.marketwatch.com",
    "www.barchart.com",
    "www.fool.com",
    "finance.yahoo.com",
    "www.zacks.com",
    "finviz.com",
    "swaggystocks.com",
    "stocktwits.com",
    "www.benzinga.com",
    "unusualwhales.com",
    //crypto urls
    "www.coindesk.com",
    "cryptonews.com",
    "blockfolio.com"
    
];

function getUserFocusDomain(focusDomain) { 
    if (linkList.includes(focusDomain) && typeof focusDomain !== undefined) {
        updateLinkMenus(focusDomain);
        chrome.runtime.sendMessage({message: "switch_link"});
    } else if (focusDomain !== "undefined") {
        updateSelectionMenus();
        chrome.runtime.sendMessage({message: "switch_selection"});
    } else {
        return;
    }
};

//Gets symbol/ticker on the mouseover event of all "link" contextmenu sites (defined in the linkList variable)
function updateLinkMenus(focusDomain) {
    document.addEventListener('mouseover', function (event) {
        let hoverOver = event.target;
        if (hoverOver.tagName !== 'A') { //Ignores non-links
            return;
        } else {
            let hoverHref = hoverOver.href;
            if(hoverHref !== "undefined") {
                switch (focusDomain) {
                    case "twitter.com": twitterSymbol(hoverHref);
                        break;
                    case "tweetdeck.twitter.com": tweetdeckSymbol(hoverHref);
                        break;
                    case "www.marketwatch.com": marketwatchSymbol(hoverHref);
                        break;
                    case "www.barchart.com": barchartSymbol(hoverHref);
                        break;
                    case "www.fool.com": motleyfoolSymbol(hoverHref);
                        break;
                    case "finance.yahoo.com": yahooFSymbol(hoverHref);
                        break;
                    case "www.zacks.com": zacksSymbol(hoverHref);
                        break;
                    case "finviz.com": finvizSymbol(hoverHref);
                        break;
                    case "swaggystocks.com": swaggySymbol(hoverHref);
                        break;
                    case "stocktwits.com": stocktwitsSymbol(hoverHref);
                        break;
                    case "www.benzinga.com": benzingaSymbol(hoverHref);
                        break;
                    case "unusualwhales.com": unusualWhaleSymbol(hoverHref);
                        break;
                    case "www.coindesk.com": coindeskSymbol(hoverHref);
                        break;
                    case "cryptonews.com": cryptonewsSymbol(hoverHref);
                        break;
                    case "blockfolio.com": blockfolioSymbol(hoverHref);
                        break;
                    case "defipulse.com": defipulseSymbol(hoverHref);
                        break;
                }
                return false;
            }
        }
    });
};

//non-link matches
function updateSelectionMenus() {
    document.addEventListener('mouseup', function () {
        let userSelection = window.getSelection().toString().replace(/\W+/g, '');
        if (userSelection.length > 0 && userSelection.length <= 5) {
            chrome.runtime.sendMessage({content: userSelection, message: "get_selection"});
        } else {
            chrome.runtime.sendMessage({content: userSelection, message: "other_selection"});
            return;
        }
    })
};

//Stock linkList matches
function twitterSymbol(hoverHref) {
    if (hoverHref.substring(0,32) == "https://twitter.com/search?q=%24") { 
        let symbolOver = hoverHref.split('%24').pop().split('&src')[0];
        chrome.runtime.sendMessage({content: symbolOver, message: "get_symbol"});
        targetSymbol.symbol = symbolOver;
        targetSymbol.hover = hoverHref;
    }
};

function tweetdeckSymbol(hoverHref) {
    if(hoverHref.includes("src=cashtag_click")) {
        let symbolOver = hoverHref.split('%24').pop().split('&src')[0];
        chrome.runtime.sendMessage({content: symbolOver, message: "get_symbol"});
        targetSymbol.symbol = symbolOver;
        targetSymbol.hover = hoverHref;
    }
};

function marketwatchSymbol(hoverHref) {
    if (hoverHref.substring(0,44) == "https://www.marketwatch.com/investing/stock/") {
        let symbolOver = hoverHref.split('k/').pop().split('?mod')[0];
        chrome.runtime.sendMessage({content: symbolOver, message: "get_symbol"});
        targetSymbol.symbol = symbolOver;
        targetSymbol.hover = hoverHref;
    } else {
        if  (hoverHref.substring(0,44) == "https://www.marketwatch.com/investing/index/") {
            let symbolOver = hoverHref.split('x/').pop().split('?mod')[0];
            chrome.runtime.sendMessage({content: symbolOver, message: "get_symbol"});
            targetSymbol.symbol = symbolOver;
            targetSymbol.hover = hoverHref;
        }
    }
};

function barchartSymbol(hoverHref) {
    if (hoverHref.substring(25,30) == "stock" || hoverHref.substring(25,35) == "etfs-funds") { 
        if (hoverHref.includes("overview")) {
            let symbolOver = hoverHref.split('es/').pop().split('/ov')[0].replace(/\W+/g, '');
            chrome.runtime.sendMessage({content: symbolOver, message: "get_symbol"});
            targetSymbol.symbol = symbolOver;
            targetSymbol.hover = hoverHref;
        } else {
            if (hoverHref.substring(25,30) == "stock") {
                let symbolOver = hoverHref.split('es/').pop().replace(/\W+/g, '');
                chrome.runtime.sendMessage({content: symbolOver, message: "get_symbol"});
                targetSymbol.symbol = symbolOver;
                targetSymbol.hover = hoverHref;
            }
        }
    }
};

function motleyfoolSymbol(hoverHref) {
    if (hoverHref.includes("quote")) {
        let foolSplit = hoverHref.split('/');
        let symbolOver = foolSplit[foolSplit.length - 2];
        chrome.runtime.sendMessage({content: symbolOver, message: "get_symbol"});
        targetSymbol.symbol = symbolOver;
        targetSymbol.hover = hoverHref;
    }
};


function yahooFSymbol(hoverHref) {
    if (hoverHref.includes("quote")) {
        let symbolOver = hoverHref.split('te/').pop().split('?p=')[0];
        if (symbolOver.includes('-USD')) {
            let symbolOverCrypto = symbolOver.replace('-USD','');
            chrome.runtime.sendMessage({content: symbolOverCrypto, message: "get_symbol"});
            targetSymbol.symbol = symbolOver;
            targetSymbol.hover = hoverHref;
        } else {
            chrome.runtime.sendMessage({content: symbolOver, message: "get_symbol"});
            targetSymbol.symbol = symbolOver;
            targetSymbol.hover = hoverHref;
        }
    }   
};

function zacksSymbol(hoverHref) {
    if (hoverHref.includes("stock/quote")) {
        let zacksSplit = hoverHref.split('/')
        let symbolOver = zacksSplit[zacksSplit.length -1];
        chrome.runtime.sendMessage({content: symbolOver, message: "get_symbol"});
    } else {
        if (hoverHref.includes("funds/etf") && hoverHref.includes("profile")) {
            let symbolOver = hoverHref.split('f/').pop().split('/profile')[0].replace(/\W+/g, '');
            chrome.runtime.sendMessage({content: symbolOver, message: "get_symbol"});
        } else if (hoverHref.includes("funds/etf") && hoverHref.includes("etfs-recent_quotes")) {
            let symbolOver = hoverHref.split('f/').pop().split('?art')[0].replace(/\W+/g, '');
            chrome.runtime.sendMessage({content: symbolOver, message: "get_symbol"});
        } else {
            if (hoverHref.includes("funds/etf")) {
                let zacksSplit = hoverHref.split('/')
                let symbolOver = zacksSplit[zacksSplit.length -1];
                chrome.runtime.sendMessage({content: symbolOver, message: "get_symbol"});
            }
        }
    }
};

function finvizSymbol(hoverHref) {
    if (hoverHref.includes("quote") && hoverHref.includes("&b=2")) {
        let symbolOver = hoverHref.split('?t=').pop().split('&b=2')[0].replace(/\W+/g, '');
        chrome.runtime.sendMessage({content: symbolOver, message: "get_symbol"});
        targetSymbol.symbol = symbolOver;
        targetSymbol.hover = hoverHref;
    } else if (hoverHref.includes("quote") && hoverHref.includes("&b=1")) {
        let symbolOver = hoverHref.split('?t=').pop().split('&ty=')[0].replace(/\W+/g, '');
        chrome.runtime.sendMessage({content: symbolOver, message: "get_symbol"});
        targetSymbol.symbol = symbolOver;
        targetSymbol.hover = hoverHref;
    } else {
        if (hoverHref.includes("quote")) {
            let finvizSplit = hoverHref.split('=');
            let symbolOver = finvizSplit[finvizSplit.length -1];
            chrome.runtime.sendMessage({content: symbolOver, message: "get_symbol"});
            targetSymbol.symbol = symbolOver;
            targetSymbol.hover = hoverHref;
        }
    }
};

function swaggySymbol(hoverHref) {
    if  ((hoverHref.includes("dashboard/stocks") && ((!hoverHref.includes("competitor-analysis") && !hoverHref.includes("earnings-calendar") && !hoverHref.includes("due-diligence"))) 
        || (hoverHref.includes("ticker-sentiment") && hoverHref.length>66))) {
            let swaggySplit = hoverHref.split('/');
            let symbolOver = swaggySplit[swaggySplit.length -1];
            chrome.runtime.sendMessage({content: symbolOver, message: "get_symbol"});
            targetSymbol.symbol = symbolOver;
            targetSymbol.hover = hoverHref;
    }
};

function stocktwitsSymbol(hoverHref) {
    if (hoverHref.includes("symbol")) {
        let twitsSplit = hoverHref.split('/');
        let symbolOver = twitsSplit[twitsSplit.length -1];
        chrome.runtime.sendMessage({content: symbolOver, message: "get_symbol"});
        targetSymbol.symbol = symbolOver;
        targetSymbol.hover = hoverHref;
    } 
};

function benzingaSymbol(hoverHref) {
    if (hoverHref.includes("stock")) {
        if(hoverHref.includes("#")) {
        let symbolOver = hoverHref.split('/').pop().split('#')[0].replace(/\W+/g, '');
        chrome.runtime.sendMessage({content: symbolOver, message: "get_symbol"});
        targetSymbol.symbol = symbolOver;
        targetSymbol.hover = hoverHref;
        } else {
            let benzingaSplit = hoverHref.split('/');
            let symbolOver = benzingaSplit[benzingaSplit.length -1];
            chrome.runtime.sendMessage({content: symbolOver, message: "get_symbol"});
            targetSymbol.symbol = symbolOver;
            targetSymbol.hover = hoverHref;
        }
    } else {
        if(hoverHref.includes("quote")) {
            let benzingaSplit = hoverHref.split('/');
            let symbolOver = benzingaSplit[benzingaSplit.length -1];
            chrome.runtime.sendMessage({content: symbolOver, message: "get_symbol"});
            targetSymbol.symbol = symbolOver;
            targetSymbol.hover = hoverHref;
        }
    }
};  

function unusualWhaleSymbol(hoverHref) {
    if (hoverHref.includes("ticker_flow")) {
        let whaleSplit = hoverHref.split('/');
        let symbolOver = whaleSplit[whaleSplit.length -1];
        chrome.runtime.sendMessage({content: symbolOver, message: "get_symbol"});
    } else {
        if (hoverHref.includes("/company/")) {
        let whaleSplit = hoverHref.split('/');
        let symbolOver = whaleSplit[whaleSplit.length -2];
        chrome.runtime.sendMessage({content: symbolOver, message: "get_symbol"});
        }
    }
};
          
// crypto linkList matches
function coindeskSymbol(hoverHref) {
    if (hoverHref.includes("price")) {
        let coindeskSplit = hoverHref.split('/');
        let symbolOver = coindeskSplit[coindeskSplit.length -1];
        chrome.runtime.sendMessage({content: symbolOver, message: "find_crypto_ticker"}, function(response) {
            let symbolTicker = response.dbResponse
            chrome.runtime.sendMessage({content: symbolTicker, message: "get_symbol"});
            return true;
        })
    }
}

function cryptonewsSymbol(hoverHref) {
    if (hoverHref.includes("coins")) {
        let cryptonewsSplit = hoverHref.split('/');
        let symbolOver = cryptonewsSplit[cryptonewsSplit.length -2];
        chrome.runtime.sendMessage({content: symbolOver, message: "find_crypto_ticker"}, function(response) {
            let symbolTicker = response.dbResponse
            chrome.runtime.sendMessage({content: symbolTicker, message: "get_symbol"});
            targetSymbol.symbol = symbolOver;
            targetSymbol.hover = hoverHref;
            return true;
        })
    }
};

function blockfolioSymbol(hoverHref) {
    if (hoverHref.includes("coin")) {
        let blockfolioSplit = hoverHref.split('/');
        let symbolOver = blockfolioSplit[blockfolioSplit.length -1];
        if(symbolOver.indexOf("_") != -1) {
            let symbolFormat = symbolOver.substring(0, symbolOver.length -2);
            chrome.runtime.sendMessage({content: symbolFormat, message: "get_symbol"});
            targetSymbol.symbol = symbolOver;
            targetSymbol.hover = hoverHref;
        } else {
            chrome.runtime.sendMessage({content: symbolOver, message: "get_symbol"});
            targetSymbol.symbol = symbolOver;
            targetSymbol.hover = hoverHref;
        }
    }
};



//Get domain
//setInterval to recheck if domain is available every .3 seconds 
function focusDomainAvailable() {
    if(typeof focusDomain !== "undefined"){
        getUserFocusDomain(focusDomain);
    } else {
        setInterval(focusDomainAvailable(), 300);
    }
};


//event listener to get the new domain when focus changes
window.addEventListener("focus", function(e) {
    if(typeof focusDomain !== "undefined"){
        focusDomainAvailable();    
    }
});


//onload, start looking for domain
window.onload = function () {
    focusDomainAvailable();
    TVOptionEnabled();
    if(document.getElementById('tradingview-container') == null) {
        let wrapper = document.createElement("div");
        wrapper.id = "tradingview-container";
        document.body.appendChild(wrapper);
        wrapper.style.cssText = 'display: none; position: absolute; z-index: 9999; margin:15px';
    }
};

function TVOptionEnabled() {
    chrome.storage.sync.get([
        "enableHoverChart"
    ], function(hover) {
        userTVHoverEnabled = hover.enableHoverChart;
        if (userTVHoverEnabled == true) {
            document.addEventListener('mouseover',TVHoverOver, true);
        } else {
            document.removeEventListener('mouseover',TVHoverOver, true);
        }
    });
};

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    let recentDomain = focusDomain;
    if(msg.request =="get_recent_domain") {
        sendResponse({domain: recentDomain});
    } else if (msg.request =="tradingview_widget"){
        sendResponse({response: "received"});
        let tvWidget = document.getElementById('tradingview-container');
        let tradingViewScript = msg.content;
        tvWidget.innerHTML += tradingViewScript;
    }
});



/*** TradingView Hover ***/

function renderBubble(mouseX, mouseY) {
    let iframe = document.getElementById('tradingview-container');
    setTimeout(function(){
        iframe.style.display = 'block';
        iframe.style.top = mouseY + 'px';
        iframe.style.left = mouseX + 'px';
        iframe.style.height = '300px';
        iframe.style.width = '482px';
    }, 250);
    ['click', 'contextmenu'].forEach(function(e) {
        document.addEventListener(e, function(e){
            if(e.target !== iframe) {
                iframe.style.display = 'none';
                return;
            };
        });
    });
};


function TVHoverOver(event) {
    let hoverOver = event.target;
    if (hoverOver.tagName !== 'A') { //Ignores non-links
        return;
    } else {
        displayTVChart(hoverOver, event);
        startTimeoutClear(hoverOver, event);
    };
};

function displayTVChart(hoverOver, event){
    timer = setTimeout(function(){
        let TVsymbolOver = symbolOver.symbol;
        let hoverHref = symbolOver.hover;
        if( hoverHref == hoverOver.href) {
            hoverOver.style.cssText = "cursor: progress;";
            hoverOver.id = "tv-hover";
            chrome.runtime.sendMessage({content: TVsymbolOver, message: "get_tradingView_Widget"});        
            chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
                if(msg.request == "tradingview_widget"){
                    sendResponse({response: "received"});
                    let tvWidget = document.getElementById('tradingview-container');
                    let tradingViewScript = msg.content;
                    tvWidget.innerHTML = '';
                    tvWidget.innerHTML += tradingViewScript;
                    renderBubble(event.pageX, event.pageY);
                };
            });
        };
        return true;
    }, 2000)
};

function startTimeoutClear(hoverOver, event) {
    if(document.getElementById("tradingview-container") !== null) {
        ['mouseleave', 'contextmenu'].forEach(function(e) {
            hoverOver.addEventListener(e, function(){
                clearTimeout(timer);
                hoverOver.removeEventListener
            }, { once: true });   
        });
    } else {
        return true;
    }
};

chrome.storage.onChanged.addListener(function () {
    TVOptionEnabled();
});