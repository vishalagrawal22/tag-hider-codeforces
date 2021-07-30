// ==UserScript==
// @name Hide Problem Tags
// @namespace http://tampermonkey.net/
// @author Vishal Agrawal
// @version 4.0
// @description hides all other problem tags other than problem rating / difficulty tag
// @match https://codeforces.com/contest/*
// @match https://codeforces.com/problemset/problem/*
// @require http://code.jquery.com/jquery-latest.js
// ==/UserScript==

let $ = window.jQuery;
$(document).ready(function () {
    let app_name = "Tag Hider"

    function display_tags(rating, tags) {
        // console.log("Making the rating box");
        let container = $("<div></div>");
        container.addClass("problem-tags roundbox sidebox");
        container.css({ "display": "inline-block", "width":"100%"});
        let lt = $("<div></div>");
        lt.addClass("roundbox-lt");
        lt.text(" ");
        let rt = $("<div></div>");
        rt.addClass("roundbox-rt");
        rt.text(" ");
        let lb = $("<div></div>");
        lb.addClass("roundbox-lb");
        lb.text(" ");
        let rb = $("<div></div>");
        rb.addClass("roundbox-rb");
        rb.text(" ");
        container.append(lt);
        container.append(rt);
        let tag_head = $("<div></div>");
        tag_head.addClass("caption titled");
        tag_head.text("→ Problem tags");
        container.append(tag_head);
        let tag_body = $("<div></div>");
        tag_body.css({"margin-bottom": "1em"});
        let tag_container = $("<div></div>").css({ "padding": "0.5em", "display": "inline-block" });
        function make_tag(tag, type)
        {
            let tag_div = $("<div></div>");
            tag_div.addClass("roundbox");
            tag_div.css({ "margin": "2px", "padding": "0px 3px 2px 3px", "background-color": "rgb(240, 240, 240)", "float": "left" });
            tag_div.append(lt);
            tag_div.append(rt);
            tag_div.append(lb);
            tag_div.append(rb);
            let tag_span = $("<span></span>");
            tag_span.addClass("tag-box");
            tag_span.css({ "font-size": "1.2rem", "display": "inline" });
            tag_span.attr("title", "Dfs and similar");
            tag_span.text(`${tag}`);
            tag_div.append(tag_span);
            tag_container.append(tag_div);
            if (type)
            {
                tag_div.hide();
                tag_span.hide();
            }
        }
        if (rating == undefined)
        {
            make_tag("*unrated", 0);
        }
        else
        {
            make_tag("*" + rating, 0);
        }
        for (let index = 0; index < tags.length; index++) {
            const tag = tags[index];
            make_tag(tag, 1);
        }
        let button_div = $('<div></div>');
        let tag_button = $('<button></button>');
        button_div.css({ "margin-top": "3px", "display": "block" });
        $(tag_button).addClass("tag-hider")
            .html("Show Tags")
            .css({ "margin": "0 auto", "display": "block" })
            .click(toggleTag)
            .appendTo(button_div);
        let current = 0;
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
            if (current == 1) {
                $(tag_button).text("Hide Tags");
            }
            else {
                $(tag_button).text("Show Tags");
            }
        };
        tag_body.append(tag_container);
        tag_body.append(button_div);
        container.append(tag_body);
        // console.log(container);
        container.insertAfter($(".submitForm").parent().parent());
        // console.log($(".submitForm"));
    }

    function get_tags(contest_id, problem_id) {
        // console.log(contest_id);
        // console.log(problem_id);
        let base_url = "https://codeforces.com/api/contest.standings";
        let api_url = base_url + `?contestId=${contest_id}&from=1&count=1`;
        $.ajax({
            url: api_url,
            success: function (response) {
                let problem_list = response.result.problems;
                // console.log(response);
                // console.log(problem_list);
                let found = 0;
                for (let index = 0; index < problem_list.length; index++) {
                    const problem = problem_list[index];
                    if (problem.index == problem_id) {
                        found = 1;
                        // console.log(problem);
                        let rating = problem.rating;
                        let tags = problem.tags;
                        display_tags(rating, tags);
                        // console.log(tags);
                        // console.log(rating);
                        break;
                    }
                }

                if (!found) {
                    console.log(`${app_name}: Problem Not Found`);
                }
            },
            error: function (response) {
                console.log(`${app_name}: API Call Failed!`);
                console.log(response.responseJSON.comment);
            },
        });

    }

    function get_data() {
        let cid, pid;
        let path = window.location.pathname;
        let path_len = path.length;
        if (path.charAt(path_len - 1) == '/')
        {
            path_len--;
        }
        let corner = path.includes("contest");
        let endpoint = path_len - 1;
        let count = 0;
        for (let index = path_len - 1; index >= 0; index--) {
            const val = path.charAt(index);
            if (val == '/')
            {
                if (count == 1)
                {
                    if (corner)
                    {
                        corner = 0;
                        endpoint = index - 1;
                        continue;
                    }
                    cid = path.substring(index + 1, endpoint + 1);
                    break;
                }
                else
                {
                    pid = path.substring(index + 1, endpoint + 1);
                    endpoint = index - 1;
                }
                count++;
            }
        }
        get_tags(cid, pid);
    }

    if ($(".verdict-accepted").length == 0) {
        get_data();
    }
});
