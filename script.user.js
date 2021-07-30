// ==UserScript==
// @name Hide Problem Tags
// @namespace http://tampermonkey.net/
// @author Vishal Agrawal
// @version 1.1
// @description hides all other problem tags other than problem rating / difficulty tag
// @match https://codeforces.com/contest/*
// @match https://codeforces.com/problemset/*
// @match https://codeforces.com/problemset
// @require http://code.jquery.com/jquery-latest.js
// ==/UserScript==

let $ = window.jQuery;
// document.getElementsByTagName("html")[0].style.visibility = "hidden";
$(document).ready(function () {
    let problemset_tags = $('a[href^="/problemset?tags="]');
    problemset_tags.hide();
    problemset_tags.parent().hide();
    if ($(".verdict-accepted").length == 0) {
        let box = $(".tag-box").parent().parent();
        if (box.length != 0) {
            let current = 1;
            box = box[0];
            let button_div = $('<div></div>');
            let tag_button = $('<button></button>');
            button_div.css({ "margin-top": "3px", "display": "block" });
            $(tag_button).addClass("tag-hider")
                .html("Show Tags")
                .css({ "margin": "0 auto", "display": "block" })
                .click(toggleTag)
                .appendTo(button_div);
            function toggleTag() {
                current = (1 - current);
                $(".tag-box").each(function () {
                    let tag = $(this);
                    let tag_text = tag.text().trim();
                    if (tag_text.charAt(0) != "*") {
                        tag.toggle();
                        tag.parent().toggle();
                    }
                });
                if (current == 0) {
                    $(tag_button).text("Hide Tags");
                }
                else {
                    $(tag_button).text("Show Tags");
                }
            };
            button_div.appendTo(box);
            toggleTag();
        }
    }
    // document.getElementsByTagName("html")[0].style.visibility = "visible";
});
