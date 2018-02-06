var steem = require('steem');

var communityRaw = 'norod, imacryptorick, yoram, summitbreeze, backlight, dimshik, bitton, yehonatan, paps, efratbit, gnovik, igal, arnavlavan, joinnessi, aviz85, yayab, ronystb, simba, bit-news, fax4u, doriitamar, ruven94, shlomit, talhoresh, yaniv, brigitte0659, taltalim102, shulamit74, didic, troglodyte, inbarbd, poet, geekorner, kobicohen, freakyfrog, kingdavidharp, lonelywolf, mrlightning, gangstayid, yardenyo, omermushkatel, noogler, assaf, atukh09, pipomim, onnkidu, megadoom, nirgf, sagivmbs, amiramnoam, anna-holy-city, elifeldman, delechex, amichai1234, windforce, steempty, yaelmarganit, nv21089, itzhakb, dany685, roeeyb, byzul234, miriam-db, aokrat, roeysimantovhe, amit337, danielaver, gadol, telaviv, henyamania, orenshani7, techslut, yairdd, cryptosludge, michalbaram, asafb2k, fun-facts, idoitbigtime, sunrock';

var names = communityRaw.split(', ');

const botName = 'israbot';

console.log(botName+' is on!');

const postKey = ''; // get from system params

const interval = 1000;

var bot = {};

bot.name = botName;

bot.lastVisitedBlock = 0;

bot.votingQueue = [];

bot.crawlingInterval = 0;
bot.votingInterval = 0;

/* 
1. get lastBlock from Globals 
2. Crawl the bot with interval through blocks
3. Check for an Israelian author, and then push it to the queue
4. Use another interval to check the vote-power and then broadcast votes by the queue
*/

var crawl = function(blockNum) {
    steem.api.getBlock(blockNum, function(err, b) {
        if (err) {} else {
            var ts = b.transactions;
            for (var i = 0; i < ts.length; i++) {
                var t = ts[i];
                var os = t.operations;
                for (var k = 0; k < os.length; k++) {

                    var o = os[k];
                    if (o[0] == 'comment')
                        if (o[1].parent_author == '') { // Post!
                        	var p = o[1];
				if (names.indexOf(p.author) > -1){ // New post has been created by someone from the community
					var po = {
						timestamp: b.timestamp,
						author: p.author,
						permlink: p.permlink,	
					};
					bot.votingQueue.push(po);
					console.log(po);
				}
			}
                }
            }
        }

    });

}

steem.api.getDynamicGlobalProperties(function(err, result) {
    if (err) {} else {
        var head = result.head_block_number;
        bot.crawlInterval = setInterval(function() {
            crawl(head++);
        }, 3000);
    }
});