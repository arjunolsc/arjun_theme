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
        arjun_theme.setup_widget_card_collapse();
    };

    // Time-of-day greeting banner ("Good Morning, <name>") above the
    // shortcuts on the Hrms Home workspace only - matched by the rendered
    // page title text rather than the route, since workspace routes are
    // slugified client-side (frappe.router.slug) and matching what's
    // actually on screen is more robust than re-deriving that slug here.
    //
    // Prepended to .page-body (a sibling of .page-head, part of the static
    // page shell) rather than the workspace's own .editor-js-container,
    // which is populated asynchronously and briefly shows loading-skeleton
    // placeholders on every reload - anchoring there made the banner pop in
    // late, below the skeleton, instead of appearing immediately like the
    // sidebar/title does.
    arjun_theme.inject_hrms_home_greeting = function () {
        const $title = $('.title-area .title-text').first();
        if (!$title.length || $title.text().trim() !== 'Hrms Home') {
            $('#arjun-hrms-greeting').remove();
            return;
        }
        if ($('#arjun-hrms-greeting').length) return;

        const $page_body = $('.page-head').first().next('.page-body');
        if (!$page_body.length) return;

        const hour = new Date().getHours();
        let greeting = 'Good Evening';
        if (hour < 12) greeting = 'Good Morning';
        else if (hour < 17) greeting = 'Good Afternoon';

        const full_name = (frappe.boot.user && frappe.boot.user.full_name) || frappe.session.user_fullname || frappe.session.user;
        const today = frappe.datetime.str_to_user(frappe.datetime.get_today());

        const $banner = $(
            '<div id="arjun-hrms-greeting" class="arjun-hrms-greeting">' +
                '<h2>' + frappe.utils.escape_html(greeting) + ', ' + frappe.utils.escape_html(full_name) + '</h2>' +
                '<div class="arjun-hrms-greeting-date">' + frappe.utils.escape_html(today) + '</div>' +
            '</div>'
        );
        $page_body.prepend($banner);
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
    // per-card toggle; collapsing only ever happens at the row/group level
    // Each group starts collapsed by default; clicking anywhere on the
    // heading row (arrow or text) expands/collapses it.
    arjun_theme.setup_widget_card_collapse = function () {
        const $title = $('.title-area .title-text').first();
        if (!$title.length || $title.text().trim() !== 'Hrms Home') return;

        const $sectionHeading = $('.editor-js-container .codex-editor__redactor > .ce-block').filter(function () {
            return $(this).find('.ce-header').length && $(this).text().trim() === 'Reports & Masters';
        }).first();
        if (!$sectionHeading.length || $sectionHeading.data('arjunGrouped')) return;

        const cardBlocks = [];
        let $sibling = $sectionHeading.next();
        while ($sibling.length && $sibling.find('.ce-header').length === 0) {
            if ($sibling.find('.widget.links-widget-box').length) {
                cardBlocks.push($sibling[0]);
            }
            $sibling = $sibling.next();
        }
        // Wait for all cards to have actually rendered before grouping -
        // same staleness trap as the section toggle: if this runs (via the
        // MutationObserver) while widgets are still loading, we'd only see
        // a partial list and group them wrong. 38 is the known card count
        // for this workspace; bail and let a later mutation retry.
        if (cardBlocks.length < 38) return;
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