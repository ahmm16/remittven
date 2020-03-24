(function ($) {
    "use strict";

    // Changes XML to JSON
    function xmlToJson(xml) {

        // Create the return object
        var obj = {};

        if (xml.nodeType == 1) { // element
            // do attributes
            if (xml.attributes.length > 0) {
                obj["@attributes"] = {};
                for (var j = 0; j < xml.attributes.length; j++) {
                    var attribute = xml.attributes.item(j);
                    obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                }
            }
        } else if (xml.nodeType == 3) { // text
            obj = xml.nodeValue;
        }

        // do children
        if (xml.hasChildNodes()) {
            for (var i = 0; i < xml.childNodes.length; i++) {
                var item = xml.childNodes.item(i);
                var nodeName = item.nodeName;
                if (typeof (obj[nodeName]) == "undefined") {
                    obj[nodeName] = xmlToJson(item);
                } else {
                    if (typeof (obj[nodeName].push) == "undefined") {
                        var old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push(xmlToJson(item));
                }
            }
        }
        return obj;
    };
    //======================
    // Fetch Tasa
    //======================
    async function fetchUrl() {
        const url = 'https://test.remit.by/remittvenwstest/admin/getSellRates';
        var formData = new FormData();
        formData.append('username', 'app_user');
        formData.append('password', 'Soluciones01');
        formData.append('pin', '12345');
        formData.append('source_country', 'United Kingdom');
        formData.append('destination_country', 'Venezuela');

        const response = await fetch(url, {
            method: 'POST',
            body: formData,
        });

        const xml = await response.text();
        const data = await xmlToJson($.parseXML(xml))
        var rate = 'Cargando...'
        for (let item in data) {
            rate = data[item].result.rate.home_delivery["#text"]
        }
        document.getElementById("rateVal").innerHTML = rate;
        document.getElementById("rate").innerHTML = new Intl.NumberFormat("de-DE").format(rate);
        //document.getElementById("rate").innerHTML = 11.6379;
    }
    let template = $("body").hasClass("tpl-home")
    template && fetchUrl();

    function conversor(name, value) {
        let rate = parseInt($("#rateVal").text());
        value = value !== '' ? parseFloat(value) : 0
        if (value === 0) {
            $("#destination").val("0")
        }
        else {
            $("#destination").val(new Intl.NumberFormat("de-DE").format(value * rate));
            //$("#source").val(new Intl.NumberFormat("de-DE").format(value));
        }
    }

    $("#source").on("keyup", function (e) {
        let isNumber = /^\d*\.?\d*$/.test(e.target.value);

        isNumber ?
            conversor(e.target.name, e.target.value)
            :
            $("#destination").val("Introduce números sólo")


    });

    $("#source").on("keyup", function (e) {
        let isNumber = /^\d*\.?\d*$/.test(e.target.value);

        isNumber ?
            conversor(e.target.name, e.target.value)
            :
            $("#destination").val("Introduce números sólo")


    });


    //======================
    // Sticky menu
    //======================

    $(window).scroll(function () {
        if ($(window).scrollTop() >= 1) {
            $(".header").addClass("fixed-header");
        } else {
            $(".header").removeClass("fixed-header");
        }
    });

    //======================
    // Preloder
    //======================
    $(window).on("load", function () {
        $("#status").fadeOut();
        $("#preloader")
            .delay(500)
            .fadeOut("slow");
        $("body")
            .delay(500)
            .css({ overflow: "visible" });
        $("#signUpName").val(getAllUrlParams().name.replace(/[.*+?^${}()|[\]\\]/g, " "));
        $("#signUpLastName").val(getAllUrlParams().lastname.replace(/[.*+?^${}()|[\]\\]/g, " "));
        $("#email").val(getAllUrlParams().email.replace(/[*+?^${}()|[\]\\]/g, " ").replace("%40", "@"));

    });

    function getAllUrlParams(url) {

        // get query string from url (optional) or window
        var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

        // we'll store the parameters here
        var obj = {};

        // if query string exists
        if (queryString) {

            // stuff after # is not part of query string, so get rid of it
            queryString = queryString.split('#')[0];

            // split our query string into its component parts
            var arr = queryString.split('&');

            for (var i = 0; i < arr.length; i++) {
                // separate the keys and the values
                var a = arr[i].split('=');

                // set parameter name and value (use 'true' if empty)
                var paramName = a[0];
                var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

                // (optional) keep case consistent
                paramName = paramName.toLowerCase();
                if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

                // if the paramName ends with square brackets, e.g. colors[] or colors[2]
                if (paramName.match(/\[(\d+)?\]$/)) {

                    // create key if it doesn't exist
                    var key = paramName.replace(/\[(\d+)?\]/, '');
                    if (!obj[key]) obj[key] = [];

                    // if it's an indexed array e.g. colors[2]
                    if (paramName.match(/\[\d+\]$/)) {
                        // get the index value and add the entry at the appropriate position
                        var index = /\[(\d+)\]/.exec(paramName)[1];
                        obj[key][index] = paramValue;
                    } else {
                        // otherwise add the value to the end of the array
                        obj[key].push(paramValue);
                    }
                } else {
                    // we're dealing with a string
                    if (!obj[paramName]) {
                        // if it doesn't exist, create property
                        obj[paramName] = paramValue;
                    } else if (obj[paramName] && typeof obj[paramName] === 'string') {
                        // if property does exist and it's a string, convert it to an array
                        obj[paramName] = [obj[paramName]];
                        obj[paramName].push(paramValue);
                    } else {
                        // otherwise add the property
                        obj[paramName].push(paramValue);
                    }
                }
            }
        }

        return obj;
    }

    //======================
    // Mobile menu
    //======================
    $("#mobile-menu-toggler").on("click", function (e) {
        e.preventDefault();
        $(".primary-menu > ul").slideToggle();
    });
    $(".has-menu-child").append(
        '<i class="menu-dropdown fas fa-angle-down"></i>'
    );

    if ($(window).width() <= 991) {
        $(".menu-dropdown").on("click", function () {
            $(this)
                .prev()
                .slideToggle("slow");
            $(this).toggleClass("fa-angle-down fa-angle-up");
        });
    }

    //======================
    // Foo nav toggler
    //======================
    // if($('.test-caro').width() < 768 ) {
    //     $('.foo-nav h5').on('click', function() {
    //         $(this).siblings('ul').slideToggle();
    //     })
    // }

    //======================
    // Testimonial
    //======================
    $(".test-caro").owlCarousel({
        autoplay: true,
        dots: true,
        loop: true,
        margin: 30,
        nav: false,
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 2
            }
        }
    });

    //======================
    // Testimonial 2
    //======================
    $(".test-caro-2").owlCarousel({
        dots: false,
        items: 1,
        nav: true,
        navText: [
            '<i class="fas fa-arrow-left"></i>',
            '<i class="fas fa-arrow-right"></i>'
        ],
        smartSpeed: 500,
        thumbs: true,
        thumbsPrerendered: true
    });

    //======================
    // Testimonial 3
    //======================
    $(".test-caro-3").owlCarousel({
        dots: true,
        items: 1,
        nav: true,
        navText: [
            '<i class="fas fa-arrow-left"></i>',
            '<i class="fas fa-arrow-right"></i>'
        ],
        smartSpeed: 500
    });

    //======================
    // Signup/Login carousel
    //======================
    $(".sl-slider-caro").owlCarousel({
        dots: true,
        items: 1,
        nav: false,
        smartSpeed: 500
    });

    //======================
    // Partners carousel
    //======================
    $(".partners-logo").owlCarousel({
        autoplay: true,
        dots: false,
        items: 6,
        loop: true,
        margin: 60,
        nav: false,
        smartSpeed: 500,
        responsive: {
            0: {
                items: 2,
                margin: 30
            },
            400: {
                items: 3,
                margin: 40
            },
            768: {
                items: 4,
                margin: 50
            },
            992: {
                items: 5,
                margin: 50
            },
            1199: {
                items: 6
            }
        }
    });

    //======================
    // Select currency
    //======================
    $(".curr-select").on("click", function () {
        $(this)
            .children("ul")
            .slideToggle();
    });

    //======================
    // Clock
    //======================
    $("#clock")
        .countdown("2020/10/10")
        .on("update.countdown", function (event) {
            var $this = $(this).html(
                event.strftime(
                    "" +
                    "<p>week%!w <span>%-w</span> </p>" +
                    "<p>day%!d <span>%-d</span> </p>" +
                    "<p>hr <span>%H</span> </p>" +
                    "<p>min <span>%M</span> </p>" +
                    "<p>sec <span>%S</span> </p>"
                )
            );
        });

    if ($(window).width() <= 575) {
        $(".footer .foo-nav h5").append('<i class="fas fa-plus fa-minus"></i>');
        $(".footer .foo-nav h5").on("click", function () {
            $(this)
                .next("ul")
                .slideToggle("");
            $(this)
                .children("i")
                .toggleClass("fa-plus");
        });
    }

    $(".btn")
        .on("mouseenter mousemove", function (e) {
            var parentOffset = $(this).offset(),
                relX = e.pageX - parentOffset.left,
                relY = e.pageY - parentOffset.top;
            $(this)
                .find(".bh")
                .css({ top: relY, left: relX });
            var origin = relX + "px" + " " + relY + "px";
        })
        .on("mouseout", function (e) {
            var parentOffset = $(this).offset(),
                relX = e.pageX - parentOffset.left,
                relY = e.pageY - parentOffset.top;
            $(this)
                .find(".bh")
                .css({ top: relY, left: relX });
        });

    var tB = new TimelineMax({ repeat: -1, yoyo: true });
    tB.add("f1")
        .to(
            ".animg1, .ani4img1",
            3,
            { rotation: "20", ease: Power2.easeNone },
            "f1"
        )
        .to(
            ".animg2, .ani4img2",
            3,
            { rotation: "-20", ease: Power2.easeNone },
            "f1"
        )
        .to(".rcvMobile", 0.7, { y: "30", ease: Linear.easeNones }, "f1")
        .to(".rcvMobile", 0.7, { y: "0", ease: Linear.easeNones }, "-=.5");

    var tC = new TimelineMax({});
    tC.add("f2")
        .to(
            ".ani5img2, .ani7img1",
            10,
            { rotation: "360", ease: Linear.easeNone, repeat: -1 },
            "f2"
        )
        .to(
            ".ani5img3, .ani7img2",
            15,
            { rotation: "360", ease: Linear.easeNone, repeat: -1 },
            "f2"
        )
        .to(
            ".ani5img4, .ani7img3",
            20,
            { rotation: "360", ease: Linear.easeNone, repeat: -1 },
            "f2"
        )
        .to(
            ".ani7img4",
            5,
            { rotation: "360", ease: Linear.easeNone, repeat: -1 },
            "f2"
        );

    var tA = new TimelineMax({ paused: true });
    var tB = new TimelineMax({ paused: true });
    tA.add("f2")
        .to(
            ".animg5",
            1.5,
            {
                top: "0",
                ease: Power1.easeOut
            },
            "f2"
        )
        .to(".animg5", 1.5, {
            left: "30%",
            ease: Power4.easeOut,
            delay: 1
        })
        .from(
            ".abs-img",
            1.5,
            {
                left: "-20px",
                opacity: 0,
                ease: Power4.easeOut,
                delay: 1
            },
            "f2"
        )
        .from(
            ".ani5img5",
            1.5,
            {
                right: "-20%",
                opacity: 0,
                ease: Power4.easeOut
            },
            "f2"
        )
        .from(
            ".ani7img5",
            1.5,
            {
                left: "-20%",
                opacity: 0,
                ease: Power4.easeOut
            },
            "f2"
        )
        .staggerTo(
            ".an3",
            1.5,
            {
                scale: 1,
                ease: Power4.easeOut
            },
            0.3,
            "f2"
        )
        .staggerFrom(
            ".scrn-1, .scrn-2, .scrn-3",
            1,
            {
                y: 300,
                ease: Power2.easeOut
            },
            0.3,
            "f2"
        )
        .staggerFrom(
            ".speciality .iconBox",
            1,
            {
                y: 50,
                opacity: 0.5,
                ease: Power1.easeOut
            },
            0.3,
            "f2"
        );
    $(".an3, .animg5, .scrn-1, .scrn-2, .scrn-3, .abs-img, .ani5img5").onScreen(
        {
            container: window,
            direction: "vertical",
            doIn: function () {
                tA.restart();
                tB.restart();
            },
            doOut: function () {
                console.log("Out");
                // Do something to the matched elements as they get off scren
            }
        }
    );
    $(".iconBox").onScreen({
        container: window,
        direction: "vertical",
        doIn: function () {
            tA.restart();
            tB.restart();
        },
        doOut: function () {
            // console.log('Out')
            // Do something to the matched elements as they get off scren
        }
    });
    function accordionFun(e) {
        var collBTN = e + " .accordion-item h5";
        var colbody = e + " .accordion-item";
        $(collBTN).on("click", function () {
            // console.log('HI', colbody);
            $(colbody).removeClass("active");
            $(this)
                .parent(".accordion-item")
                .addClass("active");
        });
    }

    accordionFun("#accordion");
    accordionFun("#accordion1");
    accordionFun("#accordion2");
    accordionFun("#accordion3");
    accordionFun("#accordion4");
    accordionFun("#accordion5");
    accordionFun("#accordion6");

    /**
     * Nice Select
     */
    $("select").niceSelect();

    function isIE() {
        var ua = window.navigator.userAgent; //Check the userAgent property of the window.navigator object
        var msie = ua.indexOf("MSIE "); // IE 10 or older
        var trident = ua.indexOf("Trident/"); //IE 11

        return msie > 0 || trident > 0;
    }

    //function to show alert if it's IE
    function ShowIEAlert() {
        if (isIE()) {
            alert("User is using IE");
        }
    }

    /**
     * IE checking
     * Browser support for IE
     */
    function isIE() {
        var ua = window.navigator.userAgent; //Check the userAgent property of the window.navigator object
        var msie = ua.indexOf("MSIE "); // IE 10 or older
        var trident = ua.indexOf("Trident/"); //IE 11
        var edge = ua.indexOf("Edge/"); //IE 11

        return msie > 0 || trident > 0 || edge > 0;
    }

    //function to add classname if it's IE
    function addClassName() {
        if (isIE()) {
            // alert("User is using IE");
            $(".banner.v2").addClass("bSupport");
        }
    }
    console.log(window.navigator.userAgent);
    addClassName();
})(jQuery);

var imported = document.createElement("script");
imported.src = "inc/switcher/js/switcher.js";
document.head.appendChild(imported);
var styleE = document.createElement("link");
styleE.href = "inc/switcher/css/switcher.css";
styleE.rel = "stylesheet";
document.head.appendChild(styleE);
