(function(e) {
    e.fn.fullpage = function(t) {
        function d() {
            e("body").append('<div id="fp-nav"><ul></ul></div>');
            h = e("#fp-nav");
            h.css("color", t.navigationColor);
            h.addClass(t.navigationPosition);
            for (var n = 0; n < e(".fp-section").length; n++) {
                var r = "";
                if (t.anchors.length) {
                    r = t.anchors[n]
                }
                var i = '<li><a href="#' + r + '"><span></span></a>';
                var s = t.navigationTooltips[n];
                if (s != undefined && s != "") {
                    i += '<div class="fp-tooltip ' + t.navigationPosition + '">' + s + "</div>"
                }
                i += "</li>";
                h.find("ul").append(i)
            }
        }

        function v() {
            e(".fp-section").each(function() {
                var t = e(this).find(".fp-slide");
                if (t.length) {
                    t.each(function() {
                        Z(e(this))
                    })
                } else {
                    Z(e(this))
                }
            });
            e.isFunction(t.afterRender) && t.afterRender.call(this)
        }

        function b() {
            if (!t.autoScrolling || t.scrollBar) {
                var n = e(window).scrollTop();
                var r = 0;
                var i = Math.abs(n - e(".fp-section").first().offset().top);
                e(".fp-section").each(function(t) {
                    var s = Math.abs(n - e(this).offset().top);
                    if (s < i) {
                        r = t;
                        i = s
                    }
                });
                var s = e(".fp-section").eq(r)
            }
            if (!t.autoScrolling) {
                if (!s.hasClass("active")) {
                    y = true;
                    var o = e(".fp-section.active").index(".fp-section") + 1;
                    var u = G(s);
                    var f = s.data("anchor");
                    s.addClass("active").siblings().removeClass("active");
                    if (!a) {
                        e.isFunction(t.onLeave) && t.onLeave.call(this, o, s.index(".fp-section") + 1, u);
                        e.isFunction(t.afterLoad) && t.afterLoad.call(this, f, s.index(".fp-section") + 1)
                    }
                    K(f, 0);
                    if (t.anchors.length && !a) {
                        l = f;
                        location.hash = f
                    }
                    clearTimeout(m);
                    m = setTimeout(function() {
                        y = false
                    }, 100)
                }
            }
            if (t.scrollBar) {
                clearTimeout(g);
                g = setTimeout(function() {
                    if (!a) {
                        _(s)
                    }
                }, 1e3)
            }
        }

        function w(e) {
            if (e.find(".fp-slides").length) {
                scrollable = e.find(".fp-slide.active").find(".fp-scrollable")
            } else {
                scrollable = e.find(".fp-scrollable")
            }
            return scrollable
        }

        function E(t, n) {
            if (t == "down") {
                var r = "bottom";
                var i = e.fn.fullpage.moveSectionDown
            } else {
                var r = "top";
                var i = e.fn.fullpage.moveSectionUp
            } if (n.length > 0) {
                if (Q(r, n)) {
                    i()
                } else {
                    return true
                }
            } else {
                i()
            }
        }

        function C(n) {
            var i = n.originalEvent;
            if (!k(n.target)) {
                if (t.autoScrolling) {
                    n.preventDefault()
                }
                var s = e(".fp-section.active");
                var o = w(s);
                if (!a && !r) {
                    var u = dt(i);
                    T = u["y"];
                    N = u["x"];
                    if (s.find(".fp-slides").length && Math.abs(x - N) > Math.abs(S - T)) {
                        if (Math.abs(x - N) > e(window).width() / 100 * t.touchSensitivity) {
                            if (x > N) {
                                e.fn.fullpage.moveSlideRight()
                            } else {
                                e.fn.fullpage.moveSlideLeft()
                            }
                        }
                    } else if (t.autoScrolling) {
                        if (Math.abs(S - T) > e(window).height() / 100 * t.touchSensitivity) {
                            if (S > T) {
                                E("down", o)
                            } else if (T > S) {
                                E("up", o)
                            }
                        }
                    }
                }
            }
        }

        function k(n, r) {
            r = r || 0;
            var i = e(n).parent();
            if (r < t.normalScrollElementTouchThreshold && i.is(t.normalScrollElements)) {
                return true
            } else if (r == t.normalScrollElementTouchThreshold) {
                return false
            } else {
                return k(i, ++r)
            }
        }

        function L(e) {
            var t = e.originalEvent;
            var n = dt(t);
            S = n["y"];
            x = n["x"]
        }

        function A(n) {
            if (t.autoScrolling) {
                n = window.event || n;
                var r = Math.max(-1, Math.min(1, n.wheelDelta || -n.deltaY || -n.detail));
                if (t.scrollBar) {
                    n.preventDefault ? n.preventDefault() : n.returnValue = false
                }
                var i = e(".fp-section.active");
                var s = w(i);
                if (!a) {
                    if (r < 0) {
                        E("down", s)
                    } else {
                        E("up", s)
                    }
                }
                return false
            }
        }

        function O(n) {
            var i = e(".fp-section.active");
            var s = i.find(".fp-slides");
            if (!s.length || r) {
                return
            }
            var o = s.find(".fp-slide.active");
            var u = null;
            if (n === "prev") {
                u = o.prev(".fp-slide")
            } else {
                u = o.next(".fp-slide")
            } if (!u.length) {
                if (!t.loopHorizontal) return;
                if (n === "prev") {
                    u = o.siblings(":last")
                } else {
                    u = o.siblings(":first")
                }
            }
            r = true;
            q(s, u)
        }

        function M() {
            e(".fp-slide.active").each(function() {
                vt(e(this))
            })
        }

        function _(n, r, i) {
            var s = n.position();
            if (typeof s === "undefined") {
                return
            }
            var o = {
                element: n,
                callback: r,
                isMovementUp: i,
                dest: s,
                dtop: s.top,
                yMovement: G(n),
                anchorLink: n.data("anchor"),
                sectionIndex: n.index(".fp-section"),
                activeSlide: n.find(".fp-slide.active"),
                activeSection: e(".fp-section.active"),
                leavingSection: e(".fp-section.active").index(".fp-section") + 1,
                localIsResizing: f
            };
            if (o.activeSection.is(n) && !f || t.scrollBar && e(window).scrollTop() === o.dtop) {
                return
            }
            if (o.activeSlide.length) {
                var u = o.activeSlide.data("anchor");
                var c = o.activeSlide.index()
            }
            if (t.autoScrolling && t.continuousVertical && typeof o.isMovementUp !== "undefined" && (!o.isMovementUp && o.yMovement == "up" || o.isMovementUp && o.yMovement == "down")) {
                o = H(o)
            }
            n.addClass("active").siblings().removeClass("active");
            a = true;
            if (typeof o.anchorLink !== "undefined") {
                ut(c, u, o.anchorLink)
            }
            e.isFunction(t.onLeave) && !o.localIsResizing && t.onLeave.call(this, o.leavingSection, o.sectionIndex + 1, o.yMovement);
            D(o);
            l = o.anchorLink;
            if (t.autoScrolling) {
                K(o.anchorLink, o.sectionIndex)
            }
        }

        function D(n) {
            if (t.css3 && t.autoScrolling && !t.scrollBar) {
                var r = "translate3d(0px, -" + n.dtop + "px, 0px)";
                rt(r, true);
                setTimeout(function() {
                    j(n)
                }, t.scrollingSpeed)
            } else {
                var i = P(n);
                e(i.element).animate(i.options, t.scrollingSpeed, t.easing).promise().done(function() {
                    j(n)
                })
            }
        }

        function P(e) {
            var n = {};
            if (t.autoScrolling && !t.scrollBar) {
                n.options = {
                    top: -e.dtop
                };
                n.element = "." + p
            } else {
                n.options = {
                    scrollTop: e.dtop
                };
                n.element = "html, body"
            }
            return n
        }

        function H(t) {
            if (!t.isMovementUp) {
                e(".fp-section.active").after(t.activeSection.prevAll(".fp-section").get().reverse())
            } else {
                e(".fp-section.active").before(t.activeSection.nextAll(".fp-section"))
            }
            mt(e(".fp-section.active").position().top);
            M();
            t.wrapAroundElements = t.activeSection;
            t.dest = t.element.position();
            t.dtop = t.dest.top;
            t.yMovement = G(t.element);
            return t
        }

        function B(t) {
            if (!t.wrapAroundElements || !t.wrapAroundElements.length) {
                return
            }
            if (t.isMovementUp) {
                e(".fp-section:first").before(t.wrapAroundElements)
            } else {
                e(".fp-section:last").after(t.wrapAroundElements)
            }
            mt(e(".fp-section.active").position().top);
            M()
        }

        function j(r) {
            B(r);
            e.isFunction(t.afterLoad) && !r.localIsResizing && t.afterLoad.call(this, r.anchorLink, r.sectionIndex + 1);
            setTimeout(function() {
                a = false;
                e.isFunction(r.callback) && r.callback.call(this)
            }, n)
        }

        function F() {
            var e = window.location.hash.replace("#", "").split("/");
            var t = e[0];
            var n = e[1];
            if (t) {
                it(t, n)
            }
        }

        function I() {
            if (!y) {
                var e = window.location.hash.replace("#", "").split("/");
                var t = e[0];
                var n = e[1];
                if (t.length) {
                    var i = typeof l === "undefined";
                    var s = typeof l === "undefined" && typeof n === "undefined" && !r;
                    if (t && t !== l && !i || s || !r && c != n) {
                        it(t, n)
                    }
                }
            }
        }

        function q(n, i) {
            var s = i.position();
            var o = n.find(".fp-slidesContainer").parent();
            var u = i.index();
            var a = n.closest(".fp-section");
            var l = a.index(".fp-section");
            var c = a.data("anchor");
            var h = a.find(".fp-slidesNav");
            var p = i.data("anchor");
            var d = f;
            if (t.onSlideLeave) {
                var v = a.find(".fp-slide.active").index();
                var m = Y(v, u);
                if (!d && m !== "none") {
                    e.isFunction(t.onSlideLeave) && t.onSlideLeave.call(this, c, l + 1, v, m)
                }
            }
            i.addClass("active").siblings().removeClass("active");
            if (typeof p === "undefined") {
                p = u
            }
            if (!t.loopHorizontal) {
                a.find(".fp-controlArrow.fp-prev").toggle(u != 0);
                a.find(".fp-controlArrow.fp-next").toggle(!i.is(":last-child"))
            }
            if (a.hasClass("active")) {
                ut(u, p, c)
            }
            var g = function() {
                if (!d) {
                    e.isFunction(t.afterSlideLoad) && t.afterSlideLoad.call(this, c, l + 1, p, u)
                }
                r = false
            };
            if (t.css3) {
                var y = "translate3d(-" + s.left + "px, 0px, 0px)";
                W(n.find(".fp-slidesContainer"), t.scrollingSpeed > 0).css(gt(y));
                setTimeout(function() {
                    g()
                }, t.scrollingSpeed, t.easing)
            } else {
                o.animate({
                    scrollLeft: s.left
                }, t.scrollingSpeed, t.easing, function() {
                    g()
                })
            }
            h.find(".active").removeClass("active");
            h.find("li").eq(u).find("a").addClass("active")
        }

        function U() {
            z();
            if (i) {
                if (e(document.activeElement).attr("type") !== "text") {
                    e.fn.fullpage.reBuild(true)
                }
            } else {
                clearTimeout(R);
                R = setTimeout(function() {
                    e.fn.fullpage.reBuild(true)
                }, 500)
            }
        }

        function z() {
            if (t.responsive) {
                var n = o.hasClass("fp-responsive");
                if (e(window).width() < t.responsive) {
                    if (!n) {
                        e.fn.fullpage.setAutoScrolling(false);
                        e("#fp-nav").hide();
                        o.addClass("fp-responsive")
                    }
                } else if (n) {
                    e.fn.fullpage.setAutoScrolling(true);
                    e("#fp-nav").show();
                    o.removeClass("fp-responsive")
                }
            }
        }

        function W(e, n) {
            var r = "all " + t.scrollingSpeed + "ms " + t.easingcss3;
            if (n) {
                e.removeClass("fp-notransition");
                return e.css({
                    "-webkit-transition": r,
                    transition: r
                })
            }
            return X(e)
        }

        function X(e) {
            return e.addClass("fp-notransition")
        }

        function V(n, r) {
            if (t.navigation) {
                e("#fp-nav").find(".active").removeClass("active");
                if (n) {
                    e("#fp-nav").find('a[href="#' + n + '"]').addClass("active")
                } else {
                    e("#fp-nav").find("li").eq(r).find("a").addClass("active")
                }
            }
        }

        function J(n) {
            if (t.menu) {
                e(t.menu).find(".active").removeClass("active");
                e(t.menu).find('[data-menuanchor="' + n + '"]').addClass("active")
            }
        }

        function K(e, t) {
            J(e);
            V(e, t)
        }

        function Q(e, t) {
            if (e === "top") {
                return !t.scrollTop()
            } else if (e === "bottom") {
                return t.scrollTop() + 1 + t.innerHeight() >= t[0].scrollHeight
            }
        }

        function G(t) {
            var n = e(".fp-section.active").index(".fp-section");
            var r = t.index(".fp-section");
            if (n == r) {
                return "none"
            }
            if (n > r) {
                return "up"
            }
            return "down"
        }

        function Y(e, t) {
            if (e == t) {
                return "none"
            }
            if (e > t) {
                return "left"
            }
            return "right"
        }

        function Z(e) {
            e.css("overflow", "hidden");
            var n = e.closest(".fp-section");
            var r = e.find(".fp-scrollable");
            if (r.length) {
                var i = r.get(0).scrollHeight
            } else {
                var i = e.get(0).scrollHeight;
                if (t.verticalCentered) {
                    i = e.find(".fp-tableCell").get(0).scrollHeight
                }
            }
            var s = u - parseInt(n.css("padding-bottom")) - parseInt(n.css("padding-top"));
            if (i > s) {
                if (r.length) {
                    r.css("height", s + "px").parent().css("height", s + "px")
                } else {
                    if (t.verticalCentered) {
                        e.find(".fp-tableCell").wrapInner('<div class="fp-scrollable" />')
                    } else {
                        e.wrapInner('<div class="fp-scrollable" />')
                    }
                    e.find(".fp-scrollable").slimScroll({
                        allowPageScroll: true,
                        height: s + "px",
                        size: "10px",
                        alwaysVisible: true
                    })
                }
            } else {
                et(e)
            }
            e.css("overflow", "")
        }

        function et(e) {
            e.find(".fp-scrollable").children().first().unwrap().unwrap();
            e.find(".slimScrollBar").remove();
            e.find(".slimScrollRail").remove()
        }

        function tt(e) {
            e.addClass("fp-table").wrapInner('<div class="fp-tableCell" style="height:' + nt(e) + 'px;" />')
        }

        function nt(e) {
            var n = u;
            if (t.paddingTop || t.paddingBottom) {
                var r = e;
                if (!r.hasClass("fp-section")) {
                    r = e.closest(".fp-section")
                }
                var i = parseInt(r.css("padding-top")) + parseInt(r.css("padding-bottom"));
                n = u - i
            }
            return n
        }

        function rt(e, t) {
            W(o, t);
            o.css(gt(e))
        }

        function it(t, n) {
            if (typeof n === "undefined") {
                n = 0
            }
            if (isNaN(t)) {
                var r = e('[data-anchor="' + t + '"]')
            } else {
                var r = e(".fp-section").eq(t - 1)
            } if (t !== l && !r.hasClass("active")) {
                _(r, function() {
                    st(r, n)
                })
            } else {
                st(r, n)
            }
        }

        function st(e, t) {
            if (typeof t != "undefined") {
                var n = e.find(".fp-slides");
                var r = n.find('[data-anchor="' + t + '"]');
                if (!r.length) {
                    r = n.find(".fp-slide").eq(t)
                }
                if (r.length) {
                    q(n, r)
                }
            }
        }

        function ot(e, n) {
            e.append('<div class="fp-slidesNav"><ul></ul></div>');
            var r = e.find(".fp-slidesNav");
            r.addClass(t.slidesNavPosition);
            for (var i = 0; i < n; i++) {
                r.find("ul").append('<li><a href="#"><span></span></a></li>')
            }
            r.css("margin-left", "-" + r.width() / 2 + "px");
            r.find("li").first().find("a").addClass("active")
        }

        function ut(e, n, r) {
            var i = "";
            if (t.anchors.length) {
                if (e) {
                    if (typeof r !== "undefined") {
                        i = r
                    }
                    if (typeof n === "undefined") {
                        n = e
                    }
                    c = n;
                    location.hash = i + "/" + n
                } else if (typeof e !== "undefined") {
                    c = n;
                    location.hash = r
                } else {
                    location.hash = r
                }
            }
        }

        function at() {
            var e = document.createElement("p"),
                t, n = {
                    webkitTransform: "-webkit-transform",
                    OTransform: "-o-transform",
                    msTransform: "-ms-transform",
                    MozTransform: "-moz-transform",
                    transform: "transform"
                };
            document.body.insertBefore(e, null);
            for (var r in n) {
                if (e.style[r] !== undefined) {
                    e.style[r] = "translate3d(1px,1px,1px)";
                    t = window.getComputedStyle(e).getPropertyValue(n[r])
                }
            }
            document.body.removeChild(e);
            return t !== undefined && t.length > 0 && t !== "none"
        }

        function ft() {
            if (document.addEventListener) {
                document.removeEventListener("mousewheel", A, false);
                document.removeEventListener("wheel", A, false)
            } else {
                document.detachEvent("onmousewheel", A)
            }
        }

        function lt() {
            if (document.addEventListener) {
                document.addEventListener("mousewheel", A, false);
                document.addEventListener("wheel", A, false)
            } else {
                document.attachEvent("onmousewheel", A)
            }
        }

        function ct() {
            if (i || s) {
                MSPointer = pt();
                e(document).off("touchstart " + MSPointer.down).on("touchstart " + MSPointer.down, L);
                e(document).off("touchmove " + MSPointer.move).on("touchmove " + MSPointer.move, C)
            }
        }

        function ht() {
            if (i || s) {
                MSPointer = pt();
                e(document).off("touchstart " + MSPointer.down);
                e(document).off("touchmove " + MSPointer.move)
            }
        }

        function pt() {
            var e;
            if (window.PointerEvent) {
                e = {
                    down: "pointerdown",
                    move: "pointermove"
                }
            } else {
                e = {
                    down: "MSPointerDown",
                    move: "MSPointerMove"
                }
            }
            return e
        }

        function dt(e) {
            var t = new Array;
            if (window.navigator.msPointerEnabled) {
                t["y"] = e.pageY;
                t["x"] = e.pageX
            } else {
                t["y"] = e.touches[0].pageY;
                t["x"] = e.touches[0].pageX
            }
            return t
        }

        function vt(n) {
            var r = t.scrollingSpeed;
            e.fn.fullpage.setScrollingSpeed(0);
            q(n.closest(".fp-slides"), n);
            e.fn.fullpage.setScrollingSpeed(r)
        }

        function mt(e) {
            if (t.scrollBar) {
                o.scrollTop(e)
            } else if (t.css3) {
                var n = "translate3d(0px, -" + e + "px, 0px)";
                rt(n, false)
            } else {
                o.css("top", -e)
            }
        }

        function gt(e) {
            return {
                "-webkit-transform": e,
                "-moz-transform": e,
                "-ms-transform": e,
                transform: e
            }
        }

        function yt() {
            mt(0);
            e("#fp-nav, .fp-slidesNav, .fp-controlArrow").remove();
            e(".fp-section").css({
                height: "",
                "background-color": "",
                padding: ""
            });
            e(".fp-slide").css({
                width: ""
            });
            o.css({
                height: "",
                position: "",
                "-ms-touch-action": "",
                "touch-action": ""
            });
            e(".fp-section, .fp-slide").each(function() {
                et(e(this));
                e(this).removeClass("fp-table active")
            });
            X(o);
            X(o.find(".fp-easing"));
            o.find(".fp-tableCell, .fp-slidesContainer, .fp-slides").each(function() {
                e(this).replaceWith(this.childNodes)
            });
            e("html, body").scrollTop(0)
        }

        function bt() {
            if (t.continuousVertical && (t.loopTop || t.loopBottom)) {
                t.continuousVertical = false;
                console && console.warn && console.warn("Option `loopTop/loopBottom` is mutually exclusive with `continuousVertical`; `continuousVertical` disabled")
            }
            if (t.continuousVertical && t.scrollBar) {
                t.continuousVertical = false;
                console && console.warn && console.warn("Option `scrollBar` is mutually exclusive with `continuousVertical`; `continuousVertical` disabled")
            }
        }
        t = e.extend({
            menu: false,
            anchors: [1, 2, 3, 4],
            navigation: false,
            navigationPosition: "right",
            navigationColor: "#000",
            navigationTooltips: ["Start", "Results", "Details", "Credits"],
            slidesNavigation: false,
            slidesNavPosition: "right",
            scrollBar: false,
            css3: true,
            scrollingSpeed: 700,
            autoScrolling: true,
            easing: "easeInQuart",
            easingcss3: "ease",
            loopBottom: false,
            loopTop: false,
            loopHorizontal: true,
            continuousVertical: false,
            normalScrollElements: "",
            scrollOverflow: false,
            touchSensitivity: 5,
            normalScrollElementTouchThreshold: 5,
            keyboardScrolling: true,
            animateAnchor: true,
            controlArrowColor: "#fff",
            verticalCentered: true,
            resize: false,
            sectionsColor: [],
            paddingTop: "60px",
            paddingBottom: "40px",
            fixedElements: null,
            responsive: 0,
            sectionSelector: ".section",
            slideSelector: ".slide",
            afterLoad: null,
            onLeave: null,
            afterRender: null,
            afterResize: null,
            afterReBuild: null,
            afterSlideLoad: null,
            onSlideLeave: null,
        }, t);
        bt();
        var n = 600;
        e.fn.fullpage.setAutoScrolling = function(n) {
            t.autoScrolling = n;
            var r = e(".fp-section.active");
            if (t.autoScrolling && !t.scrollBar) {
                e("html, body").css({
                    overflow: "hidden",
                    height: "100%"
                });
                o.css({
                    "-ms-touch-action": "none",
                    "touch-action": "none"
                });
                if (r.length) {
                    mt(r.position().top)
                }
            } else {
                e("html, body").css({
                    overflow: "visible",
                    height: "initial"
                });
                o.css({
                    "-ms-touch-action": "",
                    "touch-action": ""
                });
                mt(0);
                e("html, body").scrollTop(r.position().top)
            }
        };
        e.fn.fullpage.setScrollingSpeed = function(e) {
            t.scrollingSpeed = e
        };
        e.fn.fullpage.setMouseWheelScrolling = function(e) {
            if (e) {
                lt()
            } else {
                ft()
            }
        };
        e.fn.fullpage.setAllowScrolling = function(t) {
            if (t) {
                e.fn.fullpage.setMouseWheelScrolling(true);
                ct()
            } else {
                e.fn.fullpage.setMouseWheelScrolling(false);
                ht()
            }
        };
        e.fn.fullpage.setKeyboardScrolling = function(e) {
            t.keyboardScrolling = e
        };
        e.fn.fullpage.moveSectionUp = function() {
            var n = e(".fp-section.active").prev(".fp-section");
            if (!n.length && (t.loopTop || t.continuousVertical)) {
                n = e(".fp-section").last()
            }
            if (n.length) {
                _(n, null, true)
            }
        };
        e.fn.fullpage.moveSectionDown = function() {
            var n = e(".fp-section.active").next(".fp-section");
            console.log("test");
            if (!n.length && (t.loopBottom || t.continuousVertical)) {
                n = e(".fp-section").first()
            }
            if (n.length) {
                _(n, null, false)
            }
        };
        e.fn.fullpage.moveTo = function(t, n) {
            var r = "";
            if (isNaN(t)) {
                r = e('[data-anchor="' + t + '"]')
            } else {
                r = e(".fp-section").eq(t - 1)
            } if (typeof n !== "undefined") {
                it(t, n)
            } else if (r.length > 0) {
                _(r)
            }
        };
        e.fn.fullpage.moveSlideRight = function() {
            O("next")
        };
        e.fn.fullpage.moveSlideLeft = function() {
            O("prev")
        };
        e.fn.fullpage.reBuild = function(n) {
            f = true;
            var r = e(window).width();
            u = e(window).height();
            e(".fp-section").each(function() {
                var n = u - parseInt(e(this).css("padding-bottom")) - parseInt(e(this).css("padding-top"));
                if (t.verticalCentered) {
                    e(this).find(".fp-tableCell").css("height", nt(e(this)) + "px")
                }
                e(this).css("height", u + "px");
                if (t.scrollOverflow) {
                    var r = e(this).find(".fp-slide");
                    if (r.length) {
                        r.each(function() {
                            Z(e(this))
                        })
                    } else {
                        Z(e(this))
                    }
                }
                var r = e(this).find(".fp-slides");
                if (r.length) {
                    q(r, r.find(".fp-slide.active"))
                }
            });
            var i = e(".fp-section.active").position();
            var s = e(".fp-section.active");
            if (s.index(".fp-section")) {
                _(s)
            }
            f = false;
            e.isFunction(t.afterResize) && n && t.afterResize.call(this);
            e.isFunction(t.afterReBuild) && !n && t.afterReBuild.call(this)
        };
        var r = false;
        var i = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|BB10|Windows Phone|Tizen|Bada)/);
        var s = "ontouchstart" in window || navigator.msMaxTouchPoints > 0;
        var o = e(this);
        var u = e(window).height();
        var a = false;
        var f = false;
        var l;
        var c;
        var h;
        var p = "fullpage-wrapper";
        e.fn.fullpage.setAllowScrolling(false);
        if (t.css3) {
            t.css3 = at()
        }
        if (e(this).length) {
            o.css({
                height: "100%",
                position: "relative"
            });
            o.addClass(p)
        } else {
            console.error("Error! Fullpage.js needs to be initialized with a selector. For example: $('#myContainer').fullpage();")
        }
        e(t.sectionSelector).each(function() {
            e(this).addClass("fp-section")
        });
        e(t.slideSelector).each(function() {
            e(this).addClass("fp-slide")
        });
        if (t.navigation) {
            d()
        }
        e(".fp-section").each(function(n) {
            var r = e(this);
            var i = e(this).find(".fp-slide");
            var s = i.length;
            if (!n && e(".fp-section.active").length === 0) {
                e(this).addClass("active")
            }
            e(this).css("height", u + "px");
            if (t.paddingTop || t.paddingBottom) {
                e(this).css("padding", t.paddingTop + " 0 " + t.paddingBottom + " 0")
            }
            if (typeof t.sectionsColor[n] !== "undefined") {
                e(this).css("background-color", t.sectionsColor[n])
            }
            if (typeof t.anchors[n] !== "undefined") {
                e(this).attr("data-anchor", t.anchors[n])
            }
            if (s > 1) {
                var o = s * 100;
                var a = 100 / s;
                i.wrapAll('<div class="fp-slidesContainer" />');
                i.parent().wrap('<div class="fp-slides" />');
                e(this).find(".fp-slidesContainer").css("width", o + "%");
                e(this).find(".fp-slides").after('<div class="fp-controlArrow fp-prev"></div><div class="fp-controlArrow fp-next"></div>');
                if (t.controlArrowColor != "#fff") {
                    e(this).find(".fp-controlArrow.fp-next").css("border-color", "transparent transparent transparent " + t.controlArrowColor);
                    e(this).find(".fp-controlArrow.fp-prev").css("border-color", "transparent " + t.controlArrowColor + " transparent transparent")
                }
                if (!t.loopHorizontal) {
                    e(this).find(".fp-controlArrow.fp-prev").hide()
                }
                if (t.slidesNavigation) {
                    ot(e(this), s)
                }
                i.each(function(n) {
                    e(this).css("width", a + "%");
                    if (t.verticalCentered) {
                        tt(e(this))
                    }
                });
                var f = r.find(".fp-slide.active");
                if (f.length == 0) {
                    i.eq(0).addClass("active")
                } else {
                    vt(f)
                }
            } else {
                if (t.verticalCentered) {
                    tt(e(this))
                }
            }
        }).promise().done(function() {
            e.fn.fullpage.setAutoScrolling(t.autoScrolling);
            var n = e(".fp-section.active").find(".fp-slide.active");
            if (n.length && (e(".fp-section.active").index(".fp-section") != 0 || e(".fp-section.active").index(".fp-section") == 0 && n.index() != 0)) {
                vt(n)
            }
            if (t.fixedElements && t.css3) {
                e(t.fixedElements).appendTo("body")
            }
            if (t.navigation) {
                h.css("margin-top", "-" + h.height() / 2 + "px");
                h.find("li").eq(e(".fp-section.active").index(".fp-section")).find("a").addClass("active")
            }
            if (t.menu && t.css3 && e(t.menu).closest(".fullpage-wrapper").length) {
                e(t.menu).appendTo("body")
            }
            if (t.scrollOverflow) {
                if (document.readyState === "complete") {
                    v()
                }
                e(window).on("load", v)
            } else {
                e.isFunction(t.afterRender) && t.afterRender.call(this)
            }
            z();
            var r = window.location.hash.replace("#", "").split("/");
            var i = r[0];
            if (i.length) {
                var s = e('[data-anchor="' + i + '"]');
                if (!t.animateAnchor && s.length) {
                    if (t.autoScrolling) {
                        mt(s.position().top)
                    } else {
                        mt(0);
                        e("html, body").scrollTop(s.position().top)
                    }
                    K(i, null);
                    e.isFunction(t.afterLoad) && t.afterLoad.call(this, i, s.index(".fp-section") + 1);
                    s.addClass("active").siblings().removeClass("active")
                }
            }
            e(window).on("load", function() {
                F()
            })
        });
        var m;
        var g;
        var y = false;
        e(window).on("scroll", b);
        var S = 0;
        var x = 0;
        var T = 0;
        var N = 0;
        e(window).on("hashchange", I);
        e(document).keydown(function(n) {
            if (t.keyboardScrolling && !a && t.autoScrolling) {
                switch (n.which) {
                    case 38:
                    case 33:
                        e.fn.fullpage.moveSectionUp();
                        break;
                    case 40:
                    case 34:
                        e.fn.fullpage.moveSectionDown();
                        break;
                    case 36:
                        e.fn.fullpage.moveTo(1);
                        break;
                    case 35:
                        e.fn.fullpage.moveTo(e(".fp-section").length);
                        break;
                    case 37:
                        e.fn.fullpage.moveSlideLeft();
                        break;
                    case 39:
                        e.fn.fullpage.moveSlideRight();
                        break;
                    default:
                        return
                }
            }
        });
        e(document).on("click touchstart", "#fp-nav a", function(t) {
            t.preventDefault();
            var n = e(this).parent().index();
            _(e(".fp-section").eq(n))
        });
        e(document).on("click touchstart", ".fp-slidesNav a", function(t) {
            t.preventDefault();
            var n = e(this).closest(".fp-section").find(".fp-slides");
            var r = n.find(".fp-slide").eq(e(this).closest("li").index());
            q(n, r)
        });
        if (t.normalScrollElements) {
            e(document).on("mouseenter", t.normalScrollElements, function() {
                e.fn.fullpage.setMouseWheelScrolling(false)
            });
            e(document).on("mouseleave", t.normalScrollElements, function() {
                e.fn.fullpage.setMouseWheelScrolling(true)
            })
        }
        e(".fp-section").on("click touchstart", ".fp-controlArrow", function() {
            if (e(this).hasClass("fp-prev")) {
                e.fn.fullpage.moveSlideLeft()
            } else {
                e.fn.fullpage.moveSlideRight()
            }
        });
        e(window).resize(U);
        var R;
        e.fn.fullpage.destroy = function(n) {
            e.fn.fullpage.setAutoScrolling(false);
            e.fn.fullpage.setAllowScrolling(false);
            e.fn.fullpage.setKeyboardScrolling(false);
            e(window).off("scroll", b).off("hashchange", I).off("resize", U);
            e(document).off("click", "#fp-nav a").off("mouseenter", "#fp-nav li").off("mouseleave", "#fp-nav li").off("click", ".fp-slidesNav a").off("mouseover", t.normalScrollElements).off("mouseout", t.normalScrollElements);
            e(".fp-section").off("click", ".fp-controlArrow");
            if (n) {
                yt()
            }
        }
    }
})(jQuery)
