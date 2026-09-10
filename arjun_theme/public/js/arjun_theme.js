(function () {
    "use strict";

    frappe.provide("arjun_theme");

    // Every Desk tab always reads "OM HRMS", regardless of which page/report/
    // form is open. frappe.utils.set_title is the single choke point every
    // route change (router.js, page.js) funnels through, so overriding it
    // here covers the whole Desk rather than patching each call site.
    arjun_theme.FIXED_TAB_TITLE = "OM HRMS";
    frappe.utils.set_title = function () {
        document.title = arjun_theme.FIXED_TAB_TITLE;
    };
    document.title = arjun_theme.FIXED_TAB_TITLE;

    // frappe.utils.scroll_to() defaults to animating $("html, body") when no
    // element_to_be_scrolled is passed - true in stock Frappe, where the
    // document itself scrolls. This theme's layout uses a nested
    // .app-content div (overflow-y: auto, height: 100vh) as the real
    // scrolling container instead, so html/body never actually moves.
    // Callers throughout Frappe core (e.g. grid_row.js opening a row for
    // edit) never pass their own scroll target, so without this the browser
    // silently animates an element that was never scrolling - the row
    // expands in place with no attempt to bring the rest of it into view.
    //
    // Redirecting element_to_be_scrolled to .app-content alone isn't enough:
    // frappe's own get_scroll_position() computes scroll_top as
    // $(element).offset().top - navbar_height - additional_offset, which
    // assumes whatever it scrolls shares the document's coordinate space
    // (true for html/body, where scrollTop counts pixels from the very top
    // of the page). .app-content's scrollTop instead counts pixels from the
    // top of .app-content's OWN frame, which already starts below the
    // navbar - reusing that formula double-subtracts the navbar height,
    // landing short of the intended position and leaving a large gap of
    // dimmed content above the row editor instead of opening near the top.
    // Computing the delta directly from current rendered positions
    // (getBoundingClientRect, both already in the same viewport space)
    // sidesteps that mismatch entirely.
    if (frappe.utils && frappe.utils.scroll_to) {
        const _original_scroll_to = frappe.utils.scroll_to;
        frappe.utils.scroll_to = function (
            element,
            animate,
            additional_offset,
            element_to_be_scrolled,
            callback,
            highlight_element
        ) {
            const $appContent = $(".app-content");
            if (!element_to_be_scrolled && $appContent.length && element && typeof element !== "number") {
                const target = $(element).get(0);
                const container = $appContent.get(0);
                if (target && container) {
                    const targetRect = target.getBoundingClientRect();
                    const containerRect = container.getBoundingClientRect();
                    const offset = cint(additional_offset) || 0;
                    const new_scroll_top =
                        container.scrollTop + (targetRect.top - containerRect.top) + offset;

                    if (animate) {
                        $appContent.animate({ scrollTop: Math.max(new_scroll_top, 0) }, 400);
                    } else {
                        container.scrollTop = Math.max(new_scroll_top, 0);
                    }
                    if (highlight_element) {
                        $(element).addClass("highlight");
                        document.addEventListener(
                            "click",
                            function () {
                                $(element).removeClass("highlight");
                            },
                            { once: true }
                        );
                    }
                    callback && callback();
                    return;
                }
            }
            return _original_scroll_to.call(
                this,
                element,
                animate,
                additional_offset,
                element_to_be_scrolled,
                callback,
                highlight_element
            );
        };
    }

    arjun_theme.setup = function () {
        $('body').addClass('arjun-theme-active');
        arjun_theme.run_patches();
    };

    arjun_theme.setup_icon_picker = function () {
        const $target = $('[data-fieldname="custom_animated_icon"]');
        if ($target.length && !$target.find('.btn-icon-picker').length) {
            const $label = $target.find('.control-label');
            const $btn = $(`<button class="btn btn-xs btn-default btn-icon-picker" style="margin-left: 10px; margin-top: -2px; padding: 2px 8px; font-size: 10px;">
                <iconify-icon icon="line-md:search" width="12" style="vertical-align: middle;"></iconify-icon>
                <span style="vertical-align: middle; margin-left: 4px;">Choose Icon</span>
            </button>`);

            $label.append($btn);

            $btn.on('click', (e) => {
                e.preventDefault();
                arjun_theme.show_icon_dialog();
            });

            // Double click on input
            $target.find('input').on('dblclick', () => {
                arjun_theme.show_icon_dialog();
            });
        }
    };

    arjun_theme.show_icon_dialog = function () {
        const icons = [
            'account', 'alert-circle', 'arrow-close-left', 'arrow-close-right', 'arrow-close-up', 
            'arrow-down', 'arrow-down-circle', 'arrow-down-circle-twotone', 'arrow-down-square', 
            'arrow-down-square-twotone', 'arrow-left', 'arrow-left-circle', 'arrow-left-circle-twotone', 
            'arrow-left-square', 'arrow-left-square-twotone', 'arrow-long-diagonal', 'arrow-long-diagonal-rotated', 
            'arrow-open-down', 'arrow-open-left', 'arrow-open-right', 'arrow-open-up', 'arrow-right', 
            'arrow-right-circle', 'arrow-right-circle-twotone', 'arrow-right-square', 'arrow-right-square-twotone', 
            'arrow-small-down', 'arrow-small-left', 'arrow-small-right', 'arrow-small-up', 'arrow-up', 
            'arrow-up-circle', 'arrow-up-circle-twotone', 'arrow-up-square', 'arrow-up-square-twotone', 
            'arrows-diagonal', 'arrows-diagonal-rotated', 'arrows-horizontal', 'arrows-horizontal-alt', 
            'arrows-vertical', 'arrows-vertical-alt', 'backup-restore', 'beer', 'bell', 'bell-alert', 
            'briefcase', 'buy-me-a-coffee', 'cake', 'calendar', 'cancel', 'chat', 'chat-bubble', 
            'check-all', 'check-list-3', 'chevron-double-down', 'chevron-double-left', 'chevron-double-right', 
            'chevron-double-up', 'chevron-down', 'chevron-left', 'chevron-right', 'chevron-up', 
            'circle', 'clipboard', 'close', 'cloud', 'cloud-braces-loop', 'cloud-down', 
            'cloud-download-loop', 'cloud-upload-loop', 'coffee', 'cog', 'compass', 'computer', 
            'confirm', 'construction', 'discord', 'document', 'document-add', 'document-code', 
            'document-list', 'document-remove', 'document-report', 'double-arrow-horizontal', 
            'double-arrow-vertical', 'download-loop', 'edit', 'email', 'emoji-angry', 'emoji-frown', 
            'emoji-grin', 'emoji-neutral', 'emoji-smile', 'external-link', 'facebook', 'filter', 
            'flag', 'fork-left', 'fork-right', 'gauge', 'gauge-loop', 'github', 'grid-3', 
            'hash', 'heart', 'home', 'iconify1', 'image', 'instagram', 'laptop', 'light-dark', 
            'lightbulb', 'linkedin', 'list', 'loading-loop', 'log-in', 'log-out', 'map-marker', 
            'marker', 'mastodon', 'medical-services', 'menu', 'menu-fold-left', 'menu-fold-right', 
            'menu-to-close-transition', 'minus', 'moon', 'my-location', 'navigation', 'paint-drop', 
            'patreon', 'pause', 'pencil', 'person', 'person-add', 'person-off', 'person-search', 
            'phone', 'pixelfed', 'play', 'pleroma', 'plus', 'printer', 'question', 'reddit', 
            'refresh', 'remove', 'rotate-180', 'rotate-270', 'rotate-90', 'round-360', 'search', 
            'share', 'shield', 'shopping-cart', 'speed', 'speedometer', 'square', 'star', 
            'sun', 'switch', 'telegram', 'text-box', 'text-box-multiple', 'thumbs-down', 
            'thumbs-up', 'tiktok', 'trash', 'twitter', 'upload-loop', 'user', 'video', 'watch', 'youtube'
        ];



        const d = new frappe.ui.Dialog({
            title: __('Select Animated Icon'),
            fields: [
                { label: __('Search Icons'), fieldname: 'search', fieldtype: 'Data' },
                { label: __('Icons'), fieldname: 'icon_grid', fieldtype: 'HTML' }
            ]
        });

        const render_grid = (filter = '') => {
            let html = `<div class="icon-grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 12px; max-height: 450px; overflow-y: auto; padding: 15px;">`;
            icons.filter(i => i.includes(filter.toLowerCase())).forEach(icon => {
                html += `
                    <div class="icon-item text-center" data-icon="${icon}" style="padding: 10px; border: 1px solid var(--border-color); border-radius: 8px; cursor:pointer; transition: all 0.2s; background: var(--bg-color);">
                        <iconify-icon icon="line-md:${icon}" width="28" height="28"></iconify-icon>
                        <div style="font-size: 11px; margin-top: 8px; color: var(--text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${icon}</div>
                    </div>`;
            });
            html += `</div>`;
            d.get_field('icon_grid').$wrapper.html(html);

            d.get_field('icon_grid').$wrapper.find('.icon-item').on('mouseenter', function() {
                $(this).css({'background-color': 'var(--fg-hover-color)', 'border-color': 'var(--primary-color)', 'transform': 'scale(1.05)'});
            }).on('mouseleave', function() {
                $(this).css({'background-color': 'var(--bg-color)', 'border-color': 'var(--border-color)', 'transform': 'scale(1)'});
            }).on('click', function() {
                const selectedIcon = $(this).attr('data-icon');
                if (cur_frm) {
                    cur_frm.set_value('custom_animated_icon', selectedIcon);
                } else {
                    $('[data-fieldname="custom_animated_icon"] input').val(selectedIcon).trigger('change');
                }
                d.hide();
            });
        };

        d.fields_dict.search.$input.on('input', (e) => {
            render_grid(e.target.value);
        });

        d.show();
        render_grid();
    };

    arjun_theme.run_patches = function () {
        arjun_theme.highlight_active_route();
        arjun_theme.mutate_workspace_container();
        arjun_theme.mutate_custom_elements();
        arjun_theme.inject_navbar_toggle();
        arjun_theme.mutate_number_cards();
        arjun_theme.setup_icon_picker();
        arjun_theme.setup_responsive_sidebar();
        arjun_theme.setup_sidebar_expand();
        arjun_theme.inject_hrms_home_greeting();
        arjun_theme.setup_explore_social_split();
        arjun_theme.setup_social_feed_widget();
        arjun_theme.setup_widget_card_collapse();
        arjun_theme.inject_sidebar_collapsed_logo();
        arjun_theme.simplify_navbar_search_placeholder();
    };

    // Frappe's navbar search input placeholder is "Search or type a
    // command (Ctrl + G)" - shortened to "Search ..." here.
    arjun_theme.simplify_navbar_search_placeholder = function () {
        const el = document.getElementById('navbar-search');
        if (el && el.placeholder !== 'Search ...') {
            el.placeholder = 'Search ...';
        }
    };

    // Time-of-day greeting banner ("Good Morning, <name>") above the
    // shortcuts on the Hrms Home workspace only - matched by the rendered
    // page title text rather than the route, since workspace routes are
    // slugified client-side (frappe.router.slug) and matching what's
    // actually on screen is more robust than re-deriving that slug here.
    //
    // Prepended to .layout-main-section (the direct parent of the
    // workspace's own .editor-js-container) rather than .page-body, which
    // sits several levels *outside* the actual scrolling element
    // (.layout-main-section-wrapper, overflow:auto) - anchoring there made
    // the banner stay fixed in place while only the cards below it
    // scrolled, needing two separate scroll gestures instead of one.
    // .layout-main-section itself isn't touched by Frappe's async
    // workspace rendering (only its .editor-js-container child's content
    // gets replaced), so the banner still shows up immediately rather than
    // waiting on that content to load.
    arjun_theme.inject_hrms_home_greeting = function () {
        // Frappe's SPA keeps every page you've visited mounted in the DOM
        // (just hidden with display:none) rather than destroying it on
        // route change, so after switching through a few other modules and
        // back, more than one ".title-area .title-text" can exist at once.
        // Without :visible, .first() can grab a leftover hidden page's
        // title instead of the one actually on screen, fail the "Hrms
        // Home" check below, and rip out an already-correct banner.
        const $title = $('.title-area .title-text:visible').first();
        if (!$title.length || $title.text().trim() !== 'Hrms Home') {
            $('#arjun-hrms-greeting').remove();
            // document.body is reused across Frappe's SPA route changes -
            // reset this so the hide-until-ready CSS (scoped to
            // body:has(#arjun-hrms-greeting)) protects against the flash
            // again next time the user navigates back to Hrms Home,
            // instead of the class staying set from this visit forever.
            document.body.classList.remove('arjun-groups-ready');
            arjun_theme._split_done = false;
            arjun_theme._groups_done = false;
            arjun_theme._widget_done = false;
            arjun_theme._reveal_failsafe_scheduled = false;
            return;
        }
        if ($('#arjun-hrms-greeting').length) return;

        const $main_section = $('.layout-main-section').first();
        if (!$main_section.length) return;

        const hour = new Date().getHours();
        let greeting = 'Good Evening';
        if (hour < 12) greeting = 'Good Morning';
        else if (hour < 17) greeting = 'Good Afternoon';

        const full_name = (frappe.boot.user && frappe.boot.user.full_name) || frappe.session.user_fullname || frappe.session.user;
        const today = frappe.datetime.str_to_user(frappe.datetime.get_today());

        // The HR Admin Dashboard (company-wide HR ops - headcount, today's
        // attendance, pending approvals, birthdays/anniversaries) is only
        // useful to - and only readable by - HR/System Manager staff; the
        // www controller behind /admin-dashboard enforces the same role
        // check server-side, this just keeps the button from being shown
        // to people who'd hit a redirect anyway.
        const can_see_admin_dashboard = frappe.user.has_role(['System Manager', 'HR Manager', 'Administrator']);
        const admin_btn_html = can_see_admin_dashboard
            ? '<a href="/admin-dashboard" class="arjun-hrms-dashboard-btn">' +
                '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="7.5" r="3"/><path d="M3 19c1.2-3.4 3.6-5.1 6-5.1s4.8 1.7 6 5.1" stroke-linecap="round"/><path d="M16 8v4M14 10h4" stroke-linecap="round"/></svg>' +
                '<span>Admin Dashboard</span>' +
              '</a>'
            : '';

        // Same HR/System Manager-only visibility as the Admin Dashboard
        // button above - the www controller behind /onboarding-dashboard
        // enforces the same check server-side.
        const onboarding_btn_html = can_see_admin_dashboard
            ? '<a href="/onboarding-dashboard" class="arjun-hrms-dashboard-btn">' +
                '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="8" r="3.2"/><path d="M2.5 20c1.2-3.6 3.8-5.4 6.5-5.4s5.3 1.8 6.5 5.4" stroke-linecap="round"/><circle cx="17" cy="8.5" r="2.6"/><path d="M15.5 14.8c2.2.3 4 1.9 5 4.9" stroke-linecap="round"/></svg>' +
                '<span>Onboarding Dashboard</span>' +
              '</a>'
            : '';

        const $banner = $(
            '<div id="arjun-hrms-greeting" class="arjun-hrms-greeting">' +
                '<div class="arjun-hrms-greeting-text">' +
                    '<h2>' + frappe.utils.escape_html(greeting) + ', ' + frappe.utils.escape_html(full_name) + '</h2>' +
                    '<div class="arjun-hrms-greeting-date">' + frappe.utils.escape_html(today) + '</div>' +
                '</div>' +
                '<div class="arjun-hrms-greeting-actions">' +
                    admin_btn_html +
                    onboarding_btn_html +
                    '<a href="/ess-dashboard" class="arjun-hrms-dashboard-btn">' +
                        '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/></svg>' +
                        '<span>Dashboard</span>' +
                    '</a>' +
                '</div>' +
            '</div>'
        );
        $main_section.prepend($banner);
    };

    // ---- Social feed widget (Hrms Home, above Explore) ----
    // A compact composer + latest-3-posts preview of the full /social-feed
    // page (olscpl_hrms.api.social_feed) - not interactive beyond posting
    // and the emoji/image tools; liking, commenting, and the HR approval
    // queue all live on the full page, linked via "View Social Feed".
    arjun_theme.SOCIAL_EMOJIS = [
        '😀', '😁', '😂', '🤣', '😊', '😍', '😘',
        '😎', '🤔', '😅', '😢', '😭', '😡', '🥳',
        '👍', '👎', '👏', '🙌', '🤝', '💪', '🙏',
        '❤️', '🔥', '🎉', '✨', '🌟', '💯', '⭐',
        '🚀', '📢', '📌', '✅', '❌', '⚡', '🎯',
    ];

    // Same clean line-icon set as /social-feed's own ICONS object (raw
    // emoji glyphs like 🙂/🖼 for the toolbar buttons themselves render
    // inconsistently across platforms and look out of place next to the
    // rest of the flat UI - these render identically everywhere).
    arjun_theme.SOCIAL_ICONS = {
        emoji: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M8.5 14s1.3 2 3.5 2 3.5-2 3.5-2" stroke-linecap="round"/><path d="M8.5 9.5h.01M15.5 9.5h.01" stroke-linecap="round" stroke-linewidth="2.5"/></svg>',
        image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="16" rx="2.5"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="m4 17 5-5 3.5 3.5L17 11l3 3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20.5s-7.5-4.6-10-9.3C0.3 7.8 2 4.5 5.3 4c2-.3 3.9.6 5 2.2.9-1.6 3-2.5 5-2.2 3.3.5 5 3.8 3.3 7.2-2.5 4.7-10 9.3-10 9.3Z" stroke-linejoin="round"/></svg>',
        comment: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4h16v12H8l-4 4V4Z" stroke-linejoin="round"/></svg>',
        arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    };

    arjun_theme.SOCIAL_MAX_IMAGES = 6; // matches MAX_IMAGES_PER_POST in olscpl_hrms/api/social_feed.py
    arjun_theme.SOCIAL_MAX_ATTACHMENTS = 6; // matches MAX_ATTACHMENTS_PER_POST

    arjun_theme._social_is_image_file = function (file) { return /^image\//.test(file.type); };

    arjun_theme._social_format_size = function (bytes) {
        if (bytes == null) return '';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    arjun_theme._social_file_icon = function (filename) {
        const ext = (filename.split('.').pop() || '').toLowerCase();
        if (ext === 'pdf') return '📄';
        if (['doc', 'docx'].indexOf(ext) !== -1) return '📝';
        if (['xls', 'xlsx', 'csv'].indexOf(ext) !== -1) return '📊';
        if (['ppt', 'pptx'].indexOf(ext) !== -1) return '📑';
        if (['zip', 'rar', '7z'].indexOf(ext) !== -1) return '🗜️';
        return '📎';
    };

    // Composing (text/images/attachments/emoji) is now entirely local to
    // whichever compose dialog is open (see _open_social_compose_dialog) -
    // this only tracks the widget's own persistent post list and the
    // inline comment-thread UI, since those need to survive across dialog
    // opens/closes.
    arjun_theme._social_state = {
        me: { name: '', image: null },
        posts: [],
        loaded: false,
        canApprove: false,
        expanded: {}, // postName -> bool (inline comment thread open)
        comments: {}, // postName -> [...] (null while loading)
        commentDraft: {}, // postName -> in-progress comment text
    };

    arjun_theme._social_find_post = function (name) {
        return arjun_theme._social_state.posts.find(function (p) { return p.name === name; });
    };

    arjun_theme._social_avatar_html = function (author, size) {
        size = size || 36;
        if (author && author.image) {
            return '<img class="arjun-social-avatar" style="width:' + size + 'px;height:' + size + 'px" src="' + frappe.utils.escape_html(author.image) + '">';
        }
        var initials = ((author && author.name) || '').split(' ').filter(Boolean).slice(0, 2).map(function (p) { return p[0].toUpperCase(); }).join('');
        return '<div class="arjun-social-avatar" style="width:' + size + 'px;height:' + size + 'px">' + frappe.utils.escape_html(initials) + '</div>';
    };

    arjun_theme._social_relative_time = function (iso) {
        if (!iso) return '';
        var then = new Date(iso.replace(' ', 'T'));
        if (isNaN(then.getTime())) return '';
        var diff = Math.max(0, (Date.now() - then.getTime()) / 1000);
        if (diff < 60) return 'just now';
        if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
        if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
        return Math.floor(diff / 86400) + 'd ago';
    };

    // Moves the workspace's own "Explore" heading + its shortcut cards out
    // of the flat block list they normally sit in (alongside "Reports &
    // Masters" etc.) and into the left half of a two-column row, leaving
    // an empty right half for setup_social_feed_widget() to fill with
    // "Social Posts" - "Reports & Masters" and everything after it just
    // naturally follows in the same DOM position it always has, untouched.
    //
    // Reused pattern from _group_widget_cards below: editorjs renders its
    // blocks progressively (not all at once), and re-renders the whole
    // list from scratch on every workspace revisit (this.editor.render()
    // in workspace.js) - so this has to be idempotent and safe to call
    // repeatedly, and a stray empty-text heading block only counts as a
    // boundary once it actually has visible text.
    arjun_theme._explore_split_timer = null;

    // Three independent things all have to finish before it's safe to
    // reveal the workspace content (arjun-groups-ready, added by whichever
    // of these three runs last): the Explore/Social Posts split, the
    // Reports & Masters card grouping, and the Social Posts widget itself
    // actually being inserted into the split's right column - each has
    // its own async/debounced completion, and revealing on any one of
    // them alone would just trade one flash for a different one (e.g. an
    // empty right column popping the widget in a beat after everything
    // else already appeared).
    arjun_theme._split_done = false;
    arjun_theme._groups_done = false;
    arjun_theme._widget_done = false;
    arjun_theme._reveal_failsafe_scheduled = false;

    arjun_theme._maybe_reveal_workspace = function () {
        if (arjun_theme._split_done && arjun_theme._groups_done && arjun_theme._widget_done) {
            document.body.classList.add('arjun-groups-ready');
        }
    };

    arjun_theme.setup_explore_social_split = function () {
        const $title = $('.title-area .title-text:visible').first();
        if (!$title.length || $title.text().trim() !== 'Hrms Home') return;
        if ($('.arjun-explore-social-split').length) return; // already split this render
        if ($('.skeleton-card').length > 0) return; // still loading - try again next patch cycle

        // Failsafe: if any of the three pieces above never actually
        // completes for some reason, that would otherwise hide the whole
        // workspace forever - force it visible after a few seconds
        // regardless, same safety net setup_widget_card_collapse already
        // has for grouping alone. Scheduled once per Hrms Home visit (the
        // flags above get reset when navigating away), not once per page
        // load, since document.body carries over across route changes.
        if (!arjun_theme._reveal_failsafe_scheduled) {
            arjun_theme._reveal_failsafe_scheduled = true;
            setTimeout(function () {
                document.body.classList.add('arjun-groups-ready');
            }, 6000);
        }

        // editorjs renders its blocks one at a time, not all at once, and
        // run_patches() re-runs this on every one of those mutations -
        // debounce so the actual move only happens once the DOM has
        // settled, not mid-trickle. This matters even more here than for
        // _group_widget_cards below: moving a block editorjs still
        // considered its "last rendered" node mid-render made every block
        // it inserted *after* that point land inside the moved node's new
        // location instead of back in the redactor's own flat list -
        // "Reports & Masters" and everything after it silently vanished
        // from the visible page even though nothing had actually deleted it.
        clearTimeout(arjun_theme._explore_split_timer);
        arjun_theme._explore_split_timer = setTimeout(arjun_theme._do_explore_social_split, 500);
    };

    arjun_theme._do_explore_social_split = function () {
        if ($('.arjun-explore-social-split').length) return;

        const $exploreHeading = $('.editor-js-container .codex-editor__redactor > .ce-block').filter(function () {
            return $(this).find('.ce-header').length && $(this).text().trim() === 'Explore';
        }).first();
        if (!$exploreHeading.length) return;

        const cardBlocks = [];
        let $sibling = $exploreHeading.next();
        while ($sibling.length && $sibling.find('.ce-header').filter(function () {
            return $(this).text().trim() !== '';
        }).length === 0) {
            if ($sibling.find('.shortcut-widget-box').length) cardBlocks.push($sibling[0]);
            $sibling = $sibling.next();
        }
        // Ran out of siblings without ever reaching another heading -
        // rendering genuinely isn't finished yet (there's always at least
        // "Reports & Masters" after Explore on this workspace). Bail
        // without moving anything and let the next debounced call retry
        // once more blocks have actually arrived.
        if (!$sibling.length) return;
        if (cardBlocks.length === 0) return;

        const $split = $(
            '<div class="ce-block col-xs-12 arjun-explore-social-split">' +
            '<div class="arjun-split-left"></div>' +
            '<div class="arjun-split-right"></div>' +
            '</div>'
        );
        $exploreHeading.before($split);
        // .append() with real elements *moves* them here, not clones -
        // Explore's heading and cards leave their original spot entirely.
        $split.find('.arjun-split-left').append($exploreHeading, cardBlocks);
        // .arjun-split-right is left empty here for setup_social_feed_widget().

        arjun_theme._split_done = true;
        arjun_theme._maybe_reveal_workspace();
    };

    arjun_theme.setup_social_feed_widget = function () {
        const $title = $('.title-area .title-text:visible').first();
        if (!$title.length || $title.text().trim() !== 'Hrms Home') {
            $('#arjun-social-widget').remove();
            $('.arjun-social-heading').remove();
            return;
        }

        if ($('#arjun-social-widget').length) return;

        // setup_explore_social_split() builds this - it runs first in
        // run_patches(), but on a slow/first render it may not have found
        // the Explore heading yet; bail and let the next patch cycle
        // (MutationObserver fires on every DOM change) retry both in order.
        const $splitRight = $('.arjun-split-right');
        if (!$splitRight.length) return;

        // Two independently-patchable regions instead of one blob: typing
        // an emoji or attaching a file only ever needs to touch the
        // composer, and a new post only ever needs to touch the list -
        // rebuilding (and event-rebinding) the *entire* widget for either
        // was the same "whole container flashes" bug the full /social-feed
        // page had, just scoped to this smaller card instead of the page.
        const $widget = $(
            '<h4 class="arjun-social-heading">Social Posts</h4>' +
            '<div id="arjun-social-widget"><div class="arjun-social-card">' +
            '<div id="arjun-social-composer-region"></div>' +
            '<div id="arjun-social-posts-region"></div>' +
            '</div></div>'
        );
        $splitRight.append($widget);

        arjun_theme._render_social_composer();
        arjun_theme._render_social_posts();
        arjun_theme._bind_social_widget_events();

        // The widget structure itself (composer + a "Loading posts..."
        // placeholder) is what needs to exist before reveal, not the
        // actual post data - that arrives async below and is fine to show
        // as its own brief loading state same as everywhere else on this
        // page, not something worth delaying the whole reveal for.
        arjun_theme._widget_done = true;
        arjun_theme._maybe_reveal_workspace();

        if (!arjun_theme._social_state.loaded) {
            frappe.call({
                method: 'olscpl_hrms.api.social_feed.get_feed',
                args: { limit: 3 },
                callback: function (r) {
                    if (!r.message) return;
                    arjun_theme._social_state.posts = r.message.posts || [];
                    arjun_theme._social_state.me = r.message.me || {};
                    arjun_theme._social_state.canApprove = !!r.message.canApprove;
                    arjun_theme._social_state.loaded = true;
                    arjun_theme._render_social_composer(); // avatar now reflects "me"
                    arjun_theme._render_social_posts();
                },
            });
        }
    };

    // The composer region is no longer where posts actually get written -
    // it's just a Twitter-style trigger (avatar + placeholder + tool
    // icons) that opens the full compose dialog (_open_social_compose_
    // dialog below) where the real writing, formatting, subtopic and
    // announcement flag happen. Kept as its own render function/region
    // (rather than folded into the widget shell markup) since it still
    // needs to re-render once "me" (the avatar) loads in.
    arjun_theme._render_social_composer = function () {
        const region = document.getElementById('arjun-social-composer-region');
        if (!region) return;
        const s = arjun_theme._social_state;

        region.innerHTML =
            '<div class="arjun-social-composer-row">' +
            arjun_theme._social_avatar_html(s.me, 38) +
            '<div class="arjun-social-composer-main">' +
            '<div class="arjun-social-composer-trigger" id="arjun-social-composer-trigger">What’s up on your mind...</div>' +
            '<div class="arjun-social-composer-footer">' +
            '<div class="arjun-social-tools">' +
            '<button type="button" class="arjun-social-tool-btn" id="arjun-social-emoji-btn" title="Emoji">' + arjun_theme.SOCIAL_ICONS.emoji + '</button>' +
            '<button type="button" class="arjun-social-tool-btn" id="arjun-social-image-btn" title="Attach files">' + arjun_theme.SOCIAL_ICONS.image + '</button>' +
            '</div>' +
            '<button type="button" class="arjun-social-post-btn" id="arjun-social-post-btn">Post</button>' +
            '</div>' +
            '</div></div>';
    };

    arjun_theme._social_render_post_images = function (images) {
        if (!images || !images.length) return '';
        const n = Math.min(images.length, 4);
        return (
            '<div class="arjun-social-post-images arjun-social-post-images-' + n + '">' +
            images.map(function (url) { return '<img src="' + frappe.utils.escape_html(url) + '" alt="">'; }).join('') +
            '</div>'
        );
    };

    arjun_theme._social_render_post_attachments = function (attachments) {
        if (!attachments || !attachments.length) return '';
        return (
            '<div class="arjun-social-attachment-list">' + attachments.map(function (a) {
                return (
                    '<a class="arjun-social-attachment-chip arjun-social-attachment-chip-link" href="' + frappe.utils.escape_html(a.url) + '" target="_blank" rel="noopener" download="' + frappe.utils.escape_html(a.filename) + '">' +
                    '<span class="arjun-social-attachment-icon">' + arjun_theme._social_file_icon(a.filename) + '</span>' +
                    '<div class="arjun-social-attachment-info"><div class="arjun-social-attachment-name">' + frappe.utils.escape_html(a.filename) + '</div>' +
                    (a.size != null ? '<div class="arjun-social-attachment-size">' + arjun_theme._social_format_size(a.size) + '</div>' : '') + '</div>' +
                    '<span class="arjun-social-attachment-open">Open</span>' +
                    '</a>'
                );
            }).join('') + '</div>'
        );
    };

    arjun_theme._social_render_comments = function (post) {
        const s = arjun_theme._social_state;
        const list = s.comments[post.name];
        const draft = s.commentDraft[post.name] || '';
        const listHtml = list == null
            ? '<div class="arjun-social-empty" style="padding:10px 0">Loading comments...</div>'
            : (list.length
                ? list.map(function (c) {
                    const canDelete = s.me && (c.authorUser === s.me.user || s.canApprove);
                    const deleteBtn = canDelete
                        ? '<button type="button" class="arjun-social-comment-delete" data-delete-comment="' + post.name + '|' + c.name + '" title="Delete comment">&times;</button>'
                        : '';
                    return (
                        '<div class="arjun-social-comment">' + arjun_theme._social_avatar_html(c.author, 26) +
                        '<div class="arjun-social-comment-bubble"><div class="arjun-social-comment-author">' + frappe.utils.escape_html(c.author.name) + '</div>' +
                        '<div class="arjun-social-comment-text">' + frappe.utils.escape_html(c.comment) + '</div></div>' + deleteBtn + '</div>'
                    );
                }).join('')
                : '<div class="arjun-social-empty" style="padding:8px 0">No comments yet</div>');

        return (
            '<div class="arjun-social-comments">' + listHtml +
            '<div class="arjun-social-comment-form">' +
            '<input type="text" class="arjun-social-comment-input" data-comment-input="' + post.name + '" placeholder="Write a comment..." value="' + frappe.utils.escape_html(draft) + '">' +
            '<button type="button" class="arjun-social-comment-send" data-send-comment="' + post.name + '">Send</button>' +
            '</div></div>'
        );
    };

    arjun_theme._render_social_posts = function () {
        const region = document.getElementById('arjun-social-posts-region');
        if (!region) return;
        const s = arjun_theme._social_state;

        const postsHtml = !s.loaded
            ? '<div class="arjun-social-empty">Loading posts...</div>'
            : (s.posts.length
                ? s.posts.map(function (p) {
                    const expanded = !!s.expanded[p.name];
                    // Buttons/inputs below (like, comment, the comment form)
                    // can't legally nest inside an <a> - this is a plain div
                    // that navigates to the full feed on click (see the
                    // delegated handler in _bind_social_widget_events),
                    // except when the click landed on one of them, which
                    // stops it from propagating up to that handler.
                    return (
                        '<div class="arjun-social-post' + (p.isAnnouncement ? ' is-announcement' : '') + '" data-post-link="' + p.name + '">' +
                        arjun_theme._social_avatar_html(p.author, 36) +
                        '<div class="arjun-social-post-body">' +
                        (p.isAnnouncement ? '<div class="arjun-social-announcement-badge">📢 ' + __('Announcement') + '</div>' : '') +
                        (p.subtopic ? '<div class="arjun-social-subtopic-tag">' + frappe.utils.escape_html(p.subtopic) + '</div>' : '') +
                        '<div class="arjun-social-post-head"><b>' + frappe.utils.escape_html(p.author.name) + '</b>' +
                        '<span>' + arjun_theme._social_relative_time(p.postedOn) + '</span></div>' +
                        // p.content is rich HTML (Text Editor field, sanitized
                        // server-side on save) - rendered as-is, not escaped,
                        // so formatting (bold/lists/alignment/etc) survives.
                        (p.content ? '<div class="arjun-social-post-text">' + p.content + '</div>' : '') +
                        arjun_theme._social_render_post_images(p.images) +
                        arjun_theme._social_render_post_attachments(p.attachments) +
                        '<div class="arjun-social-post-actions">' +
                        '<button type="button" class="arjun-social-meta-stat arjun-social-like-btn ' + (p.likedByMe ? 'liked' : '') + '" data-like="' + p.name + '">' + arjun_theme.SOCIAL_ICONS.heart + '<span>' + (p.likeCount || 0) + '</span></button>' +
                        '<button type="button" class="arjun-social-meta-stat arjun-social-comment-btn" data-toggle-comments="' + p.name + '">' + arjun_theme.SOCIAL_ICONS.comment + '<span>' + (p.commentCount || 0) + '</span></button>' +
                        '</div>' +
                        (expanded ? arjun_theme._social_render_comments(p) : '') +
                        '</div>' +
                        '</div>'
                    );
                }).join('')
                : '<div class="arjun-social-empty">No posts yet. Be the first to share something!</div>');

        region.innerHTML =
            (s.loaded && s.posts.length ? '<div class="arjun-social-posts-label">Recent Posts</div>' : '') +
            '<div class="arjun-social-posts">' + postsHtml + '</div>' +
            '<a href="/social-feed" class="arjun-social-view-all"><span>View Social Feed</span>' + arjun_theme.SOCIAL_ICONS.arrow + '</a>';
    };

    arjun_theme._social_patch_comments = function (name) {
        const post = arjun_theme._social_find_post(name);
        // .arjun-social-post is a flex *row* (avatar + body side by side) -
        // the comment thread belongs inside .arjun-social-post-body, which
        // stacks its own children normally. Appending to the row itself
        // (as this used to) made the thread a third flex item next to the
        // avatar instead of content stacked under the post text.
        const bodyEl = document.querySelector('#arjun-social-posts-region .arjun-social-post[data-post-link="' + name + '"] .arjun-social-post-body');
        if (!post || !bodyEl) return;
        const html = arjun_theme._social_render_comments(post);
        const existing = bodyEl.querySelector('.arjun-social-comments');
        if (existing) existing.outerHTML = html;
        else bodyEl.insertAdjacentHTML('beforeend', html);
    };

    arjun_theme._social_patch_comment_count = function (name) {
        const post = arjun_theme._social_find_post(name);
        const btn = document.querySelector('#arjun-social-posts-region [data-toggle-comments="' + name + '"]');
        if (btn && post) btn.innerHTML = arjun_theme.SOCIAL_ICONS.comment + '<span>' + (post.commentCount || 0) + '</span>';
    };

    arjun_theme._social_send_comment = function (postName) {
        const s = arjun_theme._social_state;
        const text = (s.commentDraft[postName] || '').trim();
        if (!text) return;
        frappe.call({
            method: 'olscpl_hrms.api.social_feed.add_comment',
            args: { post: postName, comment: text },
            callback: function (r) {
                if (!r.message) return;
                if (!s.comments[postName]) s.comments[postName] = [];
                s.comments[postName].push(r.message);
                s.commentDraft[postName] = '';
                const post = arjun_theme._social_find_post(postName);
                if (post) post.commentCount = r.message.commentCount;
                arjun_theme._social_patch_comments(postName);
                arjun_theme._social_patch_comment_count(postName);
            },
        });
    };

    // ---- Compose dialog (subtopic + announcement flag + rich text +
    // image/attachment uploads + emoji) ----
    // The inline composer above is just a trigger now - writing the actual
    // post happens in this frappe.ui.Dialog, which is the only place that
    // gets Frappe's full "Text Editor" toolbar (bold/italic/lists/align/
    // etc, see get_toolbar_options() in frappe's text_editor.js) for free.
    // Its upload/emoji state is a throwaway object scoped to one dialog
    // instance, not arjun_theme._social_state - the dialog builds and tears
    // down its own DOM each time it opens, so nothing here needs to survive
    // past that, unlike the widget's own persistent post list/composer.
    arjun_theme._open_social_compose_dialog = function () {
        const cs = { images: [], attachments: [], uploading: 0, emojiOpen: false };

        const dialog = new frappe.ui.Dialog({
            title: __('Create Post'),
            fields: [
                {
                    fieldname: 'subtopic',
                    fieldtype: 'Data',
                    label: __('Topic'),
                    description: __('Optional - shown as a tag above the post (e.g. "Policy Update", "Team Outing").'),
                },
                {
                    fieldname: 'is_announcement',
                    fieldtype: 'Check',
                    label: __('📢 Mark as Announcement'),
                },
                { fieldtype: 'Section Break' },
                {
                    fieldname: 'content',
                    fieldtype: 'Text Editor',
                    label: __('Post'),
                },
                {
                    fieldname: 'upload_area',
                    fieldtype: 'HTML',
                    options: '<div id="arjun-compose-upload-region"></div>',
                },
            ],
            primary_action_label: __('Post'),
            primary_action: function () {
                arjun_theme._submit_social_compose_dialog(dialog, cs);
            },
        });

        dialog.$wrapper.addClass('arjun-social-compose-dialog');
        dialog.show();

        // Quill's own placeholder mechanism reads this attribute directly
        // (see .ql-editor.ql-blank::before in quill.snow.css) - the Text
        // Editor control itself has no `placeholder` df property.
        const contentField = dialog.fields_dict.content;
        if (contentField && contentField.quill) {
            contentField.quill.root.setAttribute('data-placeholder', "What’s up on your mind...");
        }

        arjun_theme._render_compose_upload_region(dialog, cs);
        arjun_theme._bind_compose_dialog_events(dialog, cs);
    };

    arjun_theme._render_compose_upload_region = function (dialog, cs) {
        const region = dialog.$wrapper.find('#arjun-compose-upload-region')[0];
        if (!region) return;

        const previewHtml = cs.images.length
            ? '<div class="arjun-social-preview-grid">' + cs.images.map(function (url, i) {
                return (
                    '<div class="arjun-social-preview"><img src="' + frappe.utils.escape_html(url) + '">' +
                    '<button type="button" class="arjun-social-preview-remove" data-remove-image="' + i + '">&times;</button></div>'
                );
            }).join('') + '</div>'
            : '';
        const attachmentsHtml = cs.attachments.length
            ? '<div class="arjun-social-attachment-list">' + cs.attachments.map(function (a, i) {
                return (
                    '<div class="arjun-social-attachment-chip"><span class="arjun-social-attachment-icon">' + arjun_theme._social_file_icon(a.filename) + '</span>' +
                    '<div class="arjun-social-attachment-info"><div class="arjun-social-attachment-name">' + frappe.utils.escape_html(a.filename) + '</div>' +
                    (a.size != null ? '<div class="arjun-social-attachment-size">' + arjun_theme._social_format_size(a.size) + '</div>' : '') + '</div>' +
                    '<button type="button" class="arjun-social-preview-remove" data-remove-attachment="' + i + '">&times;</button></div>'
                );
            }).join('') + '</div>'
            : '';
        const canAddMore = cs.images.length < arjun_theme.SOCIAL_MAX_IMAGES || cs.attachments.length < arjun_theme.SOCIAL_MAX_ATTACHMENTS;

        const emojiPop = cs.emojiOpen
            ? '<div class="arjun-social-emoji-pop" id="arjun-compose-emoji-pop">' +
              arjun_theme.SOCIAL_EMOJIS.map(function (e) { return '<button type="button" data-emoji="' + e + '">' + e + '</button>'; }).join('') +
              '</div>'
            : '';

        region.innerHTML =
            previewHtml + attachmentsHtml +
            '<div class="arjun-social-composer-footer arjun-compose-dialog-tools">' +
            '<div class="arjun-social-tools">' +
            '<button type="button" class="arjun-social-tool-btn" id="arjun-compose-emoji-btn" title="Emoji">' + arjun_theme.SOCIAL_ICONS.emoji + '</button>' +
            '<button type="button" class="arjun-social-tool-btn" id="arjun-compose-image-btn" title="Attach files" ' + (canAddMore ? '' : 'disabled') + '>' + arjun_theme.SOCIAL_ICONS.image + '</button>' +
            '<input type="file" multiple id="arjun-compose-image-input" style="display:none">' +
            '</div>' +
            (cs.uploading ? '<div class="arjun-social-hint">Uploading file' + (cs.uploading > 1 ? 's' : '') + '...</div>' : '') +
            '</div>' + emojiPop;
    };

    arjun_theme._bind_compose_dialog_events = function (dialog, cs) {
        const $wrap = dialog.$wrapper;

        $wrap.on('click', '#arjun-compose-emoji-btn', function (e) {
            e.stopPropagation();
            cs.emojiOpen = !cs.emojiOpen;
            arjun_theme._render_compose_upload_region(dialog, cs);
        });
        $wrap.on('click', '#arjun-compose-upload-region', function (e) { e.stopPropagation(); });
        $wrap.on('mousedown', '[data-emoji]', function (e) { e.preventDefault(); }); // keep Quill's selection alive, same reasoning as the old inline composer
        $wrap.on('click', '[data-emoji]', function () {
            const emoji = $(this).attr('data-emoji');
            const contentField = dialog.fields_dict.content;
            if (contentField && contentField.quill) {
                const quill = contentField.quill;
                const range = quill.getSelection(true) || { index: Math.max(0, quill.getLength() - 1) };
                quill.insertText(range.index, emoji, 'user');
                quill.setSelection(range.index + emoji.length, 0);
            }
            cs.emojiOpen = false;
            arjun_theme._render_compose_upload_region(dialog, cs);
        });

        $wrap.on('click', '#arjun-compose-image-btn', function () {
            $wrap.find('#arjun-compose-image-input').trigger('click');
        });
        $wrap.on('change', '#arjun-compose-image-input', function (e) {
            let files = Array.prototype.slice.call(e.target.files || []);
            e.target.value = '';
            if (!files.length) return;

            let imageFiles = files.filter(arjun_theme._social_is_image_file);
            let otherFiles = files.filter(function (f) { return !arjun_theme._social_is_image_file(f); });

            const imageRoom = arjun_theme.SOCIAL_MAX_IMAGES - cs.images.length;
            const attachmentRoom = arjun_theme.SOCIAL_MAX_ATTACHMENTS - cs.attachments.length;
            const dropped = [];
            if (imageFiles.length > imageRoom) { dropped.push('up to ' + arjun_theme.SOCIAL_MAX_IMAGES + ' images'); imageFiles = imageFiles.slice(0, imageRoom); }
            if (otherFiles.length > attachmentRoom) { dropped.push('up to ' + arjun_theme.SOCIAL_MAX_ATTACHMENTS + ' other files'); otherFiles = otherFiles.slice(0, attachmentRoom); }
            if (dropped.length) frappe.show_alert({ message: __('You can attach {0} per post - extra files were skipped.', [dropped.join(' and ')]), indicator: 'orange' }, 6);

            const totalCount = imageFiles.length + otherFiles.length;
            if (!totalCount) return;
            cs.uploading = totalCount;
            arjun_theme._render_compose_upload_region(dialog, cs);

            const doUpload = function (file) {
                const fd = new FormData();
                fd.append('file', file);
                fd.append('is_private', '0');
                return fetch('/api/method/upload_file', {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: { 'X-Frappe-CSRF-Token': frappe.csrf_token || '' },
                    body: fd,
                })
                    .then(function (res) { return res.json(); })
                    .then(function (body) { return (body.message && body.message.file_url) || null; })
                    .catch(function () { return null; });
            };

            Promise.all([
                Promise.all(imageFiles.map(doUpload)),
                Promise.all(otherFiles.map(function (f) {
                    return doUpload(f).then(function (url) { return url ? { url: url, filename: f.name, size: f.size } : null; });
                })),
            ]).then(function (results) {
                const imageUrls = results[0].filter(Boolean);
                const attachmentObjs = results[1].filter(Boolean);
                const failed = totalCount - imageUrls.length - attachmentObjs.length;
                cs.images = cs.images.concat(imageUrls);
                cs.attachments = cs.attachments.concat(attachmentObjs);
                cs.uploading = 0;
                if (failed) frappe.show_alert({ message: __('{0} file(s) failed to upload.', [failed]), indicator: 'red' });
                arjun_theme._render_compose_upload_region(dialog, cs);
            });
        });
        $wrap.on('click', '[data-remove-image]', function () {
            cs.images.splice(parseInt($(this).attr('data-remove-image'), 10), 1);
            arjun_theme._render_compose_upload_region(dialog, cs);
        });
        $wrap.on('click', '[data-remove-attachment]', function () {
            cs.attachments.splice(parseInt($(this).attr('data-remove-attachment'), 10), 1);
            arjun_theme._render_compose_upload_region(dialog, cs);
        });
    };

    arjun_theme._submit_social_compose_dialog = function (dialog, cs) {
        const s = arjun_theme._social_state;
        const values = dialog.get_values(true) || {};
        const content = (values.content || '').trim();
        const plainText = $('<div>').html(content).text().trim();
        if (!plainText && !cs.images.length && !cs.attachments.length) {
            frappe.show_alert({ message: __('Write something or attach a file before posting.'), indicator: 'orange' });
            return;
        }
        if (cs.uploading) return;

        dialog.get_primary_btn().prop('disabled', true).text(__('Posting...'));

        frappe.call({
            method: 'olscpl_hrms.api.social_feed.create_post',
            args: {
                content: content,
                subtopic: values.subtopic || '',
                is_announcement: values.is_announcement ? 1 : 0,
                images: JSON.stringify(cs.images),
                attachments: JSON.stringify(cs.attachments),
            },
            callback: function (r) {
                dialog.hide();
                if (!r.message) return;
                s.posts.unshift(r.message);
                s.posts = s.posts.slice(0, 3);
                arjun_theme._render_social_posts();
                if (r.message.status !== 'Approved') {
                    frappe.show_alert({ message: __('Post submitted - awaiting HR/System Manager approval.'), indicator: 'orange' }, 6);
                } else {
                    frappe.show_alert({ message: __('Posted!'), indicator: 'green' });
                }
            },
            error: function () {
                dialog.get_primary_btn().prop('disabled', false).text(__('Post'));
            },
        });
    };

    // Bound exactly once (setup_social_feed_widget only ever builds the
    // widget shell once) using jQuery's delegated-event form - $widget.on
    // (event, selector, handler) - so it keeps working on elements that
    // get swapped in later by _render_social_composer()/_render_social_
    // posts() without ever needing to be re-bound.
    arjun_theme._bind_social_widget_events = function () {
        const $widget = $('#arjun-social-widget');
        const s = arjun_theme._social_state;

        // The like button sits inside a post row that otherwise navigates
        // to the full feed on click - stop that click from bubbling up to
        // the row's own handler below, then toggle the like server-side
        // and patch just this one button (no need to touch anything else
        // in the 3-post preview list).
        $widget.on('click', '[data-like]', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const $btn = $(this);
            const name = $btn.attr('data-like');
            frappe.call({
                method: 'olscpl_hrms.api.social_feed.toggle_like',
                args: { post: name },
                callback: function (r) {
                    if (!r.message) return;
                    const post = s.posts.find(function (p) { return p.name === name; });
                    if (post) { post.likedByMe = r.message.liked; post.likeCount = r.message.likeCount; }
                    $btn.toggleClass('liked', r.message.liked);
                    $btn.find('span').text(r.message.likeCount || 0);
                },
            });
        });
        $widget.on('click', '[data-post-link]', function () {
            window.location.href = '/social-feed';
        });

        $widget.on('click', '[data-toggle-comments]', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const name = $(this).attr('data-toggle-comments');
            s.expanded[name] = !s.expanded[name];
            const postEl = document.querySelector('#arjun-social-posts-region .arjun-social-post[data-post-link="' + name + '"]');
            const existing = postEl && postEl.querySelector('.arjun-social-comments');
            if (!s.expanded[name]) {
                if (existing) existing.remove();
                return;
            }
            if (!existing) arjun_theme._social_patch_comments(name); // shows the "Loading comments..." state immediately
            if (s.comments[name] == null) {
                frappe.call({
                    method: 'olscpl_hrms.api.social_feed.get_comments',
                    type: 'GET',
                    args: { post: name },
                    callback: function (r) {
                        s.comments[name] = r.message || [];
                        arjun_theme._social_patch_comments(name);
                    },
                });
            }
        });
        // Stops both the post-link navigation *and* the page's own click-
        // outside-to-close-emoji-popover listener from reacting to typing
        // in this field.
        $widget.on('click', '[data-comment-input], [data-send-comment], .arjun-social-comment-delete', function (e) { e.stopPropagation(); });
        $widget.on('click', '.arjun-social-attachment-chip-link', function (e) { e.stopPropagation(); });
        $widget.on('input', '[data-comment-input]', function (e) {
            s.commentDraft[$(this).attr('data-comment-input')] = e.target.value;
        });
        $widget.on('keydown', '[data-comment-input]', function (e) {
            if (e.key === 'Enter') arjun_theme._social_send_comment($(this).attr('data-comment-input'));
        });
        $widget.on('click', '[data-send-comment]', function () {
            arjun_theme._social_send_comment($(this).attr('data-send-comment'));
        });
        $widget.on('click', '.arjun-social-comment-delete', function (e) {
            const parts = $(this).attr('data-delete-comment').split('|');
            const postName = parts[0], commentName = parts[1];
            // frappe.confirm() (a real Dialog), not window.confirm() - the
            // native browser confirm can be permanently silenced by a
            // "prevent this page from creating additional dialogs"
            // checkbox a user might tick without meaning to, after which
            // it just returns false forever with no visible dialog at all.
            frappe.confirm(__('Delete this comment?'), function () {
            frappe.call({
                method: 'olscpl_hrms.api.social_feed.delete_comment',
                args: { name: commentName },
                callback: function () {
                    s.comments[postName] = (s.comments[postName] || []).filter(function (c) { return c.name !== commentName; });
                    const post = arjun_theme._social_find_post(postName);
                    if (post) post.commentCount = Math.max(0, (post.commentCount || 1) - 1);
                    arjun_theme._social_patch_comments(postName);
                    arjun_theme._social_patch_comment_count(postName);
                },
            });
            });
        });

        // The inline composer is a pure trigger now - the placeholder text
        // and both tool icons all just open the real compose dialog.
        $widget.on('click', '#arjun-social-composer-trigger, #arjun-social-emoji-btn, #arjun-social-image-btn, #arjun-social-post-btn', function (e) {
            e.preventDefault();
            arjun_theme._open_social_compose_dialog();
        });
    };

    arjun_theme.collapse_chevron_html = function (extra_class) {
        return (
            '<button type="button" class="arjun-collapse-toggle ' + extra_class + '" aria-expanded="true" title="Collapse/expand">' +
                '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>' +
            '</button>'
        );
    };

    // Groups the report/master cards into their existing rows of 3 (they're
    // already col-md-4, i.e. 3-per-row) and inserts ONE new sub-heading
    // above each row - labelled by joining that row's 3 card titles, e.g.
    // "Settings, Employee & Key Reports" - with a single collapse/expand
    // toggle controlling all 3 cards in that row together. There is no
    // per-card toggle; collapsing only ever happens at the row/group level.
    // Each group starts collapsed by default; clicking anywhere on the
    // heading row (arrow or text) expands/collapses it.
    arjun_theme._widget_card_collapse_timer = null;

    arjun_theme.setup_widget_card_collapse = function () {
        // Same stale-hidden-page hazard as inject_hrms_home_greeting() above.
        const $title = $('.title-area .title-text:visible').first();
        if (!$title.length || $title.text().trim() !== 'Hrms Home') return;

        const $sectionHeading = $('.editor-js-container .codex-editor__redactor > .ce-block').filter(function () {
            return $(this).find('.ce-header').length && $(this).text().trim() === 'Reports & Masters';
        }).first();
        if (!$sectionHeading.length) return;

        // Failsafe: arjun_theme.css hides the cards until grouping
        // finishes (body:has(#arjun-hrms-greeting):not(.arjun-groups-ready)),
        // to avoid a flash of them in their un-grouped/expanded state. If
        // grouping never completes for some reason, that would otherwise
        // hide these cards forever - force them visible after a few
        // seconds regardless. Scheduled once per heading instance (a
        // fresh one exists each time this workspace re-renders), not once
        // per page load, since document.body carries over across
        // Frappe's SPA route changes.
        if (!$sectionHeading.data('failsafeScheduled')) {
            $sectionHeading.data('failsafeScheduled', true);
            setTimeout(function () {
                document.body.classList.add('arjun-groups-ready');
            }, 6000);
        }

        if ($sectionHeading.data('arjunGrouped')) return;

        // Frappe renders the workspace's editorjs blocks (including these
        // widget cards) one at a time as they're constructed, not all at
        // once - the page-level loading skeleton (fake placeholder divs,
        // see workspace_loading_skeleton.html / .skeleton-card) disappears
        // before that trickle finishes, so "no skeleton left" alone isn't
        // enough to know every card has arrived. run_patches() re-runs this
        // on every DOM mutation, so debounce: each call pushes the actual
        // grouping attempt further out, and it only fires once mutations
        // stop for a bit - i.e. once the DOM has actually settled.
        clearTimeout(arjun_theme._widget_card_collapse_timer);
        arjun_theme._widget_card_collapse_timer = setTimeout(function () {
            arjun_theme._group_widget_cards($sectionHeading);
        }, 400);
    };

    arjun_theme._group_widget_cards = function ($sectionHeading) {
        if ($sectionHeading.data('arjunGrouped')) return;
        if ($('.skeleton-card').length > 0) return;

        // A stray empty-text heading block (no visible text at all, so it
        // isn't noticeable in the page itself) was found sitting between
        // two sets of cards on the live site, splitting what should be
        // one continuous run of cards into two - our stop condition here
        // only treated it as a genuine boundary. Only stop at a heading
        // that actually has visible text; skip straight past an empty one
        // and keep collecting.
        const cardBlocks = [];
        let $sibling = $sectionHeading.next();
        while ($sibling.length && $sibling.find('.ce-header').filter(function () {
            return $(this).text().trim() !== '';
        }).length === 0) {
            if ($sibling.find('.widget.links-widget-box').length) {
                cardBlocks.push($sibling[0]);
            }
            $sibling = $sibling.next();
        }
        if (cardBlocks.length === 0) return;
        $sectionHeading.data('arjunGrouped', true);

        for (let i = 0; i < cardBlocks.length; i += 3) {
            const group = cardBlocks.slice(i, i + 3);
            const titles = group.map(function (block) {
                return $(block).find('.widget-title .ellipsis').first().text().trim();
            });
            const heading_text = titles.length > 1
                ? titles.slice(0, -1).join(', ') + ' & ' + titles[titles.length - 1]
                : titles[0];

            const $groupHeading = $('<div class="ce-block col-xs-12 arjun-group-heading"><div class="ce-block__content"><div class="arjun-group-heading-row"></div></div></div>');
            const $toggle = $(arjun_theme.collapse_chevron_html('arjun-group-toggle'));
            const $text = $('<span class="arjun-group-heading-text"></span>').text(heading_text);
            const $row = $groupHeading.find('.arjun-group-heading-row').append($toggle, $text);

            // Collapsed by default.
            $toggle.addClass('arjun-collapsed').attr('aria-expanded', 'false');
            $(group).hide();

            $(group[0]).before($groupHeading);

            // Bound on the whole row (not just the arrow) so clicking the
            // heading text also toggles - the arrow is a child of the row,
            // so its clicks bubble up into this same handler already.
            $row.on('click', function () {
                const collapsed = $toggle.toggleClass('arjun-collapsed').hasClass('arjun-collapsed');
                $toggle.attr('aria-expanded', String(!collapsed));
                $(group).toggle(!collapsed);
            });
        }

        // arjun_theme.css hides .links-widget-box cards (and, for the
        // Explore/Social Posts split, the whole redactor) under
        // body:has(#arjun-hrms-greeting):not(.arjun-groups-ready) so
        // nothing renders in an intermediate state before we get a chance
        // to finish. Grouping is one of three things that has to finish
        // before that class gets added - see _maybe_reveal_workspace.
        arjun_theme._groups_done = true;
        arjun_theme._maybe_reveal_workspace();
    };

    // Workspaces with children (Accounting, HR, Payroll, ...) render a
    // chevron via CSS ::after, implying they expand - but nothing wired it
    // up, so it always just linked straight through. Clicking now expands
    // the nested list in place (in addition to navigating, same as clicking
    // any other row) and auto-expands whichever parent is currently active
    // so its children are visible without an extra click.
    arjun_theme.setup_sidebar_expand = function () {
        $('.main-nav > li.has-children > a').off('click.arjun_sidebar_expand')
            .on('click.arjun_sidebar_expand', function () {
                const $li = $(this).parent();
                const expanded = $(this).attr('aria-expanded') === 'true';
                $(this).attr('aria-expanded', String(!expanded));
                $li.children('.sidebar-child-nav').toggleClass('expanded', !expanded);
            });

        $('.main-nav > li.has-children').each(function () {
            const $li = $(this);
            if ($li.find('> .sidebar-child-nav > li.active').length) {
                $li.children('a').attr('aria-expanded', 'true');
                $li.children('.sidebar-child-nav').addClass('expanded');
            }
        });
    };

    // The sidebar's collapsed (semi-nav) rail is too narrow for the full
    // wide "one" wordmark logo - object-fit:contain shrinks the whole
    // 144x42 image down to fit, leaving a thin sliver with mostly empty
    // space (see arjun_theme.css around .arjun-collapsed-logo-icon for the
    // full story). Fix: add a second <img>, right next to the original,
    // pointing at a dedicated square icon-only mark - CSS alone then swaps
    // which one is visible based on the sidebar's semi-nav/:hover state,
    // so hover-to-expand still shows the real wordmark exactly as before.
    arjun_theme.inject_sidebar_collapsed_logo = function () {
        const $wideLogo = $('nav.vertical-sidebar .app-logo .logo img').not('.arjun-collapsed-logo-icon').first();
        if (!$wideLogo.length) return;
        if ($wideLogo.siblings('.arjun-collapsed-logo-icon').length) return;
        $('<img class="arjun-collapsed-logo-icon" src="/assets/arjun_theme/images/om_icon_mark.svg" alt="OM">').insertAfter($wideLogo);
    };

    arjun_theme.mutate_number_cards = function () {
        $('.number-widget-box').each(function (index) {
            $(this).attr('data-color-index', index % 4);
        });
    };

    arjun_theme.inject_navbar_toggle = function () {
        if ($('.header-toggle').length === 0) {
            const toggle_html = '<span class="header-toggle" style="margin-right: 15px; cursor: pointer; display: flex; align-items: center; font-size: 22px; color: var(--text-primary);"> <iconify-icon icon="line-md:menu-fold-left"></iconify-icon></span>';
            $('.navbar-brand').before(toggle_html);

            // Bind click event to toggle sidebar
            $('.header-toggle').on('click', function () {
                arjun_theme.set_sidebar_narrow(!$('body').hasClass('sidebar-menu-opened'));
            });
        }
    };

    // Below this width, the full sidebar (icon + label) doesn't have room
    // and labels clip mid-word. Auto-collapse to icon-only (semi-nav) —
    // the same class the manual header-toggle button already uses, so
    // hover-to-expand still works exactly as it does when toggled by hand.
    //
    // run_patches() re-runs on every Frappe 'page-change' (e.g. switching
    // workspaces), not just on real window resizes. The naive version of
    // this re-decided narrow-vs-full from scratch every single time it ran,
    // which meant: collapse the sidebar manually, click into a workspace
    // while still hovered/expanded -> page-change fires -> width is wide ->
    // it force-uncollapses, silently discarding the manual choice. Fix:
    // only let *actual* window-resize events decide the state. Page-change
    // just re-applies whatever was last decided (manual or auto), via
    // reapply_current_state(), without re-evaluating width.
    arjun_theme.RESPONSIVE_SIDEBAR_BREAKPOINT = 1400;
    arjun_theme._responsive_sidebar_bound = false;

    arjun_theme.set_sidebar_narrow = function (narrow) {
        const $body = $('body');
        const $sidebar = $('.vertical-sidebar');
        const $icon = $('.header-toggle iconify-icon');

        if (narrow) {
            $body.addClass('sidebar-menu-opened');
            $sidebar.addClass('semi-nav');
            $icon.attr('icon', 'line-md:menu-fold-right');
        } else {
            $body.removeClass('sidebar-menu-opened');
            $sidebar.removeClass('semi-nav');
            $icon.attr('icon', 'line-md:menu-fold-left');
        }
        arjun_theme._sidebar_narrow = narrow;
    };

    // Re-apply the last known state to freshly-rendered DOM (page-change
    // replaces the sidebar/content markup) without re-deciding it.
    arjun_theme.reapply_current_state = function () {
        if (typeof arjun_theme._sidebar_narrow === 'boolean') {
            arjun_theme.set_sidebar_narrow(arjun_theme._sidebar_narrow);
        }
    };

    arjun_theme.setup_responsive_sidebar = function () {
        if (arjun_theme._responsive_sidebar_bound) {
            arjun_theme.reapply_current_state();
            return;
        }
        arjun_theme._responsive_sidebar_bound = true;

        // First-ever load: decide from the actual window width.
        arjun_theme.set_sidebar_narrow(window.innerWidth < arjun_theme.RESPONSIVE_SIDEBAR_BREAKPOINT);

        // Only real resizes re-decide narrow-vs-full from here on.
        $(window).off('resize.arjun_responsive_sidebar').on('resize.arjun_responsive_sidebar', function () {
            arjun_theme.set_sidebar_narrow(window.innerWidth < arjun_theme.RESPONSIVE_SIDEBAR_BREAKPOINT);
        });
    };

    arjun_theme.mutate_custom_elements = function () {
        const changes = [
            { selector: '.old-style-class', add: 'new-style-class', remove: 'old-style-class' },
        ];

        changes.forEach(item => {
            let $el = $(item.selector);
            if (item.remove) $el.removeClass(item.remove);
            if (item.add) $el.addClass(item.add);
        });
    };

    arjun_theme.highlight_active_route = function () {
        const current_route = window.location.pathname;
        $('.main-nav li').removeClass('active');

        // Exact matching
        $(`.main-nav a[href="${current_route}"]`).parent().addClass('active');

        // Fuzzy matching
        if (current_route && current_route !== "/app") {
            $('.main-nav a').each(function () {
                let href = $(this).attr('href');
                if (href && current_route.startsWith(href + "/") && href !== "/app") {
                    $(this).parent().addClass('active');
                }
            });
        }
    };

    //arjun_theme.remove_native_elements = function () {
    //    $('.layout-side-section, .sidebar-toggle-btn').remove();
    //};

    arjun_theme.mutate_workspace_container = function () {
        const selectors = [
            '#body > .content > .container',
            '#body > .content > .page-head > .container',
            '.page-body.container'
        ];

        selectors.forEach(selector => {
            $(selector).removeClass('container').addClass('container-fluid');
        });
    };

    // Premium Gradient Line Chart Injector
    arjun_theme.mutate_charts = function () {
        // Inject the SVG linear gradient globally if it doesn't exist to ensure correct namespace rendering
        if ($('#arjun-global-gradient').length === 0) {
            const svgHTML = `
                <svg id="arjun-global-gradient" width="0" height="0" style="position:absolute; width:0; height:0;">
                    <defs>
                        <linearGradient id="arjun-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="#0d6b59" />
                            <stop offset="40%" stop-color="#10b981" />
                            <stop offset="65%" stop-color="#73c76b" />
                            <stop offset="85%" stop-color="#d4dda0" />
                            <stop offset="100%" stop-color="#fdf4d6" />
                        </linearGradient>
                    </defs>
                </svg>
            `;
            $('body').append(svgHTML);
        }

        // Vue components in Frappe Workspace bypass the frappe.Chart global constructor.
        // We force splines directly on rendered instances.
        $('.frappe-chart').each(function () {
            try {
                let container = $(this).get(0);
                let chart = $(container).data('chart') || (container.__vue__ && container.__vue__.chart);

                if (chart && !chart._arjun_splined) {
                    chart._arjun_splined = true;
                    if (chart.options && (chart.options.type === 'line' || chart.options.type === 'axis-mixed')) {
                        chart.options.lineOptions = chart.options.lineOptions || {};
                        chart.options.lineOptions.splines = 1;
                        chart.options.lineOptions.hideDots = 1;
                        chart.options.lineOptions.regionFill = 0;
                        chart.draw(); // Redraws with splines correctly!
                    }
                }

                // The stock "Shift Assignment Breakup" pie chart (Attendance
                // Dashboard) draws its legend as raw SVG text: frappe-charts
                // lays legend items out in fixed 150px-wide columns
                // (renderLegend: Math.floor(this.width/150) items per row),
                // regardless of each label's actual rendered width. Our
                // Shift Type names ("Evening Shift 1:30PM", "Night Shift
                // 10:30PM to 8AM", ...) render wider than that column, so
                // adjacent items visually overlap. Rather than patch the
                // vendor chart library, hide its SVG legend for this one
                // widget and grow a plain-HTML legend from the same chart
                // instance's own data/colors - normal HTML text wraps
                // cleanly with no special-casing needed.
                if (chart && !chart._arjun_legend_fixed) {
                    let widget = container.closest('[data-widget-name="Shift Assignment Breakup"]');
                    if (widget) {
                        let labels = (chart.data && chart.data.labels) || [];
                        let values = (chart.data && chart.data.datasets && chart.data.datasets[0] && chart.data.datasets[0].values) || [];
                        let colors = chart.colors || [];
                        if (labels.length) {
                            chart._arjun_legend_fixed = true;
                            if (chart.legendArea) chart.legendArea.style.display = 'none';
                            $(widget).find('.arjun-shift-breakup-legend').remove();
                            let items = labels.map((label, i) => `
                                <div class="arjun-shift-breakup-legend-item">
                                    <span class="arjun-shift-breakup-legend-dot" style="background:${colors[i] || '#ccc'}"></span>
                                    <span class="arjun-shift-breakup-legend-label">${frappe.utils.escape_html(label)}</span>
                                    <span class="arjun-shift-breakup-legend-value">${values[i] != null ? values[i] : ''}</span>
                                </div>`).join('');
                            $(`<div class="arjun-shift-breakup-legend">${items}</div>`).insertAfter($(container));
                        }
                    }
                }
            } catch (e) { }
        });
    };

    const view_names = ["ListView", "FormView", "KanbanView", "ReportView", "GanttView", "Workspace"];
    view_names.forEach(name => {
        const Orig = frappe.views[name];
        if (!Orig) return;

        frappe.views[name] = class extends Orig {
            make() {
                super.make();
                arjun_theme.run_patches();
            }
        };
    });

    const observer = new MutationObserver(() => {
        arjun_theme.run_patches();
    });

    $(document).ready(() => {
        arjun_theme.setup();
        arjun_theme.mutate_charts(); // Try patching immediately
        observer.observe(document.body, { childList: true, subtree: true });
    });

    $(document).on('app_ready page-change', function () {
        arjun_theme.run_patches();
        arjun_theme.mutate_charts();
    });

})();